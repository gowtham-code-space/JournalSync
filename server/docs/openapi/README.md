# JournalSync API Documentation System

Welcome to the API-First documentation system for **JournalSync**. 

This system uses the **OpenAPI 3.1.0 Specification** to document the APIs of all services, starting from the API Gateway. The documentation is entirely driven by YAML files located in this `docs` folder.

---

## 1. Purpose of API-First Development

API-First development is a methodology where the API is treated as a **first-class citizen**. The API contract (this OpenAPI specification) is designed, reviewed, and finalized **before** writing any backend implementation or frontend integration code. 

### Benefits:
- **Parallel Workflows:** Frontend and backend teams can work concurrently by mocking the API according to the contract.
- **Single Source of Truth:** Code generators, automated tests, and interactive UI documentation are all generated from these OpenAPI files.
- **Consistently Designed APIs:** Avoids ad-hoc modifications and ensures standard endpoints, responses, error structures, and validation rules.
- **Improved Governance:** Facilitates security and architecture reviews early in the lifecycle.

---

## 2. Project Folder Structure

To scale to a large enterprise application, we avoid placing all paths and schemas in a single massive YAML file. Instead, the documentation is divided into logical subdirectories:

```text
server/docs/
├── openapi.yaml       # Main entry point (metadata, servers, tags, global components)
├── paths/            # Individual path operation files (endpoints)
│   └── health.yaml   # GET /health endpoint definition
├── schemas/          # Reusable data model schemas
│   └── HealthStatus.yaml
├── components/       # Common components (headers, parameters, security schemes)
├── examples/         # Sample request/response payloads
└── README.md         # This README file
```

---

## 3. Organizing and Defining Documentation

### How to Organize Paths
1. Place each resource endpoint definition inside the `paths/` directory (e.g., `paths/auth.yaml`, `paths/templates.yaml`).
2. Map endpoints in the main `openapi.yaml` file using a relative `$ref`:
   ```yaml
   paths:
     /auth/login:
       $ref: './paths/auth-login.yaml'
     /templates:
       $ref: './paths/templates.yaml'
   ```

### How to Define Schemas
1. Place each reusable data structure under the `schemas/` directory (e.g., `schemas/User.yaml`, `schemas/Template.yaml`).
2. Reference schemas using relative `$ref`s from path files or other schema files:
   ```yaml
   content:
     application/json:
       schema:
         $ref: '../schemas/User.yaml'
   ```

### How to Add New Endpoints (Step-by-Step)
1. **Identify the entity group** (e.g., Journal Entries, Tasks, Auth).
2. **Create the path file** in `paths/` if it does not exist (e.g., `paths/journal-entries.yaml`).
3. **Define operations** (GET, POST, PUT, DELETE) inside that file.
4. **Create any request/response schemas** in `schemas/` (e.g., `schemas/JournalEntry.yaml`).
5. **Reference schemas and paths** properly.
6. **Register the path** in `server/docs/openapi.yaml` under the `paths:` block.

---

## 4. How to Start and Access Swagger

The Swagger UI is served directly by the API Gateway using `swagger-ui-express` and `yamljs`.

### Accessing Swagger UI
1. Navigate to the API Gateway directory:
   ```bash
   cd server/api-gateway
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```text
   http://localhost:3000/api-docs
   ```

---

## 5. How Future Developers Should Use This Documentation

- **Do NOT write code first.** When adding a new feature or changing an existing flow, modify the YAML documentation first.
- **Do NOT use code-annotation packages (e.g., swagger-jsdoc).** This project enforces a clean separation of concern: documentation remains independent from backend code.
- **Strict Adherence:** Frontend developer contracts and backend validators should match this OpenAPI file exactly.
- **Validate YAML:** Ensure that all YAML formatting is clean, indentation is correct, and valid OpenAPI 3.1.0 syntax is used.
