import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No files uploaded yet",
  message = "Drag and drop your files or click to browse",
  onAction,
  actionLabel = "Choose Files",
  className = "",
  showAction = true
}) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-6 p-12 text-center ${className}`}>
      {/* Empty state illustration */}
      <div className="relative">
        <div className="w-32 h-32 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full flex items-center justify-center border-4 border-dashed border-slate-300">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
            <ApperIcon name="Upload" className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-lg rotate-12 opacity-30 animate-bounce"></div>
        <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-br from-primary to-info rounded-full opacity-40 animate-pulse"></div>
      </div>

      {/* Empty state content */}
      <div className="space-y-3 max-w-sm">
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{message}</p>
      </div>

      {/* Action button */}
      {showAction && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-medium hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <ApperIcon name="FolderOpen" className="w-5 h-5" />
          <span>{actionLabel}</span>
        </button>
      )}

      {/* Supported formats */}
      <div className="text-sm text-slate-500 space-y-2">
        <p className="font-medium">Supported formats:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {["JPG", "PNG", "PDF", "DOC", "MP4", "ZIP"].map((format) => (
            <span
              key={format}
              className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium"
            >
              {format}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Empty;