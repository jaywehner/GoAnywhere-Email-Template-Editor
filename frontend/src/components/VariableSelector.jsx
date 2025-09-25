import React, { useState, useEffect } from 'react';
import { FaCode } from 'react-icons/fa';
import axios from 'axios';

const VariableSelector = ({ editorInstance }) => {
  const [variables, setVariables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch variables when component mounts
  useEffect(() => {
    const fetchVariables = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/html-variables');
        setVariables(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load HTML variables: ' + (err.response?.data?.error || err.message));
        setVariables([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVariables();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const insertVariable = (variable) => {
    if (!editorInstance) return;

    const selection = editorInstance.getSelection();
    editorInstance.executeEdits('', [
      {
        range: selection,
        text: variable,
        forceMoveMarkers: true
      }
    ]);
    editorInstance.focus();
    setIsOpen(false);
  };

  // Filter variables based on search term
  const filteredVariables = variables.filter(variable => 
    variable.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="variable-selector">
      <button
        title="Insert HTML Variable"
        onClick={toggleDropdown}
        className={isOpen ? 'active' : ''}
      >
        <FaCode /> Variables
      </button>

      {isOpen && (
        <div className="variable-dropdown">
          <div className="variable-search">
            <input
              type="text"
              placeholder="Search variables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          
          {loading ? (
            <div className="variable-loading">Loading variables...</div>
          ) : error ? (
            <div className="variable-error">{error}</div>
          ) : (
            <div className="variable-list">
              {filteredVariables.length > 0 ? (
                filteredVariables.map((variable, index) => (
                  <div
                    key={index}
                    className="variable-item"
                    onClick={() => insertVariable(variable)}
                  >
                    {variable}
                  </div>
                ))
              ) : (
                <div className="variable-empty">
                  {searchTerm ? 'No matching variables found' : 'No variables available'}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VariableSelector;
