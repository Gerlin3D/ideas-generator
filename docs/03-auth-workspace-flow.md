# Ideas Generator — Auth and Workspace Flow

## Core Decision

Do not implement classic user registration with email in MVP.

Instead, implement workspace-based access.

A Workspace is both:

- a private login space
- a generation context for AI prompts

## Login Page

Route:

```txt
/login
```

The login page must NOT display existing workspaces.

It should show only:

- workspace name input
- password input
- submit button
- link to create workspace

Suggested page text:

```txt
Ideas Generator
Enter your private idea workspace
```

## Login Fields

- workspace name
- password

## Login Rules

On login:

1. Check whether workspace name exists.
2. Compare password with passwordHash using bcrypt.
3. If valid, create a session.
4. If invalid, show only a generic error.

Generic error:

```txt
Invalid workspace name or password
```

Do not reveal whether the workspace exists.

Bad examples:

```txt
Workspace not found
Password is incorrect
```

These should not be used.

## Session

After successful login:

- Set a secure httpOnly cookie.
- Store only workspaceId in the session/token.
- Protect all app routes using middleware or server-side checks.
- Every database query must be scoped by current workspaceId.

## Public Routes

- `/login`
- `/create-workspace`

## Protected Routes

- `/dashboard`
- `/profile`
- `/generate`
- `/ideas`
- `/ideas/[id]`
- `/usage`

## Create Workspace Page

Route:

```txt
/create-workspace
```

This page is accessible without login but requires a creation code.

Fields:

- workspace name
- password
- confirm password
- creation code

Creation code must be checked against env variable:

```env
PROFILE_CREATION_CODE=
```

After successful workspace creation:

1. Hash the password.
2. Create workspace.
3. Log the user in automatically.
4. Redirect to `/profile` or `/dashboard`.

## Security Rules

- Never store plain text passwords.
- Use bcrypt for password hashing.
- Never expose API keys to the client.
- Never return data from another workspace.
- Never reveal whether workspace exists during login.
- Use generic login errors.
- Use httpOnly cookies for sessions.
- Validate all server input.
