import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  PlusCircle,
  Calendar,
  ChevronRight,
  Map,
  Clock,
  CheckCircle2
} from "lucide-react";
import { useSession } from "next-auth/react";
import { roadmapService } from "@/services/roadmapService";

const RoadmapDashboard = () => {
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const data = await roadmapService.getRoadmaps();
      setRoadmaps(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load roadmaps");
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (roadmapData) => {
    if (!roadmapData || !Array.isArray(roadmapData)) return 0;
    
    const totalLevels = roadmapData.reduce(
      (total, section) => total + (section.levels?.length || 0),
      0
    );
    
    if (totalLevels === 0) return 0;

    const completedLevels = roadmapData.reduce(
      (total, section) =>
        total + (section.levels?.filter((level) => level.completed)?.length || 0),
      0
    );

    return Math.round((completedLevels / totalLevels) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading your roadmaps...</p>
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
              <p className="text-gray-600">Manage your learning paths</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push("/roadmap/create")}
                className="gap-2 rounded-xl px-6 py-5 text-base font-medium bg-primary hover:bg-primary/90"
              >
                <PlusCircle className="w-5 h-5" />
                Create New Roadmap
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
              <Map className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No roadmaps yet</h3>
              <p className="text-gray-500 mb-6">Start your first learning journey today!</p>
              <Button onClick={() => router.push("/roadmap/create")}>
                Create Roadmap
              </Button>
            </div>
          ) : (
            roadmaps.map((roadmap) => {
              const progress = calculateProgress(roadmap.data);
              return (
                <Card 
                  key={roadmap.id} 
                  className="group hover:shadow-md transition-all cursor-pointer border-gray-200 hover:border-primary/50"
                  onClick={() => router.push(`/roadmap/${roadmap.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{roadmap.title}</span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Created {new Date(roadmap.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600 font-medium">Progress</span>
                      <span className={`font-bold ${progress === 100 ? 'text-green-600' : 'text-primary'}`}>
                        {progress}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${progress === 100 ? 'bg-green-500' : 'bg-primary'}`}
                        style={{ width: `${progress}%` }}
                      /> 
                    </div>
                    {progress === 100 && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-green-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapDashboard;