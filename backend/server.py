import os
# MEMORY OPTIMIZATION: Helps keep RAM usage low for Render Free Tier
os.environ['MALLOC_ARENA_MAX'] = '2'

from flask import Flask
from flask_socketio import SocketIO, emit
import cv2
import numpy as np
import mediapipe as mp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# CRITICAL CHANGE: Switch to 'threading' mode.
# This prevents the "blocking functions" error when DeepFace runs.
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# ---------------- Global Initialization ---------------- #
# We load MediaPipe globally because it is lightweight enough.
mp_face_mesh = mp.solutions.face_mesh
mp_pose = mp.solutions.pose

face_mesh_detector = mp_face_mesh.FaceMesh(
    static_image_mode=True, 
    max_num_faces=1, 
    refine_landmarks=True
)

pose_detector = mp_pose.Pose(
    static_image_mode=True,
    model_complexity=1
)

# ---------------- Helper Functions ---------------- #

def analyze_emotion(frame): 
    """Analyze the dominant emotion using DeepFace (Lazy Loaded)."""
    try:
        # LAZY LOADING: Import DeepFace only when needed.
        # This prevents the server from crashing immediately upon deployment.
        from deepface import DeepFace
        
        # detector_backend='opencv' is faster and uses less RAM than retinaface
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
    # Standard Gaze Logic
    LEFT_EYE_INDICES = [33, 133, 157, 158, 159, 160, 161, 173, 246]
    RIGHT_EYE_INDICES = [362, 263, 384, 385, 386, 387, 388, 398, 466]
    
    left_eye_points = np.array([[face_landmarks.landmark[idx].x, 
                               face_landmarks.landmark[idx].y, 
                               face_landmarks.landmark[idx].z] for idx in LEFT_EYE_INDICES])
    right_eye_points = np.array([[face_landmarks.landmark[idx].x, 
                                face_landmarks.landmark[idx].y, 
                                face_landmarks.landmark[idx].z] for idx in RIGHT_EYE_INDICES])
    
    left_eye_center = left_eye_points.mean(axis=0)
    right_eye_center = right_eye_points.mean(axis=0)
    
    nose_tip = np.array([face_landmarks.landmark[1].x,
                        face_landmarks.landmark[1].y,
                        face_landmarks.landmark[1].z])
    
    vertical_tilt = abs(nose_tip[1] - (left_eye_center[1] + right_eye_center[1]) / 2)
    eye_distance = np.linalg.norm(left_eye_center - right_eye_center)
    
    if eye_distance == 0: return 0
    horizontal_angle = abs(left_eye_center[2] - right_eye_center[2]) / eye_distance
    
    VERTICAL_THRESHOLD = 0.15
    HORIZONTAL_THRESHOLD = 0.1
    
    is_looking_forward = (vertical_tilt < VERTICAL_THRESHOLD and 
                         horizontal_angle < HORIZONTAL_THRESHOLD)
    return 1 if is_looking_forward else 0

def calculate_angle(a, b, c):
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
    try:
        frame_bytes = np.frombuffer(data, dtype=np.uint8)
        frame = cv2.imdecode(frame_bytes, cv2.IMREAD_COLOR)
        
        if frame is None:
            return

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # 1. Analyze emotion (Imports DeepFace on demand)
        emotion, confidence = analyze_emotion(frame_rgb)
        
        # 2. Estimate gaze (Uses global detector)
        results_face = face_mesh_detector.process(frame_rgb)
        eye_contact = 0
        if results_face.multi_face_landmarks:
            eye_contact = calculate_eye_contact(results_face.multi_face_landmarks[0])
        
        # 3. Analyze posture (Uses global detector)
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

        response_data = {
            'emotion': str(emotion) if emotion else "Neutral",
            'confidence': float(confidence),
            'eye_contact': int(eye_contact),
            'posture_score': float(posture_score)
        }

        emit('analysis_result', response_data)

    except Exception as e:
        print(f"Error in handle_frame: {e}")

@app.route('/')
def index():
    return "Server is running (Threading Mode)!"

if __name__ == '__main__':
    socketio.run(app, debug=True)
