import os
import shutil
import tempfile
import unittest

import app as app_module


class PathTraversalSecurityTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp(prefix='gaemailcreator-security-')
        self.templates_dir = os.path.join(self.temp_dir, 'templates')
        self.editable_dir = os.path.join(self.temp_dir, 'editable')
        os.makedirs(self.templates_dir, exist_ok=True)
        os.makedirs(self.editable_dir, exist_ok=True)

        self.original_templates_dir = app_module.EMAIL_TEMPLATES_DIR
        self.original_editable_dir = app_module.EDITABLE_FILES_DIR

        app_module.EMAIL_TEMPLATES_DIR = self.templates_dir
        app_module.EDITABLE_FILES_DIR = self.editable_dir
        app_module.app.config['TESTING'] = True

        self.client = app_module.app.test_client()

    def tearDown(self):
        app_module.EMAIL_TEMPLATES_DIR = self.original_templates_dir
        app_module.EDITABLE_FILES_DIR = self.original_editable_dir
        shutil.rmtree(self.temp_dir)

    def test_open_file_rejects_path_traversal(self):
        response = self.client.post('/api/open-file', json={'filePath': '../secret.txt'})
        self.assertEqual(response.status_code, 400)

    def test_save_file_rejects_path_traversal(self):
        response = self.client.post(
            '/api/save-file',
            json={'filePath': '../outside.txt', 'content': 'x'},
        )
        self.assertEqual(response.status_code, 400)

    def test_template_endpoint_rejects_path_traversal(self):
        response = self.client.get('/api/template/../outside.xml')
        self.assertEqual(response.status_code, 400)

    def test_open_file_allows_relative_path_under_editable_root(self):
        nested = os.path.join(self.editable_dir, 'nested')
        os.makedirs(nested, exist_ok=True)
        target_file = os.path.join(nested, 'allowed.txt')

        with open(target_file, 'w', encoding='utf-8') as handle:
            handle.write('ok')

        response = self.client.post('/api/open-file', json={'filePath': 'nested/allowed.txt'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()['content'], 'ok')

    def test_save_file_writes_under_editable_root(self):
        response = self.client.post(
            '/api/save-file',
            json={'filePath': 'nested/new.txt', 'content': 'saved-content'},
        )
        self.assertEqual(response.status_code, 200)

        saved_path = os.path.join(self.editable_dir, 'nested', 'new.txt')
        self.assertTrue(os.path.exists(saved_path))

        with open(saved_path, 'r', encoding='utf-8') as handle:
            self.assertEqual(handle.read(), 'saved-content')


if __name__ == '__main__':
    unittest.main()
