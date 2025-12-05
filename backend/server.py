import os

# MEMORY OPTIMIZATION: Critical for Render Free Tier
os.environ["MALLOC_ARENA_MAX"] = "2"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"  # Reduce TensorFlow logs

from flask import Flask
from flask_socketio import SocketIO, emit
import cv2
import numpy as np
import mediapipe as mp
from flask_cors import CORS
from threading import Lock

app = Flask(__name__)
CORS(app)

# USE THREADING: Prevents blocking issues
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")

# ---------------- Global Initialization ---------------- #
mp_face_mesh = mp.solutions.face_mesh
mp_pose = mp.solutions.pose

# Load MediaPipe models once (Safe for 512MB RAM)
face_mesh_detector = mp_face_mesh.FaceMesh(
    static_image_mode=True, max_num_faces=1, refine_landmarks=True
)

pose_detector = mp_pose.Pose(
    static_image_mode=True,
    model_complexity=0,  # Reduced complexity (0 is fastest/lightest)
)

# THROTTLING LOCK
processing_lock = Lock()

# ---------------- Helper Functions ---------------- #


def analyze_emotion(frame):
    """
    Analyze emotion using DeepFace.
    Includes a SAFETY NET: If RAM is full, return 'Neutral' instead of crashing.
    """
    try:
        from deepface import DeepFace

        # 'opencv' backend is the lightest
        result = DeepFace.analyze(
            frame,
            actions=["emotion"],
            enforce_detection=False,
            detector_backend="opencv",
        )

        emotion = result[0]["dominant_emotion"]
        confidence = min(100.0, result[0]["emotion"][emotion])

        return emotion, confidence / 100.0

    except ImportError:
        print("Error: DeepFace/TensorFlow not installed or RAM full.")
        return "Neutral", 0.0
    except Exception as e:
        # If DeepFace fails (often due to OOM), fail gracefully
        print(f"Emotion Skipped (RAM protection): {e}")
        return "Neutral", 0.0


def calculate_eye_contact(face_landmarks):
    """
    Returns 1 if looking forward, 0 otherwise.
    """
    try:
        LEFT_EYE = [33, 133, 157, 158, 159, 160, 161, 173, 246]
        RIGHT_EYE = [362, 263, 384, 385, 386, 387, 388, 398, 466]

        def get_pt(idx):
            return [
                face_landmarks.landmark[idx].x,
                face_landmarks.landmark[idx].y,
                face_landmarks.landmark[idx].z,
            ]

        l_pts = np.array([get_pt(i) for i in LEFT_EYE])
        r_pts = np.array([get_pt(i) for i in RIGHT_EYE])

        l_center = l_pts.mean(axis=0)
        r_center = r_pts.mean(axis=0)
        nose = np.array(get_pt(1))

        vertical_tilt = abs(nose[1] - (l_center[1] + r_center[1]) / 2)
        eye_dist = np.linalg.norm(l_center - r_center)

        if eye_dist == 0:
            return 0
        horiz_angle = abs(l_center[2] - r_center[2]) / eye_dist

        return 1 if (vertical_tilt < 0.15 and horiz_angle < 0.1) else 0
    except:
        return 0


def calculate_angle(a, b, c):
    try:
        a, b, c = np.array(a), np.array(b), np.array(c)
        ba, bc = a - b, c - b
        n_ba = np.linalg.norm(ba)
        n_bc = np.linalg.norm(bc)
        if n_ba == 0 or n_bc == 0:
            return 0.0
        cosine = np.clip(np.dot(ba, bc) / (n_ba * n_bc), -1.0, 1.0)
        return float(np.degrees(np.arccos(cosine)))
    except:
        return 0.0


# ---------------- SocketIO Event ---------------- #


@socketio.on("frame")
def handle_frame(data):
    # 1. THROTTLING: Drop frame if busy
    if processing_lock.locked():
        return

    # 2. PROCESS
    with processing_lock:
        try:
            frame_bytes = np.frombuffer(data, dtype=np.uint8)
            frame = cv2.imdecode(frame_bytes, cv2.IMREAD_COLOR)

            if frame is None:
                return

            # MEMORY FIX: Resize large frames to 360p
            # This massively reduces RAM usage for DeepFace
            frame = cv2.resize(frame, (480, 360))
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            # A. Emotion (Protected by try/except inside function)
            emotion, confidence = analyze_emotion(frame_rgb)

            # B. Gaze
            results_face = face_mesh_detector.process(frame_rgb)
            eye_contact = 0
            if results_face.multi_face_landmarks:
                eye_contact = calculate_eye_contact(
                    results_face.multi_face_landmarks[0]
                )

            # C. Posture
            results_pose = pose_detector.process(frame_rgb)
            posture_score = 0.0

            if results_pose.pose_landmarks:
                lms = results_pose.pose_landmarks.landmark

                def gc(i):
                    return [lms[i].x, lms[i].y]

                # Shoulder/Hip indices
                ls, rs = gc(11), gc(12)
                lh, rh = gc(23), gc(24)

                sh_angle = calculate_angle(ls, rs, rh)
                hip_angle = calculate_angle(ls, lh, rh)
                posture_score = (sh_angle + hip_angle) / 2

            emit(
                "analysis_result",
                {
                    "emotion": str(emotion),
                    "confidence": float(confidence),
                    "eye_contact": int(eye_contact),
                    "posture_score": float(posture_score),
                },
            )

        except Exception as e:
            print(f"Frame Error: {e}")


# ---------------- Main ---------------- #


@app.route("/")
def index():
    return "Server is online (Optimized Mode)!"


if __name__ == "__main__":
    socketio.run(app, debug=True)
