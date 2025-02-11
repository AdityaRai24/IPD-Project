from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import cv2
import numpy as np
from deepface import DeepFace
import mediapipe as mp

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize MediaPipe modules for face and pose estimation
mp_face_mesh = mp.solutions.face_mesh
mp_pose = mp.solutions.pose

# ---------------- Video Analysis Functions ---------------- #

def analyze_emotion(frame):
    """Analyze the dominant emotion and its confidence using DeepFace."""
    try:
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = DeepFace.analyze(frame_rgb, actions=['emotion'], enforce_detection=False)
        # DeepFace returns a list; we extract the first analysis result.
        emotion = result[0]['dominant_emotion']
        confidence = result[0]['emotion'][emotion]
        return emotion, confidence
    except Exception as e:
        print(f"DeepFace error: {e}")
        return None, 0

def calculate_eye_contact(face_landmarks):
    """A simple heuristic to calculate eye contact based on landmarks."""
    # Using indices for left and right eyes (you can adjust these as needed)
    left_eye_idx = [33, 133]
    right_eye_idx = [362, 263]
    left_eye = np.array([face_landmarks.landmark[i].x for i in left_eye_idx])
    right_eye = np.array([face_landmarks.landmark[i].x for i in right_eye_idx])
    eye_distance = np.abs(left_eye.mean() - right_eye.mean())
    # If the horizontal distance between eyes is very small, we assume eye contact
    return 1 if eye_distance < 0.02 else 0

def calculate_angle(a, b, c):
    """Calculate the angle (in degrees) between the vectors BA and BC."""
    a, b, c = np.array(a), np.array(b), np.array(c)
    ba, bc = a - b, c - b
    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
    # Clip cosine value to avoid numerical issues due to floating point precision
    cosine_angle = np.clip(cosine_angle, -1.0, 1.0)
    return np.degrees(np.arccos(cosine_angle))

# ---------------- SocketIO Event ---------------- #

@socketio.on('frame')
def handle_frame(data):
    # Decode the received frame from a byte array
    frame = np.frombuffer(data, dtype=np.uint8)
    frame = cv2.imdecode(frame, cv2.IMREAD_COLOR)
    
    # Analyze emotion using DeepFace
    emotion, confidence = analyze_emotion(frame)
    
    # Estimate gaze/eye contact using MediaPipe Face Mesh
    face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1)
    results_face = face_mesh.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    eye_contact = 0
    if results_face.multi_face_landmarks:
        eye_contact = calculate_eye_contact(results_face.multi_face_landmarks[0])
    
    # Analyze posture using MediaPipe Pose estimation
    pose = mp_pose.Pose(static_image_mode=True)
    results_pose = pose.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    posture_score = 0
    if results_pose.pose_landmarks:
        landmarks = results_pose.pose_landmarks.landmark
        left_shoulder = [
            landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
            landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y
        ]
        right_shoulder = [
            landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,
            landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y
        ]
        left_hip = [
            landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,
            landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y
        ]
        right_hip = [
            landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,
            landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y
        ]
        # Compute two angles to get a rough measure of posture
        shoulder_angle = calculate_angle(left_shoulder, right_shoulder, right_hip)
        hip_angle = calculate_angle(left_shoulder, left_hip, right_hip)
        posture_score = (shoulder_angle + hip_angle) / 2

    # Emit the analysis results back to the client
    emit('analysis_result', {
        'emotion': emotion,
        'confidence': confidence,
        'eye_contact': eye_contact,
        'posture_score': posture_score
    })

# ---------------- Flask Route ---------------- #

@app.route('/')
def index():
    return render_template('index.html')

# ---------------- Main ---------------- #

if __name__ == '__main__':
    socketio.run(app, debug=True)
