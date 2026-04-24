# Project Structure

Source of truth for platform naming: `PLATFORM_CONFIG.yml` (`platform.display-name` and `platform.name`).

Project name: Project-Nexus
Group: com.nexus.platform
Artifact: nexus-core
Package: com.nexus.platform

## Option 1: Layered Package Structure

com.nexus.platform
- config       // Security, OAuth, Beans
- controller   // REST APIs
- service      // Business logic
- repository   // JPA repositories
- entity       // Database entities
- dto          // Request/Response models
- security     // JWT, OAuth logic
- exception    // Global exception handling
- util         // Helper classes

## Option 2: Feature-First Package Structure

com.nexus.platform
- user
  - controller
  - service
  - repository
  - entity
  - dto
- post
  - controller
  - service
  - repository
  - entity
  - dto
- auth
  - controller
  - service
  - security
  - dto
- common
  - config
  - exception
  - util

## Naming Change Rule

If we want to rename the platform in future, update only `PLATFORM_CONFIG.yml` first, then reflect in any user-facing docs/code generated from that value.
