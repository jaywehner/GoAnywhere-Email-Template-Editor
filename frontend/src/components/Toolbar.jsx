import React, { useRef } from 'react';
import { FaFile, FaFolderOpen, FaSave, FaFileCode, FaDownload } from 'react-icons/fa';

const Toolbar = ({ onOpenFile, onSaveFile, onOpenTemplates }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onOpenFile(file);
    }
    // Reset the input so the same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="toolbar">
      <h1>HTML Email Editor</h1>
      
      <button onClick={() => onSaveFile()}>
        <FaDownload /> Download
      </button>
      
      <button onClick={handleFileSelect}>
        <FaFolderOpen /> Open File
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".html,.htm,.xml"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      
      <button onClick={onOpenTemplates}>
        <FaFileCode /> Templates
      </button>
      
      <button className="secondary" onClick={() => {
        if (confirm('Start with a new file? Current changes will be lost.')) {
          // Create a new file with basic HTML structure
          const newHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
    }
    .header {
      background-color: #4a87b5;
      padding: 20px;
      color: white;
      text-align: center;
    }
    .content {
      padding: 20px;
      background-color: #f8f8f8;
    }
    .footer {
      padding: 10px;
      text-align: center;
      font-size: 12px;
      color: #777;
      background-color: #eeeeee;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Email Title</h1>
    </div>
    <div class="content">
      <p>Hello there,</p>
      <p>This is a sample email template. Edit this content to create your custom email.</p>
      <p>Regards,<br>Your Name</p>
    </div>
    <div class="footer">
      <p>© 2025 Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
          onOpenFile(new Blob([newHtml], { type: 'text/html' }));
        }
      }}>
        <FaFile /> New
      </button>
    </div>
  );
};

export default Toolbar;
