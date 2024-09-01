"use client"
import React from 'react'
import { useEffect } from 'react'

function Interview({params}){

  useEffect(()=>{
    console.log(params.interviewId)
    getInterwiewDetails();
  },[])

  const getInterwiewDetails=async()=>{
    const result = await db.select().from(Question)
    .where(eq(Question.mockId,params.interviewId))
    console.log(result);
  }
  return (
    <div>
      Interview
    </div>
  )
}

export default Interview

