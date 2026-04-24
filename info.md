# Project Brief

Source of truth for platform naming: `PLATFORM_CONFIG.yml` (`platform.display-name` and `platform.name`).

You are a senior staff-level software engineer and startup architect.

I am building a production-grade project called "Project-Nexus".

## Product Overview

Project-Nexus is a student-focused professional community platform where users can:

- Showcase projects (proof of work)
- Share technical posts, notes, and achievements
- Engage via likes, comments, and follows
- Build a strong public profile for career growth

Unlike platforms such as LinkedIn, Project-Nexus emphasizes structured, high-signal content and is designed to evolve into a monetization platform (mentorship, paid content).

## My Goal

1. Learn backend development using Java Spring Boot
2. Build a scalable system from scratch
3. Design the system to scale from 0 to 1 million users
4. Make this project strong enough to showcase in SDE interviews (especially SDE2/SDE3 level)

## What I Need From You

### 1. Product Roadmap (Phased Approach)

Break the development into phases:

- Phase 1: MVP (0 -> 1,000 users)
- Phase 2: Growth (1,000 -> 100K users)
- Phase 3: Scale (100K -> 1M users)

For each phase, define:

- Features to build
- What NOT to build
- Technical priorities

### 2. System Design (High-Level Architecture)

Design a scalable backend system using:

- Java Spring Boot
- REST APIs

Include:

- Architecture diagram (textual explanation is fine)
- Services/modules breakdown
- Monolith vs microservices (with justification)

### 3. Database Design

Provide:

- Core entities (User, Post, Comment, Like, Follow)
- Schema design (tables, relationships)
- Indexing strategy
- How to handle feed efficiently

### 4. Authentication Design

Implement:

- OAuth login with Google and GitHub
- JWT-based session management

Explain:

- Full auth flow
- Security considerations

### 5. Feed System Design (Important)

Explain:

- How to build a scalable feed
- Fan-out on write vs fan-out on read
- Strategy for MVP vs scaling stages

### 6. Scalability Strategy (0 -> 1M Users)

Explain evolution of system:

- Initial (single server)
- Add load balancing
- Database scaling (read replicas, sharding if needed)
- Caching (Redis)
- CDN for media

### 7. API Design

Define key APIs:

- Create post
- Get feed
- Like/comment
- Follow user

Include request/response examples.

### 8. File/Media Handling

How to handle:

- Image/video uploads
- Storage (local vs cloud like S3)

### 9. Deployment Plan

- Local development setup
- Production deployment (Docker, cloud suggestion)
- CI/CD basics

### 10. Resume Positioning

Help me write:

- Strong resume bullet points
- Key impact statements
- How to present this project in interviews

## Constraints

- Keep MVP simple but production-quality
- Avoid over-engineering early
- Prioritize learning and clean architecture
- Focus on backend depth (Spring Boot, DB, APIs)

## Output Expectation

Provide structured, actionable, and practical guidance, not generic theory. Think like you are guiding an engineer to build and scale a real startup product.
