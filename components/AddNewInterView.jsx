
"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from 'lucide-react';
import axios from "axios";
import { useRouter } from "next/navigation";

const AddNewInterView = ({ itemContent,openDialog,setOpenDialog }) => {
  const [topic, setTopic] = useState('');
  const [noOfQuestions, setNoOfQuestions] = useState();
  const [difficulty, setDifficulty] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/generateInterview",
        { topic, noOfQuestions, difficulty }
      );
      router.push(`/dashboard/jobSeeker/interview/${response.data.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handledifficulty = (selectedDifficulty) => {
    setTopic(itemContent);
    setDifficulty(selectedDifficulty);
  }

  return (
    <div>
      <Button
        className="py-6 px-6 text-md border rounded-lg bg-primary transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
        onClick={() => setOpenDialog(true)}
      >
        Mock Interview
      </Button>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl p-6 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Tell us more about job interview
            </DialogTitle>
            <DialogDescription className="text-primary font-semibold mt-2">
              Topic: {itemContent}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No Of Questions
                </label>
                <Input
                  placeholder="eg 5"
                  required
                  className="w-full text-black"
                  onChange={(event) => setNoOfQuestions(event.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose your difficulty
                </label>
                <div className="flex space-x-3">
                  {['Easy', 'Medium', 'Hard'].map((level) => (
                    <Button
                      key={level}
                      type="button"
                      onClick={() => handledifficulty(level)}
                      className={`flex-1 ${difficulty === level ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'} hover:bg-primary/90 transition-colors`}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDialog(false)}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="px-4 py-2 bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <LoaderCircle className="animate-spin w-4 h-4" />
                    <span>Generating...</span>
                  </div>
                ) : (
                  "Start interview"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterView;


