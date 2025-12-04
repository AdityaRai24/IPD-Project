import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VideoAnalysis = () => {
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const [analysisResult, setAnalysisResult] = useState({
    emotion: null,
    confidence: 0,
    eye_contact: 0,
    posture_score: 0,
  });

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_FLASK_URL;
    socketRef.current = io(backendUrl);
    socketRef.current.on("analysis_result", (data) => {
      setAnalysisResult(data);
    });

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing webcam:", err);
        });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const captureAndSendFrame = async () => {
    if (!videoRef.current || !socketRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob && socketRef.current) {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result instanceof ArrayBuffer) {
              socketRef.current.emit("frame", new Uint8Array(reader.result));
            }
          };
          reader.readAsArrayBuffer(blob);
        }
      }, "image/jpeg");
    }
  };

  useEffect(() => {
    const intervalId = setInterval(captureAndSendFrame, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="h-full flex flex-col gap-4">
      <Card className="flex-grow">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-lg font-medium text-gray-800  justify-center text-center ">
            Video 
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-[280px] rounded-lg border border-gray-200 object-cover bg-gray-50"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-white">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-gray-600 mb-1">Emotion</p>
            <p className="text-2xl font-semibold text-gray-900">
              {analysisResult.emotion || "N/A"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Confidence: {(analysisResult.confidence * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Eye Contact
            </p>
            <p
              className={`text-2xl font-semibold ${
                analysisResult.eye_contact ? "text-green-600" : "text-red-600"
              }`}
            >
              {analysisResult.eye_contact ? "Yes" : "No"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-gray-600 mb-1">Posture</p>
            <p className="text-2xl font-semibold text-gray-900">
              {analysisResult.posture_score.toFixed(1)}°
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoAnalysis;
