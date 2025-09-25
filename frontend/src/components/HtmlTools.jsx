import React from 'react';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaLink,
  FaImage,
  FaListUl,
  FaListOl,
  FaTable,
  FaHeading,
  FaPalette,
  FaFont
} from 'react-icons/fa';
import VariableSelector from './VariableSelector';

const HtmlTools = ({ editorInstance }) => {
  const insertHtml = (opening, closing = '') => {
    if (!editorInstance) return;
    
    const selection = editorInstance.getSelection();
    const selectedText = editorInstance.getModel().getValueInRange(selection);
    const range = new monaco.Range(
      selection.startLineNumber,
      selection.startColumn,
      selection.endLineNumber,
      selection.endColumn
    );
    
    const insertText = selectedText ? `${opening}${selectedText}${closing}` : `${opening}${closing}`;
    
    editorInstance.executeEdits('', [
      { range, text: insertText }
    ]);
    
    // If no text was selected, position cursor between tags
    if (!selectedText && closing) {
      const newPosition = editorInstance.getPosition();
      editorInstance.setPosition({
        lineNumber: newPosition.lineNumber,
        column: newPosition.column - closing.length
      });
    }
    
    editorInstance.focus();
  };

  const insertTag = (tag, attributes = '') => {
    const opening = `<${tag}${attributes ? ' ' + attributes : ''}>`;
    const closing = `</${tag}>`;
    insertHtml(opening, closing);
  };

  const promptAndInsertTag = (tag, promptText, attributeName) => {
    const value = prompt(promptText);
    if (value !== null) {
      insertTag(tag, `${attributeName}="${value}"`);
    }
  };

  const insertLink = () => {
    const href = prompt('Enter URL:');
    if (href !== null) {
      const text = prompt('Enter link text:', 'Link Text');
      insertHtml(`<a href="${href}">`, text !== null ? text : 'Link Text', '</a>');
    }
  };

  const insertImage = () => {
    const src = prompt('Enter image URL:');
    if (src !== null) {
      const alt = prompt('Enter image description (alt text):', '');
      insertHtml(`<img src="${src}" alt="${alt !== null ? alt : ''}" style="max-width: 100%;">`);
    }
  };

  const insertTable = () => {
    const rows = parseInt(prompt('Enter number of rows:', '3')) || 3;
    const cols = parseInt(prompt('Enter number of columns:', '3')) || 3;
    
    let tableHtml = '<table style="width: 100%; border-collapse: collapse;">\n';
    
    // Table header
    tableHtml += '  <thead>\n    <tr>\n';
    for (let j = 0; j < cols; j++) {
      tableHtml += '      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Header ' + (j+1) + '</th>\n';
    }
    tableHtml += '    </tr>\n  </thead>\n';
    
    // Table body
    tableHtml += '  <tbody>\n';
    for (let i = 0; i < rows - 1; i++) {
      tableHtml += '    <tr>\n';
      for (let j = 0; j < cols; j++) {
        tableHtml += '      <td style="border: 1px solid #ddd; padding: 8px;">Cell ' + (i+1) + '-' + (j+1) + '</td>\n';
      }
      tableHtml += '    </tr>\n';
    }
    tableHtml += '  </tbody>\n</table>';
    
    insertHtml(tableHtml);
  };

  const setTextColor = () => {
    const color = prompt('Enter color (name, hex, rgb, etc.):', '#333333');
    if (color !== null) {
      insertHtml(`<span style="color: ${color}">`, '</span>');
    }
  };

  const setFontFamily = () => {
    const font = prompt('Enter font family:', 'Arial, sans-serif');
    if (font !== null) {
      insertHtml(`<span style="font-family: ${font}">`, '</span>');
    }
  };

  return (
    <div className="html-tools">
      <div className="tool-group">
        <button title="Bold" onClick={() => insertTag('strong')}>
          <FaBold />
        </button>
        <button title="Italic" onClick={() => insertTag('em')}>
          <FaItalic />
        </button>
        <button title="Underline" onClick={() => insertHtml('<span style="text-decoration: underline;">', '</span>')}>
          <FaUnderline />
        </button>
      </div>
      
      <div className="tool-group">
        <button title="Heading" onClick={() => {
          const level = prompt('Enter heading level (1-6):', '2');
          if (level !== null && level >= 1 && level <= 6) {
            insertTag(`h${level}`);
          }
        }}>
          <FaHeading />
        </button>
        <button title="Paragraph" onClick={() => insertTag('p')}>
          P
        </button>
        <button title="Div" onClick={() => insertTag('div')}>
          Div
        </button>
      </div>
      
      <div className="tool-group">
        <button title="Text Color" onClick={setTextColor}>
          <FaPalette />
        </button>
        <button title="Font Family" onClick={setFontFamily}>
          <FaFont />
        </button>
      </div>
      
      <div className="tool-group">
        <button title="Align Left" onClick={() => insertHtml('<div style="text-align: left;">', '</div>')}>
          <FaAlignLeft />
        </button>
        <button title="Align Center" onClick={() => insertHtml('<div style="text-align: center;">', '</div>')}>
          <FaAlignCenter />
        </button>
        <button title="Align Right" onClick={() => insertHtml('<div style="text-align: right;">', '</div>')}>
          <FaAlignRight />
        </button>
        <button title="Justify" onClick={() => insertHtml('<div style="text-align: justify;">', '</div>')}>
          <FaAlignJustify />
        </button>
      </div>
      
      <div className="tool-group">
        <button title="Insert Table" onClick={insertTable}>
          <FaTable />
        </button>
      </div>
      
      <div className="tool-group">
        <VariableSelector editorInstance={editorInstance} />
      </div>
      
      <div className="tool-group">
        <button title="Insert Image" onClick={insertImage}>
          <FaImage />
        </button>
      </div>
      
      <div className="tool-group">
        <button title="Unordered List" onClick={() => insertHtml('<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ul>')}>
          <FaListUl />
        </button>
        <button title="Ordered List" onClick={() => insertHtml('<ol>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ol>')}>
          <FaListOl />
        </button>
        <button title="Insert Table" onClick={insertTable}>
          <FaTable />
        </button>
      </div>
    </div>
  );
};

export default HtmlTools;
