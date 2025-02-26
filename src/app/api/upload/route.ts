import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";
import { PrismaClient } from "@prisma/client";
import { db } from "@/lib/db";

const prisma = new PrismaClient();

interface Experience {
  userId: string;
  CompanyName?: string;
  Role: string;
  Description?: string;
  Duration?: string;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const uploadedFiles = formData.getAll("filepond");

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return NextResponse.json({ error: "No files uploaded." }, { status: 400 });
    }

    const uploadedFile = uploadedFiles[0]; // First uploaded file

    if (!(uploadedFile instanceof File)) {
      return NextResponse.json({ error: "Invalid file format." }, { status: 400 });
    }

    // Generate unique filename
    const fileName = uuidv4();
    const tempFilePath = `./tmp/${fileName}.pdf`;

    // Convert and save file
    const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());
    await fs.writeFile(tempFilePath, fileBuffer);

    // Parse PDF
    const parsedText = await parsePDF(tempFilePath);

    if (!parsedText) {
      return NextResponse.json({ error: "Failed to parse PDF." }, { status: 500 });
    }

    // Extract user details
    const linkedin = extractMatch(/linkedin\.com\/in\/\S+/, parsedText);
    const github = extractMatch(/github\.com\/\S+/, parsedText);
    const skills = extractSkills(parsedText);
    const experiences = extractExperience(parsedText, "user_generated_id"); // Replace with actual userId

    // Save extracted experiences in database
    if (experiences.length > 0) {
      await saveExperiences(experiences);
    }

    // Construct user object
    const userData = {
      name: "Surajit Maity",
      email: "sibu23122003@gmail.com",
      Linkedin: linkedin,
      Github: github,
      Skills: skills,
      Experience: experiences,
    };

    console.log("Extracted User Data:", userData);

    return NextResponse.json({ userData, fileName });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * Function to parse a PDF file and return its text content.
 */
async function parsePDF(filePath: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1);

    pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()));

    pdfParser.loadPDF(filePath);
  });
}

/**
 * Function to extract LinkedIn and GitHub links from text.
 */
function extractMatch(pattern: RegExp, text: string): string | null {
  const match = text.match(pattern);
  return match ? match[0] : null;
}

/**
 * Function to extract skills from parsed text.
 */
function extractSkills(text: string): string[] {
  const skillsMatch = text.match(/Technical Skills\s*([\s\S]*?)\s*Projects/);
  return skillsMatch
    ? skillsMatch[1]
        .replace(/Languages:|Frontend:|Backend:|Database:/g, "")
        .split(/\s*,\s*|\n|\s+/)
        .filter((skill) => skill.trim() !== "")
    : [];
}

/**
 * Function to extract experience details from text.
 */
function extractExperience(text: string, userId: string): Experience[] {
  const experienceMatch = text.match(/Experience\s*([\s\S]*)/);
  if (!experienceMatch) return [];

  return experienceMatch[1]
    .split("\n")
    .filter((line) => line.includes("|"))
    .map((exp) => {
      const [role, companyWithDuration] = exp.split("|").map((s) => s.trim());
      const [company, duration] = companyWithDuration.split(/\s(?=\d{4}$)/); // Extract year if present

      return {
        userId,
        Role: role,
        CompanyName: company || undefined,
        Duration: duration || undefined,
        Description: "", // Placeholder for now
      };
    });
}

/**
 * Function to save experience data in the Prisma database.
 */
async function saveExperiences(experiences: Experience[]) {
  await db.experience.createMany({
    data: experiences,
  });
}

