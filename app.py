import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import xml.etree.ElementTree as ET

app = Flask(__name__, static_folder='frontend/dist')
CORS(app)

# Path to email templates
EMAIL_TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'emailtemplates')

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/templates')
def list_templates():
    """List all available email templates"""
    templates = []
    
    # Get templates from the main directory
    for filename in os.listdir(EMAIL_TEMPLATES_DIR):
        filepath = os.path.join(EMAIL_TEMPLATES_DIR, filename)
        if os.path.isfile(filepath) and filename.endswith('.xml'):
            templates.append({
                'name': filename,
                'path': os.path.join('emailtemplates', filename),
                'category': 'main'
            })
    
    # Get templates from subdirectories
    for dirname in os.listdir(EMAIL_TEMPLATES_DIR):
        subdir_path = os.path.join(EMAIL_TEMPLATES_DIR, dirname)
        if os.path.isdir(subdir_path):
            for filename in os.listdir(subdir_path):
                filepath = os.path.join(subdir_path, filename)
                if os.path.isfile(filepath) and filename.endswith('.xml'):
                    templates.append({
                        'name': filename,
                        'path': os.path.join('emailtemplates', dirname, filename),
                        'category': dirname
                    })
    
    return jsonify(templates)

@app.route('/api/template/<path:template_path>')
def get_template(template_path):
    """Get a specific email template by path"""
    try:
        # Normalize the path to prevent directory traversal
        full_path = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), template_path))
        
        # Make sure the file is within the emailtemplates directory
        if not full_path.startswith(EMAIL_TEMPLATES_DIR):
            return jsonify({'error': 'Invalid template path'}), 400
        
        # Read the XML file
        tree = ET.parse(full_path)
        root = tree.getroot()
        
        # Extract the HTML content from the message CDATA section
        message_element = root.find('message')
        if message_element is not None and message_element.text:
            html_content = message_element.text
            return jsonify({'content': html_content})
        
        return jsonify({'error': 'No HTML content found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/open-file', methods=['POST'])
def open_file():
    """Open a file from a local path"""
    data = request.json
    file_path = data.get('filePath')
    
    if not file_path:
        return jsonify({'error': 'No file path provided'}), 400
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return jsonify({'content': content})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/save-file', methods=['POST'])
def save_file():
    """Save HTML content to a specific file path"""
    data = request.json
    file_path = data.get('filePath')
    content = data.get('content')
    
    if not file_path:
        return jsonify({'error': 'No file path provided'}), 400
    
    if content is None:
        return jsonify({'error': 'No content provided'}), 400
    
    try:
        # Normalize the path to prevent directory traversal
        file_path = os.path.normpath(os.path.abspath(file_path))
        
        # Create directories if they don't exist
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return jsonify({'success': True, 'message': f'File saved to {file_path}'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Serve static files from the frontend build directory
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(debug=True)
