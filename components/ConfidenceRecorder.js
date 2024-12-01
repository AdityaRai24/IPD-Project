//error in readings and randomly generated
// import React, { useEffect, useRef, useState } from "react";
// const ConfidenceRecorder = ({ onData }) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [videoStream, setVideoStream] = useState(null);
//   const videoRef = useRef(null);

//   const [confidenceData, setConfidenceData] = useState([]);
//   const [averageConfidence, setAverageConfidence] = useState(0);

//   const startRecording = async () => {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });

//       setVideoStream(stream);
//       videoRef.current.srcObject = stream;
//       setIsRecording(true);

//       // Simulate gathering confidence data every second (replace with actual detection logic)
//       setInterval(() => {
//         if (isRecording) {
//           // Simulated data (replace with actual model or logic)
//           const newData = {
//             confidence: Math.random() * 100, // Random confidence percentage
//             posture_score: Math.random(), // Random posture score (0 to 1)
//             eye_contact: Math.random() > 0.5 ? 1 : 0, // Simulate eye contact (1 for yes, 0 for no)
//           };

//           // Add the new data to the array
//           setConfidenceData((prevData) => [...prevData, newData]);

//           // Calculate the average confidence every second
//           const totalConfidence = confidenceData.reduce((acc, item) => acc + item.confidence, 0);
//           const average = totalConfidence / confidenceData.length;
//           setAverageConfidence(average);

//           // Pass the data to the parent component
//           onData(confidenceData);
//         }
//       }, 1000); // Adjust this interval as needed
//     } else {
//       console.error("Camera not available.");
//     }
//   };

//   const stopRecording = () => {
//     if (videoStream) {
//       videoStream.getTracks().forEach((track) => track.stop());
//     }
//     setIsRecording(false);
//   };

//   useEffect(() => {
//     if (isRecording) {
//       startRecording();
//     } else {
//       stopRecording();
//     }

//     return () => {
//       if (videoStream) {
//         videoStream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, [isRecording]);

//   return (
//     <div className="flex flex-col items-center">
//       <div className="relative w-[300px] h-[400px] mb-4">
//         <video
//           ref={videoRef}
//           autoPlay
//           muted
//           className="w-full h-full rounded-lg border-2"
//         ></video>
//       </div>

//       <div className="flex flex-col items-center gap-4">
//         <button
//           onClick={() => setIsRecording(!isRecording)}
//           className="bg-blue-500 text-white py-2 px-4 rounded-md"
//         >
//           {isRecording ? "Stop Recording" : "Start Recording"}
//         </button>

//         <div className="mt-4">
//           <h3 className="font-semibold">Confidence Analysis:</h3>
//           <p><strong>Current Confidence:</strong> {averageConfidence.toFixed(2)}%</p>
//           <p><strong>Eye Contact:</strong> {confidenceData[confidenceData.length - 1]?.posture_score?.toFixed(2) || "N/A"}</p>
//           <p><strong>Eye Contact:</strong> {confidenceData[confidenceData.length - 1]?.eye_contact === 1 ? "Yes" : "No"}</p>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default ConfidenceRecorder;



//3 posture scores changing randomly

// import React, { useEffect, useRef, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { StopCircle } from "lucide-react";

// const ConfidenceRecorder = ({ onData }) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [videoStream, setVideoStream] = useState(null);
//   const videoRef = useRef(null);

//   const [confidenceData, setConfidenceData] = useState([]);
//   const [averageConfidence, setAverageConfidence] = useState(0);

//   const startRecording = async () => {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });

//       setVideoStream(stream);
//       videoRef.current.srcObject = stream;
//       setIsRecording(true);

//       setInterval(() => {
//         if (isRecording) {
//           const newData = {
//             confidence: Math.random() * 100,
//             posture_score: Math.random(),
//             eye_contact: Math.random() > 0.5 ? 1 : 0,
//           };

//           setConfidenceData((prevData) => [...prevData, newData]);

//           const totalConfidence = confidenceData.reduce((acc, item) => acc + item.confidence, 0);
//           const average = totalConfidence / confidenceData.length;
//           setAverageConfidence(average);

//           onData(confidenceData);
//         }
//       }, 1000);
//     } else {
//       console.error("Camera not available.");
//     }
//   };

//   const stopRecording = () => {
//     if (videoStream) {
//       videoStream.getTracks().forEach((track) => track.stop());
//     }
//     setIsRecording(false);
//   };

//   useEffect(() => {
//     if (isRecording) {
//       startRecording();
//     } else {
//       stopRecording();
//     }

//     return () => {
//       if (videoStream) {
//         videoStream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, [isRecording]);

//   return (
//     <Card className="w-full max-w-lg mx-auto mt-8 p-4">
//       <CardHeader>
//         <CardTitle>Confidence Analysis</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
//           <video
//             ref={videoRef}
//             autoPlay
//             muted
//             className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
//           />
//         </div>

//         <Button
//           onClick={() => setIsRecording(!isRecording)}
//           className={`w-full ${isRecording ? 'bg-red-500' : 'bg-red-500'} text-white py-2 px-4 rounded-md`}
//         >
//           {isRecording ? (
//             <>
//               <StopCircle className="mr-2" /> Stop Recording
//             </>
//           ) : (
//             "Start Recording"
//           )}
//         </Button>

//         <div className="mt-4 space-y-4">
//           <h3 className="font-semibold text-lg">Confidence Analysis:</h3>
//           <div className="space-y-2">
//             <div className="flex justify-between items-center">
//               <span className="font-medium">Current Confidence</span>
//               <span className="text-sm text-gray-500">{averageConfidence.toFixed(2)}%</span>
//             </div>

//             <div className="flex justify-between items-center">
//               <span className="font-medium">Posture Score</span>
//               <Progress
//                 value={confidenceData[confidenceData.length - 1]?.posture_score * 100 || 0}
//                 className="w-full"
//               />
//               <span className="text-sm text-gray-500">
//                 {confidenceData[confidenceData.length - 1]?.posture_score?.toFixed(2) || "N/A"}
//               </span>
//             </div>

//             <div className="flex justify-between items-center">
//               <span className="font-medium">Eye Contact</span>
//               <span className="text-sm text-gray-500">
//                 {confidenceData[confidenceData.length - 1]?.eye_contact === 1 ? "Yes" : "No"}
//               </span>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default ConfidenceRecorder;


import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StopCircle, Camera } from "lucide-react";
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const ConfidenceRecorder = ({ onData, onVideoReady }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const canvasRef = useRef(null);

  const [confidenceData, setConfidenceData] = useState({
    emotion: 'neutral',
    confidence: 0,
    eye_contact: 0,
    posture_score: 50
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false
      });

      // Setup socket connection
      socketRef.current = io('http://localhost:5000', {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      socketRef.current.on('connect', () => {
        socketRef.current.emit('start_recording');
        toast.success('Recording started', { 
          icon: '🎥',
          position: 'top-right'
        });
      });

      socketRef.current.on('analysis_result', (result) => {
        setConfidenceData(result);
        onData(result);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error("Socket connection error:", error);
        toast.error('Failed to connect to analysis server', {
          position: 'top-right'
        });
      });

      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
        onVideoReady && onVideoReady();
      };

      setVideoStream(stream);
      setIsRecording(true);

      const captureFrame = () => {
        if (isRecording && videoRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          ctx.drawImage(videoRef.current, 0, 0);
          
          const base64Frame = canvas.toDataURL('image/jpeg');
          socketRef.current.emit('frame', base64Frame);
        }
      };

      const intervalId = setInterval(captureFrame, 1000);

      return () => {
        clearInterval(intervalId);
        socketRef.current?.emit('stop_recording');
        socketRef.current?.disconnect();
      };

    } catch (error) {
      console.error("Recording error:", error);
      toast.error('Camera access denied. Please check permissions.', {
        icon: '🚫',
        position: 'top-right'
      });
    }
  };

  const stopRecording = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
    }
    
    if (socketRef.current) {
      socketRef.current.emit('stop_recording');
      socketRef.current.disconnect();
      toast.success('Recording stopped', {
        icon: '⏹️',
        position: 'top-right'
      });
    }

    setIsRecording(false);
    setVideoStream(null);
  };

  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <Card className="w-full border-2 border-gray-200 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200 p-4">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
          <Camera className="mr-2 text-blue-600" /> 
          Confidence Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        <Button
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-full transition-all duration-300 ease-in-out ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          } text-white py-3 rounded-lg flex items-center justify-center`}
        >
          {isRecording ? (
            <>
              <StopCircle className="mr-2" /> Stop Recording
            </>
          ) : (
            "Start Confidence Analysis"
          )}
        </Button>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Emotion</p>
              <p className="text-lg font-bold text-blue-600">{confidenceData.emotion}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Confidence</p>
              <p className="text-lg font-bold text-green-600">
                {confidenceData.confidence.toFixed(2)}%
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Posture Score</span>
              <span className="text-sm text-gray-500">
                {confidenceData.posture_score.toFixed(2)}
              </span>
            </div>
            <Progress 
              value={confidenceData.posture_score} 
              className="w-full h-2" 
              indicatorClassName="bg-blue-500"
            />
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-medium text-gray-700">Eye Contact</span>
              <span className={`text-sm font-bold ${
                confidenceData.eye_contact === 1 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {confidenceData.eye_contact === 1 ? "Maintained" : "Not Maintained"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfidenceRecorder;