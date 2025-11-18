import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const UploadProgress = ({ 
  fileName, 
  progress = 0, 
  status = "uploading",
  className = "" 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "completed": return "from-success to-emerald-600";
      case "error": return "from-error to-red-600";
      default: return "from-primary to-secondary";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "completed": return "CheckCircle";
      case "error": return "AlertCircle";
      default: return "Upload";
    }
  };

  return (
    <motion.div
      className={cn(
        "bg-white rounded-xl p-6 shadow-sm border border-slate-100",
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            status === "completed" ? "bg-success/20" : 
            status === "error" ? "bg-error/20" : "bg-primary/20"
          )}>
            <ApperIcon 
              name={getStatusIcon()} 
              className={cn(
                "w-5 h-5",
                status === "completed" ? "text-success" :
                status === "error" ? "text-error" : "text-primary"
              )}
            />
          </div>
          <div>
            <p className="font-medium text-slate-800 truncate max-w-xs" title={fileName}>
              {fileName}
            </p>
            <p className="text-sm text-slate-600">
              {status === "completed" ? "Upload complete" :
               status === "error" ? "Upload failed" : "Uploading..."}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-lg font-bold text-slate-800">{progress}%</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className={cn(
              "h-full bg-gradient-to-r progress-shimmer",
              getStatusColor()
            )}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        
        {status === "uploading" && (
          <p className="text-xs text-slate-500 text-center">
            Please don't close this page while uploading
          </p>
        )}
      </div>

      {/* Success animation */}
      {status === "completed" && (
        <motion.div
          className="mt-4 flex items-center justify-center space-x-2 text-success"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <ApperIcon name="CheckCircle" className="w-5 h-5" />
          <span className="text-sm font-medium">Successfully uploaded!</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UploadProgress;