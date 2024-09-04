"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import QuestionSection from "./_component/QuestionSection";
import RecordAnswer from "./_component/RecordAnswer";

const StartInterview = ({ params }) => {
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(2);
  
  const getInterviewDetails = async () => {
    try {
      const sessionId = params.interviewId;
      const response = await axios.get(
        `http://localhost:3000/api/getInterview?sessionId=${sessionId}`
      );
      // console.log(response.data);
      setInterviewData(response.data);
      const jsonMockResponce = response.data.jsonMockResp;
      setMockInterviewQuestion(jsonMockResponce);
      // console.log(jsonMockResponce);
      // console.log(response.data.jsonMockResp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInterviewDetails();
  }, []);
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* questions */}
        <QuestionSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />

        {/* { Video Audio Recording} */}

        <RecordAnswer/>
      </div>
    </div>
  );
};

export default StartInterview;
