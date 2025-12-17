"use server";

import APP_CONSTANTS from "@/lib/constants";
import axios from "axios";
import { cookies } from "next/headers";

interface TokenData {
  token_type: "Bearer";
  expires_in: number;
  access_token: string;
}

export async function generateAccessToken(): Promise<string> {
  try {
    const formData = new URLSearchParams();
    formData.append("grant_type", "client_credentials");
    formData.append(
      "client_id",
      String(APP_CONSTANTS.HOSTAWAY.ACCOUNT_ID ?? "")
    );
    formData.append(
      "client_secret",
      String(APP_CONSTANTS.HOSTAWAY.API_KEY ?? "")
    );
    formData.append("scope", "general");

    const response = await axios.post<TokenData>(
      `${APP_CONSTANTS.HOSTAWAY.BASE_URL}/accessTokens`,
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const tokenData: TokenData = response.data;

    return tokenData.access_token;
  } catch (error) {
    console.error("Failed to generate access token:", error);
    throw new Error("Authentication failed");
  }
}

export interface VerifyManagerState {
  error?: string | null;
}

export async function verifyManagerAccess(
  secret: string
): Promise<{ success: boolean }> {
  const ACCESS_SECRET = APP_CONSTANTS.MANAGEMENT_ACCESS_SECRET;

  if (secret === ACCESS_SECRET) {
    const authData = {
      authenticated: true,
      timestamp: Date.now(),
    };

    const cookieStore = await cookies();
    cookieStore.set("manager_auth", JSON.stringify(authData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: APP_CONSTANTS.AUTH_DURATION,
      path: "/",
    });

    return { success: true };
  }

  return { success: false };
}
