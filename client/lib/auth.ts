import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const signOutFromApplication = async () => {
  try {
    // Assuming you have a Firebase auth instance
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
export { signOutFromApplication };
export default signOutFromApplication;
