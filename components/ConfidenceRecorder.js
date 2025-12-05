import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StopCircle, Camera } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";

const ConfidenceRecorder = ({ onData }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const socketRef = useRef(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const analyzeIntervalRef = useRef(null);

  const [confidenceData, setConfidenceData] = useState({
    emotion: "neutral",
    confidence: 0,
    eye_contact: 0,
    posture_score: 50,
  });

  // Initialize Socket Connection
  const initializeSocket = () => {
    try {
      setIsLoadingModels(true);
      const backendUrl = process.env.NEXT_PUBLIC_FLASK_URL;
      socketRef.current = io(backendUrl, {
        transports: ["websocket"],
        upgrade: false,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
      socketRef.current.on("connect", () => {
        toast.success("Connected to analysis server");
        setIsLoadingModels(false);
      });
      socketRef.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        toast.error("Failed to connect to analysis server. Please check if the server is running.");
        setIsLoadingModels(false);
      });
      socketRef.current.on("analysis_result", (data) => {
        const newData = {
          emotion: data.emotion || "neutral",
          confidence: (data.confidence || 0) * 100,
          eye_contact: data.eye_contact ? 1 : 0,
          posture_score: data.posture_score || 50,
        };
        setConfidenceData(newData);
        onData(newData);
      });
    } catch (error) {
      console.error("Socket initialization error:", error);
      toast.error("Failed to initialize analysis");
      setIsLoadingModels(false);
    }
  };

  // Frame Analysis Method
  const captureAndSendFrame = async () => {
    if (!videoRef.current || !socketRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

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
  };

  // Start Recording Method
  const startRecording = async () => {
    try {
      // Initialize socket if not already done
      if (!socketRef.current) {
        initializeSocket();
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
        audio: false,
      });

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      setVideoStream(stream);
      setIsRecording(true);

      analyzeIntervalRef.current = setInterval(captureAndSendFrame, 1000);

      toast.success("Recording started");
    } catch (error) {
      console.error("Recording error:", error);
      toast.error("Camera access denied. Please check permissions.");
    }
  };

  // Stop Recording Method
  const stopRecording = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
    }

    if (analyzeIntervalRef.current) {
      clearInterval(analyzeIntervalRef.current);
    }

    setIsRecording(false);
    setVideoStream(null);
    toast.success("Recording stopped");
  };

  // Initialize socket on component mount
  useEffect(() => {
    initializeSocket();
    
    // Cleanup on Unmount
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
      if (analyzeIntervalRef.current) {
        clearInterval(analyzeIntervalRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <Card className="w-full border-0 shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-blue-100">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
          <Camera className="mr-3 text-blue-600 w-6 h-6" />
          Confidence Analysis
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="relative w-full aspect-video bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200 shadow-inner">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        <Button
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-full transition-all duration-300 ease-in-out text-lg font-medium py-4 ${
            isRecording
              ? "bg-red-500 hover:bg-red-600"
              : "bg-primary hover:opacity-40"
          } text-white rounded-xl flex items-center justify-center`}
          disabled={isLoadingModels}
        >
          {isRecording ? (
            <>
              <StopCircle className="mr-2 w-5 h-5" /> Stop Recording
            </>
          ) : isLoadingModels ? (
            "Connecting to Analysis Server..."
          ) : (
            "Start Confidence Analysis"
          )}
        </Button>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <p className="text-sm font-medium text-gray-600 mb-1">
                Current Emotion
              </p>
              <p className="text-xl font-bold text-blue-700 capitalize">
                {confidenceData.emotion}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <p className="text-sm font-medium text-gray-600 mb-1">
                Confidence Score
              </p>
              <p className="text-xl font-bold text-green-600">
                {confidenceData.confidence.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Posture Score
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  {confidenceData.posture_score.toFixed(1)}
                </span>
              </div>
              <Progress
                value={confidenceData.posture_score}
                className="w-full h-2.5 bg-blue-100"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Eye Contact
                </span>
                <span
                  className={`text-sm font-bold px-3 py-1 rounded-full ${
                    confidenceData.eye_contact === 1
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {confidenceData.eye_contact === 1
                    ? "Maintained"
                    : "Not Maintained"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <Toaster position="top-right" />
    </Card>
  );
};

export default ConfidenceRecorder;