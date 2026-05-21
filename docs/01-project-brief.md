# Ideas Generator — Project Brief

## Project Overview

Ideas Generator is a private AI-powered business idea lab.

The app helps users generate, evaluate, refine, and store money-making ideas based on their private workspace settings:

- skills
- interests
- goals
- constraints
- preferred markets
- preferred business models
- budget level
- risk level
- available time
- additional context

The project is a private-first tool, not a public SaaS in the MVP stage.

## Core Product Idea

The user creates a private workspace and configures their generation profile.  
AI agents then generate business ideas adapted to this workspace.

The app should help answer:

- What can I build?
- How can I earn money from it?
- Is this idea realistic?
- How fast can I validate it?
- What MVP can I build?
- What are the risks?
- How much did AI generation cost in tokens/money?

## Main Value

The app should not only generate ideas.  
It should help the user choose which ideas are actually worth testing.

The generated ideas should be:

- realistic
- monetizable
- specific
- adapted to the workspace owner
- possible to validate quickly
- possible to start with low budget
- not too broad
- not generic

Avoid generic ideas like:

- make a blog
- create a todo app
- start a marketplace
- create an online course

Unless the idea is specific, differentiated, and has a realistic monetization path.

## MVP Goal

Build a working MVP that allows a user to:

1. Create a private workspace.
2. Log into that workspace.
3. Fill in workspace/generation settings.
4. Generate business/money-making ideas using AI.
5. Store generated ideas in the database.
6. View ideas in a list.
7. Open an idea detail page.
8. Refine an idea.
9. Generate an MVP concept from an idea.
10. Track AI token usage and estimated cost.

## Development Principle

Do not build everything at once.

Recommended order:

1. Database schema.
2. Workspace creation.
3. Workspace login.
4. Protected pages.
5. Workspace settings form.
6. Idea storage and list/detail pages.
7. AI provider abstraction.
8. Idea generation.
9. Refinement and MVP concept.
10. Token/cost usage tracking.
