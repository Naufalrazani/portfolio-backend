# API Contract

## 1. Purpose

This document defines the V1 REST API contract for the portfolio backend.

It is the source of truth for API behavior during implementation.

Controllers, services, repositories, validators, middleware, and routes must implement this contract rather than redefine it.

The following documents remain authoritative for their respective concerns:

- `docs/project-context.md` — product/project requirements.
- `docs/domain-model.md` — domain model.
- `docs/database-design.md` — database design.
- `docs/architecture.md` — architecture.
- `docs/coding-standards.md` — coding conventions.
- `docs/api-contract.md` — API behavior.
- `docs/authentication.md` — authentication design.

If an API decision conflicts with a lower-level implementation convenience, the documented API contract wins.

---

## 2. API Principles

- The API is a REST API.
- All application API endpoints use the base path `/api/v1` unless explicitly stated otherwise.
- Public and private data are strictly separated.
- Responses use a predictable, consistent structure.
- Endpoint naming is resource-oriented.
- CRUD is not the default: an endpoint exists only when this contract defines it.
- This contract takes precedence over implementation assumptions.

---

## 3. Access Model

The API exposes two categories of endpoints:

- **Public endpoints**: accessible without authentication. Read-only for portfolio content, with one explicitly finalized public write endpoint for contact submission.
- **Admin endpoints**: require authentication and are protected by authorization.

Admin endpoints require authentication.

Authorization must be enforced on the backend and must not rely on frontend restrictions.

The authentication mechanism is defined in Section 10.

V1 uses stateless signed JWT access-token authentication.

See `docs/authentication.md` for authentication-specific design details.

---

## 4. Response Format

Successful single-resource response:

```json
{
  "data": {}
}
```

Successful collection response:

```json
{
  "data": []
}
```

Successful public collection endpoints return `HTTP 200`. When no records are available, the collection envelope is returned with an empty array:

```json
{
  "data": []
}
```

An empty collection is a successful response, not an error.

Successful operation without a response body:

```text
HTTP 204 No Content
```

Error response:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

No additional response metadata is included unless explicitly required.

---

## 5. HTTP Status Codes

Use the status codes documented by `docs/coding-standards.md` according to the actual operation:

- `200 OK` — successful read or update.
- `201 Created` — resource created.
- `204 No Content` — successful operation without a response body.
- `400 Bad Request` — malformed request.
- `401 Unauthorized` — authentication required or failed.
- `403 Forbidden` — authenticated but not authorized.
- `404 Not Found` — resource not found.
- `409 Conflict` — request conflicts with current state (for example, a duplicate identifier).
- `422 Unprocessable Entity` — request is well-formed but fails validation.
- `429 Too Many Requests` — rate limited.
- `500 Internal Server Error` — unexpected server error.

Status codes must reflect the actual HTTP outcome and must not be assigned arbitrarily.

---

## 6. Public Endpoints

The following public endpoints are finalized.

### 6.1 GET /api/v1/profile

- **Method**: GET
- **Path**: `/api/v1/profile`
- **Purpose**: Return the portfolio owner's profile.
- **Access**: Public.
- **Query parameters**: None.
- **Path parameters**: None.
- **Request body**: None.
- **Response shape**: Single-resource envelope containing the Profile representation (see Section 7.2).
- **Business rules**:
  - Profile is a singleton resource. No collection endpoint such as `GET /api/v1/profiles` is defined.
  - Only the public fields defined in Section 7.2 may be returned.
  - `Profile.email` is returned when the stored public Profile email value is present. It is returned as `null` when no value is stored. There is currently no separate public-email configuration flag.
- **Not found**: When no Profile record exists, the response is:

  ```json
  {
    "error": {
      "code": "NOT_FOUND",
      "message": "Profile not found."
    }
  }
  ```

- **Status codes**: `200`, `404` (when no profile exists), `500`.

### 6.2 GET /api/v1/social-links

- **Method**: GET
- **Path**: `/api/v1/social-links`
- **Purpose**: Return the ordered collection of social links.
- **Access**: Public.
- **Query parameters**: None.
- **Path parameters**: None.
- **Request body**: None.
- **Response shape**: Collection envelope containing SocialLink representations (see Section 7.3).
- **Business rules**:
  - Default ordering: `sortOrder ASC`.
- **Status codes**: `200`, `500`.

### 6.3 GET /api/v1/skills

- **Method**: GET
- **Path**: `/api/v1/skills`
- **Purpose**: Return the ordered collection of skills.
- **Access**: Public.
- **Query parameters**: None.
- **Path parameters**: None.
- **Request body**: None.
- **Response shape**: Collection envelope containing Skill representations (see Section 7.4).
- **Business rules**:
  - Default ordering: `sortOrder ASC`.
- **Status codes**: `200`, `500`.

### 6.4 GET /api/v1/experiences

- **Method**: GET
- **Path**: `/api/v1/experiences`
- **Purpose**: Return the ordered collection of experiences.
- **Access**: Public.
- **Query parameters**: None.
- **Path parameters**: None.
- **Request body**: None.
- **Response shape**: Collection envelope containing Experience representations (see Section 7.5).
- **Business rules**:
  - Default ordering: `sortOrder ASC`.
- **Status codes**: `200`, `500`.

### 6.5 GET /api/v1/education

- **Method**: GET
- **Path**: `/api/v1/education`
- **Purpose**: Return the ordered collection of education records.
- **Access**: Public.
- **Query parameters**: None.
- **Path parameters**: None.
- **Request body**: None.
- **Response shape**: Collection envelope containing Education representations (see Section 7.6).
- **Business rules**:
  - Default ordering: `sortOrder ASC`.
- **Status codes**: `200`, `500`.

### 6.6 GET /api/v1/projects

- **Method**: GET
- **Path**: `/api/v1/projects`
- **Purpose**: Return the ordered collection of published projects.
- **Access**: Public.
- **Query parameters**: None.
- **Path parameters**: None.
- **Request body**: None.
- **Response shape**: Collection envelope containing public Project representations (see Section 7.7).
- **Business rules**:
  - Only projects where `published = true` are returned.
  - Default ordering: `sortOrder ASC`.
- **Status codes**: `200`, `500`.

### 6.7 GET /api/v1/projects/:slug

- **Method**: GET
- **Path**: `/api/v1/projects/:slug`
- **Purpose**: Return a single published project by its public slug.
- **Access**: Public.
- **Query parameters**: None.
- **Path parameters**: `slug` — the public project identifier.
- **Request body**: None.
- **Response shape**: Single-resource envelope containing the public Project representation (see Section 7.7).
- **Business rules**:
  - Only projects where `published = true` are returned.
  - The public project identifier is the `slug`.
  - The database UUID remains the internal primary key and is not the primary public project identifier.
  - A project that does not exist, or that is not published, is treated as not found. The response must not reveal whether an unpublished project exists.
- **Not found**: When the slug does not identify a published project, the response is:

  ```json
  {
    "error": {
      "code": "NOT_FOUND",
      "message": "Project not found."
    }
  }
  ```

  The same response is returned both for a nonexistent slug and for the slug of an unpublished project.

- **Implementation note**: This public endpoint and the admin `GET /api/v1/projects/:id` endpoint (Section 9) are conceptually separate but are implemented through a single merged Express route because Express cannot distinguish two routes that differ only by parameter name. The merged route uses the `optionalAuthenticate` middleware and resolves the parameter based on authentication state and UUID format. See Section 9 for the parameter resolution rules. The public behavior described here is unaffected by the merged implementation: unauthenticated requests always resolve the parameter as a public slug, with the same `published = true` filtering and the same public representation.

- **Status codes**: `200`, `404`, `500`.

### 6.8 GET /api/v1/certificates

- **Method**: GET
- **Path**: `/api/v1/certificates`
- **Purpose**: Return the ordered collection of certificates.
- **Access**: Public.
- **Query parameters**: None.
- **Path parameters**: None.
- **Request body**: None.
- **Response shape**: Collection envelope containing Certificate representations (see Section 7.9).
- **Business rules**:
  - Default ordering: `sortOrder ASC`.
- **Status codes**: `200`, `500`.

### 6.9 GET /api/v1/achievements

- **Method**: GET
- **Path**: `/api/v1/achievements`
- **Purpose**: Return the ordered collection of achievements.
- **Access**: Public.
- **Query parameters**: None.
- **Path parameters**: None.
- **Request body**: None.
- **Response shape**: Collection envelope containing Achievement representations (see Section 7.10).
- **Business rules**:
  - Default ordering: `sortOrder ASC`.
- **Status codes**: `200`, `500`.

### 6.10 POST /api/v1/contact-messages

- **Method**: POST
- **Path**: `/api/v1/contact-messages`
- **Purpose**: Submit a contact message from a public visitor.
- **Access**: Public.
- **Query parameters**: None.
- **Path parameters**: None.
- **Request body**: Contact message submission.
  - `name` — required.
  - `email` — required.
  - `subject` — optional.
  - `message` — required.
- **Response shape**: `201 Created` on success with a single-resource-style data envelope containing only the success message:

  ```json
  {
    "data": {
      "message": "Contact message submitted successfully."
    }
  }
  ```

  The stored ContactMessage record is not returned. The response must not expose `ContactMessage.id`, `name`, `email`, `subject`, `message`, `createdAt`, `updatedAt`, or any internal database fields.
- **Business rules**:
  - Contact messages are private. There is no public read endpoint for ContactMessage.
  - Submitted data is validated.
  - The endpoint is abuse-sensitive and requires abuse protection (see Section 13).
- **Status codes**: `201`, `400`, `422`, `429`, `500`.

---

## 7. Public Resource Representations

### 7.1 General Representation Rules

Public responses use the exact fields defined for each resource in this section.

Public API responses do not expose:

- `id`
- `createdAt`
- `updatedAt`

For ProjectImage, public responses also do not expose:

- `projectId`

These fields remain internal database fields. They are not deleted from the database; they are simply not part of the public API representation.

`sortOrder` has two roles:

1. It determines the ordering of resources where ordering is defined.
2. It is also included as a public response field for resources that contain it.

Ordered resources are ordered by `sortOrder ASC`. No secondary ordering or tie-breaker rule is defined.

Calendar-date fields are returned as ISO-8601 UTC strings with milliseconds and `Z`, for example:

```json
"2021-01-01T00:00:00.000Z"
```

Nullable date fields are returned as `null`. No date transformation layer is applied.

### 7.2 Profile

The Profile representation contains:

- `name`
- `headline`
- `bio`
- `location`
- `email`
- `profileImageUrl`
- `resumeUrl`

`Profile.email` is returned when the stored public Profile email value is present. It is returned as `null` when no value is stored. There is currently no separate public-email configuration flag.

### 7.3 SocialLink

The SocialLink representation contains:

- `platform`
- `url`
- `label`
- `sortOrder`

### 7.4 Skill

The Skill representation contains:

- `name`
- `category`
- `sortOrder`

### 7.5 Experience

The Experience representation contains:

- `role`
- `organization`
- `description`
- `location`
- `startDate`
- `endDate`
- `sortOrder`

### 7.6 Education

The Education representation contains:

- `institution`
- `degree`
- `fieldOfStudy`
- `description`
- `startDate`
- `endDate`
- `sortOrder`

### 7.7 Project

The Project representation contains:

- `title`
- `slug`
- `shortDescription`
- `description`
- `technologies`
- `repositoryUrl`
- `demoUrl`
- `category`
- `status`
- `published`
- `featured`
- `startDate`
- `endDate`
- `sortOrder`
- `images`

The following rules apply:

- Only projects where `published = true` are returned by public project endpoints.
- The public project identifier is the `slug`.
- `technologies` is represented as an array of technology names.
- `status`, `published`, and `featured` are part of the public Project representation. Because public project queries filter for `published = true`, `published` is necessarily `true` in public responses.
- `featured` is returned as part of the project representation.
  - A project may be featured only when it is published.
- Project images are part of the project representation. There is no standalone public `project-images` resource.
  - Images are included only when the project is public.
  - Images are ordered by `ProjectImage.sortOrder ASC`.
- ProjectImage storage and upload behavior remain intentionally undefined and are not part of this contract.

### 7.8 ProjectImage

ProjectImage is not exposed as a standalone public resource.

ProjectImage is represented only as the nested `images` array inside the Project representation (see Section 7.7).

Each item in the `images` array contains:

- `url`
- `altText`
- `sortOrder`

Rules:

- The `images` key is part of the Project representation.
- Images are ordered by `ProjectImage.sortOrder ASC`.
- The same nested image representation is used by both project list and project detail responses.
- Images are returned only for public projects because public project queries filter `published = true`.
- A project with no images returns an empty `images` array.

### 7.9 Certificate

The Certificate representation contains:

- `name`
- `issuer`
- `issueDate`
- `credentialUrl`
- `imageUrl`
- `description`
- `sortOrder`

### 7.10 Achievement

The Achievement representation contains:

- `title`
- `description`
- `organization`
- `date`
- `url`
- `sortOrder`

---

## 8. Contact API

- Public submission: `POST /api/v1/contact-messages`.
  - Fields: `name` (required), `email` (required), `subject` (optional), `message` (required).
- Contact messages are stored privately.
- Contact messages must never be exposed through public endpoints.
- Submitted data must be validated.
- The public submission endpoint requires abuse protection (see Section 13).
- Admin-only retrieval and read-state operations are defined in Section 9.
- V1 explicitly excludes: archive, reply, soft delete, and message status enum behavior.

---

## 9. Administrative API

### Finalized ContactMessage admin endpoints

- `GET /api/v1/contact-messages` — admin-only. Returns contact messages. Default access pattern: unread messages first, then creation order. Pagination is intentionally deferred.
- `GET /api/v1/contact-messages/:id` — admin-only. Returns a single contact message.
- `PATCH /api/v1/contact-messages/:id/read` — admin-only. Marks a contact message as read.

No archive, reply, soft delete, or message status enum behavior is added.

### Finalized administrative capabilities

Admin users may manage portfolio content. The following resources require protected administrative write operations:

- Profile
- SocialLink
- Skill
- Experience
- Education
- Project
- ProjectImage
- Certificate
- Achievement

Administrative operations include:

- create
- update
- delete

Project additionally supports:

- publish
- unpublish

Ordering updates are supported where `sortOrder` exists.

### Finalized Profile admin endpoints

The Profile is a singleton: at most one Profile record may exist. Creation and update are protected administrative operations.

- `POST /api/v1/profile` — admin-only. Creates the Profile. Returns `201 Created` with the public Profile representation.
- `PATCH /api/v1/profile` — admin-only. Partially updates the Profile. Returns `200 OK` with the public Profile representation.
- `DELETE /api/v1/profile` — admin-only. Deletes the Profile. Returns `204 No Content` without a response body.

Administrative reads of the Profile use the existing public `GET /api/v1/profile`; no separate admin read endpoint is defined.

Request body contract (create and update):

- Accepted fields: `name`, `headline`, `bio`, `location`, `email`, `profileImageUrl`, `resumeUrl`.
- `name`, `headline`, and `bio` are required for create and must be non-empty strings; they must not be `null`.
- `location`, `email`, `profileImageUrl`, and `resumeUrl` are optional strings; `null` clears the value.
- Update accepts any subset of the accepted fields, but at least one must be present.
- `id`, `createdAt`, and `updatedAt` are never accepted in the request body.
- Unknown or unsupported fields are rejected.

Response representation:

- Successful create and update responses return the public Profile representation defined in Section 7.2 (`name`, `headline`, `bio`, `location`, `email`, `profileImageUrl`, `resumeUrl`).
- `id`, `createdAt`, and `updatedAt` are not exposed in admin responses.

Status codes:

- `201 Created` — Profile created.
- `200 OK` — Profile updated.
- `204 No Content` — Profile deleted.
- `400 Bad Request` — malformed JSON or a structurally invalid request body.
- `401 Unauthorized` — missing or invalid authentication token.
- `404 Not Found` — update or delete when no Profile exists (`Profile not found.`).
- `409 Conflict` — create when a Profile already exists (`Profile already exists.`).
- `422 Unprocessable Entity` — invalid field values.
- `500 Internal Server Error` — unexpected server error.

Validation rules (see Section 13):

- `profileImageUrl` and `resumeUrl` require URL-format validation.
- No email-format rule is defined for the Profile `email` field; only contact submission email validation is finalized.

### Finalized admin endpoints for ordered portfolio resources

The following six resources have finalized admin contracts:

- SocialLink
- Skill
- Experience
- Education
- Certificate
- Achievement

All endpoints in this section are admin-only and require the existing `authenticate` middleware. The single-admin authorization model in Section 10 applies. No Role, Permission, Session, or RefreshToken models are introduced. The public endpoints in Section 6 remain unchanged and reflect records created, updated, or deleted through these admin endpoints.

#### Admin endpoint structure

Each resource uses the same resource-oriented structure under `/api/v1`:

- `POST /api/v1/<collection>` — create.
- `GET /api/v1/<collection>` — admin list.
- `GET /api/v1/<collection>/:id` — admin detail.
- `PATCH /api/v1/<collection>/:id` — partial update.
- `DELETE /api/v1/<collection>/:id` — delete.

Collection paths:

| Resource | Collection path |
|----------|-----------------|
| SocialLink | `/api/v1/social-links` |
| Skill | `/api/v1/skills` |
| Experience | `/api/v1/experiences` |
| Education | `/api/v1/education` |
| Certificate | `/api/v1/certificates` |
| Achievement | `/api/v1/achievements` |

`:id` is the database UUID of the record. A malformed `:id` (not a valid UUID) is a `400` condition. A well-formed `:id` with no matching record is a `404` condition.

The admin list and detail endpoints are necessary: the public endpoints (Section 6) return the public representations (Section 7), which exclude `id`. Admin update and delete operations must target a specific record by its `id`, so admin list and detail endpoints must expose the identifier.

#### Admin representation

Admin create, list, detail, and update responses return the public representation defined in Section 7 for the resource, plus `id`:

| Resource | Admin representation |
|----------|----------------------|
| SocialLink | `id`, `platform`, `url`, `label`, `sortOrder` |
| Skill | `id`, `name`, `category`, `sortOrder` |
| Experience | `id`, `role`, `organization`, `description`, `location`, `startDate`, `endDate`, `sortOrder` |
| Education | `id`, `institution`, `degree`, `fieldOfStudy`, `description`, `startDate`, `endDate`, `sortOrder` |
| Certificate | `id`, `name`, `issuer`, `issueDate`, `credentialUrl`, `imageUrl`, `description`, `sortOrder` |
| Achievement | `id`, `title`, `description`, `organization`, `date`, `url`, `sortOrder` |

`createdAt` and `updatedAt` are not exposed in admin responses. Unlike the singleton Profile admin contract (where no `id` is exposed because update and delete do not target a record by identifier), collection resources expose `id` because update and delete are id-targeted.

Success responses use the standard envelopes in Section 4: `{ "data": ... }` for create, list, detail, and update.

#### Request body contract

Create (POST) and update (PATCH) share the following rules:

- The request body must be an object. A non-object or structurally invalid body is a `400` condition.
- Only the documented fields are accepted. Unknown fields are rejected (`400`).
- `id`, `createdAt`, and `updatedAt` are never accepted.
- Required fields must be meaningful non-empty strings, or a valid calendar date for required date fields. They must not be `null`.
- Optional fields may be omitted. When present, their values are validated. `null` clears a nullable optional field (stored as `null`).
- Calendar-date fields accept ISO-8601 calendar-date strings (`YYYY-MM-DD`) and must represent a valid calendar date; other formats are rejected (`422`).
- URL fields require URL-format validation.
- `sortOrder` is an optional integer that defaults to the database default (`0`) when omitted. It must not be `null`. No range limit is defined.
- No length limits, string patterns, or additional numeric limits are defined.

Create required and optional fields:

- **SocialLink** — required: `platform`, `url`. Optional: `label`, `sortOrder`.
- **Skill** — required: `name`. Optional: `category`, `sortOrder`.
- **Experience** — required: `role`, `organization`, `startDate`. Optional: `description`, `location`, `endDate`, `sortOrder`.
- **Education** — required: `institution`. Optional: `degree`, `fieldOfStudy`, `description`, `startDate`, `endDate`, `sortOrder`.
- **Certificate** — required: `name`, `issuer`. Optional: `issueDate`, `credentialUrl`, `imageUrl`, `description`, `sortOrder`.
- **Achievement** — required: `title`. Optional: `description`, `organization`, `date`, `url`, `sortOrder`.

Update (PATCH) semantics:

- Partial update. Omitted fields remain unchanged.
- At least one accepted field must be present; a PATCH with no accepted fields is a `422` condition.
- Required fields are not required to appear. When present, they are validated and must not be `null`.
- Optional nullable fields may be set to `null` to clear their value.
- Unknown fields are rejected (`400`).

#### Status codes

- `201 Created` — record created.
- `200 OK` — list, detail, update.
- `204 No Content` — record deleted, with no response body.
- `400 Bad Request` — malformed or structurally invalid body, malformed `:id`, unknown field.
- `401 Unauthorized` — missing or invalid authentication token.
- `404 Not Found` — no record matches `:id`. Messages: "Social link not found.", "Skill not found.", "Experience not found.", "Education not found.", "Certificate not found.", "Achievement not found."
- `409 Conflict` — duplicate unique value (see below).
- `422 Unprocessable Entity` — invalid field values, empty required values, invalid URL or date format, non-integer `sortOrder`, `null` on a required field, PATCH with zero accepted fields.
- `500 Internal Server Error` — unexpected errors.

#### Uniqueness conflicts

- `SocialLink.platform` and `Skill.name` are unique (`docs/database-design.md` Section 9 and Section 10).
- A create or update that would produce a duplicate unique value is a `409 Conflict`. The duplicate check excludes the record being updated itself.
- Message examples: "A social link with this platform already exists." / "A skill with this name already exists."
- Experience, Education, Certificate, and Achievement have no unique fields, so no `409` condition is defined for them.

#### Ordering

- Admin list endpoints return records ordered by `sortOrder ASC` (Section 12).
- No secondary ordering or tie-breaker rule is defined.
- No generic filtering or sorting query parameters are introduced.
- `sortOrder` is not globally unique; multiple records may share the same value.
- An admin list with no records returns `200 OK` with `{ "data": [] }`.

#### Delete

- Delete is allowed for all six resources.
- Delete permanently removes the record. Soft delete is not part of V1.
- A successful delete returns `204 No Content` with no response body.

#### Resource-specific rules

- SocialLink: `platform` is a flexible string; no platform enum or supported-platform list is defined. No relationship to Profile exists.
- Skill: no proficiency level and no icon are stored; `category` is a plain string attribute.
- Experience: `endDate` is `null` when the experience is ongoing. No start-date/end-date relationship constraint is defined for V1.
- Education: no date-relationship constraint is defined.
- Certificate: `name` and `issuer` are plain string attributes; no separate Certification model exists.
- Achievement: `organization` is a plain string attribute; no separate Organization model exists.

### Finalized admin endpoints for Project

All endpoints in this section are admin-only and require the existing `authenticate` middleware, except the public collection endpoint which uses optional authentication. The single-admin authorization model in Section 10 applies.

#### Admin endpoint structure

- `GET /api/v1/projects` — collection. With optional authentication: returns all projects (admin representation). Without authentication: returns only published projects (public representation). This preserves the existing public endpoint behavior.
- `POST /api/v1/projects` — create. Authenticated.
- `GET /api/v1/projects/:id` — admin detail. Implemented through the merged detail route (see below). Authenticated.
- `PATCH /api/v1/projects/:id` — partial update. Authenticated.
- `DELETE /api/v1/projects/:id` — delete. Authenticated.
- `PATCH /api/v1/projects/:id/publish` — publish. Authenticated.
- `PATCH /api/v1/projects/:id/unpublish` — unpublish. Authenticated.

The public `GET /api/v1/projects/:slug` endpoint (Section 6.7) and the admin `GET /api/v1/projects/:id` endpoint are conceptually separate but are implemented through a single merged Express route. Express cannot distinguish two routes that differ only by parameter name (`:slug` vs `:id`), so both behaviors are served by one route handler.

#### Merged GET detail route

The single route `GET /api/v1/projects/:param` uses the `optionalAuthenticate` middleware and resolves the parameter as follows:

1. **No authentication**: The parameter is treated as a public slug. Lookup is restricted to published projects (`published = true`). The response uses the public Project representation (Section 7.7). This is identical to the public `GET /api/v1/projects/:slug` behavior documented in Section 6.7.

2. **Valid authentication + UUID-shaped parameter**: The parameter is treated as a Project `id`. Lookup is not restricted by `published` status. The response uses the admin Project representation (Section 9, admin representation). This is the admin detail behavior.

3. **Valid authentication + non-UUID parameter**: The parameter is treated as a public slug. Lookup is restricted to published projects. The response uses the public Project representation. This endpoint does not return `400` for a non-UUID parameter; non-UUID parameters are eligible for public slug resolution regardless of authentication state.

4. **Invalid authentication token**: The `optionalAuthenticate` middleware rejects the request with `401` before the parameter is evaluated. Only the complete absence of an authentication token is treated as anonymous/public access.

#### Optional authentication

The `optionalAuthenticate` middleware is used on the `GET /api/v1/projects` collection endpoint and the merged `GET /api/v1/projects/:param` detail route. It behaves as follows:

- When a valid authentication token is present: sets `req.auth` and proceeds. The request is treated as an admin request.
- When no authentication token is present: proceeds without setting `req.auth`. The request is treated as an anonymous/public request.
- When an invalid authentication token is present (malformed, expired, wrong secret, unsupported algorithm): rejects the request with `401`. An invalid token is never silently ignored.

The `optionalAuthenticate` middleware does not modify or weaken the existing `authenticate` middleware. The `authenticate` middleware continues to require a valid token and is used on all other admin endpoints.

#### UUID-shaped slug caveat

Because the merged GET detail route uses UUID format detection to distinguish admin-by-id from public-by-slug, a project with a slug that matches UUID format (e.g., `"550e8400-e29b-41d4-a716-446655440000"`) creates an ambiguity for authenticated requests. An authenticated request with a UUID-shaped parameter is always resolved as admin-by-id lookup, even when the intent may have been to look up a project by its UUID-shaped slug. The slug-based project is then unreachable through the authenticated GET path. This is an implementation constraint of the merged route. No domain restriction on slug format is introduced by this caveat.

#### Admin representation

Admin create, list, detail, and update responses return the public Project representation defined in Section 7.7, plus `id`:

`id`, `title`, `slug`, `shortDescription`, `description`, `technologies`, `repositoryUrl`, `demoUrl`, `category`, `status`, `published`, `featured`, `startDate`, `endDate`, `sortOrder`, `images`

`createdAt` and `updatedAt` are not exposed in admin responses.

The nested `images` array in admin responses uses the admin ProjectImage representation: each item contains `id`, `projectId`, `url`, `altText`, `sortOrder`. This differs from the public ProjectImage representation (Section 7.8) which does not expose `id` or `projectId`.

Success responses use the standard envelopes in Section 4: `{ "data": ... }` for create, list, detail, and update.

#### Request body contract

Create (POST) and update (PATCH) share the following rules:

- The request body must be an object. A non-object or structurally invalid body is a `400` condition.
- Only the documented fields are accepted. Unknown fields are rejected (`400`).
- `id`, `createdAt`, and `updatedAt` are never accepted.
- Required fields must be meaningful non-empty strings, a valid enum value, a boolean, or a valid array. They must not be `null`.
- Optional fields may be omitted. When present, their values are validated. `null` clears a nullable optional field (stored as `null`).
- Calendar-date fields accept ISO-8601 calendar-date strings (`YYYY-MM-DD`) and must represent a valid calendar date; other formats are rejected (`422`).
- URL fields require URL-format validation.
- `sortOrder` is an optional integer that defaults to the database default (`0`) when omitted. It must not be `null`. No range limit is defined.
- No length limits, string patterns, or additional numeric limits are defined.

Create required and optional fields:

- **Required**: `title`, `slug`, `description`, `technologies`, `status`, `published`, `featured`.
- **Optional**: `shortDescription`, `repositoryUrl`, `demoUrl`, `category`, `startDate`, `endDate`, `sortOrder`.

Field rules:

- `title` — non-empty string.
- `slug` — non-empty string. Must be unique across all projects. A create or update that would produce a duplicate slug is a `409 Conflict`. The uniqueness check excludes the record being updated.
- `shortDescription` — optional string. `null` clears the value.
- `description` — non-empty string.
- `technologies` — must be an array of non-empty strings. An empty array `[]` is valid. Must not be `null`.
- `repositoryUrl` — optional string. When present, must be a valid URL. `null` clears the value.
- `demoUrl` — optional string. When present, must be a valid URL. `null` clears the value.
- `category` — optional string. `null` clears the value.
- `status` — must be one of `IN_PROGRESS`, `COMPLETED`, `ARCHIVED`.
- `published` — must be a boolean.
- `featured` — must be a boolean.
- `startDate` — optional calendar date (`YYYY-MM-DD`). `null` clears the value.
- `endDate` — optional calendar date (`YYYY-MM-DD`). `null` clears the value.
- `sortOrder` — optional integer. Defaults to `0`. Must not be `null`.

Update (PATCH) semantics:

- Partial update. Omitted fields remain unchanged.
- At least one accepted field must be present; a PATCH with no accepted fields is a `422` condition.
- Required fields are not required to appear. When present, they are validated and must not be `null`.
- Optional nullable fields may be set to `null` to clear their value.
- Unknown fields are rejected (`400`).
- `slug` uniqueness check on update excludes the current project.

#### Publish and unpublish

- `PATCH /api/v1/projects/:id/publish` — sets `published` to `true`. No request body required. Returns `200 OK` with the admin representation. Idempotent: if already published, returns the current state.
- `PATCH /api/v1/projects/:id/unpublish` — sets `published` to `false`. No request body required. Returns `200 OK` with the admin representation. Idempotent: if already unpublished, returns the current state.

Both endpoints require authentication. Both check that the project exists (`404` if not).

#### Status codes

- `201 Created` — project created.
- `200 OK` — list, detail, update, publish, unpublish.
- `204 No Content` — project deleted, with no response body.
- `400 Bad Request` — malformed or structurally invalid body, malformed `:id`, unknown field. The malformed `:id` condition (`400`) applies to the admin mutation endpoints that explicitly require a UUID path parameter: `PATCH /api/v1/projects/:id`, `DELETE /api/v1/projects/:id`, `PATCH /api/v1/projects/:id/publish`, and `PATCH /api/v1/projects/:id/unpublish`. The merged `GET /api/v1/projects/:param` detail route does not return `400` for non-UUID parameters; non-UUID parameters are eligible for public slug resolution (see "Merged GET detail route" above).
- `401 Unauthorized` — missing or invalid authentication token.
- `404 Not Found` — no project matches `:id`. Message: "Project not found."
- `409 Conflict` — duplicate slug. Message: "A project with this slug already exists."
- `422 Unprocessable Entity` — invalid field values, empty required values, invalid URL or date format, non-boolean `published`/`featured`, non-array `technologies`, invalid `status` enum value, `null` on a required field, PATCH with zero accepted fields.
- `500 Internal Server Error` — unexpected errors.

#### Ordering

- Admin list returns projects ordered by `sortOrder ASC`.
- No secondary ordering or tie-breaker rule is defined.
- An admin list with no records returns `200 OK` with `{ "data": [] }`.

#### Delete

- Delete permanently removes the project and all associated ProjectImage records (cascade).
- A successful delete returns `204 No Content` with no response body.

### Finalized admin endpoints for ProjectImage

ProjectImage is managed as a standalone admin resource. ProjectImage is not exposed as a standalone public resource (Section 7.8).

#### Admin endpoint structure

- `POST /api/v1/project-images/upload` — upload image file. Authenticated. Content-Type: `multipart/form-data`.
- `POST /api/v1/project-images` — create with URL. Authenticated. Content-Type: `application/json`.
- `GET /api/v1/project-images/:id` — admin detail. Authenticated.
- `PATCH /api/v1/project-images/:id` — partial update. Authenticated.
- `DELETE /api/v1/project-images/:id` — delete. Authenticated.

No admin collection list endpoint is defined. Images are viewed as part of the project representation.

#### Upload endpoint (POST /api/v1/project-images/upload)

Content-Type: `multipart/form-data`

Form fields:

- `file` — required. Image file. Accepted formats: JPEG, PNG, WebP. Maximum size: 5 MB. Validated by MIME type and magic bytes.
- `projectId` — required. UUID of the parent project.
- `altText` — optional string.
- `sortOrder` — optional integer.

Behavior:

- File is uploaded to Cloudinary under `portfolio/projects/{projectId}/`.
- Cloudinary generates the image identifier; the original filename is not used.
- The secure HTTPS URL returned by Cloudinary is stored as `ProjectImage.url`.
- Existing non-Cloudinary ProjectImage records remain unchanged.

Response: `201 Created` with admin ProjectImage representation.

Errors:

- `400 MISSING_FILE` — no file provided.
- `400 MISSING_PROJECT_ID` — no projectId provided.
- `422 INVALID_FILE_TYPE` — file is not JPEG, PNG, or WebP (detected by magic bytes).
- `422 FILE_TOO_LARGE` — file exceeds 5 MB.
- `404 NOT_FOUND` — projectId references a non-existent project.
- `500 STORAGE_NOT_CONFIGURED` — Cloudinary credentials are not configured.
- `500 STORAGE_ERROR` — Cloudinary upload failed.

Cloudinary SDK errors, credentials, and stack traces are never exposed to the client.

#### Delete behavior

When a ProjectImage is deleted:

1. The Cloudinary public ID is extracted from the stored URL.
2. If the image is a Cloudinary image, Cloudinary deletion is attempted (best-effort).
3. If Cloudinary deletion fails, the error is logged server-side and the operation continues.
4. The ProjectImage database record is deleted.
5. Existing non-Cloudinary URL images are deletable from the database without Cloudinary operations.

When a Project is deleted:

1. Associated ProjectImage records are queried.
2. Cloudinary cleanup is attempted for images with Cloudinary URLs (best-effort).
3. Cleanup failures are logged and do not block project deletion.
4. The project is deleted through the existing repository method.
5. Prisma `ON DELETE CASCADE` removes ProjectImage rows.

#### Admin representation

Admin create, detail, and update responses return:

`id`, `projectId`, `url`, `altText`, `sortOrder`

`createdAt` and `updatedAt` are not exposed. `projectId` is included in the admin representation because the admin needs to identify the parent project for management purposes. This deviates from the public ProjectImage representation (Section 7.8) which excludes `projectId`.

#### Request body contract

Create (POST) and update (PATCH) share the following rules:

- The request body must be an object. A non-object or structurally invalid body is a `400` condition.
- Only the documented fields are accepted. Unknown fields are rejected (`400`).
- `id`, `createdAt`, and `updatedAt` are never accepted.
- Required fields must be meaningful non-empty strings. They must not be `null`.
- Optional fields may be omitted. When present, their values are validated. `null` clears a nullable optional field (stored as `null`).
- URL fields require URL-format validation.
- `sortOrder` is an optional integer that defaults to the database default (`0`) when omitted. It must not be `null`. No range limit is defined.

Create required and optional fields:

- **Required**: `projectId`, `url`.
- **Optional**: `altText`, `sortOrder`.

Field rules:

- `projectId` — must be a valid UUID. Must reference an existing Project. A create with a non-existent `projectId` is a `404` condition. Message: "Project not found."
- `url` — non-empty string. Must be a valid URL.
- `altText` — optional string. `null` clears the value.
- `sortOrder` — optional integer. Defaults to `0`. Must not be `null`.

Update (PATCH) semantics:

- Partial update. Omitted fields remain unchanged.
- At least one accepted field must be present; a PATCH with no accepted fields is a `422` condition.
- `projectId` is not accepted in update requests. An image cannot be moved between projects.
- Required fields are not required to appear. When present, they are validated and must not be `null`.
- Optional nullable fields may be set to `null` to clear their value.
- Unknown fields are rejected (`400`).

#### Status codes

- `201 Created` — image created.
- `200 OK` — detail, update.
- `204 No Content` — image deleted, with no response body.
- `400 Bad Request` — malformed or structurally invalid body, malformed `:id`, unknown field.
- `401 Unauthorized` — missing or invalid authentication token.
- `404 Not Found` — no image matches `:id`, or `projectId` references a non-existent project. Messages: "Project image not found." / "Project not found."
- `422 Unprocessable Entity` — invalid field values, empty required values, invalid URL format, non-integer `sortOrder`, `null` on a required field, PATCH with zero accepted fields.
- `500 Internal Server Error` — unexpected errors.

#### Delete

- Delete permanently removes the image record.
- A successful delete returns `204 No Content` with no response body.

### AdminUser

There are no public or admin CRUD endpoints for AdminUser.

### AdminUser

There are no public or admin CRUD endpoints for AdminUser.

The following are not defined:

- `GET /api/v1/admin-users`
- `POST /api/v1/admin-users`
- `PATCH /api/v1/admin-users/:id`
- `DELETE /api/v1/admin-users/:id`

Authentication is a separate concern (see Section 10).

---

## 10. Authentication and Authorization

Admin endpoints require authentication.

Authorization must be enforced on the backend.

V1 uses a simplified single-admin model.

Do not introduce:

- Role
- Permission
- Session
- RefreshToken

models or API resources.

V1 uses stateless signed JWT access-token authentication.

The access token is transmitted using:

```text
Authorization: Bearer <token>
```

V1 does not use:

- session persistence
- a Session model
- a RefreshToken model
- refresh tokens

`docs/authentication.md` is the source of truth for authentication-specific design details.

The finalized authentication contract (login endpoint, token settings, password hashing, admin bootstrap) is defined in `docs/authentication.md`.

Rate limiting, CORS, and related security parameters are finalized in `docs/operations.md`.

---

## 11. Privacy and Field Exposure

Database fields are not automatically API fields.

Public response fields must be intentionally selected per resource.

Public API responses must never expose private data, including:

- `AdminUser.passwordHash`
- credentials
- private administrative information
- private ContactMessage data
- internal data not intentionally classified as public

Public API responses do not expose the following internal fields for public resources:

- `id`
- `createdAt`
- `updatedAt`

For ProjectImage, `projectId` is also not exposed.

These fields remain internal database fields. They are not deleted from the database; they are simply not part of the public API representation.

`Profile.email` is returned when the stored public Profile email value is present and as `null` when no value is stored. There is currently no separate public-email configuration flag.

---

## 12. Ordering

Finalized ordering rules:

- Ordered portfolio collections: `sortOrder ASC` (SocialLink, Skill, Experience, Education, Project, ProjectImage, Certificate, Achievement).
- Project images: `sortOrder ASC` within the project representation.
- ContactMessage: unread messages first, then creation order.

`sortOrder` has two roles:

1. It determines the ordering of resources where ordering is defined.
2. It is also included as a public response field for resources that contain it (see Section 7).

No secondary ordering or tie-breaker rule is defined.

No generic filtering or sorting query parameters are introduced.

---

## 13. Validation and Abuse Protection

Request validation is required where appropriate.

The public contact endpoint requires abuse protection, including:

- rate limiting
- request size limits
- email validation
- spam prevention

Rate limiting, request size limits, CORS policy, health check behavior, and related operational decisions are finalized in `docs/operations.md`.

This document does not select a validation library and does not invent numeric limits.

---

## 14. Deferred API Decisions

The following decisions remain unresolved and must be explicitly decided before the corresponding implementation:

- Validation library and exact validator implementation.
- ContactMessage pagination.
- Additional filtering and sorting.
- Future API capabilities.

The following decisions are finalized in `docs/operations.md`:

- Rate limiting: login (5/15 min/IP) and contact messages (10/min/IP).
- Request body size limit: `100kb` (`express.json({ limit: "100kb" })`).
- CORS: wildcard in development; `CORS_ORIGIN` env var in production.
- Health check: `GET /healthz` returns `{ "status": "ok" }`.
- Spam prevention: rate limiting plus email validation.
- Graceful shutdown: `SIGTERM`/`SIGINT` handlers, HTTP server drain, Prisma disconnect, 30s timeout.
- Process failure handling: `uncaughtException` and `unhandledRejection` log and exit.
- Logging: prohibited fields and acceptable logging events.

The login/logout contract, credential rules, and initial admin bootstrap are finalized in `docs/authentication.md` and are no longer deferred.

Do not resolve these decisions silently.

---

## 15. Implementation Rules for AI Agents

- Do not create endpoints not defined by this document.
- Do not create CRUD endpoints merely because a database model exists.
- Do not expose database models directly.
- Do not expose private fields.
- Do not introduce new entities or relationships.
- Do not choose deferred authentication or infrastructure decisions silently.
- If implementation requires an undefined API decision, stop and report it.
- Controllers, services, repositories, validators, and middleware must implement this contract rather than redefine it.
