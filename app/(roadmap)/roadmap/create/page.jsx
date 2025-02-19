"use client";
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Code2, DatabaseZap, Server, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import GenerateButton from "@/lib/GenerateButton";

const getImagePath = (skillName) => {
  const specialCases = {
    "Node.js": "nodejs",
    "UI-UX": "ui-ux",
    ReactJS: "reactjs",
    NextJS: "nextjs",
    "API Development": "api",
    "System Design": "system-design",
    "Cloud Services": "cloud",
    "Database Design": "database",
    "Express.js": "expressjs",
    "System Architecture": "system-design",
  };

  const imageName =
    specialCases[skillName] ||
    skillName.toLowerCase().replace(/[/.]/g, "").replace(/\s+/g, "-");

  return `/logos/${imageName}.svg`;
};

const jobRoles = {
  frontend: {
    icon: <Code2 className="w-6 h-6" />,
    title: "Frontend Developer",
    description:
      "Create stunning user interfaces and interactive web experiences",
    skills: {
      HTML: 0,
      CSS: 0,
      JavaScript: 0,
      ReactJS: 0,
      NextJS: 0,
      TypeScript: 0,
      "UI-UX": 0,
      Redux: 0,
    },
  },
  backend: {
    icon: <DatabaseZap className="w-6 h-6" />,
    title: "Backend Developer",
    description: "Build robust server-side applications and APIs",
    skills: {
      "Node.js": 0,
      "Express.js": 0,
      "Database Design": 0,
      "API Development": 0,
      "System Design": 0,
      "Cloud Services": 0,
      Security: 0,
    },
  },
  fullstack: {
    icon: <Server className="w-6 h-6" />,
    title: "Full Stack Developer",
    description: "Master both frontend and backend development",
    skills: {
      HTML: 0,
      CSS: 0,
      JavaScript: 0,
      ReactJS: 0,
      "Node.js": 0,
      "Express.js": 0,
      "Database Design": 0,
      "API Development": 0,
      "System Architecture": 0,
    },
  },
};

const SkillSelector = () => {
  const [selectedRole, setSelectedRole] = useState("backend");
  const [selectedSkills, setSelectedSkills] = useState(jobRoles.backend.skills);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setSelectedSkills(jobRoles[role].skills);
    setError(null);
  };

  const handleSkillSelect = useCallback((item) => {
    setSelectedSkills((prev) => ({
      ...prev,
      [item]: prev[item] === 0 ? 1 : 0,
    }));
  }, []);

  const handleSkillLevel = useCallback((item, level) => {
    setSelectedSkills((prev) => ({
      ...prev,
      [item]: level,
    }));
  }, []);

  const renderStars = (item) => (
    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          onClick={() => handleSkillLevel(item, star)}
          fill={selectedSkills[item] >= star ? "gold" : "none"}
          stroke={selectedSkills[item] >= star ? "gold" : "currentColor"}
          className="cursor-pointer hover:scale-110 transition-transform"
        />
      ))}
    </div>
  );

  const handleGenerateRoadmap = async () => {
    const selectedCount = Object.values(selectedSkills).filter(
      (value) => value > 0
    ).length;
    if (selectedCount === 0) {
      setError("Please select at least one skill to generate a roadmap.");
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      const response = await axios.post(
        "/api/generate-roadmap",
        selectedSkills
      );
      localStorage.setItem("roadmap", JSON.stringify(response.data));
      router.push("/roadmap/generate");
    } catch (error) {
      console.error(error);
      setError("Failed to generate roadmap. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-b from-gray-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 my-3">
            Design Your <span className="text-primary">Learning Journey</span>
          </h1>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            Choose your path and skills to create a personalized learning
            roadmap tailored to your goals
          </p>
        </div>

        <Tabs
          value={selectedRole}
          onValueChange={handleRoleChange}
          className="space-y-5"
        >
          <div className="flex justify-center my-4">
            <TabsList className="inline-flex bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl shadow-sm border border-gray-200">
              {Object.entries(jobRoles).map(([key, role]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="relative px-6 py-2.5 rounded-xl text-sm font-medium transition-all
                    data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm
                    hover:text-primary/80 hover:bg-white/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="relative z-10">{role.icon}</span>
                    <span className="relative z-10">{role.title}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {Object.entries(jobRoles).map(([key, role]) => (
            <TabsContent key={key} value={key} className="space-y-6">
              <div className="text-center mb-8">
                <p className="text-gray-600 text-sm">{role.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.keys(role.skills).map((item) => (
                  <Card
                    key={item}
                    onClick={() => handleSkillSelect(item)}
                    className={`group hover:scale-[1.05]  cursor-pointer transition-all duration-200 
                      ${
                        selectedSkills[item] > 0
                          ? "border-primary/80 bg-white shadow-md"
                          : "border-gray-200 hover:border-primary/60 hover:bg-white"
                      }`}
                  >
                    <CardContent className="p-4 flex flex-col items-center gap-3">
                      <div className="w-14 h-14 p-2.5 rounded-xl bg-gray-50 group-hover:bg-white group-hover:shadow-sm transition-all duration-200">
                        <Image
                          src={getImagePath(item)}
                          width={64}
                          height={64}
                          alt={item}
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <h3 className="font-medium text-gray-700 text-sm">
                        {item}
                      </h3>
                      {selectedSkills[item] > 0 && (
                        <div className="mt-1">{renderStars(item)}</div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {error && (
          <div className="mt-6 p-3 rounded-lg bg-red-50 border border-red-100">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <GenerateButton
            isGenerating={isGenerating}
            onClick={handleGenerateRoadmap}
          />
        </div>
      </div>
    </div>
  );
};

export default SkillSelector;
