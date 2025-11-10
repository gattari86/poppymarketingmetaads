import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    const session = await getServerSession(authOptions);

    if (session) {
      redirect("/dashboard");
    }

    redirect("/auth/signin");
  } catch (error) {
    // If session check fails (e.g., missing NEXTAUTH_SECRET), redirect to signin
    console.error("Error in Home page:", error);
    redirect("/auth/signin");
  }
}
