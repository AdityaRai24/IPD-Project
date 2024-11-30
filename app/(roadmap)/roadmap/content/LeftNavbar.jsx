"use client";
import { StepForward } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useState } from "react";

const LeftNavbar = () => {
  const [roadmap, setRoadmap] = useState([]);
  const router = useRouter();
  const topic = useSearchParams().get("topic");

  useEffect(() => {
    const content = JSON.parse(localStorage.getItem("roadmap"));
    setRoadmap(content);
  }, []);

  console.log(roadmap)

  return (
    <div
      className=" max-h-screen overflow-y-auto pb-16 fixed max-w-[20%]"
      style={{ scrollbarWidth: "thin" }} // Optional custom scrollbar styling for Firefox
    >
      {roadmap?.map((item, index) => {
        return (
          <div
            key={index}
            className="px-5 max-w-[95%] mx-auto py-3 border-b border-gray-700"
          >
            <p className="font-medium text-gray-700">UNIT {index + 1}</p>
            <h2 className="font-bold text-xl">{item.name}</h2>
            {item.levels.map((levelItem, levelIndex) => {
              return (
                <div
                  key={levelIndex}
                  onClick={() =>
                    router.push(
                      `/roadmap/content?topic=${levelItem.description}`
                    )
                  }
                  className="flex items-center justify-center gap-2"
                >
                  <StepForward size={16} />{" "}
                  <p
                    className={`${
                      topic === levelItem.description
                        ? "font-medium text-black"
                        : " text-gray-500"
                    } truncate cursor-pointer`}
                  >
                    {levelItem.description}
                  </p>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default LeftNavbar;
