
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-6">
        <ShieldAlert className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-lg text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        <div className="space-y-4">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline" 
            className="w-full"
          >
            Go Back
          </Button>
          <Button 
            onClick={() => navigate("/")} 
            className="w-full"
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
