import { getApiDocs } from "./swagger";
import { NextResponse } from "next/server";

export async function GET() {
  const spec = getApiDocs();
  return NextResponse.json(spec);
}
