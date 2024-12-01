import cv2
import numpy as np
from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS  # Keep this import
import eventlet
eventlet.monkey_patch()  # Important for Socket.IO compatibility

from deepface import DeepFace
import mediapipe as mp
import base64
import io
from PIL import Image

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:3000",  # Next.js default port
            "http://localhost:5000",  # Flask server port
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5000"
        ]
    }
})

socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')
# Initialize Mediapipe models
mp_face_mesh = mp.solutions.face_mesh
mp_pose = mp.solutions.pose

def analyze_emotion(frame):
    try:
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = DeepFace.analyze(frame_rgb, actions=['emotion'], enforce_detection=False)
        emotion = result[0]['dominant_emotion']
        confidence = result[0]['emotion'][emotion]
        return emotion, confidence
    except Exception as e:
        print(f"DeepFace error: {e}")
        return "neutral", 50.0  # Default values if analysis fails

def calculate_eye_contact(face_landmarks):
    left_eye_idx = [33, 133]
    right_eye_idx = [362, 263]
    
    # Calculate eye positions
    left_eye = np.array([face_landmarks.landmark[i].x for i in left_eye_idx])
    right_eye = np.array([face_landmarks.landmark[i].x for i in right_eye_idx])
    
    # Determine eye contact based on relative positions
    eye_distance = np.abs(left_eye.mean() - right_eye.mean())
    return 1 if eye_distance < 0.05 else 0  # Adjusted threshold

def calculate_posture_score(pose_landmarks):
    if not pose_landmarks:
        return 50.0  # Default neutral score
    
    landmarks = pose_landmarks.landmark
    
    # Get key body landmarks
    left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].x, 
                     landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].y]
    right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER].x, 
                      landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER].y]
    left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP].x, 
                landmarks[mp_pose.PoseLandmark.LEFT_HIP].y]
    right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP].x, 
                 landmarks[mp_pose.PoseLandmark.RIGHT_HIP].y]
    
    # Check shoulder and hip alignment
    shoulders_horizontal = abs(left_shoulder[1] - right_shoulder[1]) < 0.05
    hips_horizontal = abs(left_hip[1] - right_hip[1]) < 0.05
    
    # Score posture based on alignment
    if shoulders_horizontal and hips_horizontal:
        return 80.0  # Good posture
    elif shoulders_horizontal or hips_horizontal:
        return 60.0  # Moderate posture
    else:
        return 40.0  # Poor posture

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('start_recording')
def handle_start_recording():
    print('Recording started')
    emit('recording_status', {'status': 'started'})

@socketio.on('stop_recording')
def handle_stop_recording():
    print('Recording stopped')
    emit('recording_status', {'status': 'stopped'})

@socketio.on('frame')
def handle_frame(data):
    try:
        # Decode base64 image
        frame_data = base64.b64decode(data.split(',')[1])
        nparr = np.frombuffer(frame_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            print("Failed to decode frame")
            return

        # Emotion analysis
        emotion, confidence = analyze_emotion(frame)

        # Mediapipe face mesh analysis
        face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1)
        results_face = face_mesh.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        
        eye_contact = 0
        if results_face.multi_face_landmarks:
            eye_contact = calculate_eye_contact(results_face.multi_face_landmarks[0])

        # Mediapipe pose analysis
        pose = mp_pose.Pose(static_image_mode=False)
        results_pose = pose.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        
        posture_score = calculate_posture_score(results_pose.pose_landmarks)

        # Print debug information
        print(f"Analysis Result - Emotion: {emotion}, Confidence: {confidence}, "
              f"Eye Contact: {eye_contact}, Posture Score: {posture_score}")

        # Emit analysis results
        emit('analysis_result', {
            'emotion': emotion,
            'confidence': confidence,
            'eye_contact': eye_contact,
            'posture_score': posture_score
        })

    except Exception as e:
        print(f"Frame processing error: {e}")
        emit('analysis_error', {'message': str(e)})

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "Server is running!"})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)