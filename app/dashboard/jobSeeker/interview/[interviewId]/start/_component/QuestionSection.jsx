"use client";
import VideoAnalysis from "@/components/VideoAnalysis";
import "regenerator-runtime/runtime";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, Volume2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import toast from "react-hot-toast";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import ConfidenceRecorder from "@/components/ConfidenceRecorder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


const QuestionSection = ({ interviewData }) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confidenceResults, setConfidenceResults] = useState([]);
  const [averages, setAverages] = useState({
    confidence: 0,
    posture: 0,
    eyeContact: "No",
  });

  const totalQuestions = interviewData?.jsonMockResp?.length || 0;

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (
      activeQuestionIndex >= totalQuestions &&
      userAnswers.length === totalQuestions
    ) {
      setIsInterviewComplete(true);
      calculateFinalAverages();
      saveUserAnswer();
    }
  }, [activeQuestionIndex, totalQuestions, userAnswers]);

  const calculateFinalAverages = () => {
    if (confidenceResults.length === 0) return;

    const totals = confidenceResults.reduce(
      (acc, result) => ({
        confidence: acc.confidence + result.confidence,
        posture: acc.posture + result.posture_score,
        eyeContact: acc.eyeContact + (result.eye_contact ? 1 : 0),
      }),
      { confidence: 0, posture: 0, eyeContact: 0 }
    );

    setAverages({
      confidence: (totals.confidence / confidenceResults.length).toFixed(2),
      posture: (totals.posture / confidenceResults.length).toFixed(2),
      eyeContact:
        totals.eyeContact / confidenceResults.length > 0.5 ? "Yes" : "No",
    });
  };

  const saveUserAnswer = async () => {
    if (userAnswers.length === 0) return;
    try {
      const response = await axios.post("/api/savingUserAnswer", {
        interviewData,
        userAnswers,
        confidenceData: {
          averageConfidence: averages.confidence,
          averagePosture: averages.posture,
          averageEyeContact: averages.eyeContact,
          detailedResults: confidenceResults,
        },
      });
      console.log("Saved interview data:", response.data);
      toast.success("Interview data saved successfully");
    } catch (error) {
      console.error("Error saving interview data:", error);
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
      speech.rate = 1.0; // Speed of speech
      speech.pitch = 1.0; // Pitch of speech
      speech.volume = 1.0; // Volume of speech

      // Get available voices and set a natural sounding one if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (voice) =>
          voice.name.includes("Natural") || voice.name.includes("Premium")
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
    setConfidenceResults((prev) => [...prev, newData]);
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
        <p>
          Thank you for completing the interview. Your answers have been saved.
        </p>
        <div className="space-y-2">
          <p>
            Average Confidence: <strong>{averages.confidence}%</strong>
          </p>
          <p>
            Average Posture: <strong>{averages.posture}</strong>
          </p>
          <p>
            Average Eye Contact: <strong>{averages.eyeContact}</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full gap-6 h-[600px]">
      {/* Left Section (Question and Answer) */}
      <Card className="w-[45%] flex flex-col">
        <CardContent className="p-6 flex flex-col h-full gap-4">
          <div className="bg-muted rounded-lg p-4">
            <h2 className="text-foreground font-medium mb-3">
              Question {activeQuestionIndex + 1} / {totalQuestions}
            </h2>
            <Progress value={((activeQuestionIndex + 1) / totalQuestions) * 100} className="h-2" />
          </div>

          <div className="flex-grow flex flex-col gap-4">
            <div className="px-5 py-4 font-medium rounded-lg bg-muted text-foreground text-lg">
              {interviewData?.jsonMockResp[activeQuestionIndex]?.question}
            </div>

            <div className="flex-grow w-full rounded-lg border p-5 bg-muted text-foreground">
              {listening ? (
                <div className="animate-fade-in">{transcript}</div>
              ) : isSaving ? (
                <div className="text-muted-foreground animate-pulse">Your answer is being saved...</div>
              ) : (
                <div className={`${userAnswers[activeQuestionIndex] ? "" : "text-muted-foreground"}`}>
                  {userAnswers[activeQuestionIndex] || "Record Your Answer..."}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between w-full">
            <Button
              onClick={() => textToSpeech(interviewData?.jsonMockResp[activeQuestionIndex]?.question)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>Read</span>
            </Button>

            <Button
              className={`w-[140px] ${listening ? "bg-destructive hover:bg-destructive/90" : ""}`}
              onClick={recordUserAnswer}
              disabled={isSaving}
            >
              {listening ? (
                <span className="flex items-center gap-2">
                  <StopCircle className="w-4 h-4 animate-pulse" />
                  Stop
                </span>
              ) : isSaving ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Record
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Right Section (Video Analysis) */}
      <Card className="flex-1">
        <CardContent className="p-6">
          <ConfidenceRecorder onData={handleConfidenceData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionSection;
