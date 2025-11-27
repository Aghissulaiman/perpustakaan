import { NextResponse } from "next/server";
import { getAllBooks, addBook } from "@/app/lib/actions";

export async function GET() {
  try {
    const books = await getAllBooks();
    return NextResponse.json(books);
  } catch (error) {
    console.error("Failed to fetch books:", error);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const result = await addBook(formData);
    if (result.success) {
      return NextResponse.json({ success: result.success });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error("Failed to add book:", error);
    return NextResponse.json({ error: "Failed to add book" }, { status: 500 });
  }
}
