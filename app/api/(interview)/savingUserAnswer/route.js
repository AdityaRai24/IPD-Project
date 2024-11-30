// import { NextResponse } from "next/server";
// import prisma from "@/lib/db";
// import { chatSession } from "@/utils/GenminiAiModel";

// export async function POST(req, res) {
//   try {
//     const { interviewData, userAnswers } = await req.json();
    

//     console.log(interviewData, userAnswers);

//     const questionAnswersArray = interviewData.jsonMockResp;

//     const arrayFormat = [
//       {
//         modifiedResponse:
//           "I have worked extensively with Next.js in various projects, leveraging its server-side rendering (SSR) and static site generation (SSG) features to build efficient web applications. These features have allowed me to optimize the performance and SEO of websites. I also used API routes to handle backend logic directly within the Next.js framework, making it easier to manage the full-stack of the application. Additionally, I utilized dynamic imports to improve the load time by splitting the code into chunks, ensuring scalability and performance.",
//         questionFeedback:
//           "The response demonstrates a strong understanding of Next.js core features like SSR, SSG, and API routes. The mention of dynamic imports for code splitting is a good sign of performance awareness. The answer could be further improved by including specific project examples or metrics showing how these optimizations impacted the application.",
//         answerRating: "8",
//       },
//     ];

//     const feedbackPrompt = `${questionAnswersArray} this is the questions and answers of 
//     a ${interviewData.topic} interview which has
//      a difficulty of ${interviewData.difficulty}. A user gave the interview and this was his response in order ${userAnswers}.
     
//      Based on this give feedback for each question seperately in an array of objects. dont add anything before or after the array.
//       The format of the feedback array should be something like this ${arrayFormat}. The first field modified Response is modifiedRespones which is for correcting spelling
//       or grammatical mistakes in user's response...the user response is taken from mic and converted to text so there are chances of some mispronounciation
//       so if there are any correct it and return the same response.
//       second field is questionFeedback which is basically the feedback for response.
//       third field is answerRating which is basically rating user respones out of 10. do such only for the ${userAnswers}
//      `;

//     const result = await chatSession.sendMessage(feedbackPrompt);
//     const responseText = result.response.text();
//     const mockJsonResp = responseText
//       .replace(/^```json\n?/, "") // Remove opening ```json if it exists at the start
//       .replace(/\n?```$/, ""); // Remove closing ``` if it exists at the end

//     const parsedArray = JSON.parse(mockJsonResp);

//     try {
//       const response = await prisma.UserAnswer.create({
//         data: {
//           interviewId: interviewData.id,
//           feedbackArray: parsedArray,
//         },
//       });
//       console.log(response);
//       return NextResponse.json(response);
//     } catch (error) {
//       console.log(error);
//       return NextResponse.error({ msg: "something went wrong." });
//     }
//   } catch (error) {
//     console.log(error);
//     return NextResponse.error({ msg: "something went wrong." });
//   }
// }
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { chatSession } from "@/utils/GenminiAiModel";

export async function POST(req,res) {
  try {
    // Parse incoming request data
    const { interviewData, userAnswers } = await req.json();
    // console.log(userAnswers);

    // Validate input
    if (!interviewData || !userAnswers) {
      return NextResponse.json(
        { error: "Missing required interview data" }, 
        { status: 400 }
      );
    }

    // Construct detailed feedback prompt
    const feedbackPrompt = `You are an expert interviewer providing detailed technical interview feedback. 

Interview Details:
- Topic: ${interviewData.topic}
- Difficulty: ${interviewData.difficulty}

Interview Questions and Expected Responses: 
${JSON.stringify(interviewData.jsonMockResp)}

Candidate Responses:
${JSON.stringify(userAnswers)}

Please provide feedback in STRICT JSON format with these requirements:
- Return an array of objects
- Each object must have these exact keys: 
  1. modifiedResponse (corrected text version)
  2. questionFeedback (detailed analysis)
  3. answerRating (numeric rating out of 10)

Example Format:
[
  {
    "modifiedResponse": "Corrected ${JSON.stringify(userAnswers)} text with grammar/pronunciation fixes",
    "questionFeedback": "Detailed assessment of the response's technical depth, clarity, and relevance",
    "answerRating": "8"
  }
]

IMPORTANT: 
- Provide ONLY the JSON array
- No markdown code blocks
- No additional text before or after the array`;

    try {
      // Send message to AI and get response
      const result = await chatSession.sendMessage(feedbackPrompt);
      const responseText = await result.response.text();

      // Clean and parse JSON response
      const cleanedJsonResp = responseText
        .replace(/```(json)?/g, '')  // Remove code block markers
        .replace(/^\s*|\s*$/g, '')   // Trim whitespace
        .trim();

      let parsedFeedbackArray;
      try {
        parsedFeedbackArray = JSON.parse(cleanedJsonResp);
      } catch (parseError) {
        console.error('JSON Parsing Error:', parseError);
        console.log('Problematic Response:', responseText);
        console.log('Cleaned Response:', cleanedJsonResp);

        return NextResponse.json(
          { 
            error: 'Failed to parse AI response', 
            originalResponse: responseText 
          }, 
          { status: 500 }
        );
      }

      // Create database record
      const databaseResponse = await prisma.UserAnswer.create({
        data: {
          interviewId: interviewData.id,
          feedbackArray: parsedFeedbackArray,
        }
      });

      // Return successful response
      return NextResponse.json(databaseResponse, { status: 200 });

    } catch (aiProcessingError) {
      console.error('AI Processing Error:', aiProcessingError);
      return NextResponse.json(
        { error: 'Error processing AI feedback', details: aiProcessingError.message }, 
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Route Handler Error:', error);
    return NextResponse.json(
      { error: 'Unexpected server error', details: error.message }, 
      { status: 500 }
    );
  }
}