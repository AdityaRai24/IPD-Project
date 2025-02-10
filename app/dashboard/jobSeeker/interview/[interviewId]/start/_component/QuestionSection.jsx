// import "regenerator-runtime/runtime";
// import { Button } from "@/components/ui/button";
// import { Mic, StopCircle, Volume2 } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
// import toast from "react-hot-toast";
// import { Progress } from "@/components/ui/progress";
// import axios from "axios";
// import ConfidenceRecorder from "@/components/ConfidenceRecorder"; // Ensure this is properly imported

// const QuestionSection = ({ interviewData }) => {
//   const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
//   const [userAnswers, setUserAnswers] = useState([]);
//   const [isInterviewComplete, setIsInterviewComplete] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);

//   // State to store confidence model data
//   const [confidenceData, setConfidenceData] = useState([]);
//   const [averageConfidence, setAverageConfidence] = useState(0);
//   const [averagePosture, setAveragePosture] = useState(0);
//   const [averageEyeContact, setAverageEyeContact] = useState(0);

//   const totalQuestions = interviewData?.jsonMockResp?.length || 0;

//   const {
//     transcript,
//     listening,
//     resetTranscript,
//     browserSupportsSpeechRecognition,
//   } = useSpeechRecognition();

//   useEffect(() => {
//     if (activeQuestionIndex >= totalQuestions && userAnswers.length === totalQuestions) {
//       setIsInterviewComplete(true);
//       saveUserAnswer();
//     }
//   }, [activeQuestionIndex, totalQuestions, userAnswers]);

//   // Save user answers to backend
//   const saveUserAnswer = async () => {
//     if (userAnswers.length === 0) return;
//     try {
//       const response = await axios.post(
//         "http://localhost:3000/api/savingUserAnswer",
//         {
//           interviewData,
//           userAnswers,
//         }
//       );
//       console.log(response.data);
//       toast.success("Interview data saved successfully");
//     } catch (error) {
//       toast.error("Failed to save interview data");
//     }
//   };

//   // Record user answer
//   const recordUserAnswer = () => {
//     if (isInterviewComplete) {
//       toast.error("Interview is already complete");
//       return;
//     }

//     if (listening) {
//       SpeechRecognition.stopListening();
//       setIsSaving(true);
//       setUserAnswers((prev) => {
//         const newAnswers = [...prev];
//         newAnswers[activeQuestionIndex] = transcript;
//         return newAnswers;
//       });
//       setTimeout(() => {
//         resetTranscript();
//         setIsSaving(false);
//         if (activeQuestionIndex < totalQuestions - 1) {
//           setActiveQuestionIndex((prev) => prev + 1);
//         } else {
//           setActiveQuestionIndex((prev) => prev + 1); // This will trigger the useEffect
//         }
//       }, 3000);
//     } else {
//       SpeechRecognition.startListening({ continuous: true });
//     }
//   };

//   // Text-to-speech functionality
//   const textToSpeech = (text) => {
//     if ("speechSynthesis" in window) {
//       const speech = new SpeechSynthesisUtterance(text);
//       window.speechSynthesis.speak(speech);
//     } else {
//       toast.error("Sorry, your browser does not support text to speech");
//     }
//   };

//   // Callback for ConfidenceRecorder data
//   const handleConfidenceData = (data) => {
//     setConfidenceData((prev) => [...prev, ...data]);
  
//     // Calculate averages from all data points
//     const totalConfidence = data.reduce((acc, item) => acc + item.confidence, 0);
//     const totalPosture = data.reduce((acc, item) => acc + item.posture_score, 0);
//     const totalEyeContact = data.reduce((acc, item) => acc + item.eye_contact, 0);
  
//     setAverageConfidence((totalConfidence / data.length).toFixed(2));
//     setAveragePosture((totalPosture / data.length).toFixed(2));
//     setAverageEyeContact((totalEyeContact / data.length) > 0.5 ? "Yes" : "No");
//   };

//   if (isInterviewComplete) {
//     return (
//       <div className="p-5 border-4 rounded-lg flex flex-col justify-center items-center w-full h-full space-y-4">
//         <h2 className="text-xl font-semibold mb-4">Interview Complete</h2>
//         <p>Thank you for completing the interview. Your answers have been saved.</p>
//         <div className="space-y-2">
//           <p>Average Confidence: <strong>{averageConfidence}%</strong></p>
//           <p>Average Posture: <strong>{averagePosture}</strong></p>
//           <p>Average Eye Contact: <strong>{averageEyeContact}</strong></p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex w-full space-x-4">
//       {/* Left Section (Question and Answer) */}
//       <div className="p-5 border-4 rounded-lg flex flex-col justify-between w-[60%] h-[520px]">
//         <div className="p-3">
//           <h2 className="pb-1 font-normal">
//             Question {activeQuestionIndex + 1} / {totalQuestions}
//           </h2>
//           <Progress value={((activeQuestionIndex + 1) / totalQuestions) * 100} />
//         </div>
//         <div>
//           <h2 className="px-3 pb-3 font-semibold rounded-md text-md md:text-lg">
//             {interviewData?.jsonMockResp[activeQuestionIndex]?.question}
//           </h2>
//           <div className="w-full text-gray-500 h-[130px] rounded-lg border-2 p-3">
//             {listening ? transcript : 
//              isSaving ? "Your answer is being saved..." : 
//              userAnswers[activeQuestionIndex] || "Record Your Answer..."}
//           </div>
//         </div>
//         <div className="flex items-center mt-2 justify-between w-full">
//           <Button
//             onClick={() => textToSpeech(interviewData?.jsonMockResp[activeQuestionIndex]?.question)}
//             variant="outline"
//             className="flex items-center justify-center gap-2 cursor-pointer"
//           >
//             <Volume2 className="cursor-pointer" />
//             Read
//           </Button>
//           <Button className="w-[170px]" onClick={recordUserAnswer} disabled={isSaving}>
//             {listening ? (
//               <h2 className="flex items-center gap-2">
//                 <StopCircle /> Stop Recording
//               </h2>
//             ) : isSaving ? (
//               <h2 className="flex items-center gap-2">Saving...</h2>
//             ) : (
//               <h2 className="flex items-center gap-2">
//                 <Mic /> Record Answer
//               </h2>
//             )}
//           </Button>
//         </div>
//       </div>

//       {/* Right Section (Video and Results) */}
//       <div className="flex-1">
//         {/* Confidence Recorder */}
//         <ConfidenceRecorder onData={handleConfidenceData} />

//         <div className="mt-4 space-y-2">

//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuestionSection;
import "regenerator-runtime/runtime";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, Volume2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import toast from "react-hot-toast";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import ConfidenceRecorder from "@/components/ConfidenceRecorder";

const QuestionSection = ({ interviewData }) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confidenceResults, setConfidenceResults] = useState([]);
  const [averages, setAverages] = useState({
    confidence: 0,
    posture: 0,
    eyeContact: 'No'
  });

  const totalQuestions = interviewData?.jsonMockResp?.length || 0;

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (activeQuestionIndex >= totalQuestions && userAnswers.length === totalQuestions) {
      setIsInterviewComplete(true);
      calculateFinalAverages();
      saveUserAnswer();
    }
  }, [activeQuestionIndex, totalQuestions, userAnswers]);

  const calculateFinalAverages = () => {
    if (confidenceResults.length === 0) return;

    const totals = confidenceResults.reduce((acc, result) => ({
      confidence: acc.confidence + result.confidence,
      posture: acc.posture + result.posture_score,
      eyeContact: acc.eyeContact + (result.eye_contact ? 1 : 0)
    }), { confidence: 0, posture: 0, eyeContact: 0 });

    setAverages({
      confidence: (totals.confidence / confidenceResults.length).toFixed(2),
      posture: (totals.posture / confidenceResults.length).toFixed(2),
      eyeContact: (totals.eyeContact / confidenceResults.length > 0.5) ? 'Yes' : 'No'
    });
  };

  const saveUserAnswer = async () => {
    if (userAnswers.length === 0) return;
    try {
      const response = await axios.post(
        "/api/savingUserAnswer",
        {
          interviewData,
          userAnswers,
          confidenceData: {
            averageConfidence: averages.confidence,
            averagePosture: averages.posture,
            averageEyeContact: averages.eyeContact,
            detailedResults: confidenceResults
          }
        }
      );
      console.log('Saved interview data:', response.data);
      toast.success("Interview data saved successfully");
    } catch (error) {
      console.error('Error saving interview data:', error);
      toast.error("Failed to save interview data");
    }
  };

  const recordUserAnswer = () => {
    if (isInterviewComplete) {
      toast.error("Interview is already complete");
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
      setIsSaving(true);
      setUserAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[activeQuestionIndex] = transcript;
        return newAnswers;
      });
      
      setTimeout(() => {
        resetTranscript();
        setIsSaving(false);
        if (activeQuestionIndex < totalQuestions - 1) {
          setActiveQuestionIndex((prev) => prev + 1);
        } else {
          setActiveQuestionIndex((prev) => prev + 1); // This will trigger the completion useEffect
        }
      }, 3000);
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const speech = new SpeechSynthesisUtterance(text);
      
      // Optional: Configure speech settings
      speech.rate = 1.0;  // Speed of speech
      speech.pitch = 1.0; // Pitch of speech
      speech.volume = 1.0; // Volume of speech
      
      // Get available voices and set a natural sounding one if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Natural') || voice.name.includes('Premium')
      );
      if (preferredVoice) {
        speech.voice = preferredVoice;
      }

      window.speechSynthesis.speak(speech);
    } else {
      toast.error("Sorry, your browser does not support text to speech");
    }
  };

  const handleConfidenceData = (newData) => {
    setConfidenceResults(prev => [...prev, newData]);
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="p-5 border-4 rounded-lg flex flex-col justify-center items-center">
        <h2 className="text-xl font-semibold text-red-600">
          Browser Speech Recognition Not Supported
        </h2>
        <p className="text-gray-600 mt-2">
          Please try using a modern browser like Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  if (isInterviewComplete) {
    return (
      <div className="p-5 border-4 rounded-lg flex flex-col justify-center items-center w-full h-full space-y-4">
        <h2 className="text-xl font-semibold mb-4">Interview Complete</h2>
        <p>Thank you for completing the interview. Your answers have been saved.</p>
        <div className="space-y-2">
          <p>Average Confidence: <strong>{averages.confidence}%</strong></p>
          <p>Average Posture: <strong>{averages.posture}</strong></p>
          <p>Average Eye Contact: <strong>{averages.eyeContact}</strong></p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full space-x-4">
      {/* Left Section (Question and Answer) */}
      <div className="p-5 border-4 rounded-lg flex flex-col justify-between w-[60%] h-[520px]">
        <div className="p-3">
          <h2 className="pb-1 font-normal">
            Question {activeQuestionIndex + 1} / {totalQuestions}
          </h2>
          <Progress value={((activeQuestionIndex + 1) / totalQuestions) * 100} />
        </div>
        <div>
          <h2 className="px-3 pb-3 font-semibold rounded-md text-md md:text-lg">
            {interviewData?.jsonMockResp[activeQuestionIndex]?.question}
          </h2>
          <div className="w-full text-gray-500 h-[130px] rounded-lg border-2 p-3">
            {listening ? transcript : 
             isSaving ? "Your answer is being saved..." : 
             userAnswers[activeQuestionIndex] || "Record Your Answer..."}
          </div>
        </div>
        <div className="flex items-center mt-2 justify-between w-full">
          <Button
            onClick={() => textToSpeech(interviewData?.jsonMockResp[activeQuestionIndex]?.question)}
            variant="outline"
            className="flex items-center justify-center gap-2 cursor-pointer"
          >
            <Volume2 className="cursor-pointer" />
            Read
          </Button>
          <Button 
            className="w-[170px]" 
            onClick={recordUserAnswer} 
            disabled={isSaving}
          >
            {listening ? (
              <h2 className="flex items-center gap-2">
                <StopCircle /> Stop Recording
              </h2>
            ) : isSaving ? (
              <h2 className="flex items-center gap-2">Saving...</h2>
            ) : (
              <h2 className="flex items-center gap-2">
                <Mic /> Record Answer
              </h2>
            )}
          </Button>
        </div>
      </div>

      {/* Right Section (Confidence Analysis) */}
      <div className="flex-1">
        <ConfidenceRecorder onData={handleConfidenceData} />
      </div>
    </div>
  );
};

export default QuestionSection;