"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
	const { uid, email, name } = params;

	try {
		const userRecord = await db.collection("users").doc(uid).get();
		if (userRecord.exists) {
			return { success: false, error: "User already exists. Please log in." };
		}
		await db.collection("users").doc(uid).set({
			email,
			name,
		});

		return { success: true, message: "User created successfully" };
	} catch (e: any) {
		console.error("Error creating a user:", e);
		if (e.code === "auth/email-already-exists") {
			return { success: false, error: "Email already exists" };
		}
		return { success: false, error: "Failed to create an account" };
	}
}

export async function signIn(params: SignInParams) {
	const { email, idToken } = params;
	try {
		const userRecord = await auth.getUserByEmail(email);
		if (!userRecord) {
			return { success: false, error: "User not found" };
		}
		await setSessionCookie(idToken);
	} catch (e) {
		console.error(e);
		return { success: false, error: "Failed to sign in" };
	}
}

export async function setSessionCookie(idToken: string) {
	const cookieStore = await cookies();

	const sessionCookie = await auth.createSessionCookie(idToken, {
		expiresIn: ONE_WEEK * 1000,
	});

	cookieStore.set("session", sessionCookie, {
		maxAge: ONE_WEEK,
		httpOnly: true,
		path: "/",
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
	});
}

export async function getCurrentUser(): Promise<User | null> {
	const cookieStore = await cookies();
	const sessionCookie: any = cookieStore.get("session")?.value;

	if (!sessionCookie) return null;
	

	try {
		const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
		const userRecord = await db
			.collection("users")
			.doc(decodedClaims.uid)
			.get();
		if (!userRecord.exists) {
			return null;
		}
		return { ...userRecord.data(), id: userRecord.id } as User;
	} catch (e) {
		console.error("Error verifying session cookie:", e);
		return null;
	}
}

export async function isAuthenticated() {
	const user = await getCurrentUser();
	return !!user;
}
