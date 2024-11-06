import { NextResponse } from "next/server";
import { skills } from "@/app/(roadmap)/skills";

export async function POST(req, res) {
  try {
    const data = await req.json();
    const filteredData = skills
      .map((item) => {
        const minLevel = data[item.name];
        if (typeof minLevel === "undefined") return null; // Skip if minLevel is not defined

        return {
          name: item.name,
          levels: item.levels.filter((_, index) => index >= minLevel - 1),
        };
      })
      .filter(Boolean);

    return NextResponse.json(filteredData);
  } catch (error) {
    console.log(error);
    return NextResponse.error(error);
  }
}
