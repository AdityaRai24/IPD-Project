"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const page = () => {
  const [selectedSkills, setSelectedSkills] = useState({
    HTML: 0,
    CSS: 0,
    JavaScript: 0,
    ReactJS: 0,
    TailwindCSS: 0,
    NextJS: 0,
    "Framer Motion": 0,
    "Shadcn UI": 0,
  });

  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const router = useRouter();

  const handleSkillSelect = useCallback((item) => {
    setSelectedSkills((prev) => {
      if (item in prev && prev[item] === 0) {
        return { ...prev, [item]: 1 }; // Set skill level to 1 if not already selected
      } else {
        return { ...prev, [item]: 0 }; // Reset level if deselected
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
      <div className="flex" onClick={(e) => e.stopPropagation()}>
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
      setError("Failed to generate roadmap. Please try again.");
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-8 mx-auto max-w-[80%] mt-16">
        {Object.keys(selectedSkills).map((item) => (
          <div
            key={item}
            onClick={() => handleSkillSelect(item)}
            className={`bg-white shadow shadow-primary
          ${selectedSkills[item] > 0 ? "border-2 border-primary" : ""}
          flex flex-col items-center gap-1 justify-center cursor-pointer rounded-md w-[300px] h-[150px] p-4`}
          >
            <Image
              src={`/logos/${item}.svg`}
              width={70}
              height={70}
              alt={item}
            />
            <h2 className="font-medium text-base tracking-wide">{item}</h2>
            {selectedSkills[item] > 0 && renderStars(item)}
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

export default page;
