import { registerUser } from "@/app/lib/actions";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const result = await registerUser(formData);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}
