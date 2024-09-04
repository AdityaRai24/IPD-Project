"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState,useEffect } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Result } from "postcss";
import { Mic } from "lucide-react";

const RecordAnswer = () => {
    const [userAnswer,setUserAnswer] = useState('');
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

  useEffect(()=>{
    results.map((result)=>{
        setUserAnswer(prevAns=>prevAns+result?.transcript)
    })
  },[results])

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
        <Button className="my-10 w-[170px]" 
        onClick={isRecording?stopSpeechToText:startSpeechToText}>
          {isRecording ? (
            <h2 className="flex gap-2">
              <Mic/> Stop Recording
            </h2>
          ) : (
            "Record Answer"
          )}
        </Button>
        
      </div>
      <Button onClick={()=>console.log(userAnswer)}>Show User Answer</Button>
    </div>
  );
};

export default RecordAnswer;
