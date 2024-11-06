import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export const GET = auth((req) => {
  const { auth } = req;

  if (auth?.user) {
    console.log(auth.user);
    return NextResponse.json(auth.user);
  }

  return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
});

export const POST = auth(async (req) => {
  const { auth } = req;

  if (!auth?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.json();
    const userDetails = auth.user;
    if (!userDetails) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = auth.user.id;

    const jobSeeker = await prisma.jobSeeker.upsert({
      where: { userId: userId },
      update: {
        phoneNumber: formData.phoneNumber,
        dateOfBirth: new Date(formData.dob).toISOString(),
        location: formData.location,
        collegeName: formData.collegeName,
        currentJobTitle: formData.currentJobTitle,
        currentCompany: formData.currentCompany,
        desiredJobTitle: formData.desiredJobTitle,
        desiredSalaryRange: formData.desiredSalaryRange,
        employmentType: formData.employmentType,
        skills: formData.skills,
        linkedinUrl: formData.linkedInUrl,
        resumeUrl: formData.resume ? formData.resume : null,
      },
      create: {
        userId: userId,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: new Date(formData.dob).toISOString(),
        location: formData.location,
        collegeName: formData.collegeName,
        currentJobTitle: formData.currentJobTitle,
        currentCompany: formData.currentCompany,
        desiredJobTitle: formData.desiredJobTitle,
        desiredSalaryRange: formData.desiredSalaryRange,
        employmentType: formData.employmentType,
        skills: formData.skills,
        linkedinUrl: formData.linkedInUrl,
        resumeUrl: formData.resume ? formData.resume : null,
      },
    });

    console.log(jobSeeker);

    return NextResponse.json({
      message: "Form submitted successfully",
      jobSeeker,
    });
  } catch (error) {
    console.log(error, "error from server");
    return NextResponse.json(
      { message: "Error submitting form", error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
});
