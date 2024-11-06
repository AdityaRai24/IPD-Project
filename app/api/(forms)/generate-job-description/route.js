import { chatSession } from "@/utils/GenminiAiModel";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const { formDetails, additionalDetails } = await req.json();

    const {
      jobTitle,
      jobType,
      industry,
      salary,
      experience,
      jobDescription,
      state,
      city,
      requiredSk,
    } = formDetails;

    const demoOutput = `
<p>We're seeking a talented and dedicated Part-Time Web Developer to join our team. As a Web Developer, you'll play a crucial role in designing, developing, and maintaining high-quality web applications using Next.js, TypeScript, and MongoDB.</p>
<p><strong>Responsibilities:</strong></p>
<ul>
    <li>Develop and maintain robust web applications using Next.js, TypeScript, and MongoDB.</li>
    <li>Collaborate with designers and other team members to create intuitive and user-friendly interfaces.</li>
    <li>Write clean, efficient, and well-structured code that adheres to best practices.</li>
    <li>Optimize web applications for performance and scalability.</li>
    <li>Troubleshoot and resolve technical issues.</li>
    <li>Stay up-to-date with the latest web development technologies and trends.</li>
</ul>
<p><strong>Requirements:</strong></p>
<ul>
    <li>Strong proficiency in Next.js, TypeScript, and MongoDB.</li>
    <li>Experience with modern JavaScript frameworks and libraries.</li>
    <li>Understanding of web development principles and best practices.</li>
    <li>Ability to work independently and as part of a team.</li>
    <li>Strong problem-solving and analytical skills.</li>
    <li>Excellent communication and interpersonal skills.</li>
</ul>
<p><strong>Preferred Qualifications:</strong></p>
<ul>
    <li>Experience with other JavaScript frameworks (e.g., React, Angular, Vue).</li>
    <li>Familiarity with cloud platforms (e.g., AWS, GCP, Azure).</li>
    <li>Knowledge of DevOps practices and tools.</li>
</ul>
<p><strong>Benefits:</strong></p>
<ul>
    <li>Flexible working hours to accommodate your schedule.</li>
    <li>Opportunity to work on exciting projects and learn new technologies.</li>
    <li>Competitive compensation.</li>
</ul>
<p>If you're a passionate and skilled web developer looking for a part-time opportunity, we encourage you to apply. Please submit your resume and portfolio to [email protected]</p>`;

    const inputPrompt = `Generate job description for these details...Job Title : ${jobTitle}, jobType : ${jobType}
    industry : ${industry}, salary : ${salary}, experience : ${experience}, jobDescription : ${jobDescription}, state : ${state}, city : ${city}, requiredSkills : ${requiredSk}, ${additionalDetails}

    Output should be in a form of this ${demoOutput}.It can follow different format but it should be in an html form...that is in the form of html so that i can render it in my tiptap text editor.Dont add any explaination , notes or other tags before or after the output...just return the html. 
    `;

    const result = await chatSession.sendMessage(inputPrompt);
    const finalHtml = result.response.text()

    return NextResponse.json(finalHtml);
  } catch (error) {
    console.log(error);
    return NextResponse.error(error);
  }
}
