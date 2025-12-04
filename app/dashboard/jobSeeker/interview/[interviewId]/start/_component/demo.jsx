"use client";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, Volume2 } from "lucide-react";
import React, { useRef, useState } from "react";

const QuestionSection = ({ interviewData }) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(1);
  const [userAnswers, setUserAnswers] = useState([]);
  const [listening, setListening] = useState(false);
  
  const recognitionRef = useRef()


  // const recordUserAnswer = ()=>{

  //   if(listening){
  //     recognitionRef.current?.stop();
  //     setListening(false); 
  //     return;
  //   }

  //   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  //   recognitionRef.current = new SpeechRecognition();

  //   recognitionRef.current.onstart = function(){
  //     setListening(true);
  //   }

  //   recognitionRef.current.onend = function(){
  //     setListening(false);
  //   }

  //   recognitionRef.current.onresult = async function(event){
  //     const transcript = event.results[0][0].transcript;
  //     console.log(event);
  //   }

  //   recognitionRef.current.start();
  // }

  // const saveUserAnswer = async () => {
  //   if (listening) {
  //     SpeechRecognition.stopListenging();
  //     console.log("Results array:", results);
  //     // if (userAnswer?.length < 10) {
  //     //   toast("Error while saving your answer, Please record again");
  //     //   return;
  //     // }
  

      // const result = await chatSession.sendMessage(feedbackPrompt);

      // const mockJsonResp = result.response
      //   .text()
      //   .replace("```json", "")
      //   .replace("```", "");
  //     // console.log(mockJsonResp);
  //   } else {
  //     SpeechRecognition.startListening();
  //     console.log("Recording started");

  //     // console.log(interviewData,userAnswer)
      // try {
      //   const response = await axios.post(
      //     `${process.env.NEXT_PUBLIC_API_URL}/savingUserAnswer`,
      //     {
      //       question: mockInterviewQuestion[activeQuestionIndex]?.question,
      //       correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
      //       userAnswer,
      //       sessionId,
      //       mockInterviewQuestion,
      //       activeQuestionIndex,
      //       mockJsonResp,
      //     }
      //   );
      //   console.log(response.data);
      // } catch (error) {
      //   console.log(error);
      // }
  //   }
  // };

  const note =
    "Click on record Answer when you want to answer the question.At the end of the interview we will give you the feedback along with the correct answer for each of question and your answer to compare it";

  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, Your browser does not support text to speech");
    }
  };

  return (
    <>
      <div className="p-5 border-4 rounded-lg w-[550px] min-h-[400px] max-h-[500px] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="px-4 py-1 bg-primary text-white rounded-full">
            {interviewData?.jobPosition}
          </h2>
          <h2 className="px-4 py-1 bg-primary text-white rounded-full">
            {activeQuestionIndex}/5
          </h2>
        </div>
        <h2 className="my-6 bg-red-100 p-3 rounded-md text-md md:text-lg">
          {interviewData?.jsonMockResp[activeQuestionIndex]?.question}
        </h2>

        <div>
          <h2 className="font-bold text-md">
            Your Answer :{" "}
            <span className="font-normal ">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
              eligendi laborum enim voluptatibus recusandae autem nisi,
              molestiae, perspiciatis consectetur sit explicabo fuga possimus
              labore minus? Eum nulla sunt mollitia id.
            </span>
          </h2>
        </div>

        <div className="flex items-center justify-between w-full">
          <Button
            onClick={() =>
              textToSpeech(
                interviewData?.jsonMockResp[activeQuestionIndex]?.question
              )
            }
            variant="outline"
            className="flex items-center justify-center gap-2  cursor-pointer"
          >
            <Volume2 className="cursor-pointer" />
            Read
          </Button>
          <Button className="my-10 w-[170px]" onClick={recordUserAnswer}>
            {listening ? (
              <h2 className="flex items-center gap-2">
                <StopCircle /> Stop Recording
              </h2>
            ) : (
              <h2 className="flex items-center gap-2">
                <Mic /> Record Answer
              </h2>
             )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default QuestionSection;
