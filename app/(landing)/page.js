"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Users, FileCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    redirect("/roadmap");
  }
 

  return (
    <div className="min-h-screen bg-pink-50 px-4 py-12 sm:px-6 mt-24 lg:px-8">
      <main className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Ace Your <span className="text-red-500">Placements</span> with
            Confidence
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
            Prepare smarter, interview better, and land your dream job with our
            comprehensive placement preparation platform.
          </p>
          <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
            <Button className="bg-red-500 text-white hover:bg-red-600">
              <Link href="/authenticate">Start Preparing Now</Link>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-16">
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<BookOpen className="h-6 w-6 text-red-500" />}
              title="Personalized Roadmaps"
              description="Get tailored study plans based on your target companies and roles."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6 text-red-500" />}
              title="Mock Interviews"
              description="Practice with AI-powered mock interviews simulating real company scenarios."
            />
            <FeatureCard
              icon={<FileCheck className="h-6 w-6 text-red-500" />}
              title="Skill Assessments"
              description="Evaluate your progress with comprehensive skill assessments and quizzes."
            />
          </div>
        </div>

        <div className="mt-20 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Ready to boost your placement chances?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Join thousands of students who have successfully landed their
              dream jobs using our platform.
            </p>
            <div className="mt-8">
              <Button className="bg-red-500 text-white hover:bg-red-600">
                <Link href="/authenticate">Sign Up for Free</Link>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
          {icon}
          <span className="ml-3">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">{description}</p>
      </CardContent>
    </Card>
  );
}
