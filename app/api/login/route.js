import { loginUser } from "@/app/lib/actions";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const user = await loginUser(formData);

    return new Response(JSON.stringify({ message: "Login berhasil", user }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}
