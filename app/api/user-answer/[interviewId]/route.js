import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { interviewId } = params;
    
    if (!interviewId) {
      return NextResponse.json(
        { error: "Interview ID is required" },
        { status: 400 }
      );
    }

    const userAnswer = await prisma.userAnswer.findFirst({
      where: {
        interviewId: interviewId,
      },
    });

    if (!userAnswer) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(userAnswer);
  } catch (error) {
    console.error("Error fetching interview data:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview data" },
      { status: 500 }
    );
  }
} 