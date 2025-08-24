# document-feature

Generate comprehensive documentation for a new feature, including both developer technical specs and user-friendly guides.

## Usage

```bash
claude document-feature <feature-name>
```

## Description

Automatically generates two types of documentation when you add a new feature:
- Developer documentation with technical implementation details
- User documentation with step-by-step guides and screenshot placeholders

## Steps

1. **Parse the feature name from the command arguments**
   - If no feature name provided, ask the user for it
   - Convert to kebab-case for consistency

2. **Gather feature context**
   - Ask user: "Brief description of this feature (one sentence):"
   - Ask user: "Is this a frontend, backend, or full-stack feature?"

3. **Analyze the codebase for the feature**
   - Search for files containing the feature name in their path or content
   - Look in common directories: src/, app/, components/, services/, api/, routes/
   - Identify file types to understand the feature scope:
     - Frontend: .jsx, .tsx, .vue, .css, .scss files
     - Backend: controllers, services, models, migrations, routes
     - API: files in api/ or routes/ directories
   - Extract key information:
     - Function/method names
     - API endpoint definitions
     - Component names
     - Database schema changes

4. **Generate Developer Documentation**
   - Create file at `docs/dev/{feature-name}-implementation.md`
   - Include sections:
     - Overview with technical description
     - Architecture and design decisions
     - API endpoints table (if applicable)
     - Data models and schemas
     - File structure tree
     - Database changes
     - Testing approach
     - Performance and security notes
     - Link to user documentation

5. **Generate User Documentation**  
   - Create file at `docs/user/how-to-{feature-name}.md`
   - Include sections:
     - What is this feature? (plain language)
     - Prerequisites
     - Step-by-step instructions
     - Screenshot placeholders: `![Screenshot: {description}](screenshots/{feature-name}-{step}.png)`
     - Common use cases
     - Troubleshooting
     - FAQs
     - Link to technical documentation

6. **Create screenshot checklist**
   - Generate `docs/user/screenshots/{feature-name}-checklist.md`
   - List all screenshots needed with descriptions
   - Include example commands for capturing them

7. **Update documentation index**
   - Look for docs/README.md or docs/index.md
   - Add links to both new documentation files
   - If no index exists, create one

8. **Search for related documentation**
   - Search existing markdown files for mentions of the feature
   - Add "Related Documentation" sections with links

9. **Display summary**
   - Show created files
   - List number of files analyzed
   - Show screenshot checklist location
   - Provide next steps for the user

## Developer Documentation Template

```markdown
# {Feature Name} - Technical Implementation

## Overview
{Technical description from analysis}

## Architecture

### Components
{List discovered components}

### API Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
{Discovered endpoints}

### Data Models
```javascript
{Extracted schemas/models}
```

### File Structure
```
{Generated file tree from analysis}
```

### Database Changes
{Migration files and schema changes found}

## Implementation Details

### Core Logic
{Key functions and business rules discovered}

### Dependencies
{Package.json additions related to feature}

## Testing
{Test files found and coverage if available}

## Performance Considerations
{Any caching, optimization found in code}

## Security
{Auth checks, validation found}

## Deployment Notes
{Environment variables, config changes detected}

## Related Documentation
- [User Guide](../user/how-to-{feature-name}.md)
{Other related docs found}

## Changelog
- Initial documentation: {current date}
```

## User Documentation Template

```markdown
# How to Use {Feature Name}

## What is {Feature Name}?
{User-friendly description based on feature context}

## Prerequisites
{Based on feature type and dependencies}

## Getting Started

### Step 1: Access the Feature
1. Navigate to {location based on routes/components}
2. Click on {UI element}

![Screenshot: Feature Entry Point](screenshots/{feature-name}-entry.png)
*Caption: Where to find {Feature Name} in the application*

### Step 2: Configure Settings
{Steps based on form fields/options found}

![Screenshot: Configuration Screen](screenshots/{feature-name}-config.png)
*Caption: Configuration options for {Feature Name}*

### Step 3: Use the Feature
{Detailed steps based on component flow}

![Screenshot: Feature in Action](screenshots/{feature-name}-usage.png)
*Caption: {Feature Name} in action*

## Common Use Cases

### Use Case 1: {Inferred from code}
{Steps for common scenario}

### Use Case 2: {Inferred from tests}
{Steps for another scenario}

## Tips and Best Practices
{Based on validation rules and constraints found}

## Troubleshooting

### Issue: {Common error from error handling code}
**Solution:** {Resolution steps}

### Issue: {Validation error scenarios}
**Solution:** {How to fix}

## Frequently Asked Questions

**Q: {Question based on feature complexity}**
A: {Answer}

**Q: {Question based on common edge case}**
A: {Answer}

## Related Features
{Links to related features found in code}

## Need More Help?
- [Technical Documentation](../dev/{feature-name}-implementation.md)
- [Support Contact](mailto:support@example.com)

---
*Last updated: {current date}*
```

## Screenshot Checklist Template

```markdown
# Screenshot Checklist: {Feature Name}

Please capture the following screenshots for the user documentation:

## Required Screenshots

### 1. Feature Entry Point
- [ ] Filename: `{feature-name}-entry.png`
- [ ] Location: Main navigation or dashboard
- [ ] Elements to highlight: Button/link to access feature

### 2. Configuration Screen
- [ ] Filename: `{feature-name}-config.png`
- [ ] Location: Feature settings/setup page
- [ ] Elements to show: All configuration options

### 3. Feature in Use
- [ ] Filename: `{feature-name}-usage.png`
- [ ] Location: Main feature interface
- [ ] Elements to show: Feature actively being used

### 4. Success State
- [ ] Filename: `{feature-name}-success.png`
- [ ] Location: After successful action
- [ ] Elements to show: Success message/confirmation

### 5. Error State (if applicable)
- [ ] Filename: `{feature-name}-error.png`
- [ ] Location: Error scenario
- [ ] Elements to show: Error message and recovery options

## Capture Instructions

### Using Browser DevTools
1. Open Chrome/Firefox DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Set viewport to 1920x1080
4. Navigate to feature
5. Take screenshot (Ctrl+Shift+P → "Capture screenshot")

### Using macOS
1. Press Cmd+Shift+5
2. Select "Capture Selected Window"
3. Click on browser window
4. Save to `docs/user/screenshots/`

### Using Windows
1. Press Win+Shift+S
2. Select rectangular area
3. Paste into image editor
4. Save as PNG to `docs/user/screenshots/`

## Notes
- Keep browser at 100% zoom
- Use light theme/mode if available
- Clear any test data that might be sensitive
- Include realistic sample data where possible
```

## Configuration Check

Check for `.claude/config/documentation.json`:
```json
{
  "paths": {
    "devDocs": "docs/dev",
    "userDocs": "docs/user",
    "screenshots": "docs/user/screenshots"
  },
  "templates": {
    "useCustom": false,
    "devTemplate": ".claude/templates/dev-doc.md",
    "userTemplate": ".claude/templates/user-doc.md"
  },
  "features": {
    "updateIndex": true,
    "searchRelated": true,
    "generateChecklist": true
  }
}
```

Use these settings if file exists, otherwise use defaults shown above.

## Error Handling

- If docs directories don't exist, create them
- If documentation already exists, ask: "Documentation already exists. Overwrite? (y/n)"
- If no related code found, still generate skeleton documentation with placeholders
- If can't determine feature type, default to full-stack

## Success Output

```
✅ Documentation generated successfully!

📁 Created Files:
- docs/dev/{feature-name}-implementation.md
- docs/user/how-to-{feature-name}.md  
- docs/user/screenshots/{feature-name}-checklist.md

📊 Analysis Summary:
- Analyzed {N} files related to '{feature-name}'
- Found {N} API endpoints
- Found {N} components
- Added {N} screenshot placeholders

📝 Documentation Index:
- Updated docs/README.md with new entries

🔗 Cross-References:
- Found {N} related documents
- Added bidirectional links

Next steps:
1. Review and enhance the generated documentation
2. Capture the {N} screenshots listed in the checklist
3. Add any feature-specific details not captured
4. Run tests to ensure documentation matches implementation
```

## Example Run

```bash
$ claude document-feature user-authentication

🔍 Analyzing feature: user-authentication
> Is this a frontend, backend, or full-stack feature? full-stack
> Brief description of this feature (one sentence): Complete authentication system with login, logout, and session management

📂 Scanning codebase...
  ✓ Found 23 related files
  ✓ Detected 5 API endpoints
  ✓ Found 4 React components
  ✓ Database migrations detected

📝 Generating developer documentation...
  ✓ Created: docs/dev/user-authentication-implementation.md
  - Documented 5 API endpoints
  - Added JWT token schema
  - Included middleware details
  - Test coverage: 89%

📝 Generating user documentation...
  ✓ Created: docs/user/how-to-user-authentication.md
  - Added 6 screenshot placeholders
  - Created login flow guide
  - Added security tips section
  - Included password requirements

📸 Screenshot checklist...
  ✓ Created: docs/user/screenshots/user-authentication-checklist.md
  - Listed 6 required screenshots
  - Added capture instructions

🔗 Updating documentation...
  ✓ Updated docs/README.md
  ✓ Found and linked 3 related documents

✅ Documentation generated successfully!
```