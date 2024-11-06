"use client";
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Router, Star } from "lucide-react";
import { roles } from "../role";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Page = () => {
  const [selectedSkills, setSelectedSkills] = useState({});
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const router = useRouter();

  const handleSkillSelect = useCallback((item) => {
    setSelectedSkills((prev) => {
      if (item in prev) {
        const { [item]: _, ...rest } = prev;
        return rest;
      } else {
        return { ...prev, [item]: 1 };
      }
    });
  }, []);

  const handleSkillLevel = useCallback((item, level) => {
    setSelectedSkills((prev) => ({
      ...prev,
      [item]: level,
    }));
  }, []);

  const renderStars = (item) => {
    return (
      <div className="flex mt-2" onClick={(e) => e.stopPropagation()}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            onClick={() => handleSkillLevel(item, star)}
            fill={selectedSkills[item] >= star ? "gold" : "none"}
            stroke={selectedSkills[item] >= star ? "gold" : "currentColor"}
            className="cursor-pointer"
          />
        ))}
      </div>
    );
  };

  const handleGenerateRoadmap = async () => {
    try {
      setIsGenerating(true);
      const response = await axios.post(
        "http://localhost:3000/api/generate-roadmap",
        selectedSkills
      );
      localStorage.setItem("roadmap", JSON.stringify(response.data));
      setTimeout(() => {
        router.push("/roadmap/generate");
      });
      setIsGenerating(false);
    } catch (error) {
      console.log(error);
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-8 mx-auto max-w-[80%] mt-16">
        {roles[0].skills.map((item) => (
          <div
            key={item}
            onClick={() => handleSkillSelect(item)}
            className={`bg-white shadow shadow-primary
              ${item in selectedSkills ? "border-2 border-primary" : ""}
              flex flex-col items-center justify-center cursor-pointer rounded-md w-[300px] h-[150px] p-4`}
          >
            {/* <Image src="/logos/html.png" width={100} height={100} alt="logo" /> */}
            <div>{item}</div>
            {item in selectedSkills && renderStars(item)}
          </div>
        ))}
      </div>
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      <div className="flex justify-center gap-4 mt-8">
        <Button onClick={() => handleGenerateRoadmap()} disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate Roadmap"}
        </Button>
      </div>
    </>
  );
};

export default Page;
