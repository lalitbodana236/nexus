# Nexus Core - Gmail OAuth2 Login Setup

## Overview
This application supports OAuth2 login with Google (Gmail). Follow the steps below to configure it.

## Prerequisites
- Google Cloud Console account
- Your application registered as an OAuth2 client

## Google OAuth2 Setup Steps

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one

### 2. Enable Google+ API
1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API" and enable it

### 3. Create OAuth2 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure the OAuth consent screen if prompted
4. Select "Web application" as application type
5. Add authorized redirect URIs:
   - For development: `http://localhost:8080/login/oauth2/code/google`
   - For production: `https://yourdomain.com/login/oauth2/code/google`

### 4. Get Client Credentials
After creating the OAuth2 client, you'll get:
- **Client ID**: A long string ending with `.googleusercontent.com`
- **Client Secret**: A shorter secret string

## Application Configuration

### Environment Variables (Recommended)
Set these environment variables:

```bash
export GOOGLE_CLIENT_ID=your-actual-client-id.googleusercontent.com
export GOOGLE_CLIENT_SECRET=your-actual-client-secret
```

### Or Application Properties
Update `src/main/resources/application.properties`:

```properties
spring.security.oauth2.client.registration.google.client-id=your-actual-client-id.googleusercontent.com
spring.security.oauth2.client.registration.google.client-secret=your-actual-client-secret
```

## Testing the Login

1. Start the application:
   ```bash
   ./mvnw spring-boot:run
   ```

2. Visit: `http://localhost:8080/login`

3. Click "Sign in with Google"

4. You'll be redirected to Google for authentication

5. After successful login, you'll be redirected back with a JWT token

## API Endpoints

- `GET /login` - Login page
- `GET /oauth2/authorization/google` - Initiate Google OAuth2 login
- `GET /auth/user` - Get current authenticated user info (requires authentication)
- `POST /auth/login` - Traditional login (username/password)

## Next Steps
After Gmail login is working, you can implement GitHub OAuth2 login by:
1. Adding GitHub OAuth2 client configuration
2. Creating similar OAuth2 success handler for GitHub
3. Adding GitHub login button to the login page

## Security Notes
- Never commit real client secrets to version control
- Use environment variables or external configuration for production
- Configure proper CORS settings for your frontend application
- Implement proper session management and token refresh