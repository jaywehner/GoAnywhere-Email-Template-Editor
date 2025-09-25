import React, { useState, useEffect } from 'react';

const TemplateSelector = ({ templates, loading, onSelect, onClose }) => {
  const [categorizedTemplates, setCategorizedTemplates] = useState({});

  useEffect(() => {
    // Organize templates by category
    const organizeTemplates = () => {
      const organized = {};
      
      templates.forEach(template => {
        const category = template.category || 'Other';
        if (!organized[category]) {
          organized[category] = [];
        }
        organized[category].push(template);
      });
      
      setCategorizedTemplates(organized);
    };
    
    organizeTemplates();
  }, [templates]);

  return (
    <div className="template-selector-overlay" onClick={onClose}>
      <div className="template-selector" onClick={e => e.stopPropagation()}>
        <h2>
          Select a Template
          <button onClick={onClose}>×</button>
        </h2>
        
        {loading ? (
          <div className="loader"></div>
        ) : (
          <div className="template-list">
            {Object.keys(categorizedTemplates).length === 0 ? (
              <p>No templates available</p>
            ) : (
              Object.entries(categorizedTemplates).map(([category, templates]) => (
                <div key={category} className="template-category">
                  <div className="category-header">{category}</div>
                  {templates.map((template, index) => (
                    <div
                      key={index}
                      className="template-item"
                      onClick={() => onSelect(template.path)}
                    >
                      {template.name}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateSelector;
