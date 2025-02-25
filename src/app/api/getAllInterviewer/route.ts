import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const interviewers = await db.User.findMany({
      where:{
        type: "interviewer"
      }
    });
    return NextResponse.json(interviewers);
  } catch (error) {
    console.error("Error fetching interviewers:", error);
    return NextResponse.json({ error: "Failed to fetch interviewers" }, { status: 500 });
  }
}
