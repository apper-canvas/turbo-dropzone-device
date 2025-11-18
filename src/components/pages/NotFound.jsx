import React from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        {/* 404 Icon */}
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="SearchX" className="w-16 h-16 text-slate-600" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">!</span>
          </div>
        </div>

        {/* Error Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-slate-800">404</h1>
          <h2 className="text-xl font-semibold text-slate-700">Page Not Found</h2>
          <p className="text-slate-600 leading-relaxed">
            Oops! The page you're looking for seems to have wandered off. 
            Let's get you back to uploading files.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link to="/">
            <Button size="lg" className="w-full">
              <ApperIcon name="Home" className="w-5 h-5 mr-2" />
              Back to DropZone
            </Button>
          </Link>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
            <Link 
              to="/" 
              className="hover:text-primary transition-colors duration-200"
            >
              Upload Files
            </Link>
            <span>•</span>
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="hover:text-primary transition-colors duration-200"
            >
              Help Center
            </a>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center space-x-2 opacity-50">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="w-2 h-2 bg-gradient-to-br from-primary to-secondary rounded-full animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;