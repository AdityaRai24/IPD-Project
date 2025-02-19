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
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import QuizSection from "../quiz/page";

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
  const [hasInitialized, setHasInitialized] = useState(false);

  const generateContent = async () => {
    if (!topic || generating) return;

    const parsed = JSON.parse(localStorage.getItem("roadmap"));
    const details = parsed[sectionIdx].levels[levelId].details.join(",");

    try {
      setGenerating(true);
      setError(null);
      const response = await axios.post(
        "http://localhost:3000/api/generate-description",
        { description: topic, details: details },
        { timeout: 30000 }
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
    }
  };

  useEffect(() => {
    if (!topic || hasInitialized) return;

    setHasInitialized(true);
    const cachedContent = localStorage.getItem(topic);

    if (cachedContent) {
      try {
        setContent(JSON.parse(cachedContent));
      } catch (error) {
        console.error("Failed to parse cached content:", error);
        generateContent();
      }
    } else {
      generateContent();
    }
  }, [topic, hasInitialized]);

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
              <li key={itemIdx} className="flex items-start gap-3 text-gray-600">
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

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3 text-slate-500 text-lg">
          <RefreshCw className="w-5 h-5 animate-spin" />
          {generating ? "Generating content..." : "Loading..."}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 bg-gray-100 min-h-screen">
      <article className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
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
                    setHasInitialized(false);
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

        {/* Quiz Section */}
        {content?.quiz && (
          <Card className="border-0 shadow-xl bg-white rounded-2xl">
            <CardContent className="p-8">
              <QuizSection quizData={content.quiz} />
            </CardContent>
          </Card>
        )}
      </article>
    </div>
  );
};

export default LearningContentPage;