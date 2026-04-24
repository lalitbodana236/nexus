# Google Login Flow (Sequence Diagram)

```text
Browser                Spring Security                 Google OAuth               Callback Endpoint           Success Handler
   |                          |                             |                             |                          |
1. GET /login                 |                             |                             |                          |
   |------------------------->|                             |                             |                          |
   |<---- login page ---------|                             |                             |                          |
   |                          |                             |                             |                          |
2. Click "Sign in with Google"|                             |                             |                          |
   | GET /oauth2/authorization/google                      |                             |                          |
   |------------------------->|                             |                             |                          |
   |<--- 302 Redirect --------|                             |                             |                          |
   |                          |------ authorize request --->|                             |                          |
   |                          |                             |                             |                          |
3. User login + consent on Google                          |                             |                          |
   |<======================== Google UI ===================>|                             |                          |
   |                          |                             |                             |                          |
4. Google redirects back      |                             |                             |                          |
   | GET /login/oauth2/code/google?code=...&state=...      |                             |                          |
   |------------------------------------------------------->|                             |                          |
   |                          |---- exchange code/token --->|                             |                          |
   |                          |<--- token + user info ------|                             |                          |
   |                          |                             |                             |                          |
5. Auth success callback      |                             |                             |                          |
   |                          |----------------------------------------------------------->| onAuthenticationSuccess |
   |                          |                             |                             |------------------------->|
   |                          |                             |                             |  extract email/name/id   |
   |                          |                             |                             |  create token            |
   |                          |                             |                             |  return JSON 200         |
   |<-------------------------------------- { success:true, message:"Login successful", data:{token, username} } ---|
```

## Success Identification

1. Success handler returns HTTP `200` with `success: true`.
2. `/auth/user` returns authenticated user details when session is valid.
3. On failure, flow redirects to `/login?error=true`.


Here is the exact Gmail login control flow in your project:

User opens login page
LoginController.java (line 9) returns login.html.

User clicks Sign in with Google
login.html (line 51) sends browser to /oauth2/authorization/google.

Spring Security starts OAuth flow
SecurityConfig.java (line 28) enables oauth2Login, so Spring redirects user to Google.

Google authenticates user, then calls back
Callback URI is configured at application.properties (line 13):
{baseUrl}/login/oauth2/code/{registrationId} (for Google, registrationId = google).

On success, control goes to your custom success handler
SecurityConfig.java (line 30) points to OAuth2AuthenticationSuccessHandler.java (line 23).
This extracts user attributes, creates token, and returns JSON.

How to identify login success:

Success handler response is HTTP 200 with JSON containing:
success: true
message "Login successful"
data.token
See OAuth2AuthenticationSuccessHandler.java (line 41) and OAuth2AuthenticationSuccessHandler.java (line 43).
You can also verify session auth by calling /auth/user:
If logged in: returns success: true with user info.
If not logged in: returns success: false "No authenticated user".
See AuthController.java (line 35).
Failure path goes to /login?error=true
Configured at SecurityConfig.java (line 31), displayed in login.html (line 47).