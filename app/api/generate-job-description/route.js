import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const content = await req.json();


    return NextResponse.json("hi");
  } catch (error) {
    console.log(error)
    return NextResponse.error(error);
  }
}
