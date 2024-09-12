"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import {
  ArrowRight,
  Lightbulb,
  Video,
  VideoOff,
  WebcamIcon,
} from "lucide-react";
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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInterviewDetails();
  }, []);

  return (
    <div className="my-10 flex bg-background justify-center  flex-col items-center">
      <div>
        {webCamEnable ? (
          <div className="relative">
            <Webcam
              onUserMedia={() => setWebCamEnable(true)}
              onUserMediaError={() => setWebCamEnable(false)}
              mirrored={true}
              style={{
                height: 500,
                width: 500,
              }}
            />
            <Button
                className="absolute right-[45%] bottom-5"
                onClick={() => setWebCamEnable(false)}
                variant="outline"
              >
                <Video />
              </Button>
          </div>
        ) : (
          <>
            {" "}
            <div className="relative">
              <WebcamIcon className="h-[400px] w-[400px] my-7 p-20 bg-secondary rounded-lg border" />
              <Button
                className="absolute right-[45%] bottom-5"
                onClick={() => setWebCamEnable(true)}
                variant="outline"
              >
                <VideoOff />
              </Button>
            </div>
          </>
        )}
      </div>
      <div className="flex justify-end items-end mt-3">
        <Link
          href={
            "/dashboard/jobSeeker/interview/" + params.interviewId + "/start"
          }
        >
          <Button>
            Start Interview <ArrowRight className="ml-2 w-5 h-5" />{" "}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Interview;
