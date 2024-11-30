"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  CheckCircle,
  BookOpen,
  Trophy,
  ArrowRight,
  PlusCircle,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import AddNewInterView from "@/components/AddNewInterView";



const RoadmapDashboard = () => {
  const router = useRouter();
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    completedLevels: 0,
    totalLevels: 0,
    completionPercentage: 0,
  });

  const { data: session, status } = useSession();

  const today = new Date();
  const currentHour = today.getHours();
  let greeting = "";

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon";
  } else if (currentHour >= 17 && currentHour < 24) {
    greeting = "Good evening";
  }

  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  const formattedDate = today.toLocaleDateString("en-US", options);

  useEffect(() => {
    loadRoadmap();
  }, []);

  const loadRoadmap = () => {
    try {
      const savedRoadmap = localStorage.getItem("roadmap");
      if (savedRoadmap) {
        const parsedRoadmap = JSON.parse(savedRoadmap);
        const initializedRoadmap = parsedRoadmap.map((section) => ({
          ...section,
          levels: section.levels.map((level) => ({
            ...level,
            completed: level.completed || false,
          })),
        }));
        setRoadmap(initializedRoadmap);
        calculateStats(initializedRoadmap);
      } else {
        setError("No roadmap found in storage");
      }
    } catch (error) {
      setError("Failed to load roadmap data");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (roadmapData) => {
    const totalLevels = roadmapData.reduce(
      (total, section) => total + section.levels.length,
      0
    );
    const completedLevels = roadmapData.reduce(
      (total, section) =>
        total + section.levels.filter((level) => level.completed).length,
      0
    );
    const completionPercentage = totalLevels
      ? Math.round((completedLevels / totalLevels) * 100)
      : 0;

    setStats({
      completedLevels,
      totalLevels,
      completionPercentage,
    });
  };

  const handleSectionClick = (sectionIndex) => {
    router.push(`/roadmap/generate`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h2 className="text-md text-gray-500 font-medium">{formattedDate}</h2>
          <h2 className="text-black text-2xl font-semibold mt-1">
            {greeting}, {session?.user?.name}
          </h2>
          <p className="text-gray-600 mt-2">Ready to continue your journey?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold">
                  {stats.completionPercentage}%
                </p>
                <p className="text-gray-600">Overall Completion</p>
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {stats.completedLevels}/{stats.totalLevels}
                </p>
                <p className="text-gray-600">Chapters Completed</p>
              </div>
            </div>
            <Progress value={stats.completionPercentage} className="h-3" />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push("/roadmap/generate")}
            >
              View Detailed Progress <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/roadmap/create`)}
            >
              New Roadmap <PlusCircle className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              Units Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="space-y-4 max-h-64 overflow-y-auto 
      scrollbar-thin 
      scrollbar-track-gray-100 
      scrollbar-thumb-gray-300 
      hover:scrollbar-thumb-gray-400 
      rounded-scrollbar"
            >
              {roadmap.map((section, index) => {
                const sectionCompletedLevels = section.levels.filter(
                  (level) => level.completed
                ).length;
                const sectionPercentage = Math.round(
                  (sectionCompletedLevels / section.levels.length) * 100
                );

                return (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSectionClick(index)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-900">
                        Unit {index + 1}: {section.name}
                      </h3>
                      <span className="text-sm font-medium text-gray-900">
                        {sectionPercentage}%
                      </span>
                    </div>
                    <Progress value={sectionPercentage} className="h-2" />
                    <p className="text-sm text-gray-600 mt-2">
                      {sectionCompletedLevels} of {section.levels.length}{" "}
                      chapters completed
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            Mock Interviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Practice for interviews according to your preferred topics. Our
            AI-powered mock interviews help you prepare for real-world scenarios
            and improve your skills.
          </p>
          <div className="flex justify-between items-center">
            <AddNewInterView />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoadmapDashboard;
