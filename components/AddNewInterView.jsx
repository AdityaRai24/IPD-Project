"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChatSession } from "@google/generative-ai";
import { chatSession } from "@/utils/GenminiAiModel";
import { LoaderCircle } from "lucide-react";
import moment from "moment/moment";
import { useRouter } from "next/router";
import prisma from "@/lib/db";
import axios from "axios";

const AddNewInterView = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDescription, setJobDescription] = useState();
  const [experience, setExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const demoOutput = [
    {
      question:
        "Describe your experience with React.js and its core concepts like components, state management, and lifecycle methods.",
      answer:
        "I have [Number] years of experience working with React.js, developing [Project type/example]. I am proficient in creating reusable components, managing state using [State management library/method], and understanding the various lifecycle methods to optimize component behavior.",
    },
    {
      question:
        "Explain how you would use Firebase for authentication and database management in a React application.",
      answer:
        "Firebase offers a robust authentication system with various methods like email/password, social logins, and phone authentication. I would integrate it into my React app using the Firebase SDK, allowing users to sign up, sign in, and manage their accounts. For database management, I would leverage Firebase Realtime Database or Firestore, depending on the project's needs. Realtime Database is suitable for simple data structures with real-time updates, while Firestore offers more structured data storage and querying capabilities.",
    },
    {
      question:
        "How would you handle data fetching and error handling in a React application using Firebase?",
      answer:
        "I would use the Firebase SDK's built-in methods to fetch data from the database. For example, using getDoc() to retrieve a single document or getDocs() for retrieving a collection. To handle errors, I would implement error handling using try-catch blocks and display appropriate messages to the user. Additionally, I would consider using a loading state while data is being fetched to provide a better user experience.",
    },
    {
      question:
        "Explain the concept of state management in React and how you would approach it in a complex application.",
      answer:
        "State management in React refers to managing and updating data that affects the UI. For simple applications, local state within components is sufficient. However, in complex applications, we need a centralized state management solution. I have experience using [State management library/method] like Redux, Context API, or MobX. These libraries provide a structured way to manage state, making it easier to share data across components and avoid prop drilling.",
    },
    {
      question:
        "Describe a challenging bug you encountered while working with React and Firebase, and how you resolved it.",
      answer:
        "In a recent project, I encountered an issue where data was not updating correctly in real-time using Firebase Realtime Database. After investigation, I realized the problem was caused by [Describe the cause of the bug]. I resolved it by [Describe the solution you implemented].",
    },
  ];

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/generateInterview",
        { jobPosition, jobDescription, experience, demoOutput }
      );
      // console.log(response.data.jsonMockResp);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="p-10 w-[250px] h-[150px]border rounded-lg bg-primary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className=" text-lg text-center text-white">+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about job interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add details about your job position/role description and
                    your years ofexperience
                  </h2>
                  <div className="mt-7 my-3">
                    <label>Jobe Role/ Job Decription</label>
                    <Input
                      placeholder="eg App developer"
                      required
                      onChange={(event) => setJobPosition(event.target.value)}
                    />
                  </div>
                  <div className="my-3">
                    <label>Job Decription</label>

                    <Textarea
                      placeholder="eg React, Angular"
                      required
                      onChange={(event) =>
                        setJobDescription(event.target.value)
                      }
                    />
                  </div>
                  <div className="mt-7 my-3">
                    <label>Experience</label>
                    <Input
                      type="number"
                      required
                      onChange={(event) => setExperience(event.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-5 justify-end mt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" />
                        'Generating from Ai'
                      </>
                    ) : (
                      "Start interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterView;
