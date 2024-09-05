import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export const GET = auth((req) => {
  const { auth } = req;

  if (auth?.user) {
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

    console.log(formData)

    const recruiter = await prisma.recruiter.upsert({
      where: { userId: userId },
      update: {
        companyName: formData.companyName,
        linkedinUrl: formData.linkedinUrl,
        companyWebsite: formData.companyWebsite,
        industry: formData.companyIndustry,
        companyLogo: formData.companyLogo ? formData.companyLogo : null,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
      },
      create: {
        companyName: formData.companyName,
        linkedinUrl: formData.linkedinUrl,
        companyWebsite: formData.companyWebsite,
        industry: formData.companyIndustry,
        companyLogo: formData.companyLogo ? formData.companyLogo : null,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        user: {
          connect: { id: userId },
        },
      },
    });

    console.log(recruiter);

    return NextResponse.json({
      message: "Form submitted successfully",
      recruiter,
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
