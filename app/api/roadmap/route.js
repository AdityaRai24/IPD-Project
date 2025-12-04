import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, data } = body;

    if (!title || !data) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const roadmap = await prisma.roadmap.create({
      data: {
        userId: session.user.id,
        title,
        data,
      },
    });

    return NextResponse.json(roadmap);
  } catch (error) {
    console.error("Error creating roadmap:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const roadmaps = await prisma.roadmap.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        data: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(roadmaps);
  } catch (error) {
    console.error("Error fetching roadmaps:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
