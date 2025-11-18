import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const DropZone = ({ onFilesSelected, disabled = false, className = "" }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    // Only set to false if we're leaving the dropzone entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragActive(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    
    setIsDragOver(false);
    setIsDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && onFilesSelected) {
      onFilesSelected(files);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && onFilesSelected) {
      onFilesSelected(files);
    }
    // Reset the input value
    e.target.value = "";
  };

  return (
    <motion.div
      className={cn(
        "relative border-4 border-dashed rounded-2xl transition-all duration-300 cursor-pointer",
        "flex flex-col items-center justify-center p-12 space-y-6",
        "hover:border-primary hover:bg-primary/5",
        isDragOver || isDragActive ? "border-primary bg-primary/10 scale-[1.02]" : "border-slate-300 bg-slate-50/50",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      animate={isDragOver ? { scale: 1.02 } : { scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Upload icon with animation */}
      <motion.div
        className="relative"
        animate={isDragActive ? { y: -8 } : { y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
          isDragOver ? "bg-gradient-to-br from-primary to-secondary" : "bg-gradient-to-br from-slate-200 to-slate-100"
        )}>
          <ApperIcon 
            name="Upload" 
            className={cn(
              "w-10 h-10 transition-colors duration-300",
              isDragOver ? "text-white" : "text-slate-600"
            )} 
          />
        </div>
        
        {/* Floating elements */}
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-accent to-secondary rounded-lg"
          animate={{ rotate: isDragActive ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-br from-primary to-info rounded-full"
          animate={{ scale: isDragActive ? 1.2 : 1 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Content */}
      <div className="text-center space-y-3 max-w-md">
        <h3 className={cn(
          "text-xl font-bold transition-colors duration-300",
          isDragOver ? "text-primary" : "text-slate-800"
        )}>
          {isDragOver ? "Drop your files here" : "Upload your files"}
        </h3>
        
        <p className="text-slate-600 leading-relaxed">
          Drag and drop your files here, or{" "}
          <span className="text-primary font-medium underline">click to browse</span>
        </p>
        
        <div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Zap" className="w-4 h-4" />
            <span>Fast upload</span>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Shield" className="w-4 h-4" />
            <span>Secure</span>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Download" className="w-4 h-4" />
            <span>Easy sharing</span>
          </div>
        </div>
      </div>

      {/* Supported formats */}
      <div className="text-sm text-slate-500 text-center">
        <p className="font-medium mb-2">Supported formats:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {["Images", "Videos", "Documents", "Audio", "Archives"].map((format) => (
            <span
              key={format}
              className="px-3 py-1 bg-white/80 text-slate-600 rounded-full text-xs font-medium border border-slate-200"
            >
              {format}
            </span>
          ))}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload animation overlay */}
      {isDragActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
};

export default DropZone;