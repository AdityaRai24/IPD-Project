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
      // Try to get embeddings with error details if it fails
      // Using a more reliable embedding model
      const apiOutput = await hf.featureExtraction({
        model: "sentence-transformers/all-MiniLM-L6-v2",
        inputs: query.trim(),
      });
      
      if (!apiOutput) {
        throw new Error("No embedding output received");
      }
      
      queryEmbedding = Array.from(apiOutput);
      if (queryEmbedding.length === 0) {
        throw new Error("Empty embedding received");
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
      !details ||
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

    const inputPrompt = `You are a technical content creator specialized in creating in-depth blog articles.
     Create a comprehensive article about ${description}. While you are creating the article, make sure to include the following details and course : ${details}.

    Use the following references: ${retrievals}


    Structure the response as a JSON object with the following format:
    {
      "title": "Main title of the article",
      "description": "Brief overview of what will be covered",
      "sections": [
        {
          "type": "introduction",
          "title": "Introduction",
          "content": [
            {
              "type": "text",
              "content": "Introductory paragraph..."
            }
          ]
        },
        {
          "type": "concepts",
          "title": "Key Concepts",
          "content": [
            {
              "subtitle": "Important Concept 1",
              "type": "text",
              "content": "Explanation..."
            },
            {
              "type": "list",
              "items": ["Point 1", "Point 2", "Point 3"]
            }
          ]
        },
        {
          "type": "examples",
          "title": "Practical Examples",
          "content": [
            {
              "subtitle": "Example 1",
              "type": "code",
              "language": "javascript",
              "content": "// Code example here"
            },
            {
              "type": "text",
              "content": "Explanation of the code..."
            }
          ]
        }
      ]
    }

    Ensure each section is detailed and includes relevant examples where appropriate. Include code samples for technical topics.
    
    Return the data in a proper json format so that it is directly parsable. dont add anything before or after.Also generate a 5 question mcq quiz on this topic and return with this json object.
    `;

    const result = await chatSession.sendMessage(inputPrompt);
    const geminiResponse = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");

    return NextResponse.json(geminiResponse);
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
