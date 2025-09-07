import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "@/utils/apiResponse";
export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return handleErrorResponse("All fields are required", 400);
    }

    // Check if user already exists
    const existingUser = await db("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    if (existingUser.length > 0) {
      return handleErrorResponse("This email already exist", 400);
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `INSERT INTO users (name, email, password) VALUES (?,?,?)`;
    // Insert the user into the database
    await db(query, [name, email, hashedPassword]);

    // Get inserted user ID
    const [newUser] = await db("SELECT id FROM users WHERE email = ?", [email]);
    const id = newUser.id;

    return handleSuccessResponse(
      { id, name, email },
      "Registration successful",
      201
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return handleErrorResponse("Internal server error", 500);
  }
}
