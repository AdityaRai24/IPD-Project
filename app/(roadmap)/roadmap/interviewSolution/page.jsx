"use client"
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle, AlertCircle, Clock, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const InterviewSolution = () => {
  const params = useParams();
  const router = useRouter();
  const [interviewData, setInterviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getInterviewDetails = async () => {
    try {
      setIsLoading(true);
      
      // If an interviewId is provided in the URL, fetch that specific interview
      if (params?.interviewId) {
        console.log("Fetching specific interview data for ID:", params.interviewId);
        const response = await axios.get(
          `/api/user-answer/${params.interviewId}`
        );
        setInterviewData([response.data]); // Wrap in array to maintain component structure
      } else {
        // Otherwise fetch all interviews (for the main dashboard)
        console.log("Fetching all interview data");
        const response = await axios.get(
          `/api/getUserAnswer`
        );
        setInterviewData(response.data);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching interview data:", error);
      setError("Failed to load interview data. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getInterviewDetails();
  }, [params?.interviewId]);

  const getRatingColor = (rating) => {
    if (rating >= 8) return "bg-green-100 text-green-800";
    if (rating >= 5) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getDateFormatted = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[85vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Loading interview data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[85vh]">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-lg text-red-500">{error}</p>
        <Button onClick={handleBack} className="mt-4 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  if (!interviewData || interviewData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[85vh]">
        <Clock className="h-12 w-12 text-gray-500 mb-4" />
        <p className="text-lg">No interview data available.</p>
        <Button onClick={handleBack} className="mt-4 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 mt-11">
      <div className="flex justify-between items-center mb-8">
        <Button onClick={handleBack} variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold text-center">
          {params?.interviewId ? "Interview Analysis" : "Interview Analysis Dashboard"}
        </h1>
        <div className="w-24"></div> {/* Empty div for flex alignment */}
      </div>
      
      <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
        {interviewData.map((interview, index) => (
          <Card key={interview._id || index} className="shadow-lg border-t-4 border-t-primary">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">
                    {params?.interviewId ? "Interview Details" : `Interview #${index + 1}`}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    ID: {interview.interviewId}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> 
                  {getDateFormatted(interview.createdAt)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {interview.interviewData.map((item, i) => (
                <div key={i} className="mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg mb-2">
                    <h3 className="font-semibold text-gray-700 mb-2">Question:</h3>
                    <p className="text-gray-800">{item.question}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-700 mb-2">Your Answer:</h3>
                    <p className="text-gray-800">{item.answer}</p>
                  </div>
                </div>
              ))}

              <Separator className="my-6" />

              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Feedback
                </h3>

                {interview.feedbackArray.map((feedback, i) => (
                  <div key={i} className="space-y-4 rounded-lg border p-4">
                    
                    {feedback.modifiedResponse && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Corrected Response:</h4>
                        <p className="text-sm bg-green-50 p-3 rounded border border-green-100">
                          {feedback.modifiedResponse}
                        </p>
                      </div>
                    )}
                    {feedback.questionFeedback && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Feedback on Response:</h4>
                        <p className="text-sm bg-yellow-50 p-3 rounded border border-yellow-100">
                          {feedback.questionFeedback}
                        </p>
                      </div>
                    )}


                    {(typeof feedback.answerRating === 'number' || typeof feedback.answerRating === 'string') && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Rating:</h4>
                        <div className="flex items-center">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(parseInt(feedback.answerRating))}`}>
                            {feedback.answerRating}/10
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InterviewSolution;
