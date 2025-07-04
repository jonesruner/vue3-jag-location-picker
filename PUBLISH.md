# Publishing Guide

## Prerequisites

1. Make sure you have an npm account
2. Login to npm: `npm login`
3. Update package.json with your information:
   - `name`: Choose a unique package name
   - `author`: Your name
   - `repository.url`: Your GitHub repository URL
   - `bugs.url`: Your GitHub issues URL
   - `homepage`: Your GitHub repository homepage

## Build and Publish

1. **Build the package:**
   ```bash
   npm run build
   ```

2. **Test the build:**
   ```bash
   # Check what will be published
   npm pack --dry-run
   
   # Or install locally to test
   npm pack
   npm install ./vue-ag-location-picker-1.0.0.tgz
   ```

3. **Publish to npm:**
   ```bash
   npm publish
   ```

## Version Management

- **Patch version** (1.0.x): Bug fixes
  ```bash
  npm version patch
  ```

- **Minor version** (1.x.0): New features
  ```bash
  npm version minor
  ```

- **Major version** (x.0.0): Breaking changes
  ```bash
  npm version major
  ```

## Publishing Checklist

- [ ] Update version in package.json
- [ ] Update README.md if needed
- [ ] Test the build locally
- [ ] Run `npm run build`
- [ ] Check dist/ folder contents
- [ ] Run `npm publish`

## Troubleshooting

### Common Issues

1. **Package name already exists:**
   - Choose a different name in package.json
   - Use scoped package: `@yourusername/vue-location-picker`

2. **Build fails:**
   - Check TypeScript errors
   - Ensure all dependencies are installed
   - Verify vite.config.ts configuration

3. **Type definitions not working:**
   - Check that dist/index.d.ts exists
   - Verify types field in package.json

### Useful Commands

```bash
# Check package contents
npm pack --dry-run

# Install dependencies
npm install

# Build for development
npm run dev

# Build for production
npm run build

# Publish with specific tag
npm publish --tag beta

# Unpublish (within 72 hours)
npm unpublish vue3-jag-location-picker@1.0.0
``` 