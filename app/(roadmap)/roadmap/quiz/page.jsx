"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

const QuizPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const topic = searchParams.get("topic");
    const storedContent = localStorage.getItem(topic);

    if (storedContent) {
      const parsedContent = JSON.parse(storedContent);
      const practiceSection = parsedContent.find(
        (section) => section.type === "practiceExercise"
      );

      if (practiceSection) {
        setQuizData(practiceSection);
        setSelectedAnswers(
          new Array(practiceSection.questions.length).fill(null)
        );
      }
    }
  }, []);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    if (!showResults) {
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[questionIndex] = optionIndex;
      setSelectedAnswers(newSelectedAnswers);
    }
  };

  const calculateScore = () => {
    if (!quizData) return;

    const correctAnswers = quizData.questions.reduce((acc, question, index) => {
      const selectedOptionIndex = selectedAnswers[index];
      return selectedOptionIndex !== null &&
        question.options[selectedOptionIndex].isCorrect
        ? acc + 1
        : acc;
    }, 0);

    const scorePercentage = (correctAnswers / quizData.questions.length) * 100;
    setScore(scorePercentage);
    setShowResults(true);
  };

  const restartQuiz = () => {
    setSelectedAnswers(new Array(quizData.questions.length).fill(null));
    setShowResults(false);
    setScore(0);
  };

  if (!quizData) {
    return <div className="text-center mt-10">Loading Quiz...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Quiz: Practice Test
        </h1>

        {quizData.questions.map((question, questionIndex) => (
          <div key={questionIndex} className="mb-6">
            <h3 className="text-xl font-semibold mb-4">
              {question.questionText}
            </h3>
            <div className="space-y-3">
              {question.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                  className={`
                    w-full text-left p-3 rounded-lg border transition-colors 
                    ${
                      showResults && option.isCorrect
                        ? "bg-green-100 border-green-300"
                        : showResults &&
                          selectedAnswers[questionIndex] === optionIndex &&
                          !option.isCorrect
                        ? "bg-red-100 border-red-300"
                        : selectedAnswers[questionIndex] === optionIndex
                        ? "bg-blue-100 border-blue-300"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }
                  `}
                >
                  {option.text}
                  {showResults && option.isCorrect && (
                    <CheckCircle2 className="inline ml-2 text-green-600" />
                  )}
                  {showResults &&
                    selectedAnswers[questionIndex] === optionIndex &&
                    !option.isCorrect && (
                      <XCircle className="inline ml-2 text-red-600" />
                    )}
                </button>
              ))}
            </div>
            {showResults && (
              <div className="bg-gray-100 p-4 rounded-lg mt-4">
                <p className="font-medium">Explanation:</p>
                <p>{question.explanation}</p>
              </div>
            )}
          </div>
        ))}

        {!showResults && (
          <Button
            onClick={calculateScore}
            disabled={selectedAnswers.some((answer) => answer === null)}
            className="w-full mt-6"
          >
            Submit Quiz
          </Button>
        )}

        {showResults && (
          <div className="text-center space-y-4 mt-6">
            <h4 className="text-2xl font-bold">
              Your Score: {score.toFixed(0)}%
              {score >= quizData.passingScore ? (
                <span className="text-green-600 ml-2">Passed!</span>
              ) : (
                <span className="text-red-600 ml-2">Failed</span>
              )}
            </h4>
            <p className="text-gray-600">
              Passing Score: {quizData.passingScore}%
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <Button onClick={restartQuiz}>Retake Quiz</Button>
              <Button
                variant="secondary"
                onClick={() =>
                  router.push(
                    `/roadmap/content?topic=${searchParams.get("topic")}`
                  )
                }
              >
                Back to Content
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
