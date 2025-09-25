import React from 'react';
import { FaSync } from 'react-icons/fa';

const PreviewControls = ({ onRefresh }) => {
  return (
    <div className="preview-controls">
      <button onClick={onRefresh} title="Refresh preview">
        <FaSync /> Refresh Preview
      </button>
    </div>
  );
};

export default PreviewControls;
