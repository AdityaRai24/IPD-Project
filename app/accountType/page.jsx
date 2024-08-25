import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BriefcaseBusiness, Handshake } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <>
      <div className="flex items-center justify-center gap-16 mt-32">
        <Card className="cursor-pointer w-[450px] h-[300px] hover:scale-[1.025] hover:border-2 hover:border-primary transition duration-300 ease-in shadow-lg">
          <CardHeader className="flex flex-col items-center justify-center">
            <BriefcaseBusiness className="h-16 w-16" />
            <h1 className="text-2xl font-bold ">Job Seeker</h1>
            <p className="text-gray-600">
              Utilize this platform to create a strong profile highlighting your
              skills and experience. Carefully apply to relevant job postings
              and engage proactively with recruiters. Leverage the features to
              stay informed about new opportunities.
            </p>
          </CardHeader>
        </Card>
        <Card className="cursor-pointer w-[450px] h-[300px] hover:scale-[1.025] hover:border-2 hover:border-primary transition duration-300 ease-in shadow-lg">
          <CardHeader className="flex flex-col items-center justify-center">
            <Handshake className="h-16 w-16 " />
            <h1 className="text-2xl font-bold ">Recruiter</h1>
            <p className="text-gray-600">
              Efficiently manage job postings, candidate screening, and
              selection using the platform's intuitive tools. Identify qualified
              candidates through the search and filtering capabilities. Provide
              timely feedback to foster a positive recruitment experience.
            </p>
          </CardHeader>
        </Card>
      </div>
    </>
  );
};

export default page;
