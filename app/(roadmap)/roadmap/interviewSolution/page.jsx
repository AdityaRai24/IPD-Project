// "use client"
// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Loader2 } from "lucide-react";
// import axios from "axios";

// const page = () => {
//   const [interviewData, setInterviewData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//   const getInterviewDetails = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(
//         `http://localhost:3000/api/getUserAnswer`
//       );
//       setInterviewData(response.data);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error fetching interview data:", error);
//       setError("Failed to load interview data. Please try again.");
//       setIsLoading(false);
//     }
//   };

//  useEffect(() => {
//     getInterviewDetails();
//   }, []);
  

  
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-[85vh]">
//         <Loader2 className="mr-2 h-8 w-8 animate-spin" />
//         <p>Loading interview data...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-[85vh]">
//         <p className="text-red-500">{error}</p>
//       </div>
//     );
//   }

//   if (!interviewData) {
//     return (
//       <div className="flex items-center justify-center h-[85vh]">
//         <p>No interview solution available.</p>
//       </div>
//     );
//   }


//   return (
//     <div className="flex text-center items-center  w-full mt-56 bg-primary justify-center">
//       <Card className="">
//         <CardHeader>
//           <CardTitle>Lets Analyse Your Interviews</CardTitle>
//           <CardDescription>Card Description</CardDescription>
//         </CardHeader>
//         <CardContent>
   
  

//     <div className="interview-container">
//       <h2>Interview Results</h2>
//       {interviewData.map((interview, index) => (
//         <div key={interview._id || index} className="interview-card">
//           <h3>Interview ID: {interview.interviewId}</h3>
          
//           <div className="interview-questions">
//             <h4>Questions and Answers:</h4>
//             {interview.interviewData.map((item, i) => (
//               <div key={i} className="qa-pair">
//                 <p><strong>Question:</strong> {item.question}</p>
//                 <p><strong>Answer:</strong> {item.answer}</p>
//               </div>
//             ))}
//           </div>
          
//           <div className="feedback-section">
//             <h4>Feedback:</h4>
//             {interview.feedbackArray.map((feedback, i) => (
//               <div key={i} className="feedback-item">
//                 <p><strong>Modified Response:</strong> {feedback.modifiedResponse}</p>
//                 <p><strong>Question Feedback:</strong> {feedback.questionFeedback}</p>
//                 <p><strong>Answer Rating:</strong> {feedback.answerRating}</p>
//               </div>
//             ))}
//           </div>
          
          
//         </div>
//       ))}
//     </div>

//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default page;
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
import { Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react";
import axios from "axios";

const page = () => {
  const [interviewData, setInterviewData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getInterviewDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/getUserAnswer`
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
  }, []);

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
      </div>
    );
  }

  if (!interviewData || interviewData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[85vh]">
        <Clock className="h-12 w-12 text-gray-500 mb-4" />
        <p className="text-lg">No interview data available yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 mt-11">
      <h1 className="text-3xl font-bold text-center mb-12">Interview Analysis Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
        {interviewData.map((interview, index) => (
          <Card key={interview._id || index} className="shadow-lg border-t-4 border-t-primary">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">Interview #{index + 1}</CardTitle>
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
                    <h3 className="font-semibold text-blue-700 mb-2">Correct Answer:</h3>
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
                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Your Response:</h4>
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


                    {typeof feedback.answerRating === 'number' && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Rating:</h4>
                        <div className="flex items-center">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(feedback.answerRating)}`}>
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

export default page;
