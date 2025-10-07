import React, { useState, useEffect, useRef } from 'react';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle
} from 'react-resizable-panels';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import Toolbar from './components/Toolbar';
import TemplateSelector from './components/TemplateSelector';
import HtmlTools from './components/HtmlTools';
import PreviewControls from './components/PreviewControls';
import './App.css';

function App() {
  const [htmlContent, setHtmlContent] = useState('<!-- Start editing your HTML here -->');
  const [editorOptions, setEditorOptions] = useState({
    minimap: { enabled: false },
    automaticLayout: true,
    wordWrap: 'on',
    scrollBeyondLastLine: false,
    fontSize: 14
  });
  
  const editorRef = useRef(null);
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    // Add global monaco to window for the HtmlTools component
    window.monaco = monaco;
  };
  
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewKey, setPreviewKey] = useState(0); // Used to force iframe refresh

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/templates');
      setTemplates(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch templates: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEditorChange = (value) => {
    setHtmlContent(value);
  };

  const handleTemplateSelect = async (templatePath) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/template/${templatePath}`);
      
      if (response.data.content) {
        setHtmlContent(response.data.content);
        setShowTemplateSelector(false);
      } else {
        setError('Selected template has no content');
      }
    } catch (err) {
      setError('Failed to load template: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFile = async (file) => {
    if (!file) return;
    
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target.result;
        setHtmlContent(content);
      };
      
      reader.readAsText(file);
    } catch (err) {
      setError('Failed to open file: ' + err.message);
    }
  };

  const handleSaveFile = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-template.html';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleRefreshPreview = () => {
    // Increment the key to force a re-render of the iframe
    setPreviewKey(prevKey => prevKey + 1);
  };
  
  return (
    <div className="app-container">
      <Toolbar 
        onOpenFile={handleOpenFile}
        onSaveFile={handleSaveFile}
        onOpenTemplates={() => setShowTemplateSelector(true)}
      />
      
      <HtmlTools editorInstance={editorRef.current} />
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="editor-container">
        <PanelGroup direction="horizontal">
          <Panel minSize={30} defaultSize={50} className="code-editor-container">
            <Editor
              height="100%"
              defaultLanguage="html"
              value={htmlContent}
              onChange={handleEditorChange}
              options={editorOptions}
              theme="vs-dark"
              onMount={handleEditorDidMount}
            />
          </Panel>
          <PanelResizeHandle className="resize-handle" />
          <Panel minSize={30} defaultSize={50} className="preview-container">
            <div className="preview-wrapper">
              <PreviewControls onRefresh={handleRefreshPreview} />
              <iframe
                key={previewKey}
                title="HTML Preview"
                srcDoc={htmlContent}
                width="100%"
                height="100%"
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
          </Panel>
        </PanelGroup>
      </div>
      
      {showTemplateSelector && (
        <TemplateSelector
          templates={templates}
          loading={loading}
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}
    </div>
  );
}

export default App;
