import { NextResponse } from "next/server";

const tokenBlacklist: Set<string> = new Set(); // Example in-memory blacklist

/**
 * @swagger
 * /api/v1/logout:
 *   post:
 *     summary: Logout user by invalidating their JWT token
 *     description: Invalidates the provided JWT token by adding it to a blacklist
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully."
 *       400:
 *         description: No token provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No token provided."
 *       500:
 *         description: Server error during logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to log out."
 */
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No token provided." },
        { status: 400 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Add the token to the blacklist
    tokenBlacklist.add(token);

    return NextResponse.json(
      { message: "Logged out successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to log out." }, { status: 500 });
  }
}
