"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SearchIcon } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Home() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <div className=" h-full">
        <div className="flex items-center justify-center w-full h-[70vh]">
          <div className="flex items-center w-[65%] ">
            <div>
              <h1 className="text-7xl font-semibold text-center text-[#0B1215] tracking-normal leading-[1.15]">
                Hiring made<span className="text-primary/90"> intelligent</span>{" "}
                <img
                  src="/underline.svg"
                  className="w-[350px] top-[37%] right-96 absolute"
                />
                for modern businesses.
              </h1>
              <p className="max-w-[70%] text-[#0B1215] text-lg mt-4 block mx-auto text-center">
                Most recruitment processes are time-consuming and inefficient.
                We use AI to streamline hiring, helping you find the best talent
                efficiently
              </p>
              <div className="mt-8 flex relative items-center gap-2 max-w-[70%] mx-auto shadow-xl justify-center">
                <Input
                  ref={inputRef}
                  placeholder="Search for your dream job..."
                  className="py-8"
                />
                <Button className="py-6 flex items-center justify-center gap-2 absolute right-0 m-2">Search <SearchIcon /> </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
