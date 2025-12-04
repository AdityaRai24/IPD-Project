export const dynamic = 'force-dynamic';
import prisma from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req,res){
    try {
        const url = new URL(req.url)
        const sessionId = url.searchParams.get("sessionId")
        console.log(sessionId)
        const result = await prisma.interview.findUnique({
            where:{
                id : sessionId
            }
        })
        // console.log(result)

        return NextResponse.json(result)
    } catch (error) {
        console.log(error)
        return NextResponse.error("something wen twong.")
    }
}