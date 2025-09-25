# HTML Email Editor

A web application that allows editing HTML files with live preview functionality. Specifically designed to work with email templates.

## Features

- Modern HTML editor with syntax highlighting
- Real-time preview of HTML content
- Open and edit existing HTML files
- Select from available email templates in the emailtemplates directory
- Save/download edited HTML files

## Setup

### Standard Setup

#### Backend (Python/Flask)

```bash
# Install backend dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```

#### Frontend (Node.js)

```bash
# Install frontend dependencies
cd frontend
npm install --legacy-peer-deps

# Run the development server
npm run dev
```

### Docker Setup

You can also run the application using Docker and Docker Compose:

```bash
# Build and start the containers
docker-compose up -d --build

# View the logs
docker-compose logs -f

# Stop the containers
docker-compose down
```

When using Docker:
- The application will be available at http://localhost
- The backend API will be available at http://localhost/api
- The backend service is also directly accessible at http://localhost:5001
- Any changes to the email templates will be reflected immediately as the templates directory is mounted as a volume

### Port Configuration

If you encounter port conflicts, you can modify the port mappings in the `docker-compose.yml` file:

```yaml
# For frontend port conflict (default 80)
frontend:
  ports:
    - "8080:80"  # Change 8080 to your preferred port

# For backend port conflict (default 5001)
backend:
  ports:
    - "5002:5000"  # Change 5002 to your preferred port
```

## Usage

### Standard Setup
1. Access the application at http://localhost:5173 (frontend) or http://localhost:5000 (backend)
2. Use the editor to create or modify HTML content
3. Open existing files or choose from available templates
4. Save your work using the Download button or Save As feature

### Docker Setup
1. Access the application at http://localhost
2. Use the editor to create or modify HTML content
3. Open existing files or choose from available templates 
4. Save your work using the Download button or Save As feature

## Technologies

- Backend: Python with Flask
- Frontend: Node.js with React
- Editor: Monaco Editor (VS Code's editor)

## Git Repository

This project is maintained in the [GoAnywhere-Email-Template-Editor](https://github.com/jaywehner/GoAnywhere-Email-Template-Editor) GitHub repository.

### Setting Up Git

```bash
# Clone the repository
git clone https://github.com/jaywehner/GoAnywhere-Email-Template-Editor.git
cd GoAnywhere-Email-Template-Editor

# Install dependencies
pip install -r requirements.txt
cd frontend && npm install --legacy-peer-deps && cd ..
```

### Contributing

For contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).
