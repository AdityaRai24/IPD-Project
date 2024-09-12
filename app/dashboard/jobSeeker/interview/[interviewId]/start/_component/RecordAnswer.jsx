"use client";
import React, {  } from "react";
import Webcam from "react-webcam";

const RecordAnswer = ({
 interviewData,
  sessionId
}) => {


  return (
    <div className="">
      <div className="flex flex-col justify-center items-center bg-black rounded-lg w-[550px] h-[430px] ">
        <img src="/webcam.png" width={200} height={200} className="absolute" />
        <Webcam
          mirrored={true}
          style={{
            height: "430px",
            width: "550px",
            zIndex: 10,
          }}
        />
      </div>
     
    </div>
  );
};

export default RecordAnswer;
