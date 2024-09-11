"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Result } from "postcss";
import { Mic, StopCircle } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import axios from "axios";
import { toast } from "sonner";
import { chatSession } from "@/utils/GenminiAiModel";

const RecordAnswer = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  sessionId
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [loading,setLoading]=useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results.map((result) => {
      setUserAnswer((prevAns) => prevAns + result?.transcript);
    });
  }, [results]);


  const onSubmit = async (e) => {
    
  };

  const saveUserAnswer = async() => {
    if (isRecording) {
    
      stopSpeechToText();
     
      // if (userAnswer?.length < 10) {
      //   toast("Error while saving your answer, Please record again");
      //   return;
      // }

      const feedbackPrompt =
        "Question:" +
         mockInterviewQuestion[activeQuestionIndex]?.question +
        ", userAnswer: " +
        userAnswer +
        "Depends on question and user answer for give inteview question" +
        "PLease give us rating out of 10 for answer and feedback if area of improvment if any" +
        "in just 3 to 5 line to improve it in JSON format with rating field and feedback field";

      const result = await chatSession.sendMessage(feedbackPrompt);

      const mockJsonResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");
      console.log(mockJsonResp)
    
      // onSubmit();
      
  } else {
      startSpeechToText();
      try {
        const response = await axios.post(
          "http://localhost:3000/api/savingUserAnswer",
          {
            question: mockInterviewQuestion[activeQuestionIndex]?.question,
            correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
            userAnswer,
            sessionId,
            mockInterviewQuestion,
            activeQuestionIndex,
            mockJsonResp
          }
        );
        console.log(response.data);
        // if(response){
        //   toast('User Answer recorded successfully');
        // }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="">
      <div className="flex flex-col justify-center items-center bg-black rounded-lg p-5 w-[500px] mt-3 h-[400px] ">
        <img src="/webcam.png" width={200} height={200} className="absolute" />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <div className="flex justify-end w-[500px]">
        <Button className="my-10 w-[170px]" onClick={saveUserAnswer} >
          {isRecording ? (
            <h2 className="flex gap-2">
              <StopCircle /> Stop Recording
            </h2>
          ) : (
            <h2 className="flex gap-2">
              <Mic /> Record Answer
            </h2>
          )}
        </Button>
      </div>
      <Button onClick={() => console.log(userAnswer)}>Show User Answer</Button>
    </div>
  );
};

export default RecordAnswer;
