"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Code2,
  HelpCircle,
  RefreshCw
} from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
      return selectedAnswers[index] === question.correctAnswer ? acc + 1 : acc;
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

  const handleRetry = () => {
    setSelectedAnswers(new Array(questions.length).fill(null));
    setShowResults(false);
    setScore(0);
    setCurrentQuestionIndex(0);
  };

  const currentQuestion = questions[currentQuestionIndex];

  const renderQuestionContent = (question) => {
    switch (question.type) {
      case 'code-analysis':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit">
              <Code2 className="w-4 h-4" />
              Code Analysis
            </div>
            <h3 className="text-xl font-semibold text-slate-800 leading-relaxed">
              {question.question}
            </h3>
            {question.codeSnippet && (
              <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                <SyntaxHighlighter
                  language="javascript"
                  style={vscDarkPlus}
                  customStyle={{ margin: 0, padding: '1.5rem' }}
                  showLineNumbers={true}
                >
                  {question.codeSnippet}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        );
      
      case 'true-false':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full w-fit">
              <HelpCircle className="w-4 h-4" />
              True or False
            </div>
            <h3 className="text-xl font-semibold text-slate-800 leading-relaxed">
              {question.question}
            </h3>
          </div>
        );

      default: // multiple-choice
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full w-fit">
              <BookOpen className="w-4 h-4" />
              Multiple Choice
            </div>
            <h3 className="text-xl font-semibold text-slate-800 leading-relaxed">
              {question.question}
            </h3>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {!showResults ? (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300 ease-out"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-sm text-slate-500 font-medium">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Completed</span>
          </div>

          {/* Question Card */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
            {renderQuestionContent(currentQuestion)}

            <div className="grid gap-3">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  className={`
                    w-full text-left p-4 rounded-xl border-2 transition-all duration-200
                    hover:shadow-md active:scale-[0.99]
                    ${
                      selectedAnswers[currentQuestionIndex] === option
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-slate-100 bg-white hover:border-primary/50 hover:bg-slate-50"
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
                      ${selectedAnswers[currentQuestionIndex] === option
                        ? "border-primary bg-primary text-white"
                        : "border-slate-300 text-transparent"
                      }
                    `}>
                      <div className="w-2 h-2 bg-current rounded-full" />
                    </div>
                    <span className={`font-medium ${selectedAnswers[currentQuestionIndex] === option ? 'text-primary' : 'text-slate-700'}`}>
                      {option}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between gap-4 pt-4">
            <Button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              variant="ghost"
              className="text-slate-500 hover:text-slate-900"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={calculateScore}
                disabled={selectedAnswers.some((answer) => answer === null)}
                className="px-8"
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="px-8"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-none shadow-lg bg-white overflow-hidden">
            <div className={`h-2 w-full ${score >= 70 ? 'bg-green-500' : 'bg-red-500'}`} />
            <CardContent className="p-8 text-center space-y-6">
              <div className="relative inline-block">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold border-4 ${
                  score >= 70 
                    ? 'border-green-100 text-green-600 bg-green-50' 
                    : 'border-red-100 text-red-600 bg-red-50'
                }`}>
                  {score.toFixed(0)}%
                </div>
                {score >= 70 && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {score >= 70 ? "Excellent Work!" : "Keep Learning!"}
                </h2>
                <p className="text-slate-600 max-w-md mx-auto">
                  {score >= 70 
                    ? "You've demonstrated a solid understanding of this topic. You're ready to move on!" 
                    : "Review the explanations below to strengthen your understanding before trying again."}
                </p>
              </div>

              <Button onClick={handleRetry} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Retry Quiz
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 px-2">Detailed Review</h3>
            {questions.map((q, idx) => {
              const isCorrect = selectedAnswers[idx] === q.correctAnswer;
              return (
                <Card key={idx} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs font-normal text-slate-500">
                            Question {idx + 1}
                          </Badge>
                          {q.type === 'code-analysis' && <Badge variant="secondary" className="text-xs">Code Analysis</Badge>}
                        </div>
                        <p className="font-medium text-slate-900 text-lg">{q.question}</p>
                      </div>
                      {isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                      )}
                    </div>

                    {q.codeSnippet && (
                      <div className="bg-slate-900 rounded-md p-4 overflow-x-auto">
                        <code className="text-sm text-blue-300 font-mono whitespace-pre">{q.codeSnippet}</code>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4 pt-2">
                      <div className={`p-3 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <span className="text-xs font-semibold uppercase tracking-wider opacity-70 block mb-1">Your Answer</span>
                        <span className={`font-medium ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                          {selectedAnswers[idx]}
                        </span>
                      </div>
                      
                      {!isCorrect && (
                        <div className="p-3 rounded-lg border bg-green-50 border-green-200">
                          <span className="text-xs font-semibold text-green-700 uppercase tracking-wider opacity-70 block mb-1">Correct Answer</span>
                          <span className="font-medium text-green-900">{q.correctAnswer}</span>
                        </div>
                      )}
                    </div>

                    {q.explanation && (
                      <Alert className="bg-blue-50 border-blue-100">
                        <AlertCircle className="w-4 h-4 text-blue-600" />
                        <AlertTitle className="text-blue-800 font-semibold">Explanation</AlertTitle>
                        <AlertDescription className="text-blue-700 mt-1">
                          {q.explanation}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizSection;
