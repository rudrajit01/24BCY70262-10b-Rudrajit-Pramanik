import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const key = new TextEncoder().encode(JWT_SECRET);

interface TokenPayload {
  [key: string]: any;
  userId: string;
  email: string;
  name: string;
}

export async function signToken(payload: TokenPayload): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(key);

  return token;
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const verified = await jwtVerify(token, key);
    return verified.payload as TokenPayload;
  } catch (error) {
    return null;
  }
}
