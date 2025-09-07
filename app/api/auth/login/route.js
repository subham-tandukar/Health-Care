import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "@/utils/apiResponse";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return handleErrorResponse("Email and password are required", 400);
    }

    // Find user
    const [user] = await db("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) {
      return handleErrorResponse("Invalid email or password", 401);
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return handleErrorResponse("Invalid email or password", 401);
    }

    return handleSuccessResponse(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      "Login successful",
      200
    );
  } catch (error) {
    console.error("Login Error:", error);
    return handleErrorResponse("Internal server error", 500);
  }
}
