import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { formatFileSize, getFileIcon, isImageFile } from "@/utils/fileUtils";
import ApperIcon from "@/components/ApperIcon";

const FileCard = ({ 
  file, 
  onRemove, 
  onCopyUrl, 
  onImagePreview,
  showProgress = false, 
  showUrl = false,
  className = "" 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "text-success";
      case "uploading": return "text-primary";
      case "error": return "text-error";
      default: return "text-slate-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return "CheckCircle";
      case "uploading": return "Loader2";
      case "error": return "AlertCircle";
      default: return "Clock";
    }
  };

  return (
    <motion.div
      className={cn(
        "bg-white rounded-xl p-4 shadow-sm border border-slate-100",
        "hover:shadow-lg hover:border-slate-200 transition-all duration-300",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center space-x-4">
        {/* File thumbnail/icon */}
<div className="flex-shrink-0">
          {file.thumbnail ? (
            <img
              src={file.thumbnail}
              alt={file.name}
              className={`w-12 h-12 rounded-lg object-cover border border-slate-200 ${
                onImagePreview && isImageFile(file.type) 
                  ? 'cursor-pointer hover:border-primary transition-colors' 
                  : ''
              }`}
              onClick={() => onImagePreview && isImageFile(file.type) && onImagePreview(file)}
              title={onImagePreview && isImageFile(file.type) ? 'Click to preview' : ''}
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <ApperIcon name={getFileIcon(file.type)} className="w-6 h-6 text-slate-600" />
            </div>
          )}
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-800 truncate" title={file.name}>
                {file.name}
              </p>
              <p className="text-xs text-slate-500">
                {formatFileSize(file.size)} • {file.type.split("/")[1]?.toUpperCase() || "Unknown"}
              </p>
            </div>
            
            {/* Status indicator */}
            <div className="flex items-center space-x-2 ml-3">
              <ApperIcon 
                name={getStatusIcon(file.status)} 
                className={cn(
                  "w-4 h-4",
                  getStatusColor(file.status),
                  file.status === "uploading" && "animate-spin"
                )}
              />
            </div>
          </div>

          {/* Progress bar */}
          {showProgress && file.status === "uploading" && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Uploading...</span>
                <span>{file.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-secondary progress-shimmer"
                  initial={{ width: 0 }}
                  animate={{ width: `${file.progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          {/* Error message */}
          {file.error && (
            <p className="mt-1 text-xs text-error bg-red-50 px-2 py-1 rounded">
              {file.error}
            </p>
          )}

          {/* Upload URL */}
          {showUrl && file.uploadedUrl && (
            <div className="mt-2 flex items-center space-x-2">
              <input
                type="text"
                value={file.uploadedUrl}
                readOnly
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-600"
              />
              <button
                onClick={() => onCopyUrl && onCopyUrl(file.uploadedUrl)}
                className="px-2 py-1 text-xs bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                title="Copy URL"
              >
                <ApperIcon name="Copy" className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Action buttons */}
<div className="flex items-center space-x-1">
          {/* Preview button for images */}
          {onImagePreview && isImageFile(file.type) && (
            <button
              onClick={() => onImagePreview(file)}
              className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary/10 rounded transition-colors"
              title="Preview image"
            >
              <ApperIcon name="Eye" size={14} />
            </button>
          )}
          {showUrl && file.uploadedUrl && (
            <button
              onClick={() => onCopyUrl && onCopyUrl(file.uploadedUrl)}
              className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
              title="Copy URL"
            >
              <ApperIcon name="Copy" className="w-4 h-4" />
            </button>
          )}
          
          {onRemove && (
            <button
              onClick={() => onRemove(file)}
              className="p-2 text-slate-400 hover:text-error hover:bg-red-50 rounded-lg transition-colors"
              title="Remove file"
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FileCard;