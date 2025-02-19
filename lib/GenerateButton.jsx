import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const GenerateButton = ({ isGenerating, onClick }) => {
  return (
    <div className="flex justify-center">
      <Button
        size="lg"
        onClick={onClick}
        disabled={isGenerating}
        className="group relative overflow-hidden bg-white hover:bg-white/95 text-primary border-2 border-primary/20 
          hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300 
          disabled:opacity-50 disabled:hover:bg-white px-8 py-4 rounded-2xl"
      >
        <div className="relative z-10 flex items-center gap-3">
          <Sparkles 
            className={`w-5 h-5 transition-transform duration-500 
              ${isGenerating ? 'animate-spin' : 'group-hover:rotate-12'}`}
          />
          <span className="text-base font-semibold">
            {isGenerating ? 'Creating Your Journey...' : 'Design My Learning Path'}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent 
          translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </Button>
    </div>
  );
};

export default GenerateButton;