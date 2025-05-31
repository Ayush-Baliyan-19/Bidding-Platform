import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const signOutFromApplication = async () => {
  try {
    // Assuming you have a Firebase auth instance
    await signOut(auth);
    console.log("User signed out successfully");
    // Optionally, you can redirect the user or clear any local state
    // For example, if using Next.js, you might redirect to the login page
    window.location.href = "/"; // Uncomment if you want to redirect
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
export { signOutFromApplication };
export default signOutFromApplication;
