import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const roadmap = await prisma.roadmap.findUnique({
      where: {
        id,
      },
    });

    if (!roadmap) {
      return NextResponse.json({ message: "Roadmap not found" }, { status: 404 });
    }

    if (roadmap.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(roadmap);
  } catch (error) {
    console.error("Error fetching roadmap:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { data } = body;

    const existingRoadmap = await prisma.roadmap.findUnique({
      where: { id },
    });

    if (!existingRoadmap) {
      return NextResponse.json({ message: "Roadmap not found" }, { status: 404 });
    }

    if (existingRoadmap.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updatedRoadmap = await prisma.roadmap.update({
      where: { id },
      data: {
        data,
      },
    });

    return NextResponse.json(updatedRoadmap);
  } catch (error) {
    console.error("Error updating roadmap:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
