import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check login status on mount and when location changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = sessionStorage.getItem("isAdminLoggedIn") === "true";
      setIsLoggedIn(loginStatus);
    };
    
    checkLoginStatus();
    
    // Add event listener for storage changes (in case of logout in another tab)
    window.addEventListener("storage", checkLoginStatus);
    
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, [location]);
  
  const handleLogout = () => {
    sessionStorage.removeItem("isAdminLoggedIn");
    setIsLoggedIn(false);
    setLocation("/");
  };
  
  const handleAdminClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setLocation("/login");
    }
  };

  return (
    <nav className="py-3 px-4 md:px-6 flex justify-between items-center bg-white shadow-sm">
      <div className="font-semibold text-lg">BU PMP/CAPM Review</div>
      <div className="flex items-center space-x-4">
        <Link 
          href="/" 
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary", 
            location === "/" ? "text-primary" : "text-muted-foreground"
          )}
        >
          RSVP Form
        </Link>
        <Link 
          href="/admin" 
          onClick={handleAdminClick}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary", 
            location === "/admin" ? "text-primary" : "text-muted-foreground"
          )}
        >
          Admin Dashboard
        </Link>
        
        {isLoggedIn && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
}