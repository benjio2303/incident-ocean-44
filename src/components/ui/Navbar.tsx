
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, BarChart4, User, AlertCircle } from "lucide-react";

const Navbar: React.FC = () => {
  const { role, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <nav className="bg-cy-blue text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold">
              CY Incident Management
            </Link>
            
            {role === "admin" && (
              <div className="hidden md:flex space-x-4">
                <Link to="/admin/dashboard" className="hover:text-cy-lightBlue transition-colors flex items-center gap-2">
                  <BarChart4 size={18} /> Dashboard
                </Link>
                <Link to="/admin/incidents" className="hover:text-cy-lightBlue transition-colors flex items-center gap-2">
                  <AlertCircle size={18} /> Incidents
                </Link>
              </div>
            )}
            
            {role === "user" && (
              <div className="hidden md:flex space-x-4">
                <Link to="/user/dashboard" className="hover:text-cy-lightBlue transition-colors flex items-center gap-2">
                  <User size={18} /> Dashboard
                </Link>
                <Link to="/user/report-incident" className="hover:text-cy-lightBlue transition-colors flex items-center gap-2">
                  <AlertCircle size={18} /> Report Incident
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block font-medium">
              {role === "admin" ? "Admin Portal" : "User Portal"}
            </div>
            <Button 
              variant="outline" 
              className="text-white border-white hover:bg-white hover:text-cy-blue"
              onClick={logout}
            >
              <LogOut size={18} className="mr-2" /> Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
