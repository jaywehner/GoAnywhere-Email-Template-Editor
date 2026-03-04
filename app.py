import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import xml.etree.ElementTree as ET
import json
from werkzeug.security import safe_join
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='frontend/dist')
CORS(app)

# Path to email templates and html variables
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EMAIL_TEMPLATES_DIR = os.path.join(BASE_DIR, 'emailtemplates')
HTML_VARIABLES_PATH = os.path.join(BASE_DIR, 'htmlvariables', 'varlist.txt')
EDITABLE_FILES_DIR = os.path.abspath(os.getenv('EDITABLE_FILES_DIR', EMAIL_TEMPLATES_DIR))


def _authorize_sensitive_endpoint():
    """Optional API-key authorization for file access endpoints."""
    expected_api_key = os.getenv('EDITOR_API_KEY')
    if not expected_api_key:
        return None

    provided_api_key = request.headers.get('X-API-Key')
    if provided_api_key != expected_api_key:
        return jsonify({'error': 'Unauthorized'}), 401

    return None


def _sanitize_relative_path(user_path):
    """Validate and sanitize a user-supplied relative path."""
    if not isinstance(user_path, str):
        raise ValueError('Path must be a string')

    normalized = user_path.replace('\\', '/').strip()
    if not normalized or normalized.startswith('/'):
        raise ValueError('Path must be relative')

    parts = [part for part in normalized.split('/') if part not in ('', '.')]
    if not parts:
        raise ValueError('Invalid path')

    sanitized_parts = []
    for part in parts:
        if part == '..':
            raise ValueError('Path traversal is not allowed')

        sanitized_part = secure_filename(part)
        if not sanitized_part or sanitized_part != part:
            raise ValueError('Invalid path segment')

        sanitized_parts.append(sanitized_part)

    return '/'.join(sanitized_parts)


def _resolve_user_path(base_dir, user_path):
    """Resolve a validated user path under a fixed base directory."""
    safe_relative_path = _sanitize_relative_path(user_path)
    base_abs = os.path.abspath(base_dir)
    resolved_path = safe_join(base_abs, safe_relative_path)
    if not resolved_path:
        raise ValueError('Invalid path')

    resolved_abs = os.path.abspath(resolved_path)
    if os.path.commonpath([base_abs, resolved_abs]) != base_abs:
        raise ValueError('Path traversal is not allowed')

    return resolved_abs

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/templates')
def list_templates():
    """List all available email templates"""
    templates = []
    
    # Get templates from the main directory (paths relative to EMAIL_TEMPLATES_DIR)
    for filename in os.listdir(EMAIL_TEMPLATES_DIR):
        filepath = os.path.join(EMAIL_TEMPLATES_DIR, filename)
        if os.path.isfile(filepath) and filename.endswith('.xml'):
            templates.append({
                'name': filename,
                'path': filename,  # e.g. "AgentDisconnectedAlert.xml"
                'category': 'main'
            })

    # Get templates from subdirectories (relative paths with forward slashes)
    for dirname in os.listdir(EMAIL_TEMPLATES_DIR):
        subdir_path = os.path.join(EMAIL_TEMPLATES_DIR, dirname)
        if os.path.isdir(subdir_path):
            for filename in os.listdir(subdir_path):
                filepath = os.path.join(subdir_path, filename)
                if os.path.isfile(filepath) and filename.endswith('.xml'):
                    # Build a URL-style relative path like "Subdir/Template.xml"
                    rel_path = f"{dirname}/{filename}"
                    templates.append({
                        'name': filename,
                        'path': rel_path,
                        'category': dirname
                    })
    
    return jsonify(templates)

@app.route('/api/template/<path:template_path>')
def get_template(template_path):
    """Get a specific email template by path"""
    auth_error = _authorize_sensitive_endpoint()
    if auth_error:
        return auth_error

    try:
        full_path = _resolve_user_path(EMAIL_TEMPLATES_DIR, template_path)

        # Verify the file exists
        if not os.path.exists(full_path) or not os.path.isfile(full_path):
            return jsonify({'error': 'Template not found'}), 404

        # Read and return the full file content; frontend will extract <message> HTML
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()

        return jsonify({'content': content})

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        app.logger.error(f'Error loading template: {str(e)}')
        return jsonify({'error': f'Failed to load template: {str(e)}'}), 500

@app.route('/api/open-file', methods=['POST'])
def open_file():
    """Open a file from a local path"""
    auth_error = _authorize_sensitive_endpoint()
    if auth_error:
        return auth_error

    data = request.get_json(silent=True) or {}
    file_path = data.get('filePath')
    
    if not file_path:
        return jsonify({'error': 'No file path provided'}), 400
    
    try:
        safe_path = _resolve_user_path(EDITABLE_FILES_DIR, file_path)

        with open(safe_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return jsonify({'content': content})
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
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

@app.route('/api/save-file', methods=['POST'])
def save_file():
    """Save HTML content to a specific file path"""
    auth_error = _authorize_sensitive_endpoint()
    if auth_error:
        return auth_error

    data = request.get_json(silent=True) or {}
    file_path = data.get('filePath')
    content = data.get('content')
    
    if not file_path:
        return jsonify({'error': 'No file path provided'}), 400
    
    if content is None:
        return jsonify({'error': 'No content provided'}), 400
    
    try:
        safe_path = _resolve_user_path(EDITABLE_FILES_DIR, file_path)
        
        # Create directories if they don't exist
        os.makedirs(os.path.dirname(safe_path), exist_ok=True)
        
        with open(safe_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return jsonify({'success': True, 'message': 'File saved successfully'})
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Serve static files from the frontend build directory
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
