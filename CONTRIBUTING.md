# Contributing to GoAnywhere Email Template Editor

Thank you for considering contributing to the GoAnywhere Email Template Editor! This document provides guidelines and instructions for contributing to this project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/GoAnywhere-Email-Template-Editor.git
   ```
3. **Set up the upstream remote**:
   ```bash
   git remote add upstream https://github.com/jaywehner/GoAnywhere-Email-Template-Editor.git
   ```

## Development Workflow

1. **Create a branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bugfix-name
   ```

2. **Make your changes**:
   - Follow the coding style of the project
   - Add or update tests as necessary
   - Ensure all tests pass

3. **Commit your changes**:
   ```bash
   git commit -am "Add feature: description of your changes"
   ```

4. **Keep your branch updated**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

5. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Submit a Pull Request** through GitHub

## Pull Request Guidelines

- Provide a clear description of the problem and solution
- Include the relevant issue number if applicable
- Update documentation as needed
- Ensure all tests pass
- Add screenshots for UI changes

## Code Style

- Follow PEP 8 style guidelines for Python code
- Use ESLint rules for JavaScript/React code
- Use meaningful variable and function names

## Testing

- Add tests for new features
- Make sure all existing tests pass before submitting a PR

## Documentation

- Update the README.md file with details of changes to the interface
- Update or create documentation for new features

## Questions?

If you have any questions or need help, please open an issue in the GitHub repository.

## License

By contributing, you agree that your contributions will be licensed under the project's license.

Thank you for your contribution!
