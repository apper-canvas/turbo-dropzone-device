import React from "react";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ 
  error = "Something went wrong", 
  onRetry, 
  className = "",
  showRetry = true 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-6 p-8 text-center ${className}`}>
      {/* Error icon */}
      <div className="relative">
        <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertCircle" className="w-10 h-10 text-error" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-error rounded-full flex items-center justify-center">
          <ApperIcon name="X" className="w-3 h-3 text-white" />
        </div>
      </div>

      {/* Error message */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-800">Upload Error</h3>
        <p className="text-slate-600 max-w-md leading-relaxed">
          {error}
        </p>
      </div>

      {/* Retry button */}
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <ApperIcon name="RotateCcw" className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}

      {/* Help text */}
      <div className="text-sm text-slate-500 space-y-1">
        <p>Try refreshing the page or check your internet connection.</p>
        <p>If the problem persists, please try again later.</p>
      </div>
    </div>
  );
};

export default ErrorView;