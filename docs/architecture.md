# Backend Architecture

## 1. Architecture Style

The backend uses a modular layered architecture.

The primary request flow is:

HTTP Request
→ Route
→ Middleware
→ Controller
→ Service
→ Repository
→ Prisma
→ PostgreSQL

The architecture should remain simple and should evolve only when actual project complexity requires it.

---

## 2. Route Layer

Location:

`src/routes/`

Responsibilities:

- Define API endpoints.
- Connect endpoints to controllers.
- Apply route-level middleware when required.

Routes must not contain business logic.

Example:

```js
router.post(
  "/projects",
  authenticate,
  validate(createProjectSchema),
  projectController.create,
);
```

The route should primarily describe how an HTTP request is connected to the appropriate application logic.

---

## 3. Middleware Layer

Location:

`src/middlewares/`

Responsibilities may include:

- Authentication.
- Authorization.
- Request validation.
- Error handling.
- Rate limiting.
- Other cross-cutting HTTP concerns.

Middleware should have a focused responsibility.

Middleware must not contain unrelated business logic.

---

## 4. Controller Layer

Location:

`src/controllers/`

Responsibilities:

- Receive HTTP requests.
- Extract request data.
- Call the appropriate service.
- Determine the appropriate HTTP response.
- Return the response to the client.

Controllers should remain thin.

Controllers should not contain:

- Complex business rules.
- Direct Prisma queries.
- Large data-processing logic.
- Duplicated validation logic.

Example:

```js
const create = async (req, res) => {
  const project = await projectService.create(req.body);

  return res.status(201).json({
    success: true,
    data: project,
  });
};
```

---

## 5. Service Layer

Location:

`src/services/`

Responsibilities:

- Business logic.
- Business rules.
- Coordinating multiple repositories when necessary.
- Performing business-related data transformations.

Services should represent application behavior rather than HTTP behavior.

Services should not depend directly on Express `req` or `res` objects unless there is a concrete reason.

Example:

```js
const create = async (input) => {
  // Business rules and application logic belong here.
};
```

---

## 6. Repository Layer

Location:

`src/repositories/`

Responsibilities:

- Database access.
- Prisma queries.
- Persistence-related operations.
- Data retrieval and persistence.

Repositories should not contain:

- HTTP logic.
- HTTP status codes.
- Express request/response handling.
- Presentation logic.

Example:

```js
const create = async (data) => {
  return prisma.project.create({
    data,
  });
};
```

The repository should focus on persistence rather than business decisions.

---

## 7. Validator Layer

Location:

`src/validators/`

Responsibilities:

- Validate request bodies.
- Validate route parameters.
- Validate query parameters.
- Enforce input constraints.

Validation should happen before business logic is executed.

Example:

```js
const createProjectSchema = {
  // Validation rules will be defined
  // when the validation approach is finalized.
};
```

The validation library has not been finalized yet.

Do not introduce a validation library solely because this document mentions validators.

---

## 8. Configuration Layer

Location:

`src/config/`

Responsibilities may include:

- Application configuration.
- Environment variable handling.
- Database configuration.
- External service configuration.

Environment variables should not be accessed randomly throughout the application.

Sensitive configuration must never be hardcoded.

---

## 9. Library and Infrastructure Layer

Location:

`src/lib/`

This directory may contain initialized clients or infrastructure-related modules that are shared across the application.

Examples may include:

- Prisma client.
- External service clients (e.g., Cloudinary for image storage).
- Other infrastructure integrations.

Only create modules when they are actually required.

Do not create placeholder infrastructure modules for technologies that are not being used.

---

## 10. Utility Layer

Location:

`src/utils/`

Utilities should contain genuinely reusable functionality that does not belong to a specific business domain.

Do not create a utility merely to avoid writing a few lines of code once.

Business-specific logic should remain in the appropriate service or domain-related module.

---

## 11. Application Entry Point

### `src/app.js`

Responsible for:

- Creating the Express application.
- Registering global middleware.
- Registering API routes.
- Registering centralized error handling.

`app.js` should not start the HTTP server.

Example:

```js
const app = express();

app.use(express.json());

// middleware registration
// route registration
// error handling

export default app;
```

---

## 12. Server Entry Point

### `src/server.js`

Responsible for:

- Importing the Express application.
- Starting the HTTP server.
- Handling server startup concerns.

Example:

```js
import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

The exact implementation may change based on the final project configuration.

---

## 13. Error Handling

The application should use centralized error handling.

The preferred flow is:

Request
→ Route
→ Controller
→ Service
→ Error
→ Central Error Handler
→ HTTP Response

Business logic should not repeatedly construct HTTP error responses.

Example:

```js
throw new Error("Project not found");
```

The exact error classes and error-handling mechanism will be defined when the implementation is designed.

---

## 14. Dependency Direction

The preferred dependency direction is:

Route
→ Controller
→ Service
→ Repository
→ Prisma

Supporting components such as middleware, validators, configuration, and utilities may be used where appropriate.

Avoid reverse dependencies.

Examples:

- Repositories must not import controllers.
- Services should not import route modules.
- Services should not depend on Express response objects.
- Controllers should not directly perform Prisma queries when the repository layer is established.

---

## 15. Separation of Responsibilities

Each layer should have a clear responsibility.

### Route

Defines how HTTP requests enter the application.

### Middleware

Handles cross-cutting request concerns.

### Controller

Handles HTTP-specific input and output.

### Service

Handles business logic.

### Repository

Handles persistence.

### Prisma

Provides database access.

### PostgreSQL

Provides persistent data storage.

A layer should not take over responsibilities that belong to another layer without a concrete reason.

---

## 16. Avoiding Over-Abstraction

The architecture does not require every piece of logic to have its own abstraction.

Do not automatically create:

- Interfaces for every class.
- Base repositories.
- Generic CRUD services.
- Factory patterns.
- Strategy patterns.
- Use-case classes.
- DTO classes.
- Mapper layers.

Introduce an abstraction only when it solves an actual problem in the project.

---

## 17. Feature Development

When implementing a feature:

1. Identify the HTTP entry point.
2. Identify required validation.
3. Identify required business logic.
4. Identify required database operations.
5. Implement only the layers that are actually needed.
6. Follow existing project patterns.

Not every feature must contain every possible layer if a layer is genuinely unnecessary.

However, established patterns should be followed consistently once they are adopted.

---

## 18. Source Code Organization

The initial source structure is expected to be approximately:

```text
src/
├── config/
├── controllers/
├── lib/
├── middlewares/
├── repositories/
├── routes/
├── services/
├── utils/
├── validators/
├── app.js
└── server.js
```

Directories should only be created when they are needed.

Do not create empty directories merely to satisfy this document.

---

## 19. Architecture Changes

The architecture may evolve when actual project requirements justify a change.

Examples of reasons that may justify architectural changes:

- Increasing application complexity.
- Repeated patterns that require a better abstraction.
- New infrastructure requirements.
- Testing limitations.
- Performance requirements.
- Security requirements.

An architectural change should:

1. Have a concrete reason.
2. Be reviewed before implementation.
3. Avoid unnecessary scope expansion.
4. Be documented when it represents a significant project decision.

---

## 20. Current Architectural Constraints

The following decisions are currently established:

- Express is the HTTP framework.
- PostgreSQL is the database.
- Prisma is the ORM.
- REST is the API style.
- The application follows a layered architecture.
- Business logic belongs primarily in services.
- Database access belongs primarily in repositories.
- HTTP concerns belong primarily in controllers and middleware.
- The architecture should remain proportional to the project's actual complexity.

The following decisions are intentionally not finalized:

- Exact authentication architecture.
- Exact authorization model.
- Validation library.
- Error class implementation.
- Logging implementation.
- Rate-limiting implementation.
- Caching strategy.

Do not assume these decisions without explicit documentation.
