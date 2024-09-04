import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

const QuestionSection = ({ mockInterviewQuestion, activeQuestionIndex }) => {
  const note =
    "Click on record Answer when you want to answer the question.At the end of the interview we will give you the feedback along with the correct answer for each of question and your answer to compare it";
  
  const textToSpeech=(text)=>{
    if('speechSynthesis' in window){
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech)
    } else{
      alert('Sorry, Your browser does not support text to speech')
    }
  }
    return (
    <div className="p-5 border-4 rounded-lg w-[550px] ml-[250px] my-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {mockInterviewQuestion &&
          mockInterviewQuestion.map((question, index) => (
            <h2
              className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer ${
                activeQuestionIndex === index
                  ? " bg-primary text-white"
                  : "bg-slate-200 text-black"
              }`}
            >
              Question #{index + 1}
            </h2>
          ))}
      </div>
      <h2 className="my-6 text-md  md:text-lg">
        {mockInterviewQuestion[activeQuestionIndex]?.question}

      </h2>
      <Volume2 className="cursor-pointer" onClick={()=>textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}/>

      <div className="border-2 rounded-lg p-5 bg-blue-200 mt-20">
        <h2 className="flex gap-2 items-center text-blue-700">
          <Lightbulb />
          <strong>Note</strong>
        </h2>
        <h2 className="text-sm text-blue-700 my-2">{note}</h2>
      </div>
    </div>
  );
};

export default QuestionSection;
