"use client";
import { Button } from "@/components/ui/button";
import { signOutFromApplication } from "@/lib/auth"; // Adjust the import path as necessary
export default function LogoutButton() {
    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            signOutFromApplication();
        } catch (error) {
        console.error("Logout failed", error);
        // Handle error (e.g., show a notification)
        }
    };
    
    return (
      <Button
        onClick={(e) => {
          e.preventDefault();
          handleLogout(e);
        }}
        variant="outline"
        size="sm"
        className="absolute bottom-4 left-4"
      >
        Logout
      </Button>
    );
}