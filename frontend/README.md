# HTML Email Editor Frontend

This is the frontend for the HTML Email Editor application. It provides a modern UI with a powerful code editor and real-time preview of HTML email templates.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Features

- Monaco editor (VS Code's editor) with HTML syntax highlighting
- Real-time preview of HTML content
- HTML tools for easy formatting and tag insertion
- Template selection from email templates directory
- File opening and saving functionality

## Structure

- `src/` - Source code
  - `components/` - React components
    - `Toolbar.jsx` - Application toolbar with file operations
    - `TemplateSelector.jsx` - Email template selection interface
    - `HtmlTools.jsx` - HTML editing tools and formatting options
  - `App.jsx` - Main application component
  - `main.jsx` - Entry point
