import os
# MEMORY OPTIMIZATION: Critical for Render Free Tier
os.environ['MALLOC_ARENA_MAX'] = '2'

from flask import Flask
from flask_socketio import SocketIO, emit
import cv2
import numpy as np
import mediapipe as mp
from flask_cors import CORS
from threading import Lock

app = Flask(__name__)
CORS(app)

# USE THREADING: Prevents the "blocking mainloop" error
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# ---------------- Global Initialization ---------------- #
mp_face_mesh = mp.solutions.face_mesh
mp_pose = mp.solutions.pose

# Load MediaPipe models once (lightweight enough for global load)
face_mesh_detector = mp_face_mesh.FaceMesh(
    static_image_mode=True, 
    max_num_faces=1, 
    refine_landmarks=True
)

pose_detector = mp_pose.Pose(
    static_image_mode=True,
    model_complexity=1
)

# THROTTLING LOCK: Prevents server overload
# If the server is busy processing a frame, new frames are ignored.
processing_lock = Lock()

# ---------------- Helper Functions ---------------- #

def analyze_emotion(frame): 
    """Analyze emotion using DeepFace (Lazy Loaded)."""
    try:
        # LAZY LOAD: Prevents startup crash
        from deepface import DeepFace
        
        # 'opencv' backend is faster/lighter than retinaface
        result = DeepFace.analyze(
            frame, 
            actions=['emotion'], 
            enforce_detection=False, 
            detector_backend='opencv' 
        )
        
        emotion = result[0]['dominant_emotion']
        confidence = min(100.0, result[0]['emotion'][emotion])
        
        return emotion, confidence / 100.0
    except Exception as e:
        print(f"DeepFace error: {e}")
        return None, 0

def calculate_eye_contact(face_landmarks):
    """
    Returns 1 if looking forward, 0 otherwise.
    """
    try:
        LEFT_EYE_INDICES = [33, 133, 157, 158, 159, 160, 161, 173, 246]
        RIGHT_EYE_INDICES = [362, 263, 384, 385, 386, 387, 388, 398, 466]
        
        # Helper to get numpy array of points
        def get_points(indices):
            return np.array([[face_landmarks.landmark[idx].x, 
                              face_landmarks.landmark[idx].y, 
                              face_landmarks.landmark[idx].z] for idx in indices])

        left_eye_points = get_points(LEFT_EYE_INDICES)
        right_eye_points = get_points(RIGHT_EYE_INDICES)
        
        left_eye_center = left_eye_points.mean(axis=0)
        right_eye_center = right_eye_points.mean(axis=0)
        
        nose_tip = np.array([face_landmarks.landmark[1].x,
                            face_landmarks.landmark[1].y,
                            face_landmarks.landmark[1].z])
        
        vertical_tilt = abs(nose_tip[1] - (left_eye_center[1] + right_eye_center[1]) / 2)
        
        eye_distance = np.linalg.norm(left_eye_center - right_eye_center)
        if eye_distance == 0:
            return 0
            
        horizontal_angle = abs(left_eye_center[2] - right_eye_center[2]) / eye_distance
        
        VERTICAL_THRESHOLD = 0.15 
        HORIZONTAL_THRESHOLD = 0.1 
        
        is_looking_forward = (vertical_tilt < VERTICAL_THRESHOLD and 
                            horizontal_angle < HORIZONTAL_THRESHOLD)
        
        return 1 if is_looking_forward else 0
    except Exception as e:
        print(f"Eye contact error: {e}")
        return 0

def calculate_angle(a, b, c):
    """Calculate angle between three points."""
    a, b, c = np.array(a), np.array(b), np.array(c)
    ba, bc = a - b, c - b
    
    norm_ba = np.linalg.norm(ba)
    norm_bc = np.linalg.norm(bc)
    
    if norm_ba == 0 or norm_bc == 0:
        return 0.0

    cosine_angle = np.dot(ba, bc) / (norm_ba * norm_bc)
    cosine_angle = np.clip(cosine_angle, -1.0, 1.0)
    
    return float(np.degrees(np.arccos(cosine_angle)))

# ---------------- SocketIO Event ---------------- #

@socketio.on('frame')
def handle_frame(data):
    # 1. THROTTLING CHECK
    # If the lock is acquired (someone else is being processed), skip this frame.
    if processing_lock.locked():
        return

    # 2. PROCESS FRAME (Protected by Lock)
    with processing_lock:
        try:
            frame_bytes = np.frombuffer(data, dtype=np.uint8)
            frame = cv2.imdecode(frame_bytes, cv2.IMREAD_COLOR)
            
            if frame is None:
                return

            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            # --- Analysis Pipeline ---
            
            # A. Emotion (Heavy Task)
            emotion, confidence = analyze_emotion(frame_rgb)
            
            # B. Gaze
            results_face = face_mesh_detector.process(frame_rgb)
            eye_contact = 0
            if results_face.multi_face_landmarks:
                eye_contact = calculate_eye_contact(results_face.multi_face_landmarks[0])
            
            # C. Posture
            results_pose = pose_detector.process(frame_rgb)
            posture_score = 0.0
            
            if results_pose.pose_landmarks:
                landmarks = results_pose.pose_landmarks.landmark
                def get_coords(idx): return [landmarks[idx].x, landmarks[idx].y]

                l_sh = get_coords(mp_pose.PoseLandmark.LEFT_SHOULDER.value)
                r_sh = get_coords(mp_pose.PoseLandmark.RIGHT_SHOULDER.value)
                l_hip = get_coords(mp_pose.PoseLandmark.LEFT_HIP.value)
                r_hip = get_coords(mp_pose.PoseLandmark.RIGHT_HIP.value)
                
                sh_angle = calculate_angle(l_sh, r_sh, r_hip)
                hip_angle = calculate_angle(l_sh, l_hip, r_hip)
                posture_score = (sh_angle + hip_angle) / 2

            # --- Response ---
            response_data = {
                'emotion': str(emotion) if emotion else "Neutral",
                'confidence': float(confidence),
                'eye_contact': int(eye_contact),
                'posture_score': float(posture_score)
            }

            emit('analysis_result', response_data)

        except Exception as e:
            print(f"Error in handle_frame: {e}")

# ---------------- Main ---------------- #

@app.route('/')
def index():
    return "Server is running (Threaded + Throttled)!"

if __name__ == '__main__':
    socketio.run(app, debug=True)
