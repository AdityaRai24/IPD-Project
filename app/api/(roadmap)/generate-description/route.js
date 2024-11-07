import { chatSession } from "@/utils/GenminiAiModel";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/db";

export async function POST(req) {
  try {
    if (!req.body) {
      return NextResponse.json(
        {
          error: "Missing request body",
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const description = body.description;

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        {
          error: "Invalid or missing description",
        },
        { status: 400 }
      );
    }

    const prompt = `
    You are a JSON generator. Your task is to generate learning content for "${description}" in a strict JSON array format.
    Follow this exact structure without any additional text or markdown:
    [
      {
        "type": "introduction",
        "content": "2-3 sentences introduction"
      },
      {
        "type": "keyConcepts",
        "content": ["concept1", "concept2", "concept3"]
      },
      {
        "type": "codeExample",
        "content": "your code here",
        "language": "appropriate language"
      },
      {
        "type": "codeExplanation",
        "content": "Step by step explanation"
      },
      {
        "type": "bestPractices",
        "content": ["practice1", "practice2", "practice3"]
      },
      {
        "type": "commonMistakes",
        "content": ["mistake1", "mistake2", "mistake3"]
      },
      {
        "type": "practiceExercise",
        "content": "Exercise description",
        "starterCode": "Code template if applicable"
      },
      {
        "type": "resources",
        "content": [
          {
            "title": "Resource title",
            "url": "URL",
            "type": "documentation|video|tutorial"
          }
        ]
      }
    ]

    Important:
    1. Ensure the response is a valid JSON array
    2. Do not include any markdown code blocks or additional text
    3. Escape any special characters in strings
    4. Use double quotes for all keys and string values
    5. Do not include any comments or explanations outside the JSON structure
    6. Whenever you are writing some theory content. Try to write it as in detail as you can.
    7. Do not use back tick (\`\`) anywhere in your code.
    8. Make sure the links you give are updated as of 2024 and properly working.
    9. Do not add something like ** in your response.
    10. The reference links should be from the official documentation or the mdn docs or w3 schools or geeks for geeks.
    `;

    const result = await chatSession.sendMessage(prompt);
    const responseText = await result.response.text();

    const cleanupResponse = (response) => {
      let cleaned = response.replace(/```json\s?|\s?```/g, "");

      cleaned = cleaned.trim();

      const firstBracket = cleaned.indexOf("[");
      const lastBracket = cleaned.lastIndexOf("]") + 1;
      if (firstBracket !== -1 && lastBracket !== -1) {
        cleaned = cleaned.slice(firstBracket, lastBracket);
      }

      return cleaned;
    };

    try {
      const cleanedResponse = cleanupResponse(responseText);
      const parsedResponse = JSON.parse(cleanedResponse);

      if (!Array.isArray(parsedResponse)) {
        throw new Error("Response is not an array");
      }
      return NextResponse.json(parsedResponse);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return NextResponse.json(
        {
          error: "Failed to parse generated content",
          message: parseError.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate content",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
