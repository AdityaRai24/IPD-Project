import { chatSession } from "@/utils/GenminiAiModel";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/db";

export async function POST(req, res) {
  try {
    const { topic, noOfQuestions, difficulty, demoOutput } = await req.json();


    const inputPrompt = `
    topic: ${topic}
    Difficulty: ${difficulty}
    depends on topic and difficulty give 
    Number of Questions: ${noOfQuestions}
    interview question along with answer in JSON format, give us question and answer field on JSON .Only return the array dont give whitespace unecessary.

      Important:
    1. Ensure the response is a valid JSON array
    2. Do not include any markdown code blocks or additional text
    3. Escape any special characters in strings
    4. Use double quotes for all keys and string values
    5. Do not include any comments or explanations outside the JSON structure
    `;

    const result = await chatSession.sendMessage(inputPrompt);
    const mockJsonResponse = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");

    const parsedJsonResponse = JSON.parse(mockJsonResponse);

    if (parsedJsonResponse) {
      console.log(parsedJsonResponse);
      try {
        console.log(topic,difficulty)
        const response = await prisma.interview.create({
          data: {
            mockId: uuidv4(),
            jsonMockResp: parsedJsonResponse,
            topic: topic,
            difficulty: difficulty,
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
