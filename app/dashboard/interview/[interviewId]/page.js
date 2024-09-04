"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import { WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const Interview = ({ params }) => {
  const [interviewData, setInterviewData] = useState();
  const [webCamEnable, setWebCamEnable] = useState(false);
  const getInterviewDetails = async () => {
    try {
      const sessionId = params.interviewId;
      const response = await axios.get(
        `http://localhost:3000/api/getInterview?sessionId=${sessionId}`
      );
      console.log(response.data);
      setInterviewData(result[0]);
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
      <div>
        {webCamEnable ? (
          <Webcam 
          onUserMedia={()=>setWebCamEnable(true)}
          onUserMediaError={()=>setWebCamEnable(false)}
          mirrored={true}
          style={{
            height:300,
            width:300,
          }}/>
        ) : (
          <>         <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
          <Button onClick={()=>setWebCamEnable(true)}> Enable Web CAm and Microphone</Button>
          </>
 
        )}
        
      </div>
    </div>
  );
};

export default Interview;
