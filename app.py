import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import xml.etree.ElementTree as ET
import json

app = Flask(__name__, static_folder='frontend/dist')
CORS(app)

# Path to email templates and html variables
EMAIL_TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'emailtemplates')
HTML_VARIABLES_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'htmlvariables', 'varlist.txt')

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
        # Securely join the base directory with the requested template path
        base_dir = os.path.abspath(EMAIL_TEMPLATES_DIR)
        requested_path = os.path.normpath(os.path.join(base_dir, template_path))
        
        # Check for path traversal attempts
        if os.path.commonprefix([requested_path, base_dir]) != base_dir:
            return jsonify({'error': 'Invalid template path'}), 400
        
        # Read the XML file
        tree = ET.parse(requested_path)
        root = tree.getroot()
        
        # Extract the HTML content from the message CDATA section
        message_element = root.find('message')
        if message_element is not None and message_element.text:
            html_content = message_element.text
            return jsonify({'content': html_content})
        
        return jsonify({'error': 'No HTML content found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/html-variables')
def get_html_variables():
    """Get the list of available HTML variables"""
    try:
        if os.path.exists(HTML_VARIABLES_PATH):
            with open(HTML_VARIABLES_PATH, 'r', encoding='utf-8') as f:
                variables = [line.strip() for line in f if line.strip()]
            return jsonify(variables)
        else:
            return jsonify({'error': 'Variables file not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Serve static files from the frontend build directory
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
