"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, BriefcaseBusiness, Handshake } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const page = () => {
  const [selected, setSelected] = useState("");

  const router = useRouter()

  return (
    <div className="mt-24">
      <h1 className="text-center text-4xl font-bold tracking-normal">
        Choose your <span className="text-primary">Account Type</span>
        <img
          src="/dual-underline.svg"
          className="w-[190px] absolute right-[35%]"
          alt=""
        />
      </h1>

      <div className="flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-5 max-w-xl mt-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div
              onClick={() => setSelected("job-seeker")}
              className={cn("hover:scale-[1.02] transition duration-200 border-2  hover:border-primary ease-in  rounded-lg shadow-md p-3 flex cursor-pointer items-center justify-center gap-2",
                selected === "job-seeker" ? "border-primary scale-[1.02]" : "border-transparent"
              )}
            >
              <div className="bg-white p-3 rounded-lg">
                <BriefcaseBusiness className="size-8" />
              </div>
              <div>
                <h1 className="text-md font-bold tracking-normal">
                  I'm a Job Seeker
                </h1>
                <p className="text-sm text-[#5a5a5a] font-medium">
                  Find and apply for job opportunities that match your skills
                  and career goals.
                </p>
              </div>
            </div>

            <div
              onClick={() => setSelected("recruiter")}
              className={cn("hover:scale-[1.02] transition duration-200 border-2  hover:border-primary ease-in  rounded-lg shadow-md p-3 flex cursor-pointer items-center justify-center gap-2",
                selected === "recruiter" ? "border-primary scale-[1.02]" : "border-transparent"
              )}
            >
              <div className="bg-white p-3 rounded-lg">
                <Handshake className="size-8" />
              </div>
              <div>
                <h1 className="text-md font-bold tracking-normal">
                  I'm a Recruiter
                </h1>
                <p className="text-sm text-[#5a5a5a] font-medium">
                  Post job listings and discover qualified candidates to fill
                  your open positions.
                </p>
              </div>
            </div>
          </div>
          <Button onClick={() => {router.push(`/onboarding/${selected}`)}} className="w-full mt-4 active:scale-[0.99] hover:scale-[1.01] transition duration-300 ease-in">
            Continue <ArrowRight className="size-4 ml-2" />{" "}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
