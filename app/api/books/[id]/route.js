import { NextResponse } from "next/server";
import { updateBook, deleteBook } from "@/app/lib/actions";

export async function GET(request, { params }) {
  // For simplicity, since getAllBooks exists, but for individual, we can use it
  // But better to add a getBookById function
  // For now, return error
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const formData = await request.formData();
    formData.append("id", id);
    const result = await updateBook(formData);
    if (result.success) {
      return NextResponse.json({ success: result.success });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error("Failed to update book:", error);
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const result = await deleteBook(id);
    if (result.success) {
      return NextResponse.json({ success: result.success });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error("Failed to delete book:", error);
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
  }
}
