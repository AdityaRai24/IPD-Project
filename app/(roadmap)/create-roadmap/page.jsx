"use client";
import { useRoadmapStore } from '@/store/useRoadmapStore';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function RoadmapPage() {
  const { roadmap, selectedSkills } = useRoadmapStore();
  const router = useRouter();

  if (!roadmap || !selectedSkills) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">No Roadmap Found</h2>
          <p className="text-gray-500 mt-2">Please generate a roadmap to view it here.</p>
        </div>
      </div>
    );
  }

  // Handle both array (new API) and object (legacy/potential) structures
  const roadmapItems = Array.isArray(roadmap) 
    ? roadmap 
    : Object.entries(roadmap).map(([name, levels]) => ({ name, levels }));

  return (
    <div className="container mx-auto p-8 max-w-5xl">
      <h1 className="text-4xl font-bold mb-8 text-primary">Your Learning Roadmap</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Selected Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedSkills).map(([skill, level]) => (
              <Badge key={skill} variant="secondary" className="text-base px-3 py-1">
                {skill} • {level}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {roadmapItems.map((item, index) => (
          <Card key={index} className="overflow-hidden border-l-4 border-l-primary">
            <CardHeader className="bg-gray-50/50 pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">
                  {index + 1}
                </span>
                {item.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid gap-4">
                {item.levels && item.levels.map((levelObj, idx) => (
                  <div key={idx} className="border-b last:border-0 pb-4 last:pb-0">
                    <h4 className="font-semibold text-lg text-gray-800 mb-2">
                      Level {levelObj.level}: {levelObj.description}
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4">
                      {levelObj.details && levelObj.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2 text-gray-600 text-sm">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 flex justify-center gap-4 pb-8">
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => router.push('/dashboard/jobSeeker')}
          className="px-8"
        >
          Go to Dashboard
        </Button>
        <Button 
          size="lg"
          onClick={() => router.push('/roadmap/generate')}
          className="px-8 bg-primary hover:bg-primary/90"
        >
          Start Learning Path
        </Button>
      </div>
    </div>
  );
}