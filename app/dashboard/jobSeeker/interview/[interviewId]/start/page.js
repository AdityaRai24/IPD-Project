"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import QuestionSection from "./_component/QuestionSection";
import RecordAnswer from "./_component/RecordAnswer";
import { Loader2 } from "lucide-react";

const StartInterview = ({ params }) => {
  const [interviewData, setInterviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const sessionId = params.interviewId;

  const getInterviewDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/getInterview?sessionId=${sessionId}`
      );
      setInterviewData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching interview data:", error);
      setError("Failed to load interview data. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getInterviewDetails();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[85vh]">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p>Loading interview data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[85vh]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!interviewData) {
    return (
      <div className="flex items-center justify-center h-[85vh]">
        <p>No interview data available.</p>
      </div>
    );
  }


  return (
    <div className="flex items-center justify-center gap-8 h-[85vh]">
      <QuestionSection interviewData={interviewData} />
      {/* <RecordAnswer sessionId={sessionId} interviewData={interviewData} /> */}
    </div>
  );
};

export default StartInterview;