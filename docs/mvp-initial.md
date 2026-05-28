# studio-1 MVP Plan

## Goal

Build `studio-1` as a repo intelligence studio.

The first version should let a user connect or upload a repository, analyze it, organize it into useful parts, and display those parts inside a dashboard.

## Core Idea

`studio-1` should understand the repo before it tries to modify the repo.

## MVP Flow

1. User connects or uploads a GitHub repo.
2. `studio-1` pulls the repo.
3. `studio-1` scans the repo files.
4. Junk files are ignored.
5. The app detects the project stack.
6. The app organizes the repo into categories.
7. The app generates a Project Map.
8. The dashboard displays the organized repo structure.

## Project Map Categories

- Components
- Pages / Routes
- API Endpoints
- Functions
- Classes
- Database Files
- Auth Logic
- Payment Logic
- AI Logic
- Config Files
- Documentation
- Problems / TODOs

## First Feature

Build the Repo Map feature first.

Input:

- GitHub repo URL

Output:

- Organized Project Map shown in the dashboard

## What Not To Build Yet

Do not build these yet:

- AI agents
- Repo editing
- Code generation
- Workflow automation
- Pull request creation
- Multi-user collaboration

## MVP Success Criteria

The MVP is successful when:

- A repo can be connected or uploaded.
- The repo can be scanned.
- Important files can be classified.
- Components, functions, routes, and config files can be viewed in the dashboard.
- The user can clearly understand the structure of the app from inside `studio-1`.

## Next Step

Set up the GitHub repo and commit this planning document.