"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Code2,
  BookOpen,
  AlertCircle,
  BookMarked,
  Link,
  Lightbulb,
  List,
  FileCode,
  Copy,
  CheckCircle,
  RefreshCw,
  ArrowLeft,
  ClipboardList,
  Users,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import QuizSection from "../quiz/page";
import AddNewInterView from "@/components/AddNewInterView";

const CodeBlock = ({ content, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-blue-500 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
      <div className="relative">
        <div className="flex items-center justify-between bg-gray-800 rounded-t-xl px-4 py-2">
          <Badge variant="secondary" className="bg-gray-700 text-gray-200">
            {language}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            onClick={handleCopy}
          >
            {copied ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
        <pre className="bg-gray-900 text-gray-100 p-6 rounded-b-xl overflow-x-auto font-mono text-sm leading-relaxed">
          <code>{content}</code>
        </pre>
      </div>
    </div>
  );
};

const LearningContentPage = () => {
  const router = useRouter();
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");
  const sectionIdx = searchParams.get("sectionIdx");
  const levelId = searchParams.get("levelId");
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTopic, setCurrentTopic] = useState("");
  const [activeView, setActiveView] = useState("main"); // 'main', 'quiz', or 'interview'
  const [interviewDialogOpen, setInterviewDialogOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const generateContent = async () => {
    if (!topic || generating) return;

    const parsed = JSON.parse(localStorage.getItem("roadmap"));
    const details = parsed[sectionIdx]?.levels.find((item)=>item.level == levelId).details.join(",");

    try {
      setGenerating(true);
      setError(null);
      const response = await axios.post(
        "http://localhost:3000/api/generate-description",
        { description: topic, details: details }
      );

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(response.data);
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        setError("Invalid response format");
        return;
      }

      setContent(parsedResponse);
      localStorage.setItem(topic, JSON.stringify(parsedResponse));
    } catch (error) {
      console.error("Generation error:", error);
      setError(error.response?.data?.message || "Failed to generate content");
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset state when topic changes
    if (topic !== currentTopic) {
      setContent(null);
      setLoading(true);
      setCurrentTopic(topic);
    }

    if (!topic) return;

    const cachedContent = localStorage.getItem(topic);

    if (cachedContent) {
      try {
        const parsedContent = JSON.parse(cachedContent);
        setContent(parsedContent);
        setLoading(false);
      } catch (error) {
        console.error("Failed to parse cached content:", error);
        generateContent();
      }
    } else {
      generateContent();
    }
  }, [topic, sectionIdx, levelId]);

  const getIconForSection = (type) => {
    const icons = {
      introduction: <BookOpen className="w-6 h-6" />,
      concepts: <Lightbulb className="w-6 h-6" />,
      examples: <Code2 className="w-6 h-6" />,
      conclusion: <BookMarked className="w-6 h-6" />,
      resources: <Link className="w-6 h-6" />,
      diagram: <FileCode className="w-6 h-6" />,
      default: <List className="w-6 h-6" />,
    };
    return icons[type] || icons.default;
  };

  const renderContentBlock = (block) => {
    if (!block?.type) return null;

    switch (block.type) {
      case "text":
        return block.content ? (
          <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed">
            {block.content}
          </div>
        ) : null;

      case "list":
        return block.items?.length ? (
          <ul className="space-y-3">
            {block.items.map((item, itemIdx) => (
              <li
                key={itemIdx}
                className="flex items-start gap-3 text-gray-600"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2.5" />
                <span className="flex-1">{item}</span>
              </li>
            ))}
          </ul>
        ) : null;

      case "code":
        return block.content ? (
          <CodeBlock content={block.content} language={block.language} />
        ) : null;

      default:
        return null;
    }
  };

  // Card navigation for Quiz and Interview options
  const InteractionCardsSection = () => (
    <div className="mt-12 grid md:grid-cols-2 gap-6">
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-none bg-white shadow-md">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-gradient-to-r from-pink-500/10 to-blue-500/10">
              <ClipboardList className="h-12 w-12 text-pink-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">
              Take Quiz
            </CardTitle>
            <p className="text-gray-600">
              Test your knowledge with interactive questions about{" "}
              {content?.title || topic}
            </p>
            <Button
              className="mt-4 bg-gradient-to-r from-red-600 to-pink-600 transition-all duration-300  hover:from-pink-700 hover:to-blue-700 text-white"
              onClick={() => setActiveView("quiz")}
            >
              Start Quiz
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-none bg-white shadow-md">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-gradient-to-r from-pink-500/10 to-blue-500/10">
              <Users className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">
              Take Mock Interview
            </CardTitle>
            <p className="text-gray-600">
              Practice with simulated interview questions about{" "}
              {content?.title || topic}
            </p>
            <Button
              className="mt-4 bg-gradient-to-r from-red-600 to-pink-600 transition-all duration-300  hover:from-pink-700 hover:to-blue-700 text-white"
              onClick={() => setOpenDialog(true)}
            >
              Start Interview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Quiz view component
  const QuizView = () => (
    <Card className="border-0 shadow-xl bg-white rounded-2xl">
      <CardHeader className="border-b border-gray-100 p-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => setActiveView("main")}
            className="w-10 h-10 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Quiz: {content?.title || topic}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        {content?.quiz ? (
          <QuizSection quizData={content.quiz} />
        ) : (
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="mx-auto h-12 w-12 mb-4 text-gray-400" />
            <p className="text-lg">No quiz available for this topic.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Loading state
  const LoadingView = () => (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-xl">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500/20 to-blue-500/20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          Loading {topic}...
        </h2>
        <p className="text-gray-500 text-center max-w-md">
          We're preparing your learning content. This might take a moment if we're
          generating fresh content.
        </p>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <Alert variant="destructive" className="shadow-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading || !content) {
    return <LoadingView />;
  }

  return (
    <div className="pt-20 px-4 bg-gray-100 min-h-screen">
      <article className="max-w-5xl mx-auto space-y-8">
        {activeView === "main" && (
          <>
            {/* Main Content Card */}
            <Card className="border-0 shadow-md bg-gray-50 rounded-lg overflow-hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-200/10 to-blue-200/10" />
                <CardHeader className="relative space-y-6 p-8">
                  <div className="space-y-4">
                    <CardTitle className="text-4xl font-bold text-gray-900 tracking-tight">
                      {content.title}
                    </CardTitle>
                    {content.description && (
                      <p className="text-xl text-gray-600 leading-relaxed">
                        {content.description}
                      </p>
                    )}
                  </div>
                </CardHeader>
              </div>

              {/* Content Sections */}
              <CardContent className="p-8 space-y-12">
                {content.sections?.map((section, index) => (
                  <section key={index} className="space-y-6">
                    {/* Section Header */}
                    <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-pink-500/10 to-blue-500/10 text-pink-600">
                        {getIconForSection(section.type)}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                        {section.title}
                      </h2>
                    </div>

                    {/* Section Content */}
                    <div className="space-y-8 pl-4">
                      {section.content?.map((block, idx) => (
                        <div key={idx} className="space-y-4">
                          {block.subtitle && (
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">
                              {block.subtitle}
                            </h3>
                          )}
                          {renderContentBlock(block)}
                        </div>
                      ))}
                    </div>
                  </section>
                ))}

                {/* Quiz & Interview Card Navigation */}
                <InteractionCardsSection />

                {/* Navigation Footer */}
                <div className="flex justify-between items-center pt-8 mt-12 border-t border-gray-100">
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Topics
                  </Button>

                  {topic && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        localStorage.removeItem(topic);
                        setLoading(true);
                        generateContent();
                      }}
                      className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Regenerate Content
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AddNewInterview component stays on main view only but is hidden by default */}
            <div className="hidden">
              <AddNewInterView itemContent={content?.title || topic} />
            </div>
          </>
        )}

        {/* Conditionally render Quiz View */}
        {activeView === "quiz" && <QuizView />}

        {/* Interview Modal - this is controlled by the interviewDialogOpen state */}
        {openDialog && (
          <AddNewInterView
            itemContent={content?.title || topic}
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
          />
        )}
      </article>
    </div>
  );
};

export default LearningContentPage;