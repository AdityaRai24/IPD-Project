import prisma from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req,res){
    try {
      const result = await prisma.UserAnswer.findMany();
    //   console.log(result)

        return NextResponse.json(result)
    } catch (error) {
        console.log(error)
        return NextResponse.error("something wen twong.")
    }
}