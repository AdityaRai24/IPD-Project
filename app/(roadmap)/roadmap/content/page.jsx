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
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSearchParams } from "next/navigation";

const LearningContentPage = () => {
  const [content, setContent] = useState([]);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");

  useEffect(() => {
    try {
      const savedContent = localStorage.getItem(topic);
      if (savedContent) {
        const parsedContent = JSON.parse(savedContent);
        if (Array.isArray(parsedContent)) {
          setContent(parsedContent);
        } else {
          setError("Invalid content format: expected an array");
        }
      } else {
        setError("No content found in local storage");
      }
    } catch (error) {
      console.error("Error loading content:", error);
      setError("Failed to load content");
    }
  }, []);

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
        return (
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg my-6">
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
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
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
      <div className="max-w-4xl mx-auto p-6">
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
    <div className="max-w-4xl mx-auto p-6">
      <article className="prose prose-lg max-w-none">
        <Card className="border-0 shadow-none">
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
          </CardContent>
        </Card>
      </article>
    </div>
  );
};

export default LearningContentPage;
