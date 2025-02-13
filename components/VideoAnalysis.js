import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const VideoAnalysis = () => {
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const [analysisResult, setAnalysisResult] = useState({
    emotion: null,
    confidence: 0,
    eye_contact: 0,
    posture_score: 0
  });

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://127.0.0.1:5000');

    // Handle analysis results
    socketRef.current.on('analysis_result', (data) => {
      setAnalysisResult(data);
    });

    // Initialize webcam
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error('Error accessing webcam:', err);
        });
    }

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Function to capture and send frame
  const captureAndSendFrame = async () => {
    if (!videoRef.current || !socketRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob && socketRef.current) {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result instanceof ArrayBuffer) {
              socketRef.current.emit('frame', new Uint8Array(reader.result));
            }
          };
          reader.readAsArrayBuffer(blob);
        }
      }, 'image/jpeg');
    }
  };

  // Capture and analyze frames periodically
  useEffect(() => {
    const intervalId = setInterval(captureAndSendFrame, 1000); // Analyze every second
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Video Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Emotion</p>
                <p className="text-2xl font-bold">{analysisResult.emotion || 'N/A'}</p>
                <p className="text-sm text-gray-500">
                  Confidence: {(analysisResult.confidence * 100).toFixed(1)}%
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Eye Contact</p>
                <p className="text-2xl font-bold">
                  {analysisResult.eye_contact ? 'Maintained' : 'Not Maintained'}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Posture Score</p>
                <p className="text-2xl font-bold">
                  {analysisResult.posture_score.toFixed(1)}°
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoAnalysis;