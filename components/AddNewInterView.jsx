"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button, } from "./ui/button";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"




const AddNewInterView = () => {
  const[openDialog, setOpenDialog] = useState(false);
  const[jobPosition,setJobPosition] = useState();
  const[jobDescription,setJobDescription] = useState();
  const[experience,setExperience]=useState();

  const onSubmit=(e) => {
    e.preventDefault()
    console.log(jobDescription,jobPosition,experience)

    const inputPrompt ="Job position:"+jobPosition+"Job description"+jobDescription+"job experience:"+experience+"for the given data give 5 interview question and answers in JSON format. provide the questiona and ansewers in JSON format" 
  }

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
            <DialogTitle className="text-2xl">Tell us more about job interview</DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
              <div>
               
                <h2>Add details about your job position/role description and your years ofexperience</h2>
                <div className="mt-7 my-3">
                    <label>Jobe Role/ Job Decription</label>
                    <Input placeholder="eg App developer" required
                    onChange={(event) =>setJobPosition(event.target.value)}
                    />
                </div>
                <div className="my-3">
                    <label>Job Decription</label>
                  
                    <Textarea placeholder="eg React, Angular" required
                        onChange={(event) =>setJobDescription(event.target.value)}/>
                </div>
                <div className="mt-7 my-3">
                    <label>Experience</label>
                    <Input type="number" required
                    onChange={(event) =>setExperience(event.target.value)}
                    />
                </div>
              </div>
              <div className="flex gap-5 justify-end mt-2">
                <Button type="button"variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
                <Button type="submit">Start Interview</Button>
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
