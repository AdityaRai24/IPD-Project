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

    const recruiterId = auth.user.id;

    const Jobpost = await prisma.Jobpost.upsert({
      where: { recruiterId: recruiterId },
      update: {
        contactname: formData.contactName,
        contactnumber: formData.contactPhone,
        contactemail: formData.contactEmail,
        title: formData.jobTitle,
        type: formData.jobType,
        industry: formData.industry,
        salary: formData.salary,
        workexp: formData.experience,
        state: formData.State,
        city: formData.City,
        skills: formData.requiredskills,
        description: formData.jobDescription,
      },
      create: {
        recruiterId: recruiterId,
        contactname: formData.contactName,
        contactnumber: formData.contactPhone,
        contactemail: formData.contactEmail,
        title: formData.jobTitle,
        type: formData.jobType,
        industry: formData.industry,
        salary: formData.salary,
        workexp: formData.experience,
        state: formData.State,
        city: formData.City,
        skills: formData.requiredskills,
        description: formData.jobDescription,
      },
    });
    console.log(Jobpost);

    return NextResponse.json({
      message: "Form submitted successfully",
      Jobpost,
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
