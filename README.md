# GitHub Content Management System

A modern, Next.js application for managing and publishing Markdown content directly to GitHub repositories. Create drafts locally, preview content in real-time, and publish multiple posts with a single commit.

## Features

**Fetch Content from GitHub** - Retrieve and display Markdown files from any public repository  
**Draft Management** - Create, edit, delete, and organize drafts with local persistence  
**Live Preview** - Real-time Markdown preview with syntax highlighting  
**Bulk Publishing** - Publish all drafts to GitHub in a single commit  
**Secure Integration** - Environment variables protect sensitive credentials  
**Responsive Design** - Clean, accessible UI that works on all devices  
**Error Handling** - Graceful error boundaries and user feedback

## Architecture & Design Rationale

### Technology Stack

- **Next.js 15** with App Router for modern development
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS v4** with semantic design tokens for consistent theming
- **Shadcn UI** components for accessibility and polish
- **GitHub REST API** for repository integration
- **Local Storage** for draft persistence across browser sessions

### Design Decisions

**Local-First Approach**: Drafts are stored in browser localStorage, allowing users to work offline and maintain drafts across sessions without requiring a backend database.

**Single Commit Publishing**: All drafts are published in one atomic commit, maintaining clean repository history and allowing easy rollbacks.

**Sanitized HTML Rendering**: Markdown content is parsed with `React-markdown` library.

**Semantic Design Tokens**: The app uses a good color system with cyan primary (#0891b2) and amber accent (#d97706) colors, ensuring consistent theming and easy customization.

## Quick Start

### Prerequisites

- Node.js 22+ and npm/yarn
- A GitHub account with a public repository
- A GitHub Personal Access Token with repository permissions

### Installation

1. **Clone or download the project**

   ```bash
   git clone https://github.com/devmuhib/github-md-publisher.git
   cd github-md-publisher
   npm install

   ```

2. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   GITHUB_OWNER=your-github-username
   GITHUB_REPO=your-repository-name
   GITHUB_TOKEN=your-personal-access-token

   ```

3. **Create a GitHub Personal Access Token**

   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Select scopes: `repo` (Full control of private repositories)
   - Copy the generated token to your `.env` file

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:3000` to start using the application.

## Usage Guide

### Fetching GitHub Content

1. Navigate to the home page
2. Enter a file path (e.g., `content/hello.md`) in the GitHub Content Fetcher
3. Click "Fetch" to retrieve and display the Markdown content as HTML

### Managing Drafts

1. **Create a new draft**:

   - Go to the "Drafts" page
   - Click "New Draft" or switch to the "Create" tab
   - Enter a title and write your content in Markdown
   - Use the "Preview" tab to see how it will look
   - Click "Save Draft"

2. **Edit existing drafts**:

   - Find your draft in the list
   - Click "Edit" to modify the content
   - Save your changes

3. **Delete drafts**:
   - Click "Delete" next to any draft
   - Confirm the deletion in the dialog

### Publishing to GitHub

1. **Review drafts**:

   - Go to the "Publish" page
   - Review all drafts that will be published
   - Each draft shows its target file path (e.g., `content/my-post.md`)

2. **Publish all drafts**:
   - Click "Publish All" button
   - Confirm the action in the dialog
   - Monitor the progress bar during publishing
   - Drafts are automatically cleared after successful publishing

## Environment Variables

| Variable       | Description                                     | Required |
| -------------- | ----------------------------------------------- | -------- |
| `GITHUB_OWNER` | Your GitHub username or organization            | Yes      |
| `GITHUB_REPO`  | Repository name where content will be published | Yes      |
| `GITHUB_TOKEN` | Personal Access Token with repo permissions     | Yes      |

### GitHub Token Permissions

Your token needs the following scopes:

- `repo` - Full control of private repositories (includes public repos)

## API Endpoints

### GET `/api/github/fetch`

Fetches a file from the configured GitHub repository.

**Query Parameters:**

- `path` (string, required) - File path relative to repository root

**Response:**

```json
{
  "name": "hello.md",
  "path": "content/hello.md",
  "content": "# Hello World\n\nThis is my content.",
  "sha": "abc123..."
}
```

### POST `/api/github/publish`

Publishes multiple drafts to GitHub in a single commit.

**Request Body:**

```json
{
  "drafts": [
    {
      "id": "uuid",
      "title": "My Post",
      "body": "Post content in Markdown",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Successfully published 1 post: My Post",
  "files": ["content/my-post.md"]
}
```

## File Structure

```
├── app/
│ ├── api/github/ # GitHub API routes
│ ├── drafts/ # Draft management page
│ ├── publish/ # Publishing page
│ ├── layout.tsx # Root layout with navigation
│ ├── page.tsx # Home page
│ └── globals.css # Global styles and design tokens
├── components/
│ ├── ui/ # Reusable UI components
│ ├── draft-form.tsx # Draft creation/editing form
│ ├── draft-list.tsx # Draft listing and management
│ ├── draft-manager.tsx # Main draft management interface
│ ├── github-content-fetcher.tsx # GitHub content retrieval
│ ├── markdown-renderer.tsx # Markdown to HTML renderer
│ ├── publish-manager.tsx # Publishing interface
│ └── navigation.tsx # App navigation
├── lib/
│ ├── github.ts # GitHub API client
│ ├── markdown.ts # Markdown processing utilities
│ ├── storage.ts # Local storage management
│ └── utils.ts # General utilities

```

## Security Considerations

- **Environment Variables**: Sensitive credentials are stored in environment variables, never in client-side code
- **Content Sanitization**: All Markdown content is sanitized before rendering to prevent XSS attacks
- **API Validation**: Server-side validation ensures only valid requests are processed
- **Error Handling**: Comprehensive error boundaries prevent application crashes

## Troubleshooting

### Common Issues

**"Missing required GitHub environment variables" error**

- Ensure all three environment variables are set in `.env`
- Restart the development server after adding environment variables

**"GitHub API error: 401 Unauthorized"**

- Check that your GitHub token is valid and not expired
- Verify the token has `repo` scope permissions
- Ensure the token is correctly set in `GITHUB_TOKEN`

**"GitHub API error: 404 Not Found"**

- Verify `GITHUB_OWNER` and `GITHUB_REPO` are correct
- Ensure the repository exists and is accessible
- Check that the file path exists in the repository

**Drafts not persisting**

- Drafts are stored in browser localStorage
- Clear browser data will remove all drafts
- Use "Publish All" to save drafts to GitHub before clearing browser data

**Publishing fails**

- Check your internet connection
- Verify GitHub token permissions
- Ensure the repository allows pushes to the main branch

### Getting Help

If you encounter issues not covered here:

1. Check the browser console for detailed error messages
2. Verify all environment variables are correctly set
3. Test your GitHub token with a simple API call
4. Ensure your repository has the correct permissions

## Performance Considerations

- **Local Storage**: Drafts are stored locally for fast access and offline capability
- **Optimistic Updates**: UI updates immediately while API calls happen in background
- **Efficient Rendering**: Markdown parsing is optimized and content is sanitized safely
- **Progressive Enhancement**: Core functionality works even if JavaScript fails

## Browser Compatibility

- Modern browsers with ES2020+ support
- Local Storage API required for draft persistence
- Fetch API required for GitHub integration

## Contributing

This project follows standard Next.js development practices:

1. Use TypeScript for all new code
2. Follow the existing component patterns
3. Add proper error handling and loading states
4. Update documentation for new features
5. Test thoroughly before submitting changes

## License

This project is open source and available under the MIT License.

## Author

Muhibur Rahman
