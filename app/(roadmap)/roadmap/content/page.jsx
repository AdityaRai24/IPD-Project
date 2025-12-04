"use client";
import React, { useEffect, useState, Suspense } from "react"; // Added Suspense
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
  Zap,
  AlertTriangle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import QuizSection from "../quiz/page";
import AddNewInterView from "@/components/AddNewInterView";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// --- Helper Components ---

const LoadingView = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
    <h2 className="text-lg font-medium text-gray-800">
      Loading content...
    </h2>
    <p className="text-gray-500 text-sm mt-2">
      This may take a few moments.
    </p>
  </div>
);

const CodeBlock = ({ content, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4 rounded-lg overflow-hidden border border-gray-200">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
        <span className="text-xs text-gray-300 font-mono">{language || 'code'}</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white h-6 w-6 p-0"
          onClick={handleCopy}
        >
          {copied ? (
            <CheckCircle className="w-3 h-3 text-green-500" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </Button>
      </div>
      <SyntaxHighlighter
        language={language || 'javascript'}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1rem',
          fontSize: '0.9rem',
        }}
        showLineNumbers={true}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
};

// --- Main Logic Component (Inner) ---
// This component uses useSearchParams and contains your original logic
const LearningContent = () => {
  const router = useRouter();
  const { roadmap } = useRoadmapStore();
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");
  const sectionIdx = searchParams.get("sectionIdx");
  const levelId = searchParams.get("levelId");
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTopic, setCurrentTopic] = useState("");
  const [activeView, setActiveView] = useState("main");
  const [openDialog, setOpenDialog] = useState(false);

  const generateContent = async () => {
    if (!topic || generating || !roadmap) return;

    const section = roadmap[sectionIdx];
    const level = section?.levels?.find((item) => item.level == levelId);

    if (!level) {
      console.error("Level details not found in roadmap");
    }

    const details = level?.details?.join(",") || "";

    try {
      setGenerating(true);
      setError(null);
      const response = await axios.post(
        "/api/generate-description",
        { description: topic, details: details }
      );

      let parsedResponse;
      try {
        parsedResponse = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
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
  }, [topic, sectionIdx, levelId, roadmap]);

  const getIconForSection = (type) => {
    const icons = {
      introduction: <BookOpen className="w-5 h-5" />,
      concepts: <Lightbulb className="w-5 h-5" />,
      examples: <Code2 className="w-5 h-5" />,
      conclusion: <BookMarked className="w-5 h-5" />,
      resources: <Link className="w-5 h-5" />,
      diagram: <FileCode className="w-5 h-5" />,
      default: <List className="w-5 h-5" />,
    };
    return icons[type] || icons.default;
  };

  const renderContentBlock = (block) => {
    if (!block?.type) return null;

    switch (block.type) {
      case "text":
        return block.content ? (
          <div className="prose prose-slate max-w-none text-gray-700 leading-relaxed mb-4">
            {block.content}
          </div>
        ) : null;

      case "list":
        return block.items?.length ? (
          <ul className="list-disc list-inside space-y-2 my-4 text-gray-700">
            {block.items.map((item, itemIdx) => (
              <li key={itemIdx} className="ml-4">
                {item}
              </li>
            ))}
          </ul>
        ) : null;

      case "code":
        return block.content ? (
          <CodeBlock content={block.content} language={block.language} />
        ) : null;

      case "callout":
        const isTip = block.variant === 'tip';
        return (
          <Alert className={`my-4 ${isTip ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200'}`}>
            {isTip ? <Zap className="h-4 w-4 text-blue-600" /> : <AlertTriangle className="h-4 w-4 text-amber-600" />}
            <div className="ml-2">
              <AlertTitle className={`font-semibold ${isTip ? 'text-blue-800' : 'text-amber-800'}`}>
                {block.title || (isTip ? "Pro Tip" : "Note")}
              </AlertTitle>
              <AlertDescription className={`${isTip ? 'text-blue-700' : 'text-amber-700'}`}>
                {block.content}
              </AlertDescription>
            </div>
          </Alert>
        );

      default:
        return null;
    }
  };

  const InteractionCardsSection = () => (
    <div className="mt-8 grid md:grid-cols-2 gap-4">
      <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <ClipboardList className="h-8 w-8 text-primary" />
            <CardTitle className="text-lg font-semibold text-gray-800">
              Take Quiz
            </CardTitle>
            <p className="text-sm text-gray-600">
              Test your knowledge on {content?.title || topic}
            </p>
            <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={() => setActiveView("quiz")}
            >
              Start Quiz
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <Users className="h-8 w-8 text-primary" />
            <CardTitle className="text-lg font-semibold text-gray-800">
              Mock Interview
            </CardTitle>
            <p className="text-sm text-gray-600">
              Practice interview questions for {content?.title || topic}
            </p>
            <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={() => setOpenDialog(true)}
            >
              Start Interview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const QuizView = () => (
    <Card className="border-0 shadow-lg bg-white rounded-xl">
      <CardHeader className="border-b border-gray-100 p-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => setActiveView("main")}
            className="h-8 w-8 p-0 rounded-full"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </Button>
          <CardTitle className="text-xl font-bold text-gray-800">
            Quiz: {content?.title || topic}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {content?.quiz ? (
          <QuizSection quizData={content.quiz} />
        ) : (
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="mx-auto h-10 w-10 mb-3 text-gray-400" />
            <p>No quiz available for this topic.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 pt-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 bg-white text-red-600 hover:bg-gray-50"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Alert>
      </div>
    );
  }

  if (loading || !content) {
    return <LoadingView />;
  }

  return (
    <div className="pt-20 px-4 bg-gray-50 min-h-screen pb-10">
      <article className="max-w-4xl mx-auto space-y-6">
        {activeView === "main" && (
          <>
            <Card className="border-0 shadow-sm bg-white rounded-xl overflow-hidden">
              <CardHeader className="p-8 border-b border-gray-100 bg-white">
                <div className="space-y-2">
                  <Badge variant="secondary" className="mb-2">
                    Learning Guide
                  </Badge>
                  <CardTitle className="text-3xl font-bold text-gray-900">
                    {content.title}
                  </CardTitle>
                  {content.description && (
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {content.description}
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-10">
                {content.sections?.map((section, index) => (
                  <section key={index} className="space-y-4">
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                      <div className="p-2 rounded-lg bg-gray-100 text-gray-700">
                        {getIconForSection(section.type)}
                      </div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {section.title}
                      </h2>
                    </div>

                    <div className="space-y-4 pl-1">
                      {section.content?.map((block, idx) => (
                        <div key={idx} className="space-y-2">
                          {block.subtitle && (
                            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                              {block.subtitle}
                            </h3>
                          )}
                          {renderContentBlock(block)}
                        </div>
                      ))}
                    </div>
                  </section>
                ))}

                <InteractionCardsSection />

                <div className="flex justify-between items-center pt-6 mt-8 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>

                  {topic && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        localStorage.removeItem(topic);
                        setLoading(true);
                        generateContent();
                      }}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="hidden">
              <AddNewInterView itemContent={content?.title || topic} />
            </div>
          </>
        )}

        {activeView === "quiz" && <QuizView />}

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

// --- Parent Wrapper Component (Exported) ---
// This is the fix: Wrap the component using searchParams in Suspense
const LearningContentPage = () => {
  return (
    <Suspense fallback={<LoadingView />}>
      <LearningContent />
    </Suspense>
  );
};

export default LearningContentPage;