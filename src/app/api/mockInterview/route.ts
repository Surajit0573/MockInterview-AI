import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      console.log('Received request body:', body);
  
      const { jobDesc, jobPosition, jobexperience, MockResponse } = body;
    const user=await currentUser();
    if(!user){
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }
    console.log('user',user);

      const newMockInterview = await db.mockInterview.create({
        data: {
          jobDesc,
          jobPosition,
          jobexperience,
          MockResponse,
          userId:user.id
        },
      });
  
      return NextResponse.json(newMockInterview);
    } catch (error:any) {
      console.error('Error saving mock interview:', error.message || error);
      return NextResponse.json(
        { error: 'Failed to save mock interview' },
        { status: 500 }
      );
    }
  }
  
