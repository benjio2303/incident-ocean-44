
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/ui/Navbar";
import { useAuth } from "@/contexts/AuthContext";

const MainLayout: React.FC = () => {
  const { role } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-6 px-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
