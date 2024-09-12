import "regenerator-runtime/runtime";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, Volume2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import toast from "react-hot-toast";
import { Progress } from "@/components/ui/progress";
import axios from "axios";

const QuestionSection = ({ interviewData }) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
      saveUserAnswer();
    }
  }, [activeQuestionIndex, totalQuestions, userAnswers]);

  const saveUserAnswer = async () => {
    if (userAnswers.length === 0) return;
    try {
      const response = await axios.post(
        "http://localhost:3000/api/savingUserAnswer",
        {
          interviewData,
          userAnswers,
        }
      );
      console.log(response.data)
      toast.success("Interview data saved successfully");
    } catch (error) {
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
          setActiveQuestionIndex((prev) => prev + 1);  // This will trigger the useEffect
        }
      }, 3000);
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      toast.error("Sorry, your browser does not support text to speech");
    }
  };

  if (isInterviewComplete) {
    return (
      <div className="p-5 border-4 rounded-lg flex flex-col justify-center items-center w-[450px] h-[420px]">
        <h2 className="text-xl font-semibold mb-4">Interview Complete</h2>
        <p>Thank you for completing the interview. Your answers have been saved.</p>
      </div>
    );
  }

  return (
    <div className="p-5 border-4 rounded-lg flex flex-col justify-between w-[450px] h-[420px]">
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
        <Button className="w-[170px]" onClick={recordUserAnswer} disabled={isSaving}>
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
  );
};

export default QuestionSection;