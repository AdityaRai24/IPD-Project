import { chatSession } from "@/utils/GenminiAiModel";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/db";

export async function POST(req) {
  try {
    // Ensure proper request body parsing
    if (!req.body) {
      return NextResponse.json({ 
        error: "Missing request body" 
      }, { status: 400 });
    }

    // Parse request body and validate description
    const body = await req.json();
    const description = body.description;

    if (!description || typeof description !== 'string') {
      return NextResponse.json({ 
        error: "Invalid or missing description" 
      }, { status: 400 });
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
    `;

    // Get response from AI model
    const result = await chatSession.sendMessage(prompt);
    const responseText = await result.response.text();

    // Clean up common issues that might make JSON invalid
    const cleanupResponse = (response) => {
      // Remove any markdown code blocks if they exist
      let cleaned = response.replace(/```json\s?|\s?```/g, '');
      
      // Remove any leading/trailing whitespace
      cleaned = cleaned.trim();
      
      // Remove any potential explanatory text before or after the JSON
      const firstBracket = cleaned.indexOf('[');
      const lastBracket = cleaned.lastIndexOf(']') + 1;
      if (firstBracket !== -1 && lastBracket !== -1) {
        cleaned = cleaned.slice(firstBracket, lastBracket);
      }

      return cleaned;
    };

    // Try to parse the JSON with error handling
    try {
      const cleanedResponse = cleanupResponse(responseText);
      const parsedResponse = JSON.parse(cleanedResponse);
      
      // Validate the structure
      if (!Array.isArray(parsedResponse)) {
        throw new Error('Response is not an array');
      }

      // Save to localStorage (if needed)
      // Note: This should be done on the client side instead
      // localStorage.setItem('current', JSON.stringify(parsedResponse));

      // Return the parsed and validated JSON
      return NextResponse.json(parsedResponse);

    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return NextResponse.json({
        error: "Failed to parse generated content",
        message: parseError.message
      }, { status: 500 });
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({
      error: "Failed to generate content",
      message: error.message
    }, { status: 500 });
  }
}