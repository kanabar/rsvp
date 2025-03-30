import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import RSVPForm from "@/pages/RSVPForm";
import Dashboard from "@/pages/Dashboard";
import LoginPage from "@/pages/LoginPage";
import Navigation from "@/components/navigation";

// Protected route wrapper
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isAdminLoggedIn") === "true";
    if (!isLoggedIn) {
      setLocation("/login");
    }
  }, [setLocation]);
  
  const isLoggedIn = sessionStorage.getItem("isAdminLoggedIn") === "true";
  return isLoggedIn ? <Component /> : null;
}

function Router() {
  return (
    <>
      <Navigation />
      <Switch>
        <Route path="/" component={RSVPForm} />
        <Route path="/login" component={LoginPage} />
        <Route path="/admin">
          <ProtectedRoute component={Dashboard} />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
