"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, Circle, BookOpen, Trophy } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { PieChartComp } from "./PieChart";

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

  const COLORS = ["#4CAF50", "#E0E0E0"];

  const pieData = [
    { name: "Completed", value: stats.completedLevels },
    { name: "Remaining", value: stats.totalLevels - stats.completedLevels },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <PieChartComp stats={stats} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Units Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-64 overflow-y-auto">
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
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Unit {index + 1}: {section.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {sectionCompletedLevels} of {section.levels.length}{" "}
                          chapters
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {sectionPercentage}%
                        </span>
                        {sectionPercentage === 100 ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoadmapDashboard;
