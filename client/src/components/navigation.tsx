import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="py-3 px-4 md:px-6 flex justify-between items-center bg-white shadow-sm">
      <div className="font-semibold text-lg">BU PMP/CAPM Review</div>
      <div className="flex space-x-4">
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
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary", 
            location === "/admin" ? "text-primary" : "text-muted-foreground"
          )}
        >
          Admin Dashboard
        </Link>
      </div>
    </nav>
  );
}