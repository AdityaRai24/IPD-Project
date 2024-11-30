"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Code2,
  BookOpen,
  AlertCircle,
  BookMarked,
  Link,
  Play,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import AddNewInterView from "@/components/AddNewInterView";

// const startInterview = (itemContent) => {
//   console.log("Starting interview with content:", itemContent);
//   return(
//     <div className="flex justify-between items-center">
//     <AddNewInterView />
//   </div>
//   )

// };

const QuizSection = ({ quizData }) => {
  const [selectedAnswers, setSelectedAnswers] = useState(
    new Array(quizData.questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    if (!showResults) {
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[questionIndex] = optionIndex;
      setSelectedAnswers(newSelectedAnswers);
    }
  };

  const calculateScore = () => {
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

  return (
    <div className="bg-gray-50 p-6 rounded-lg space-y-6">
      {quizData.questions.map((question, questionIndex) => (
        <div key={questionIndex} className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">
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
            <div className="bg-gray-100 p-4 rounded-lg">
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
          className="w-full"
        >
          Submit Quiz
        </Button>
      )}
      {showResults && (
        <div className="text-center space-y-4">
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
        </div>
      )}
    </div>
  );
};

const LearningContentPage = () => {
  const [content, setContent] = useState([]);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");
  const [generating, setGenerating] = useState(false);

  const generateContent = async () => {
    try {
      setGenerating(true);
      const response = await axios.post(
        "http://localhost:3000/api/generate-description",
        { description: topic },
        { timeout: 30000 }
      );

      setContent(response.data);
      localStorage.setItem(topic, JSON.stringify(response.data));
      setGenerating(false);
    } catch (error) {
      setGenerating(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem(topic))) {
      generateContent();
    } else {
      setContent(JSON.parse(localStorage.getItem(topic)));
    }
  }, [topic]);

  const getIconForSection = (type) => {
    switch (type) {
      case "introduction":
        return <BookOpen className="w-6 h-6" />;
      case "keyConcepts":
        return <BookMarked className="w-6 h-6" />;
      case "codeExample":
        return <Code2 className="w-6 h-6" />;
      case "commonMistakes":
        return <AlertCircle className="w-6 h-6" />;
      case "resources":
        return <Link className="w-6 h-6" />;
      default:
        return <BookMarked className="w-6 h-6" />;
    }
  };

  const renderContent = (item) => {
    if (!item || !item.type) return null;

    switch (item.type) {
      case "introduction":
        return (
          <p className="text-gray-700 leading-relaxed text-lg">
            {item.content}
          </p>
        );

      case "keyConcepts":
      case "bestPractices":
      case "commonMistakes":
        return (
          <ul className="list-disc list-inside space-y-3 text-lg">
            {Array.isArray(item.content) &&
              item.content.map((concept, idx) => (
                <li key={idx} className="text-gray-700">
                  {concept}
                </li>
              ))}
          </ul>
        );

      case "codeExample":
        return (
          <div className="space-y-4 my-6">
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
                <code>{item.content}</code>
              </pre>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-3 right-3"
                onClick={() => navigator.clipboard.writeText(item.content)}
              >
                Copy
              </Button>
            </div>
            {item.language && (
              <Badge className="text-sm">{item.language}</Badge>
            )}
          </div>
        );

      case "codeExplanation":
        return (
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
            {item.content}
          </p>
        );

      case "practiceExercise":
        return item.quizType === "multipleChoice" ? (
          <QuizSection quizData={item} />
        ) : (
          <div className="space-y-4 p-6 rounded-lg my-6">
            <p className="text-gray-700 text-lg">{item.content}</p>
            {item.starterCode && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Starter Code:</p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code>{item.starterCode}</code>
                </pre>
              </div>
            )}
          </div>
        );

      case "resources":
        return (
          <div className="grid gap-4 my-6">
            {Array.isArray(item.content) &&
              item.content.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4  rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {resource.type === "video" ? (
                    <Play className="w-5 h-5 mr-3 text-red-500" />
                  ) : (
                    <Link className="w-5 h-5 mr-3 text-blue-500" />
                  )}
                  <div>
                    <p className="font-medium text-lg">{resource.title}</p>
                    <Badge variant="outline" className="mt-2">
                      {resource.type}
                    </Badge>
                  </div>
                </a>
              ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto ">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!content.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg shadow-sm shadow-primary !bg-transparent mx-auto py-8 px-4">
      {generating ? (
        <div className="w-full min-h-screen flex items-center justify-center">
          Generating...
        </div>
      ) : (
        <article className="w-full">
          <Card className="border-0 !bg-transparent shadow-none">
            <CardHeader className="pb-8">
              <CardTitle className="text-4xl font-bold text-gray-900">
                {topic}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-12">
              {content.map((item, index) => (
                <section key={index} className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    {getIconForSection(item.type)}
                    <h2 className="text-2xl font-semibold capitalize">
                      {item.type.replace(/([A-Z])/g, " $1").trim()}
                    </h2>
                  </div>
                  {renderContent(item)}
                </section>
              ))}

              {/* <div className="mt-8 w-full">
                <Button onClick={() => startInterview(topic)}>
                  Start Interview
                </Button>
              </div> */}
              <div className="flex justify-between items-center">
                <AddNewInterView itemContent={topic} />
              </div>
              
            </CardContent>
          </Card>
        </article>
      )}
    </div>
  );
};

export default LearningContentPage;
