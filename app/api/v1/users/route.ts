import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);
const secret = process.env.JWT_SECRET!;
const prisma = new PrismaClient();

const tokenBlacklist: Set<string> = new Set();

async function authenticateRequest(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  if (tokenBlacklist.has(token)) {
    return null;
  }

  try {
    const payload = jwt.verify(token, secret);
    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a list of users with pagination
 *     description: Retrieves a paginated list of users with optional search and filtering
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page (use 0 for all items)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering users
 *       - in: query
 *         name: firstName
 *         schema:
 *           type: string
 *         description: Filter by first name
 *       - in: query
 *         name: lastName
 *         schema:
 *           type: string
 *         description: Filter by last name
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by email
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       first_name:
 *                         type: string
 *                       last_name:
 *                         type: string
 *                       email:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     hasMore:
 *                       type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function GET(req: Request) {
  const user = await authenticateRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const searchTerm = url.searchParams.get("search") || "";
    const firstName = url.searchParams.get("firstName") || "";
    const lastName = url.searchParams.get("lastName") || "";
    const email = url.searchParams.get("email") || "";

    const whereClause: any = {
      AND: [],
    };

    if (searchTerm) {
      whereClause.AND.push({
        OR: [
          { first_name: { contains: searchTerm } },
          { last_name: { contains: searchTerm } },
          { email: { contains: searchTerm } },
        ],
      });
    }

    if (firstName) {
      whereClause.AND.push({ first_name: { contains: firstName } });
    }
    if (lastName) {
      whereClause.AND.push({ last_name: { contains: lastName } });
    }
    if (email) {
      whereClause.AND.push({ email: { contains: email } });
    }

    if (whereClause.AND.length === 0) {
      delete whereClause.AND;
    }

    if (pageSize === 0) {
      const users = await prisma.user.findMany({
        where: whereClause,
        orderBy: {
          id: "desc",
        },
      });
      return NextResponse.json({
        data: users,
        pagination: {
          total: users.length,
          page: 1,
          pageSize: users.length,
          totalPages: 1,
          hasMore: false,
        },
      });
    }

    const skip = (page - 1) * pageSize;
    const [total, users] = await Promise.all([
      prisma.user.count({
        where: whereClause,
      }),
      prisma.user.findMany({
        where: whereClause,
        take: pageSize,
        skip: skip,
        orderBy: {
          id: "desc",
        },
      }),
    ]);

    return NextResponse.json({
      data: users,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasMore: skip + users.length < total,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users." },
      { status: 500 }
    );
  }
}

/**
 * @openapi
 * /api/v1/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     description: Creates a new user with the provided information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid request data
 *       409:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { first_name, last_name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await prisma.user.create({
      data: { first_name, last_name, email, password: hashedPassword },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
    });

    return NextResponse.json({ data: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user." },
      { status: 500 }
    );
  }
}

/**
 * @openapi
 * /api/v1/users:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete all users
 *     description: Removes all users from the system (requires authentication)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All users deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function DELETE(req: Request) {
  const user = await authenticateRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.user.deleteMany();
    return NextResponse.json({ message: "All users deleted successfully." });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete users." },
      { status: 500 }
    );
  }
}

export async function invalidateToken(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No token provided." }, { status: 400 });
  }

  const token = authHeader.split(" ")[1];
  tokenBlacklist.add(token);

  return NextResponse.json({ message: "Token invalidated successfully." });
}
