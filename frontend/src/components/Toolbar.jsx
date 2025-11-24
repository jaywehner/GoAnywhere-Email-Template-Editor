import React, { useRef } from 'react';
import { FaFile, FaFolderOpen, FaFileCode, FaDownload } from 'react-icons/fa';

const Toolbar = ({ onOpenFile, onSaveFile, onOpenTemplates, isTemplateLoaded }) => {
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
      <h1>GoAnywhere Custom HTML Email Editor</h1>
      
      <button 
        onClick={() => onSaveFile()} 
        disabled={!isTemplateLoaded}
        title={isTemplateLoaded ? 'Download current template' : 'Please load a template first'}
      >
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
      
    </div>
  );
};

export default Toolbar;
