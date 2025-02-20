from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import cv2
import numpy as np
from deepface import DeepFace
import mediapipe as mp

from flask_cors import CORS

app = Flask(__name__)
CORS(app)
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
        # DeepFace returns a list; we extract the first analysis result
        emotion = result[0]['dominant_emotion']
        # Ensure confidence is between 0 and 100
        confidence = min(100.0, result[0]['emotion'][emotion])
        return emotion, confidence / 100  # Convert to decimal (0-1 range)
    except Exception as e:
        print(f"DeepFace error: {e}")
        return None, 0

def calculate_eye_contact(face_landmarks):
    """
    Enhanced eye contact detection using multiple facial landmarks
    Returns a boolean indicating whether eye contact is detected
    """
    # Define key landmark indices for eyes
    LEFT_EYE_INDICES = [33, 133, 157, 158, 159, 160, 161, 173, 246]  # Left eye landmarks
    RIGHT_EYE_INDICES = [362, 263, 384, 385, 386, 387, 388, 398, 466]  # Right eye landmarks
    
    # Get eye landmarks
    left_eye_points = np.array([[face_landmarks.landmark[idx].x, 
                               face_landmarks.landmark[idx].y, 
                               face_landmarks.landmark[idx].z] for idx in LEFT_EYE_INDICES])
    right_eye_points = np.array([[face_landmarks.landmark[idx].x, 
                                face_landmarks.landmark[idx].y, 
                                face_landmarks.landmark[idx].z] for idx in RIGHT_EYE_INDICES])
    
    # Calculate eye centers
    left_eye_center = left_eye_points.mean(axis=0)
    right_eye_center = right_eye_points.mean(axis=0)
    
    # Calculate face direction using nose tip (landmark 1)
    nose_tip = np.array([face_landmarks.landmark[1].x,
                        face_landmarks.landmark[1].y,
                        face_landmarks.landmark[1].z])
    
    # Calculate the vertical tilt of the face
    vertical_tilt = abs(nose_tip[1] - (left_eye_center[1] + right_eye_center[1]) / 2)
    
    # Calculate horizontal angle of the face
    eye_distance = np.linalg.norm(left_eye_center - right_eye_center)
    horizontal_angle = abs(left_eye_center[2] - right_eye_center[2]) / eye_distance
    
    # Thresholds for determining eye contact
    VERTICAL_THRESHOLD = 0.15  # Adjusted threshold for vertical tilt
    HORIZONTAL_THRESHOLD = 0.1  # Adjusted threshold for horizontal angle
    
    # Check if both vertical and horizontal angles are within acceptable ranges
    is_looking_forward = (vertical_tilt < VERTICAL_THRESHOLD and 
                         horizontal_angle < HORIZONTAL_THRESHOLD)
    
    return 1 if is_looking_forward else 0

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
    return "Server is running!"

# ---------------- Main ---------------- #

if __name__ == '__main__':
    socketio.run(app, debug=True)
