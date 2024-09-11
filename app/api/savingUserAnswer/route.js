import { chatSession } from "@/utils/GenminiAiModel";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/db";

export async function POST(req, res) {
  try {
    const { question, correctAns, userAnswer,sessionId,mockInterviewQuestion,activeQuestionIndex ,mockJsonResp} =
      await req.json();

      const jsonFeedbackResp=JSON.parse(mockJsonResp)

    
      try {
        const response = await prisma.UserAnswer.create({
          data: {
          
            interviewId:sessionId,
            question: question,
            correctAns:correctAns,
            userAnswer:userAnswer,
            feedback:jsonFeedbackResp?.feedback,
            rating:jsonFeedbackResp?.rating.toString(),
            
          },
        });
        console.log(response)
        return NextResponse.json(response);
      } catch (error) {
        console.log(error);
        return NextResponse.error({ msg: "something went wrong." });
      }
    
  } catch (error) {
    console.log(error);
    return NextResponse.error({ msg: "something went wrong." });
  }}