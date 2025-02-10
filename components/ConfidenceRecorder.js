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

// saturday
// import React, { useEffect, useRef, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { StopCircle, Camera } from "lucide-react";
// import toast from 'react-hot-toast';

// const ConfidenceRecorder = ({ onData, onVideoReady }) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [videoStream, setVideoStream] = useState(null);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const analyzeIntervalRef = useRef(null);

//   const [confidenceData, setConfidenceData] = useState({
//     emotion: 'neutral',
//     confidence: 0,
//     eye_contact: 0,
//     posture_score: 50
//   });

//   const captureFrame = async () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     try {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext('2d');
//       canvas.width = videoRef.current.videoWidth;
//       canvas.height = videoRef.current.videoHeight;
//       ctx.drawImage(videoRef.current, 0, 0);
      
//       const base64Frame = canvas.toDataURL('image/jpeg');
      
//       const response = await fetch('/api/emotion', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ image: base64Frame }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
      
//       if (data.error) {
//         console.warn('API warning:', data.error);
//         return; // Skip updating if no face detected
//       }
      
//       if (data.emotions) {
//         // Calculate confidence based on positive emotions
//         const confidence = (
//           data.emotions.happiness +
//           data.emotions.neutral +
//           data.emotions.surprise
//         ) / 3;

//         // Determine dominant emotion
//         const emotions = Object.entries(data.emotions);
//         const dominantEmotion = emotions.reduce((prev, curr) => 
//           curr[1] > prev[1] ? curr : prev
//         )[0];

//         // Simple eye contact detection (assuming looking directly at camera)
//         const hasEyeContact = data.emotions.neutral > 30 || data.emotions.happiness > 30;

//         // Calculate posture score (simplified)
//         const postureScore = Math.min(
//           100,
//           50 + (data.emotions.neutral + data.emotions.happiness) / 3
//         );

//         const newData = {
//           emotion: dominantEmotion,
//           confidence: confidence,
//           eye_contact: hasEyeContact ? 1 : 0,
//           posture_score: postureScore
//         };

//         setConfidenceData(newData);
//         onData(newData);
//       }
//     } catch (error) {
//       console.error('Error analyzing frame:', error);
//       // Don't show toast for every failed frame to avoid spam
//       if (analyzeIntervalRef.current) {
//         clearInterval(analyzeIntervalRef.current);
//         setIsRecording(false);
//         toast.error('Analysis failed. Please try again.');
//       }
//     }
//   };

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { width: 640, height: 480 },
//         audio: false
//       });

//       videoRef.current.srcObject = stream;
//       videoRef.current.onloadedmetadata = () => {
//         videoRef.current.play();
//         onVideoReady && onVideoReady();
//       };

//       setVideoStream(stream);
//       setIsRecording(true);

//       // Start analysis loop
//       analyzeIntervalRef.current = setInterval(captureFrame, 2000); // Every 2 seconds

//       toast.success('Recording started', { 
//         icon: '🎥',
//         position: 'top-right'
//       });

//     } catch (error) {
//       console.error("Recording error:", error);
//       toast.error('Camera access denied. Please check permissions.', {
//         icon: '🚫',
//         position: 'top-right'
//       });
//     }
//   };

//   const stopRecording = () => {
//     if (videoStream) {
//       videoStream.getTracks().forEach((track) => track.stop());
//     }
    
//     if (analyzeIntervalRef.current) {
//       clearInterval(analyzeIntervalRef.current);
//     }

//     toast.success('Recording stopped', {
//       icon: '⏹️',
//       position: 'top-right'
//     });

//     setIsRecording(false);
//     setVideoStream(null);
//   };

//   useEffect(() => {
//     return () => {
//       if (videoStream) {
//         videoStream.getTracks().forEach((track) => track.stop());
//       }
//       if (analyzeIntervalRef.current) {
//         clearInterval(analyzeIntervalRef.current);
//       }
//     };
//   }, []);

//   return (
//     <Card className="w-full border-2 border-gray-200 shadow-lg rounded-xl overflow-hidden">
//       <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200 p-4">
//         <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
//           <Camera className="mr-2 text-blue-600" /> 
//           Confidence Analysis
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="p-4 space-y-4">
//         <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
//           <video
//             ref={videoRef}
//             autoPlay
//             muted
//             playsInline
//             className="w-full h-full object-cover"
//           />
//           <canvas ref={canvasRef} style={{ display: 'none' }} />
//         </div>

//         <Button
//           onClick={isRecording ? stopRecording : startRecording}
//           className={`w-full transition-all duration-300 ease-in-out ${
//             isRecording 
//               ? 'bg-red-500 hover:bg-red-600' 
//               : 'bg-green-500 hover:bg-green-600'
//           } text-white py-3 rounded-lg flex items-center justify-center`}
//         >
//           {isRecording ? (
//             <>
//               <StopCircle className="mr-2" /> Stop Recording
//             </>
//           ) : (
//             "Start Confidence Analysis"
//           )}
//         </Button>

//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-gray-50 p-3 rounded-lg">
//               <p className="text-sm font-medium text-gray-600">Emotion</p>
//               <p className="text-lg font-bold text-blue-600">{confidenceData.emotion}</p>
//             </div>
//             <div className="bg-gray-50 p-3 rounded-lg">
//               <p className="text-sm font-medium text-gray-600">Confidence</p>
//               <p className="text-lg font-bold text-green-600">
//                 {confidenceData.confidence.toFixed(2)}%
//               </p>
//             </div>
//           </div>
          
//           <div className="space-y-2">
//             <div className="flex justify-between items-center">
//               <span className="text-sm font-medium text-gray-700">Posture Score</span>
//               <span className="text-sm text-gray-500">
//                 {confidenceData.posture_score.toFixed(2)}
//               </span>
//             </div>
//             <Progress 
//               value={confidenceData.posture_score} 
//               className="w-full h-2" 
//               indicatorClassName="bg-blue-500"
//             />
            
//             <div className="flex justify-between items-center mt-2">
//               <span className="text-sm font-medium text-gray-700">Eye Contact</span>
//               <span className={`text-sm font-bold ${
//                 confidenceData.eye_contact === 1 
//                   ? 'text-green-600' 
//                   : 'text-red-600'
//               }`}>
//                 {confidenceData.eye_contact === 1 ? "Maintained" : "Not Maintained"}
//               </span>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default ConfidenceRecorder;

//10th feb
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StopCircle, Camera, Cloud, Cpu } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import * as faceapi from 'face-api.js';

// Utility function to prevent multiple backend registrations
const safeLoadModels = async () => {
  try {
    // Unregister existing backends to prevent registration errors
    if (faceapi.tf) {
      try {
        faceapi.tf.dispose();
      } catch {}
    }

    // Reset the library to prevent backend conflicts
    Object.keys(faceapi.nets).forEach(net => {
      if (faceapi.nets[net].isLoaded()) {
        faceapi.nets[net].unload();
      }
    });

    // Load models with error handling
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ]);

    return true;
  } catch (error) {
    console.error('Model loading error:', error);
    return false;
  }
};

const ConfidenceRecorder = ({ onData }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [isLocalModel, setIsLocalModel] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const analyzeIntervalRef = useRef(null);

  const [confidenceData, setConfidenceData] = useState({
    emotion: 'neutral',
    confidence: 0,
    eye_contact: 0,
    posture_score: 50
  });

  // Initialize Local Models with Comprehensive Error Handling
  const initializeLocalModels = async () => {
    // Prevent multiple simultaneous loading attempts
    if (isLoadingModels || modelsLoaded) return;

    setIsLoadingModels(true);
    setModelsLoaded(false);

    try {
      // Attempt to load models
      const loadSuccess = await safeLoadModels();

      if (loadSuccess) {
        setModelsLoaded(true);
        toast.success('Local analysis models loaded successfully');
      } else {
        throw new Error('Model loading failed');
      }
    } catch (error) {
      console.error('Comprehensive model loading error:', error);
      toast.error('Failed to load local analysis models');
      setIsLocalModel(false);
    } finally {
      setIsLoadingModels(false);
    }
  };

  // Cloud Analysis Method (Existing from previous implementation)
  const analyzeAPICall = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);
      
      const base64Frame = canvas.toDataURL('image/jpeg', 0.8);

      const response = await fetch('/api/emotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Frame }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      
      if (data.error) {
        console.warn('API warning:', data.error);
        return;
      }
      
      if (data.emotions) {
        const confidence = (
          data.emotions.happiness +
          data.emotions.neutral +
          data.emotions.surprise
        ) / 3;

        const newData = {
          emotion: Object.entries(data.emotions)
            .reduce((a, b) => a[1] > b[1] ? a : b)[0],
          confidence: confidence,
          eye_contact: data.emotions.neutral > 30 || data.emotions.happiness > 30 ? 1 : 0,
          posture_score: Math.min(100, 50 + (data.emotions.neutral + data.emotions.happiness) / 3)
        };

        setConfidenceData(newData);
        onData(newData);
      }
    } catch (error) {
      console.error('Error in API analysis:', error);
      toast.error('Cloud analysis failed. Consider switching to local model.');
    }
  };

  // Local Frame Analysis with Robust Error Handling
  const analyzeLocalFrame = async () => {
    if (!videoRef.current || !modelsLoaded) return;

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Detect faces with more robust options
      const detections = await faceapi
        .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions({ 
          inputSize: 512,
          scoreThreshold: 0.5 
        }))
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections.length > 0) {
        const detection = detections[0];
        const expressions = detection.expressions;
        
        // Comprehensive Emotion Detection
        const emotionScores = {
          happy: expressions.happy || 0,
          neutral: expressions.neutral || 0,
          surprised: expressions.surprised || 0,
          angry: expressions.angry || 0,
          disgusted: expressions.disgusted || 0,
          fearful: expressions.fearful || 0,
          sad: expressions.sad || 0
        };

        const dominantEmotion = Object.entries(emotionScores)
          .reduce((a, b) => a[1] > b[1] ? a : b)[0];

        // Enhanced Confidence Calculation
        const confidence = Math.min(100, 
          Object.values(emotionScores)
            .reduce((a, b) => a + b, 0) * 50
        );

        // Robust Eye Contact Calculation
        const leftEye = detection.landmarks.getLeftEye();
        const rightEye = detection.landmarks.getRightEye();
        const eyeDistanceRatio = Math.abs(
          (leftEye[0].x - rightEye[4].x) / canvas.width
        );
        const hasEyeContact = eyeDistanceRatio < 0.1;

        // Improved Posture Estimation
        const jawline = detection.landmarks.getJawOutline();
        const headTiltAngle = Math.atan2(
          jawline[8].y - jawline[0].y, 
          jawline[8].x - jawline[0].x
        ) * (180 / Math.PI);

        const postureScore = Math.max(0, 100 - Math.abs(headTiltAngle * 2));

        const newData = {
          emotion: dominantEmotion,
          confidence: Math.min(100, confidence),
          eye_contact: hasEyeContact ? 1 : 0,
          posture_score: Math.min(100, postureScore)
        };

        setConfidenceData(newData);
        onData(newData);
      }
    } catch (error) {
      console.error('Local analysis error:', error);
      toast.error('Local analysis failed');
    }
  };

  // Toggle Analysis Mode with Comprehensive Error Handling
  const toggleAnalysisMode = async () => {
    // Stop any ongoing recording
    if (isRecording) {
      stopRecording();
    }

    // Switch model type
    const newLocalModelState = !isLocalModel;
    setIsLocalModel(newLocalModelState);

    // If switching to local model, attempt to load models
    if (newLocalModelState && !modelsLoaded) {
      await initializeLocalModels();
    }
  };

  // Start Recording Method
  const startRecording = async () => {
    if (isLocalModel && (!modelsLoaded || isLoadingModels)) {
      toast.error('Please wait for models to load');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 640,
          height: 480,
          facingMode: 'user'
        },
        audio: false
      });

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      setVideoStream(stream);
      setIsRecording(true);

      analyzeIntervalRef.current = setInterval(
        () => isLocalModel ? analyzeLocalFrame() : analyzeAPICall(),
        1000
      );

      toast.success(`Recording started using ${isLocalModel ? 'local' : 'cloud'} analysis`);
    } catch (error) {
      console.error("Recording error:", error);
      toast.error('Camera access denied. Please check permissions.');
    }
  };

  // Stop Recording Method
  const stopRecording = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
    }
    
    if (analyzeIntervalRef.current) {
      clearInterval(analyzeIntervalRef.current);
    }

    setIsRecording(false);
    setVideoStream(null);
    toast.success('Recording stopped');
  };

  // Cleanup on Unmount
  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
      if (analyzeIntervalRef.current) {
        clearInterval(analyzeIntervalRef.current);
      }
    };
  }, []);

  // Model Preloading Effect
  useEffect(() => {
    // Attempt to preload models when local mode is selected
    if (isLocalModel && !modelsLoaded) {
      initializeLocalModels();
    }
  }, [isLocalModel]);

  // Render Method
  return (
    <Card className="w-full border-2 border-gray-200 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200 p-4">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center justify-between">
          <div className="flex items-center">
            <Camera className="mr-2 text-blue-600" /> 
            Confidence Analysis
          </div>
          <Button
            onClick={toggleAnalysisMode}
            variant="outline"
            className="ml-2"
            disabled={isRecording || isLoadingModels}
          >
            {isLocalModel ? (
              <Cloud className="w-4 h-4 mr-2" />
            ) : (
              <Cpu className="w-4 h-4 mr-2" />
            )}
            {isLoadingModels ? 'Loading Models...' : 
             isLocalModel ? 'Switch to Cloud' : 'Switch to Local'}
          </Button>
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
          disabled={isLocalModel && (!modelsLoaded || isLoadingModels)}
        >
          {isRecording ? (
            <>
              <StopCircle className="mr-2" /> Stop Recording
            </>
          ) : (
            isLoadingModels ? "Loading Models..." : "Start Confidence Analysis"
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
      <Toaster position="top-right" />
    </Card>
  );
};

export default ConfidenceRecorder;

/*
SETUP INSTRUCTIONS:

1. Install Dependencies:
   npm install face-api.js react-hot-toast

2. Download Models (Terminal Command):
   mkdir -p public/models && 
   wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector.json -O public/models/tiny_face_detector.json && 
   wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model.json -O public/models/face_landmark_68_model.json && 
   wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model*/

   //10th feb 2nd try
//    import React, { useEffect, useRef, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { StopCircle, Camera, Cloud, Cpu } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";
// import * as faceapi from 'face-api.js';



// // Utility function to prevent multiple backend registrations
// const safeLoadModels = async () => {
//   try {
//     // Unregister existing backends to prevent registration errors
//     if (faceapi.tf) {
//       try {
//         faceapi.tf.dispose();
//       } catch {}
//     }

//     // Reset the library to prevent backend conflicts.
//     // Check if the isLoaded method exists before calling it.
//     Object.keys(faceapi.nets).forEach(net => {
//       if (
//         faceapi.nets[net] &&
//         typeof faceapi.nets[net].isLoaded === "function" &&
//         faceapi.nets[net].isLoaded()
//       ) {
//         faceapi.nets[net].unload();
//       }
//     });

//     // Load models with error handling
//     await Promise.all([
//       faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
//       faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//       faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
//       faceapi.nets.faceExpressionNet.loadFromUri('/models')
//     ]);

//     return true;
//   } catch (error) {
//     console.error('Model loading error:', error);
//     return false;
//   }
// };

// const ConfidenceRecorder = ({ onData }) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [videoStream, setVideoStream] = useState(null);
//   const [isLocalModel, setIsLocalModel] = useState(false);
//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [isLoadingModels, setIsLoadingModels] = useState(false);

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const analyzeIntervalRef = useRef(null);

//   const [confidenceData, setConfidenceData] = useState({
//     emotion: 'neutral',
//     confidence: 0,
//     eye_contact: 0,
//     posture_score: 50
//   });

//   // Initialize Local Models with Comprehensive Error Handling
//   const initializeLocalModels = async () => {
//     // Prevent multiple simultaneous loading attempts
//     if (isLoadingModels || modelsLoaded) return;

//     setIsLoadingModels(true);
//     setModelsLoaded(false);

//     try {
//       // Attempt to load models
//       const loadSuccess = await safeLoadModels();

//       if (loadSuccess) {
//         setModelsLoaded(true);
//         toast.success('Local analysis models loaded successfully');
//       } else {
//         throw new Error('Model loading failed');
//       }
//     } catch (error) {
//       console.error('Comprehensive model loading error:', error);
//       toast.error('Failed to load local analysis models');
//       setIsLocalModel(false);
//     } finally {
//       setIsLoadingModels(false);
//     }
//   };

//   // Cloud Analysis Method (Do not edit or touch)
//   const analyzeAPICall = async () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     try {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext('2d');
//       canvas.width = videoRef.current.videoWidth;
//       canvas.height = videoRef.current.videoHeight;
//       ctx.drawImage(videoRef.current, 0, 0);
      
//       const base64Frame = canvas.toDataURL('image/jpeg', 0.8);

//       const response = await fetch('/api/emotion', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ image: base64Frame }),
//       });

//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const data = await response.json();
      
//       if (data.error) {
//         console.warn('API warning:', data.error);
//         return;
//       }
      
//       if (data.emotions) {
//         const confidence = (
//           data.emotions.happiness +
//           data.emotions.neutral +
//           data.emotions.surprise
//         ) / 3;

//         const newData = {
//           emotion: Object.entries(data.emotions)
//             .reduce((a, b) => a[1] > b[1] ? a : b)[0],
//           confidence: confidence,
//           eye_contact: data.emotions.neutral > 30 || data.emotions.happiness > 30 ? 1 : 0,
//           posture_score: Math.min(100, 50 + (data.emotions.neutral + data.emotions.happiness) / 3)
//         };

//         setConfidenceData(newData);
//         onData(newData);
//       }
//     } catch (error) {
//       console.error('Error in API analysis:', error);
//       toast.error('Cloud analysis failed. Consider switching to local model.');
//     }
//   };

//   // Local Frame Analysis with Robust Error Handling
//   const analyzeLocalFrame = async () => {
//     if (!videoRef.current || !modelsLoaded) return;

//     try {
//       const video = videoRef.current;
//       const canvas = canvasRef.current;
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       const ctx = canvas.getContext('2d');
//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//       // Detect faces with more robust options
//       const detections = await faceapi
//         .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions({ 
//           inputSize: 512,
//           scoreThreshold: 0.5 
//         }))
//         .withFaceLandmarks()
//         .withFaceExpressions();

//       if (detections.length > 0) {
//         const detection = detections[0];
//         const expressions = detection.expressions;
        
//         // Comprehensive Emotion Detection
//         const emotionScores = {
//           happy: expressions.happy || 0,
//           neutral: expressions.neutral || 0,
//           surprised: expressions.surprised || 0,
//           angry: expressions.angry || 0,
//           disgusted: expressions.disgusted || 0,
//           fearful: expressions.fearful || 0,
//           sad: expressions.sad || 0
//         };

//         const dominantEmotion = Object.entries(emotionScores)
//           .reduce((a, b) => a[1] > b[1] ? a : b)[0];

//         // Enhanced Confidence Calculation
//         const confidence = Math.min(100, 
//           Object.values(emotionScores)
//             .reduce((a, b) => a + b, 0) * 50
//         );

//         // Robust Eye Contact Calculation
//         const leftEye = detection.landmarks.getLeftEye();
//         const rightEye = detection.landmarks.getRightEye();
//         const eyeDistanceRatio = Math.abs(
//           (leftEye[0].x - rightEye[4].x) / canvas.width
//         );
//         const hasEyeContact = eyeDistanceRatio < 0.1;

//         // Improved Posture Estimation
//         const jawline = detection.landmarks.getJawOutline();
//         const headTiltAngle = Math.atan2(
//           jawline[8].y - jawline[0].y, 
//           jawline[8].x - jawline[0].x
//         ) * (180 / Math.PI);

//         const postureScore = Math.max(0, 100 - Math.abs(headTiltAngle * 2));

//         const newData = {
//           emotion: dominantEmotion,
//           confidence: Math.min(100, confidence),
//           eye_contact: hasEyeContact ? 1 : 0,
//           posture_score: Math.min(100, postureScore)
//         };

//         setConfidenceData(newData);
//         onData(newData);
//       }
//     } catch (error) {
//       console.error('Local analysis error:', error);
//       toast.error('Local analysis failed');
//     }
//   };

//   // Toggle Analysis Mode with Comprehensive Error Handling
//   const toggleAnalysisMode = async () => {
//     // Stop any ongoing recording
//     if (isRecording) {
//       stopRecording();
//     }

//     // Switch model type
//     const newLocalModelState = !isLocalModel;
//     setIsLocalModel(newLocalModelState);

//     // If switching to local model, attempt to load models
//     if (newLocalModelState && !modelsLoaded) {
//       await initializeLocalModels();
//     }
//   };

//   // Start Recording Method
//   const startRecording = async () => {
//     if (isLocalModel && (!modelsLoaded || isLoadingModels)) {
//       toast.error('Please wait for models to load');
//       return;
//     }

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { 
//           width: 640,
//           height: 480,
//           facingMode: 'user'
//         },
//         audio: false
//       });

//       videoRef.current.srcObject = stream;
//       await videoRef.current.play();

//       setVideoStream(stream);
//       setIsRecording(true);

//       analyzeIntervalRef.current = setInterval(
//         () => isLocalModel ? analyzeLocalFrame() : analyzeAPICall(),
//         1000
//       );

//       toast.success(`Recording started using ${isLocalModel ? 'local' : 'cloud'} analysis`);
//     } catch (error) {
//       console.error("Recording error:", error);
//       toast.error('Camera access denied. Please check permissions.');
//     }
//   };

//   // Stop Recording Method
//   const stopRecording = () => {
//     if (videoStream) {
//       videoStream.getTracks().forEach(track => track.stop());
//     }
    
//     if (analyzeIntervalRef.current) {
//       clearInterval(analyzeIntervalRef.current);
//     }

//     setIsRecording(false);
//     setVideoStream(null);
//     toast.success('Recording stopped');
//   };

//   // Cleanup on Unmount
//   useEffect(() => {
//     return () => {
//       if (videoStream) {
//         videoStream.getTracks().forEach(track => track.stop());
//       }
//       if (analyzeIntervalRef.current) {
//         clearInterval(analyzeIntervalRef.current);
//       }
//     };
//   }, []);

//   // Model Preloading Effect
//   useEffect(() => {
//     // Attempt to preload models when local mode is selected
//     if (isLocalModel && !modelsLoaded) {
//       initializeLocalModels();
//     }
//   }, [isLocalModel]);

//   // Render Method
//   return (
//     <Card className="w-full border-2 border-gray-200 shadow-lg rounded-xl overflow-hidden">
//       <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200 p-4">
//         <CardTitle className="text-xl font-bold text-gray-800 flex items-center justify-between">
//           <div className="flex items-center">
//             <Camera className="mr-2 text-blue-600" /> 
//             Confidence Analysis
//           </div>
//           <Button
//             onClick={toggleAnalysisMode}
//             variant="outline"
//             className="ml-2"
//             disabled={isRecording || isLoadingModels}
//           >
//             {isLocalModel ? (
//               <Cloud className="w-4 h-4 mr-2" />
//             ) : (
//               <Cpu className="w-4 h-4 mr-2" />
//             )}
//             {isLoadingModels ? 'Loading Models...' : 
//              isLocalModel ? 'Switch to Cloud' : 'Switch to Local'}
//           </Button>
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="p-4 space-y-4">
//         <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
//           <video
//             ref={videoRef}
//             autoPlay
//             muted
//             playsInline
//             className="w-full h-full object-cover"
//           />
//           <canvas ref={canvasRef} style={{ display: 'none' }} />
//         </div>

//         <Button
//           onClick={isRecording ? stopRecording : startRecording}
//           className={`w-full transition-all duration-300 ease-in-out ${
//             isRecording 
//               ? 'bg-red-500 hover:bg-red-600' 
//               : 'bg-green-500 hover:bg-green-600'
//           } text-white py-3 rounded-lg flex items-center justify-center`}
//           disabled={isLocalModel && (!modelsLoaded || isLoadingModels)}
//         >
//           {isRecording ? (
//             <>
//               <StopCircle className="mr-2" /> Stop Recording
//             </>
//           ) : (
//             isLoadingModels ? "Loading Models..." : "Start Confidence Analysis"
//           )}
//         </Button>

//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-gray-50 p-3 rounded-lg">
//               <p className="text-sm font-medium text-gray-600">Emotion</p>
//               <p className="text-lg font-bold text-blue-600">{confidenceData.emotion}</p>
//             </div>
//             <div className="bg-gray-50 p-3 rounded-lg">
//               <p className="text-sm font-medium text-gray-600">Confidence</p>
//               <p className="text-lg font-bold text-green-600">
//                 {confidenceData.confidence.toFixed(2)}%
//               </p>
//             </div>
//           </div>
          
//           <div className="space-y-2">
//             <div className="flex justify-between items-center">
//               <span className="text-sm font-medium text-gray-700">Posture Score</span>
//               <span className="text-sm text-gray-500">
//                 {confidenceData.posture_score.toFixed(2)}
//               </span>
//             </div>
//             <Progress 
//               value={confidenceData.posture_score} 
//               className="w-full h-2" 
//               indicatorClassName="bg-blue-500"
//             />
            
//             <div className="flex justify-between items-center mt-2">
//               <span className="text-sm font-medium text-gray-700">Eye Contact</span>
//               <span className={`text-sm font-bold ${
//                 confidenceData.eye_contact === 1 
//                   ? 'text-green-600' 
//                   : 'text-red-600'
//               }`}>
//                 {confidenceData.eye_contact === 1 ? "Maintained" : "Not Maintained"}
//               </span>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//       <Toaster position="top-right" />
//     </Card>
//   );
// };

// export default ConfidenceRecorder;

