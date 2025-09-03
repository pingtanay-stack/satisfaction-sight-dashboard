import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/20 via-background to-secondary-light/20 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="absolute top-6 left-6">
        <img 
          src="/lovable-uploads/c2503f0e-4514-4e32-b540-b9ea2e9d0512.png" 
          alt="Sysmex - Together for a better healthcare journey" 
          className="h-10 w-auto object-contain"
        />
      </div>

      <div className="text-center space-y-8 max-w-md mx-auto">
        <div className="space-y-4">
          <div className="text-8xl font-bold text-primary/20">404</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Page Not Found
          </h1>
          <p className="text-muted-foreground text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <a 
          href="/" 
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
