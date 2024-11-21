"use server";
import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const login = async (provider,isRegister) => {
  await signIn(provider, { redirectTo: isRegister ? "/roadmap" : "/" });
  revalidatePath("/");
};

export const logout = async () => {
  await signOut({ callbackUrl: "/" });
  revalidatePath("/")
  redirect("/")
};

export const loginWithCredentials = async (formData) => {
  const rawFormData = {
    emailId: formData.get("emailId"),
    password: formData.get("password"),
    isRegistering: "false",
  };

  try {
    await signIn("credentials", { ...rawFormData, redirectTo : "/" });
    revalidatePath("/");
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "AuthError":
          return { error: error.cause };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
};

export const registerWithCredentials = async (formData) => {
  const rawFormData = {
    emailId: formData.get("emailId"),
    password: formData.get("password"),
    isRegistering: "true",
  };

  try {
    await signIn("credentials", { ...rawFormData, redirectTo: "/roadmap" });
    revalidatePath("/");
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "AuthError":
          return { error: error.cause };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
};
