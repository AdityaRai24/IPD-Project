import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  BookOpen,
  Trophy,
  Target,
  PlusCircle,
  Calendar,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useSession } from "next-auth/react";

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

  const { data: session } = useSession();

  const greeting = new Date().getHours() < 12 ? "Good morning" : 
                  new Date().getHours() < 17 ? "Good afternoon" : 
                  "Good evening";

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

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

    setStats({ completedLevels, totalLevels, completionPercentage });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Preparing your learning journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {error && (
          <Alert variant="destructive" className="mb-6 rounded-xl">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-gray-500 mb-3">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">{formattedDate}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {greeting}, {session?.user?.name || 'Learner'} 
                <span className="text-primary">!</span>
              </h1>
              <p className="text-gray-600">Your learning adventure continues today</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/roadmap/create")}
                className="gap-2 rounded-xl px-6 py-5 text-base font-medium border-2 hover:bg-gray-50"
              >
                <PlusCircle className="w-5 h-5" />
                New Journey
              </Button>
              <Button 
                onClick={() => router.push("/roadmap/generate")} 
                className="gap-2 rounded-xl px-6 py-5 text-base font-medium bg-primary hover:bg-primary/90"
              >
                <Target className="w-5 h-5" />
                View Progress
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-0 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b bg-white/50 backdrop-blur-sm">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <BookOpen className="w-5 h-5 text-primary" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {roadmap.map((section, index) => {
                  const completedLevels = section.levels.filter(
                    (level) => level.completed
                  ).length;
                  const percentage = Math.round(
                    (completedLevels / section.levels.length) * 100
                  );

                  return (
                    <div
                      key={index}
                      onClick={() => router.push("/roadmap/generate")}
                      className="group p-5 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-primary/20"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors flex items-center gap-2">
                            Unit {index + 1}: {section.name}
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {completedLevels} of {section.levels.length} chapters complete
                          </p>
                        </div>
                        <span className="text-sm font-medium px-3 py-1 rounded-full bg-white shadow-sm border border-gray-100 group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors">
                          {percentage}%
                        </span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-2 bg-gray-100 group-hover:bg-primary/10"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b bg-white/50 backdrop-blur-sm">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-5xl font-bold text-primary mb-2">
                    {stats.completionPercentage}%
                  </p>
                  <p className="text-gray-600">Overall Progress</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-xl p-6 text-center">
                  <p className="text-4xl font-bold text-yellow-600 mb-2">
                    {stats.completedLevels}/{stats.totalLevels}
                  </p>
                  <p className="text-gray-600">Chapters Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDashboard;