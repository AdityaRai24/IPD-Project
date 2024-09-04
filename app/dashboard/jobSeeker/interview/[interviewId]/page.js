"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { env } from "process";
import Link from "next/link";

const Interview = ({ params }) => {
  const [interviewData, setInterviewData] = useState();
  const [webCamEnable, setWebCamEnable] = useState(false);
  const info =
    "Enable Video Cam and Microphone to Start your AI Generated Mock Interview.It has 5 questions which you can answer anf at the last you will get the report on the basis of your answer, NOTE: we never record your video. You can disable Web cam access whenever you want";

  const getInterviewDetails = async () => {
    try {
      const sessionId = params.interviewId;
      const response = await axios.get(
        `http://localhost:3000/api/getInterview?sessionId=${sessionId}`
      );
      console.log(response.data);
      setInterviewData(response.data);
      // console.log(response.data.jsonMockResp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInterviewDetails();
  }, []);

  return (
    <div className="my-10 flex justify-center  flex-col items-center">
      <h2 className="font-bold text-2xl">Let's Gets Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-5">
        <div className="flex flex-col my-5 gap-5  w-[600px]">
          <div className=" flex flex-col p-5 rounded-lg border gap-5">
            <h2 className="text-lg">
              <strong className="pr-1">Job Role/Job Position:</strong>
              {interviewData?.jobPosition}
            </h2>
            <h2 className="text-lg">
              <strong className="pr-1">Job Description/Tech Stack:</strong>
              {interviewData?.jobDescription}
            </h2>
            <h2 className="text-lg">
              <strong className="pr-1">Years Of Experience:</strong>
              {interviewData?.exp}
            </h2>
          </div>
          <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100 ">
            <h2 className="flex gap-2 items-center text-yellow-500">
              <Lightbulb />
              <strong>Information</strong>
            </h2>
            <h2 className="mt-3 text-yellow-500  ">
              {info}
            </h2>
          </div>
        </div>

        <div>
          {webCamEnable ? (
            <Webcam
              onUserMedia={() => setWebCamEnable(true)}
              onUserMediaError={() => setWebCamEnable(false)}
              mirrored={true}
              style={{
                height: 300,
                width: 300,
              }}
            />
          ) : (
            <>
              {" "}
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
              <Button onClick={() => setWebCamEnable(true)} className="w-full">
                {" "}
                Enable Web Cam and Microphone
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end items-end mt-3">
        <Link href={'/dashboard/jobSeeker/interview/'+params.interviewId+'/start'}>
        <Button>Start Interview</Button>
        </Link>
      
      </div>
    </div>
  );
};

export default Interview;
