# Contributing to MindfulScroll

Thank you for your interest in contributing to MindfulScroll! This document provides guidelines and instructions for contributing.

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## 🚀 Getting Started

### Prerequisites

- Chrome browser (latest version)
- Git
- Basic knowledge of:
  - JavaScript (ES6+)
  - HTML/CSS
  - Chrome Extensions API (Manifest V3)
  - Git/GitHub workflow

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/MindfulScroll.git
   cd MindfulScroll
   ```

2. **Load extension in Chrome**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the MindfulScroll directory

3. **Make your changes**
   - Create a new branch: `git checkout -b feature/your-feature-name`
   - Make your changes
   - Test thoroughly

4. **Test your changes**
   - Test on multiple sites (Instagram, Twitter, YouTube, etc.)
   - Test timer functionality
   - Test overlay appearance and unlock flow
   - Test popup interface
   - Check console for errors

## 📋 Development Guidelines

### Code Style

- **JavaScript**: Use modern ES6+ syntax
- **Indentation**: 2 spaces
- **Naming**: 
  - camelCase for variables and functions
  - UPPER_CASE for constants
  - Descriptive names
- **Comments**: Add comments for complex logic
- **Console Logs**: Use `[MindfulScroll]` prefix for all console logs

### File Structure

- Keep files focused on their purpose
- `content.js` - Main extension logic
- `popup.js` - Popup interface logic
- `styles.css` - Overlay and timer styles
- `popup.css` - Popup styles

### Chrome Extension Best Practices

- Use Manifest V3 APIs only
- Store data in `chrome.storage.local`
- Use `chrome.runtime.sendMessage` for communication
- Handle errors gracefully
- Test on multiple Chrome versions

## 🐛 Reporting Bugs

### Before Reporting

1. Check if the bug has already been reported
2. Test on the latest version
3. Try to reproduce the issue consistently

### Bug Report Template

```markdown
**Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen.

**Actual Behavior**
What actually happens.

**Screenshots**
If applicable, add screenshots.

**Environment**
- Chrome Version: [e.g., 120.0.0.0]
- Extension Version: [e.g., 1.0.0]
- OS: [e.g., Windows 11]

**Console Errors**
Any errors from the browser console.
```

## 💡 Feature Requests

### Before Requesting

1. Check if the feature has been requested
2. Consider if it aligns with the project's goals
3. Think about implementation complexity

### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature.

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other approaches you've thought about.

**Additional Context**
Any other relevant information.
```

## 🔨 Pull Request Process

### Before Submitting

1. **Update Documentation**
   - Update README.md if needed
   - Update CHANGELOG.md with your changes
   - Update PRODUCT_SPECIFICATION.md if adding features

2. **Test Thoroughly**
   - Test on multiple sites
   - Test edge cases
   - Check for console errors
   - Verify popup functionality

3. **Code Quality**
   - Follow code style guidelines
   - Remove debug console.logs (or use proper logging)
   - Add comments for complex logic
   - Ensure no linter errors

### PR Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No console errors
- [ ] Tested on multiple sites
```

### Review Process

1. PR will be reviewed by maintainers
2. Address any feedback
3. Once approved, PR will be merged
4. Thank you for contributing! 🎉

## 🎯 Areas for Contribution

### High Priority

- Bug fixes
- Performance improvements
- Accessibility improvements
- Documentation improvements

### Medium Priority

- New warning messages
- UI/UX improvements
- Additional site support
- Timer accuracy improvements

### Low Priority

- Code refactoring
- Test coverage
- Localization
- Analytics features

## 📝 Commit Messages

Use clear, descriptive commit messages:

```
feat: Add custom warning message support
fix: Resolve timer reset on SPA navigation
docs: Update README with installation steps
style: Improve overlay padding and spacing
refactor: Simplify timer state management
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

## 🧪 Testing Guidelines

### Manual Testing Checklist

- [ ] Extension loads without errors
- [ ] Popup displays correctly
- [ ] Settings save properly
- [ ] Timer starts on blocked sites
- [ ] Overlay appears after delay
- [ ] Unlock flow works correctly
- [ ] Intent timer displays properly
- [ ] Navigation doesn't break tracking
- [ ] Close tab functionality works
- [ ] Custom sites can be added/removed

### Testing Sites

Test on:
- Instagram (instagram.com)
- Twitter (twitter.com)
- X.com (x.com)
- YouTube (youtube.com)
- Facebook (facebook.com)
- Custom added sites

## 📚 Resources

- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
- [Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)

## ❓ Questions?

- Open an issue for questions
- Check existing issues and discussions
- Review the codebase and documentation

## 🙏 Thank You!

Your contributions make MindfulScroll better for everyone. We appreciate your time and effort!

---

**Remember**: Every contribution, no matter how small, is valuable. Thank you for helping make the internet a more mindful place!

