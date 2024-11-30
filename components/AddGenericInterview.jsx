// "use client";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { useState } from "react";
// import { Button } from "./ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { LoaderCircle } from "lucide-react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// const AddNewInterView = ({itemContent}) => {
//   const [openDialog, setOpenDialog] = useState(false);
//   const [topic,setTopic] = useState('');
//   const [noOfQuestions, setNoOfQuestions] = useState();
//   const [difficulty,setDifficulty] = useState();
//   const [loading, setLoading] = useState(false);
//   const [jsonResponse, setJsonResponse] = useState([]);
//   const demoOutput = [
//     {
//       question:
//         "Describe your experience with React.js and its core concepts like components, state management, and lifecycle methods.",
//       answer:
//         "I have [Number] years of experience working with React.js, developing [Project type/example]. I am proficient in creating reusable components, managing state using [State management library/method], and understanding the various lifecycle methods to optimize component behavior.",
//     },
//     {
//       question:
//         "Explain how you would use Firebase for authentication and database management in a React application.",
//       answer:
//         "Firebase offers a robust authentication system with various methods like email/password, social logins, and phone authentication. I would integrate it into my React app using the Firebase SDK, allowing users to sign up, sign in, and manage their accounts. For database management, I would leverage Firebase Realtime Database or Firestore, depending on the project's needs. Realtime Database is suitable for simple data structures with real-time updates, while Firestore offers more structured data storage and querying capabilities.",
//     },
//     {
//       question:
//         "How would you handle data fetching and error handling in a React application using Firebase?",
//       answer:
//         "I would use the Firebase SDK's built-in methods to fetch data from the database. For example, using getDoc() to retrieve a single document or getDocs() for retrieving a collection. To handle errors, I would implement error handling using try-catch blocks and display appropriate messages to the user. Additionally, I would consider using a loading state while data is being fetched to provide a better user experience.",
//     },
//     {
//       question:
//         "Explain the concept of state management in React and how you would approach it in a complex application.",
//       answer:
//         "State management in React refers to managing and updating data that affects the UI. For simple applications, local state within components is sufficient. However, in complex applications, we need a centralized state management solution. I have experience using [State management library/method] like Redux, Context API, or MobX. These libraries provide a structured way to manage state, making it easier to share data across components and avoid prop drilling.",
//     },
//     {
//       question:
//         "Describe a challenging bug you encountered while working with React and Firebase, and how you resolved it.",
//       answer:
//         "In a recent project, I encountered an issue where data was not updating correctly in real-time using Firebase Realtime Database. After investigation, I realized the problem was caused by [Describe the cause of the bug]. I resolved it by [Describe the solution you implemented].",
//     },
//   ];

//   const router = useRouter();

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     try {
      
//       setLoading(true);
//       const response = await axios.post(
//         "http://localhost:3000/api/generateInterview",
//         { topic, noOfQuestions, difficulty, demoOutput }
//       );
//       router.push(`/dashboard/jobSeeker/interview/${response.data.id}`);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handledifficulty = (difficulty) => {
//     setTopic(itemContent);
//     setDifficulty(difficulty)
//     // console.log(difficulty)
//   }

//   // console.log("the content is",topic)
//   return (
//     <div>
//       <Button
//         className="!py-6 !px-6 text-md border rounded-lg bg-primary transition duration-300 ease hover:scale-[1.03] hover:shadow-md cursor-pointer"
//         onClick={() => setOpenDialog(true)}
//       >
//         Mock Interview
//       </Button>
//       <Dialog open={openDialog}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle className="text-2xl">
//               Tell us more about job interview
//             </DialogTitle>
//             <DialogDescription className="text-primary font-semibold">
//               Topic : {itemContent}
//             </DialogDescription>
//           </DialogHeader>
//           <form onSubmit={onSubmit}>
//             <div className="flex flex-col gap-3">
//               <div>
//                 <label className="text-sm font-medium text-gray-700">
//                   No Of Questions
//                 </label>
//                 <Input
//                   placeholder="eg 5"
//                   required
//                   className="text-black mt-1"
//                   onChange={(event) => setNoOfQuestions(event.target.value)}
//                 />
//               </div>
//               <div>
//               <label className="text-sm font-medium text-gray-700">
//                  Choose your difficulty
//               </label>
//               <Button  onClick={()=>handledifficulty('Easy')}>Easy</Button>
//               <Button onClick={()=>handledifficulty('Medium')}>Medium</Button>
//               <Button onClick={()=>handledifficulty('Hard')}>Hard</Button>
//               </div>

//               <Button
//                 type="button"
//                 variant="ghost"
//                 onClick={() => setOpenDialog(false)}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={loading}>
//                 {loading ? (
//                   <>
//                     <LoaderCircle className="animate-spin w-4 h-4 mr-2" />
//                     Generating...
//                   </>
//                 ) : (
//                   "Start interview"
//                 )}
//               </Button>
//             </div>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default AddNewInterView;

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

const AddNewInterView = ({ itemContent }) => {
  const [openDialog, setOpenDialog] = useState(false);
 
  const [jobposition,setJobPostion] = useState()
  const [jobdescription,setJobDescription] = useState()
  const [yrsofexp,setYrsOfExp] = useState()

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


