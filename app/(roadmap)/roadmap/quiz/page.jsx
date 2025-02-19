"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const QuizSection = ({ quizData }) => {
  const questions = quizData || [];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(
    new Array(questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  if (!questions.length) return null;

  const handleAnswerSelect = (answer) => {
    if (!showResults) {
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[currentQuestionIndex] = answer;
      setSelectedAnswers(newSelectedAnswers);
    }
  };

  const calculateScore = () => {
    const correctAnswers = questions.reduce((acc, question, index) => {
      return selectedAnswers[index] === question.answer ? acc + 1 : acc;
    }, 0);
    setScore((correctAnswers / questions.length) * 100);
    setShowResults(true);
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1));
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="space-y-8 p-8 rounded-xl shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          Quiz Assessment
        </h2>
        <div className="text-sm text-slate-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      {!showResults ? (
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-lg">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">
              {currentQuestion.question}
            </h3>
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  className={`
                    w-full text-left p-4 rounded-lg border transition-all
                    hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary
                    ${
                      selectedAnswers[currentQuestionIndex] === option
                        ? "bg-primary/10 border-primary"
                        : "bg-white border-slate-200"
                    }
                    relative pl-12
                  `}
                >
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <div
                      className={`
                        w-5 h-5 border-2 rounded-full
                        ${
                          selectedAnswers[currentQuestionIndex] === option
                            ? "border-primary bg-primary/10"
                            : "border-slate-300"
                        }
                      `}
                    />
                  </div>
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <Button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className="w-32"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={calculateScore}
                disabled={selectedAnswers.some((answer) => answer === null)}
                className="w-32"
              >
                Submit
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="w-32"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          <div className="flex justify-center">
            <div className="flex gap-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`
                    w-3 h-3 rounded-full
                    ${
                      selectedAnswers[index] !== null
                        ? "bg-primary"
                        : "bg-slate-200"
                    }
                    ${
                      currentQuestionIndex === index
                        ? "ring-2 ring-primary ring-offset-2"
                        : ""
                    }
                  `}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div
              className={`text-4xl font-bold ${
                score >= 70 ? "text-green-600" : "text-red-600"
              }`}
            >
              {score.toFixed(0)}%
            </div>
            <div className="text-slate-600">Passing Score: 70%</div>
          </div>
          {score >= 70 ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Congratulations! You've passed the quiz!
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                You haven't reached the passing score. Please review the
                material and try again.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizSection;
