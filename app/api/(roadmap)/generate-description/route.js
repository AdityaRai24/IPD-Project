import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import { Pinecone } from "@pinecone-database/pinecone";
import { chatSession } from "@/utils/GenminiAiModel";

const hf = new HfInference(process.env.HF_TOKEN);
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY ?? "",
});

async function queryPineconeVectorStore(client, indexName, namespace, query) {
  try {
    if (!query.trim()) {
      throw new Error("Query string cannot be empty");
    }

    if (!process.env.HF_TOKEN) {
      throw new Error("HF_TOKEN environment variable is not set");
    }

    console.log("Fetching embedding for query:", query);
    
    let queryEmbedding = [];
    try {
      // WE MUST USE A 1024 DIMENSION MODEL TO MATCH YOUR PINECONE INDEX
      // BAAI/bge-large-en-v1.5 outputs 1024 dimensions
      const modelId = "BAAI/bge-large-en-v1.5"; 
      
      // Direct fetch call to Hugging Face API
      const response = await fetch(
        `https://router.huggingface.co/hf-inference/models/${modelId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: [query.trim()], 
            options: { wait_for_model: true }
          }),
          cache: "no-store", 
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HF API Error: ${response.status} - ${errorBody}`);
      }

      const result = await response.json();
      
      // Handle Hugging Face response variations (Nested arrays vs flat)
      // We need a single flat array of 1024 numbers
      if (Array.isArray(result) && Array.isArray(result[0])) {
          queryEmbedding = result[0]; // Extract inner array
      } else {
          queryEmbedding = result;
      }

      console.log(`Embedding generated. Dimensions: ${queryEmbedding.length}`);

      // DOUBLE CHECK DIMENSIONS BEFORE SENDING TO PINECONE
      if (queryEmbedding.length !== 1024) {
          throw new Error(`Dimension mismatch! Model returned ${queryEmbedding.length}, but Pinecone needs 1024.`);
      }

    } catch (embeddingError) {
      console.error("Hugging Face embedding error details:", embeddingError);
      
      // Try a different fallback model if the first one fails
      try {
        console.log("Trying fallback embedding model");
        const fallbackOutput = await hf.featureExtraction({
          model: "BAAI/bge-small-en-v1.5",
          inputs: query.trim(),
        });
        
        queryEmbedding = Array.from(fallbackOutput);
        console.log("Fallback embedding successful, length:", queryEmbedding.length);
      } catch (fallbackError) {
        console.error("Fallback embedding error:", fallbackError);
        // Fallback with simple keyword-based retrieval instead of failing completely
        console.log("Using keyword-based retrieval method");
        
        // Return a fallback response
        return `No vector-based retrieval available. Using keywords: ${query.split(" ").slice(0, 10).join(", ")}`;
      }
    }

    console.log("Query Embedding generated successfully, length:", queryEmbedding.length);

    const index = client.Index(indexName);
    let indexInfo;
    try {
      indexInfo = await index.describeIndexStats();
      console.log("Index Stats:", indexInfo);
    } catch (indexError) {
      console.error("Pinecone index error:", indexError);
      return "Error connecting to vector database. Using direct content generation.";
    }

    if (!indexInfo || Object.keys(indexInfo).length === 0) {
      console.log("Index not found or empty");
      return "No relevant information found in the vector database. Using general knowledge.";
    }

    let queryResponse;
    try {
      queryResponse = await index.namespace(namespace).query({
        topK: 5,
        vector: queryEmbedding,
        includeMetadata: true,
        includeValues: false,
      });
    } catch (queryError) {
      console.error("Pinecone query error:", queryError);
      return "Error searching vector database. Using direct content generation.";
    }

    console.log(
      "Pinecone Query Response:",
      JSON.stringify(queryResponse, null, 2)
    );

    if (!queryResponse || !queryResponse.matches) {
      return "<nomatches>";
    }

    const concatenatedRetrievals = queryResponse.matches
      .filter((match) => match.metadata?.chunk)
      .map(
        (match, index) => `\nResult ${index + 1}: \n ${match.metadata?.chunk}`
      )
      .join(". \n\n");

    return concatenatedRetrievals || "<nomatches>";
  } catch (error) {
    console.error("Error in queryPineconeVectorStore:", error);
    // Return a fallback response instead of throwing
    return `Failed to retrieve relevant information. Using general knowledge for query: ${query.substring(0, 100)}...`;
  }
}

export async function POST(req) {
  try {
    if (!req.body) {
      return NextResponse.json(
        { error: "Missing request body" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const description = body.description;
    const details = body.details;

    if (
      !description ||
      typeof description !== "string" ||
      typeof details !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid or missing description" },
        { status: 400 }
      );
    }

    const query = `Represent this for searching relevant passages:\n\n${description} ${details}`;
    const retrievals = await queryPineconeVectorStore(
      pinecone,
      "index-one",
      "testspace",
      query
    );

    const inputPrompt = `You are an expert technical educator.
     Write a comprehensive, engaging guide about "${description}".
     
     Context: ${details}
     
     Use these references: ${retrievals}

     **Tone:** Enthusiastic, clear, and practical. Include "Pro Tips" and "Common Pitfalls".

     **Output Format:**
     Return ONLY a valid JSON object with this structure:
     {
       "title": "Descriptive Title",
       "description": "Brief overview.",
       "sections": [
         {
           "type": "introduction",
           "title": "Introduction",
           "content": [
             { "type": "text", "content": "Intro paragraph..." }
           ]
         },
         {
           "type": "concepts",
           "title": "Core Concepts",
           "content": [
             { "type": "text", "content": "Explanation..." },
             { "type": "callout", "variant": "tip", "title": "Pro Tip", "content": "Tip text..." },
             { "type": "callout", "variant": "warning", "title": "Warning", "content": "Warning text..." }
           ]
         },
         {
           "type": "examples",
           "title": "Examples",
           "content": [
             { "type": "text", "content": "Example intro:" },
             { "type": "code", "language": "javascript", "content": "const x = 1;" },
             { "type": "text", "content": "Explanation..." }
           ]
         }
       ],
       "quiz": [
         {
           "type": "multiple-choice", 
           "question": "Question text?",
           "options": ["Option A", "Option B", "Option C", "Option D"],
           "correctAnswer": "Option A",
           "explanation": "Why A is correct."
         },
         {
           "type": "true-false",
           "question": "Statement is true?",
           "options": ["True", "False"],
           "correctAnswer": "True",
           "explanation": "Reasoning..."
         },
         {
           "type": "code-analysis",
           "question": "What does this code output?",
           "codeSnippet": "console.log(1 + '1');",
           "options": ["2", "11", "NaN", "Error"],
           "correctAnswer": "11",
           "explanation": "Type coercion explanation..."
         }
       ]
     }

     IMPORTANT: Return ONLY the raw JSON. No markdown formatting (no \`\`\`json). No extra text.
    `;

    let geminiResponseText = "";
    try {
      const result = await chatSession.sendMessage(inputPrompt);
      geminiResponseText = result.response.text();
    } catch (geminiError) {
      console.error("Gemini generation error:", geminiError);
      return NextResponse.json({
        title: description,
        description: "Content generation is currently unavailable. Please try again later.",
        sections: []
      });
    }

    // Robust JSON Extraction
    let cleanedResponse = geminiResponseText.trim();
    
    // Remove markdown code blocks
    if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.replace("```json", "").replace("```", "");
    } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.replace("```", "").replace("```", "");
    }
    
    // Find the first '{' and last '}'
    const firstBrace = cleanedResponse.indexOf('{');
    const lastBrace = cleanedResponse.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanedResponse = cleanedResponse.substring(firstBrace, lastBrace + 1);
    }

    try {
      const parsedJson = JSON.parse(cleanedResponse);
      return NextResponse.json(parsedJson);
    } catch (jsonError) {
      console.error("Invalid JSON from Gemini:", jsonError);
      console.log("Raw response:", geminiResponseText);
      
      // Fallback response to prevent UI crash
      return NextResponse.json({
        title: description,
        description: "We generated the content but had trouble formatting it.",
        sections: [
           {
            type: "introduction",
            title: "Content",
            content: [{ type: "text", content: geminiResponseText.replace(/[{}]/g, '') }] 
          }
        ]
      });
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
