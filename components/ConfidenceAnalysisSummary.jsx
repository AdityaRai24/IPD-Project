import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  AlertCircle,
  CheckCircle,
  Eye,
  Smile,
  Frown,
  Video,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "./ui/button";
import InterviewSolution from "@/app/(roadmap)/roadmap/interviewSolution/page";
import { useRouter } from "next/navigation";

const ConfidenceAnalysisSummary = ({
  confidenceResults,
  averages,
  userAnswers,
}) => {
  const router = useRouter();

  const [expandedSections, setExpandedSections] = useState({ tips: false });

  // Transform confidence results for time-series visualization
  const timeSeriesData = confidenceResults.map((result, index) => ({
    time: `S${index + 1}`,
    confidence: parseFloat(result.confidence.toFixed(1)),
    posture: parseFloat(result.posture_score.toFixed(1)),
    eyeContact: result.eye_contact ? 100 : 0,
  }));

  // Generate improvement tips based on performance
  const generateTips = () => {
    const tips = [];

    // Confidence tips
    if (averages.confidence < 50) {
      tips.push({
        category: "Confidence",
        issue: "Low overall confidence detected",
        tip: "Practice power posing for 2 minutes before interviews. Research shows this can boost confidence hormones.",
        severity: "high",
      });
    } else if (averages.confidence < 70) {
      tips.push({
        category: "Confidence",
        issue: "Moderate confidence levels",
        tip: "Try recording yourself answering questions and review for nervous habits or filler words.",
        severity: "medium",
      });
    }

    // Posture tips
    if (averages.posture < 50) {
      tips.push({
        category: "Posture",
        issue: "Poor posture throughout interview",
        tip: "Sit up straight with shoulders back. Place a sticky note reminder at eye level on your screen.",
        severity: "high",
      });
    } else if (averages.posture < 70) {
      tips.push({
        category: "Posture",
        issue: "Inconsistent posture",
        tip: "Practice interviews in front of a mirror or with a friend who can remind you when you're slouching.",
        severity: "medium",
      });
    }

    // Eye contact tips
    if (averages.eyeContact === "No") {
      tips.push({
        category: "Eye Contact",
        issue: "Limited eye contact with camera",
        tip: "Place a small sticker or googly eye next to your webcam as a reminder to look at the camera.",
        severity: "high",
      });
    }

    // Emotion tips based on most common emotion (would need to be calculated from results)
    const emotions = confidenceResults.map((r) => r.emotion);
    const mostCommonEmotion = emotions
      .sort(
        (a, b) =>
          emotions.filter((v) => v === a).length -
          emotions.filter((v) => v === b).length
      )
      .pop();

    if (mostCommonEmotion === "nervous" || mostCommonEmotion === "fear") {
      tips.push({
        category: "Emotional Expression",
        issue: "Anxiety or nervousness detected",
        tip: "Practice deep breathing exercises before and during interviews. Try 4-7-8 breathing: inhale for 4 seconds, hold for 7, exhale for 8.",
        severity: "high",
      });
    } else if (mostCommonEmotion === "neutral") {
      tips.push({
        category: "Emotional Expression",
        issue: "Limited emotional expressiveness",
        tip: "Practice varying your vocal tone and facial expressions. Record yourself and identify moments to add emphasis.",
        severity: "medium",
      });
    }

    return tips;
  };

  const improvementTips = generateTips();

  // Calculate overall score
  const calculateOverallScore = () => {
    const confidenceWeight = 0.4;
    const postureWeight = 0.3;
    const eyeContactWeight = 0.3;

    const eyeContactScore = averages.eyeContact === "Yes" ? 100 : 30;

    return (
      parseFloat(averages.confidence) * confidenceWeight +
      parseFloat(averages.posture) * postureWeight +
      eyeContactScore * eyeContactWeight
    ).toFixed(1);
  };

  const overallScore = calculateOverallScore();

  // Determine performance level
  const getPerformanceLevel = (score) => {
    if (score >= 85) return { text: "Excellent", color: "text-green-600" };
    if (score >= 70) return { text: "Good", color: "text-blue-600" };
    if (score >= 50) return { text: "Average", color: "text-yellow-600" };
    return { text: "Needs Improvement", color: "text-red-600" };
  };

  const performanceLevel = getPerformanceLevel(overallScore);

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const handleInterviewAnalysis = () => {
    return (
      <>
       
        <h1>hellp</h1>
        <InterviewSolution />
      </>
    );
  };

  return (
    <div className="w-full space-y-6">
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-blue-100">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
            Interview Confidence Analysis
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Score Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Overall Performance
              </h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">{overallScore}%</span>
                <span
                  className={`text-lg font-semibold ${performanceLevel.color}`}
                >
                  {performanceLevel.text}
                </span>
              </div>
              <Progress value={overallScore} className="h-3 mb-4" />

              <div className="grid grid-cols-3 gap-2 mt-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-500">Confidence</p>
                  <p className="text-xl font-bold text-blue-600">
                    {averages.confidence}%
                  </p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-500">Posture</p>
                  <p className="text-xl font-bold text-purple-600">
                    {averages.posture}/100
                  </p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-500">Eye Contact</p>
                  <p className="text-xl font-bold text-green-600">
                    {averages.eyeContact}
                  </p>
                </div>
              </div>
            </div>

            {/* Trend Analysis */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Performance Trends
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={timeSeriesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="confidence"
                      name="Confidence"
                      fill="#3b82f6"
                    />
                    <Bar dataKey="posture" name="Posture" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <Tabs defaultValue="metrics" className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
              <TabsTrigger value="emotions">Emotional Analysis</TabsTrigger>
              <TabsTrigger value="improvements">Improvement Plan</TabsTrigger>
            </TabsList>

            {/* Metrics Tab */}
            <TabsContent
              value="metrics"
              className="p-4 bg-white rounded-xl border border-gray-200 mt-2"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="flex items-center text-lg font-medium text-gray-700 mb-2">
                    <Eye className="mr-2 h-5 w-5 text-blue-500" /> Eye Contact
                    Analysis
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {averages.eyeContact === "Yes"
                      ? "You maintained good eye contact throughout most of the interview."
                      : "You struggled to maintain consistent eye contact during the interview."}
                  </p>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full ${
                          averages.eyeContact === "Yes"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                        style={{
                          width: `${
                            averages.eyeContact === "Yes" ? "80%" : "40%"
                          }`,
                        }}
                      ></div>
                    </div>
                    <span className="ml-4 font-medium">
                      {averages.eyeContact === "Yes" ? "Good" : "Poor"}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="flex items-center text-lg font-medium text-gray-700 mb-2">
                    <Video className="mr-2 h-5 w-5 text-purple-500" /> Posture
                    Consistency
                  </h3>
                  <div className="flex items-center mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-4 mr-4">
                      <div
                        className={`h-4 rounded-full ${
                          parseFloat(averages.posture) > 70
                            ? "bg-green-500"
                            : parseFloat(averages.posture) > 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${averages.posture}%` }}
                      ></div>
                    </div>
                    <span className="font-medium">{averages.posture}/100</span>
                  </div>
                  <p className="text-gray-600">
                    {parseFloat(averages.posture) > 70
                      ? "Your posture was excellent throughout the interview."
                      : parseFloat(averages.posture) > 50
                      ? "Your posture was adequate but could use improvement."
                      : "Your posture needs significant improvement."}
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Emotions Tab */}
            <TabsContent
              value="emotions"
              className="p-4 bg-white rounded-xl border border-gray-200 mt-2"
            >
              <div className="space-y-4">
                <h3 className="flex items-center text-lg font-medium text-gray-700 mb-2">
                  <Smile className="mr-2 h-5 w-5 text-yellow-500" /> Emotional
                  Expression
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {confidenceResults.map((result, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Second {idx + 1}</span>
                        <span
                          className={`text-sm px-2 py-1 rounded-full capitalize ${
                            result.emotion === "happy" ||
                            result.emotion === "neutral"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {result.emotion}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Confidence:{" "}
                        <span className="font-medium">
                          {result.confidence.toFixed(1)}%
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Improvements Tab */}
            <TabsContent
              value="improvements"
              className="p-4 bg-white rounded-xl border border-gray-200 mt-2"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center text-lg font-medium text-gray-700">
                    <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />{" "}
                    Personalized Improvement Tips
                  </h3>
                  <button
                    onClick={() => toggleSection("tips")}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    {expandedSections.tips ? (
                      <>
                        Less <ChevronUp className="ml-1 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        More <ChevronDown className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-3">
                  {improvementTips
                    .slice(
                      0,
                      expandedSections.tips ? improvementTips.length : 2
                    )
                    .map((tip, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-blue-50 rounded-lg border border-blue-100"
                      >
                        <div className="flex items-start">
                          <div
                            className={`p-2 rounded-full ${
                              tip.severity === "high"
                                ? "bg-red-100 text-red-600"
                                : tip.severity === "medium"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-green-100 text-green-600"
                            } mr-3`}
                          >
                            {tip.severity === "high" ? (
                              <AlertCircle className="h-5 w-5" />
                            ) : tip.severity === "medium" ? (
                              <ArrowUpCircle className="h-5 w-5" />
                            ) : (
                              <CheckCircle className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800 flex items-center">
                              {tip.category}: {tip.issue}
                            </h4>
                            <p className="mt-1 text-gray-600">{tip.tip}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">Next Steps</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    <li>
                      Schedule another practice interview focusing on these
                      improvement areas
                    </li>
                    <li>
                      Review your recorded answers with attention to body
                      language
                    </li>
                    <li>
                      Practice responses to similar questions with improved
                      confidence techniques
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
       <Button onClick={()=>router.push(`/roadmap/interviewSolution`)}>Interview Analysis</Button>
     

    </div>
  );
};

export default ConfidenceAnalysisSummary;
