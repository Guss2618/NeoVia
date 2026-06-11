import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
  const filePath = path.join(process.cwd(), "data", "versoes.json");
  const file = await readFile(filePath, "utf-8");
  const versoes = JSON.parse(file);

  return NextResponse.json(versoes);
}
