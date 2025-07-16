import cv2
import numpy as np
import time
import requests
from ultralytics import YOLO
import mediapipe as mp

# ========== CONFIG ==========
THRESHOLD_CONF = 0.4
CAMERA_INDEX = 0
SAVE_PATH = "output_webcam_seat_detection.mp4"
API_URL = "http://localhost:8000/seats/{seat_id}"

# ========== INIT ==========
yolo_model = YOLO("yolov8m.pt")

mp_pose = mp.solutions.pose
pose_detector = mp_pose.Pose(
    static_image_mode=True,
    model_complexity=1,
    enable_segmentation=False,
    min_detection_confidence=THRESHOLD_CONF
)

# ========== SEAT SETTINGS ==========
#seats = [
#    {"id": 1, "rect": (200, 270, 150, 150), "occupied": False, "last_state": False,
#     "last_change_time": 0, "change_candidate": None, "change_candidate_frame_count": 0},
#    {"id": 2, "rect": (450, 100, 150, 150), "occupied": False, "last_state": False,
#     "last_change_time": 0, "change_candidate": None, "change_candidate_frame_count": 0},
#]
seats = [
    # Quầy 1
    {"id": 1, "counter_id": 1, "rect": (300, 270, 80, 80), "occupied": False, "type": "officer",
     "last_state": False, "last_change_time": 0,
     "change_candidate": None, "change_candidate_frame_count": 0},
    
    {"id": 2, "counter_id": 1, "rect": (420, 270, 80, 80), "occupied": False, "type": "client",
     "last_state": False, "last_change_time": 0,
     "change_candidate": None, "change_candidate_frame_count": 0},

    # Quầy 2
    {"id": 3, "counter_id": 2, "rect": (300, 155, 80, 80), "occupied": False, "type": "officer",
     "last_state": False, "last_change_time": 0,
     "change_candidate": None, "change_candidate_frame_count": 0},
    
    {"id": 4, "counter_id": 2, "rect": (420, 155, 80, 80), "occupied": False, "type": "client",
     "last_state": False, "last_change_time": 0,
     "change_candidate": None, "change_candidate_frame_count": 0},
]

# ========== UTILS ==========
def run_mediapipe(image):
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = pose_detector.process(image_rgb)
    if results.pose_landmarks:
        keypoints = [(lm.x, lm.y, lm.visibility) for lm in results.pose_landmarks.landmark]
        return np.array(keypoints)
    return None

def angle_between_points(a, b, c):
    ba = a - b
    bc = c - b
    cosine = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
    angle = np.degrees(np.arccos(np.clip(cosine, -1.0, 1.0)))
    return angle

def is_standing(keypoints):
    idx = mp_pose.PoseLandmark
    key_indices = {
        "shoulder": idx.LEFT_SHOULDER.value,
        "hip": idx.LEFT_HIP.value,
        "knee": idx.LEFT_KNEE.value,
        "ankle": idx.LEFT_ANKLE.value
    }
    points = {}
    for name, i in key_indices.items():
        x, y, conf = keypoints[i]
        if conf > THRESHOLD_CONF:
            points[name] = np.array([x, y])

    if len(points) < 3:
        return None

    from itertools import combinations
    for a, b, c in combinations(points.keys(), 3):
        angle = angle_between_points(points[a], points[b], points[c])
        if angle > 150:
            return True
    return False

def iou(boxA, boxB):
    ax, ay, aw, ah = boxA
    bx, by, bw, bh = boxB
    ax2, ay2 = ax + aw, ay + ah
    bx2, by2 = bx + bw, by + bh
    x1, y1 = max(ax, bx), max(ay, by)
    x2, y2 = min(ax2, bx2), min(ay2, by2)
    if x2 <= x1 or y2 <= y1:
        return 0
    inter = (x2 - x1) * (y2 - y1)
    union = aw * ah + bw * bh - inter
    return inter / union

def send_seat_update(seat_id, occupied):
    try:
        res = requests.put(
            API_URL.format(seat_id=seat_id),
            json={"occupied": occupied},
            timeout=1
        )
        print(f"✅ API cập nhật ghế {seat_id}: {'Occupied' if occupied else 'Empty'} | Status: {res.status_code}")
    except Exception as e:
        print(f"❌ API lỗi ghế {seat_id}: {e}")

# ========== CAMERA ==========
cap = cv2.VideoCapture(CAMERA_INDEX)
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = cap.get(cv2.CAP_PROP_FPS) or 30.0

fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(SAVE_PATH, fourcc, fps, (width, height))

# ========== MAIN LOOP ==========
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    current_time = time.time()
    results = yolo_model(frame)
    boxes = results[0].boxes
    person_in_seat = {seat["id"]: False for seat in seats}

    for box in boxes:
        if int(box.cls[0]) != 0:
            continue

        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(int)
        conf = box.conf[0].cpu().item()
        if conf < THRESHOLD_CONF:
            continue

        w, h = x2 - x1, y2 - y1
        ratio = h / w if w > 0 else 0

        if ratio > 2.2:
            label = "Standing"
        elif ratio < 1.2:
            label = "Sitting"
        else:
            person_crop = frame[y1:y2, x1:x2]
            if person_crop.size == 0:
                continue
            keypoints = run_mediapipe(person_crop)
            if keypoints is None:
                label = "Sitting"
            else:
                pose = is_standing(keypoints)
                label = "Standing" if pose else "Sitting"

        # Check each seat
        for seat in seats:
            if iou((x1, y1, w, h), seat["rect"]) > 0.1:
                is_occupied = label == "Sitting"
                person_in_seat[seat["id"]] = True

                if is_occupied != seat["last_state"]:
                    if seat["change_candidate"] != is_occupied:
                        seat["change_candidate"] = is_occupied
                        seat["change_candidate_frame_count"] = 1
                    else:
                        seat["change_candidate_frame_count"] += 1
                        if seat["change_candidate_frame_count"] >= 3 and current_time - seat["last_change_time"] >= 3:
                            seat["occupied"] = is_occupied
                            seat["last_state"] = is_occupied
                            seat["last_change_time"] = current_time
                            seat["change_candidate"] = None
                            seat["change_candidate_frame_count"] = 0
                            send_seat_update(seat["id"], is_occupied)
                else:
                    seat["change_candidate"] = None
                    seat["change_candidate_frame_count"] = 0

    # Check seats without any person
    for seat in seats:
        if not person_in_seat[seat["id"]]:
            is_occupied = False
            if is_occupied != seat["last_state"]:
                if seat["change_candidate"] != is_occupied:
                    seat["change_candidate"] = is_occupied
                    seat["change_candidate_frame_count"] = 1
                else:
                    seat["change_candidate_frame_count"] += 1
                    if seat["change_candidate_frame_count"] >= 8 and current_time - seat["last_change_time"] >= 3:
                        seat["occupied"] = is_occupied
                        seat["last_state"] = is_occupied
                        seat["last_change_time"] = current_time
                        seat["change_candidate"] = None
                        seat["change_candidate_frame_count"] = 0
                        send_seat_update(seat["id"], is_occupied)
            else:
                seat["change_candidate"] = None
                seat["change_candidate_frame_count"] = 0

    # Draw seat boxes
    for seat in seats:
        x, y, w, h = seat["rect"]
        color = (0, 255, 0) if seat["occupied"] else (0, 0, 255)
        label = f"Seat {seat['id']}: {'Occupied' if seat['occupied'] else 'Empty'}"
        cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
        cv2.putText(frame, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

    out.write(frame)
    cv2.imshow("Seat Detection", frame)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
out.release()
cv2.destroyAllWindows()
print(f"✅ Video saved to {SAVE_PATH}")
