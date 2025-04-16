import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ data: "GET" });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body);
  } catch (error) {
    console.error(error);
  }
  return NextResponse.json({ data: "POST" });
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    console.log(body);
  } catch (error) {
    console.error(error);
  }

  return NextResponse.json({ data: "PUT" });
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    console.log(body);
  } catch (error) {
    console.error(error);
  }
  return NextResponse.json({ data: "DELETE" });
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    console.log(body);
  } catch (error) {
    console.error(error);
  }

  return NextResponse.json({ data: "PATCH" });
}
