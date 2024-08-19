"use server";
import { signIn, signOut } from "@/lib/auth";
import db from "@/lib/db";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

export const login = async (provider) => {
  await signIn(provider, { redirect: "/" });
  revalidatePath("/");
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
  revalidatePath("/");
};



export const loginWithCredentials = async (formData) => {
  const rawFormData = {
    emailId: formData.get("emailId"),
    password: formData.get("password"),
    isRegistering: false,
  };

  try {
   await signIn("credentials", rawFormData);
    
  } catch (error) {
    console.log(error)
  }
    
};

export const registerWithCredentials = async (formData) => {
  const rawFormData = {
    emailId: formData.get("emailId"),
    password: formData.get("password"),
    isRegistering: true,
  };

  try {
    await signIn("credentials", rawFormData, { redirect: false });
  } catch (error) {
    console.log(error,"error in register credentials")
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignIn":
          return { error: "Invalid Credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
  revalidatePath("/");
};
