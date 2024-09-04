import { chatSession } from "@/utils/GenminiAiModel";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/db";

export async function POST(req, res) {
  try {
    const { jobPosition, jobDescription, experience, demoOutput } =
      await req.json();

    const inputPrompt =
      "Job position:" +
      jobPosition +
      "Job description" +
      jobDescription +
      " Years of Experience" +
      experience +
      "depends on Job Position, Job Description, Years of Experience give us " +
      process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +
      " interview question along with answer in JSON format, give us question and answer field on JSON .Only return the array dont give whitespace unecessary gve otuput in this format" +
      demoOutput;

    const result = await chatSession.sendMessage(inputPrompt);
    const mockJsonResponse = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");

    const parsedJsonResponse = JSON.parse(mockJsonResponse);

    if (mockJsonResponse) {
      try {
        const response = await prisma.interview.create({
          data: {
            mockId: uuidv4(),
            jsonMockResp: parsedJsonResponse,
            jobPosition:jobPosition,
            jobDescription:jobDescription,
            exp:experience,
          },
        });
        return NextResponse.json(response);
      } catch (error) {
        console.log(error);
        return NextResponse.error({ msg: "something went wrong." });
      }
    }
  } catch (error) {
    console.log(error);
    return NextResponse.error({ msg: "something went wrong." });
  }
}
