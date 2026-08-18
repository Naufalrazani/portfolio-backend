# Project Image Upload & Media Management — Design Spec

## Overview

Replace the manual URL-entry workflow for Project Images with a file-upload workflow. Admin selects a local image file, the backend validates and uploads it to Cloudinary, and the resulting secure URL is stored in the existing `ProjectImage.url` field. No schema change.

## Storage Provider

**Cloudinary** — selected because:

- ProjectImage already stores URL strings
- Cloudinary returns a secure HTTPS URL after upload
- Free tier is sufficient for a portfolio
- No VPS filesystem dependency
- Built-in CDN and delivery optimization

**No schema change required.** Cloudinary public IDs are derivable from the stored URL at deletion time.

## Dependencies

| Package | Purpose |
|---------|---------|
| `cloudinary` | Official Cloudinary Node.js SDK |
| `multer` | Multipart form-data parsing (memory storage) |

No other dependencies added. No image processing libraries.

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `CLOUDINARY_CLOUD_NAME` | Yes (for upload) | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes (for upload) | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes (for upload) | Cloudinary API secret |

Added to `.env.example`. Validated in `src/config/env.js`. Cloudinary config is only required when image upload is used — GET endpoints continue working without credentials.

## Architecture

```
Admin UI (file picker)
  → multipart/form-data
  → Multer middleware (memory storage)
  → Controller (extract file + fields)
  → Service (validate, upload to Cloudinary, create record)
  → Repository (Prisma create)
  → PostgreSQL
```

Follows the existing layered pattern: Route → Controller → Service → Repository → Prisma.

## New Files

### `src/lib/cloudinary.js`

Initializes Cloudinary SDK from environment variables. Exports:

- `uploadImage(buffer, folder)` — uploads a buffer to Cloudinary, returns `{ url, publicId }`
- `deleteImage(publicId)` — deletes an asset from Cloudinary by public ID

Configuration is lazy — only initialized when called. If env vars are missing, upload/delete throw a clear error.

Cloudinary folder structure: `portfolio/projects/{projectId}`

### `src/middlewares/upload.js`

Configures multer with memory storage. Exports a middleware that handles single-file upload with field name `file`. No disk writes.

## Modified Files

### `src/config/env.js`

Add `cloudinaryCloudName`, `cloudinaryApiKey`, `cloudinaryApiSecret` to the exported env object. These are optional — only validated when present.

### `.env.example`

Add the three Cloudinary variables with placeholder comments.

### `src/routes/project-image.routes.js`

Add new route:

```
POST /upload  →  authenticate → multer → controller.upload
```

Existing routes unchanged.

### `src/controllers/project-image.controller.js`

Add `upload` handler. Extracts `req.file` (buffer, mimetype) and `req.body` (projectId, altText, sortOrder). Delegates to service. Returns `{ data: image }`.

Add `delete` modification — passes file URL to service for Cloudinary cleanup.

### `src/services/project-image.service.js`

**New method: `upload({ file, projectId, altText, sortOrder })`**

1. Validate projectId references an existing Project (throw 404 if not)
2. Validate file exists (throw 400 if not)
3. Validate MIME type is `image/jpeg`, `image/png`, or `image/webp` (throw 422 if not)
4. Validate file size ≤ 5MB (throw 422 if not)
5. Upload buffer to Cloudinary via `uploadImage(buffer, folder)`
6. Create ProjectImage record with returned URL
7. Return created record

**Modified method: `delete(id)`**

1. Find the ProjectImage record (throw 404 if not found)
2. Extract Cloudinary public ID from `url`
3. Delete from Cloudinary (log error if fails, continue)
4. Delete database record
5. Return null

**Modified method: `deleteByProjectId(projectId)`** (called from project delete service)

1. Find all ProjectImages for the project
2. For each: extract public ID, delete from Cloudinary (best-effort)
3. Return (Prisma cascade handles DB cleanup)

### `src/repositories/project-image.repository.js`

Add `findByProjectId(projectId)` — returns all images for a project (used by cascade cleanup).

### `src/services/project.service.js`

Modify `delete` method to call `projectImageService.deleteByProjectId(id)` before the Prisma delete (which cascades).

### `docs/api-contract.md`

Document the new upload endpoint. Mark image storage as finalized.

### `docs/architecture.md`

Mark file upload architecture and image storage provider as finalized.

## API Design

### New Endpoint

```
POST /api/v1/project-images/upload
```

**Auth:** Required (Bearer token)

**Content-Type:** multipart/form-data

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | binary | Yes | Image file (JPEG, PNG, or WebP) |
| `projectId` | string | Yes | UUID of the project |
| `altText` | string | No | Alt text for the image |
| `sortOrder` | number | No | Display order (default: 0) |

**Response (201):**

```json
{
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "url": "https://res.cloudinary.com/.../upload/...",
    "altText": "Dashboard screenshot",
    "sortOrder": 0
  }
}
```

**Errors:**

| Status | Code | Condition |
|--------|------|-----------|
| 400 | MISSING_FILE | No file in request |
| 400 | MISSING_PROJECT_ID | No projectId in request |
| 401 | UNAUTHORIZED | No/invalid token |
| 404 | NOT_FOUND | Project does not exist |
| 422 | INVALID_FILE_TYPE | Not JPEG/PNG/WebP |
| 422 | FILE_TOO_LARGE | Exceeds 5MB |
| 500 | STORAGE_ERROR | Cloudinary upload failed |

### Existing Endpoints

All unchanged. `DELETE /project-images/:id` now also deletes from Cloudinary.

## File Validation

| Check | Value |
|-------|-------|
| Allowed MIME types | `image/jpeg`, `image/png`, `image/webp` |
| Maximum file size | 5 MB (5,242,880 bytes) |
| SVG | Not allowed |
| Validation layer | Service (authoritative) + frontend (UX) |

Backend validates MIME type from the buffer content (not just the Content-Type header). Frontend validates before upload for immediate feedback.

## Upload Flow

1. Admin clicks "Upload Image" button
2. File picker opens (filtered to JPG/PNG/WebP)
3. Admin selects file
4. Frontend validates type and size, shows local preview via `URL.createObjectURL()`
5. Admin confirms upload
6. Frontend sends `multipart/form-data` with file + projectId + altText + sortOrder
7. Multer parses the request into `req.file` (buffer) and `req.body` (fields)
8. Service validates file content and projectId
9. Service uploads buffer to Cloudinary folder `portfolio/projects/{projectId}`
10. Cloudinary returns secure URL
11. Service creates ProjectImage record with URL
12. Response returns created image to frontend
13. Frontend adds image to list, revokes object URL

## Delete Flow

1. Admin clicks "Delete" on a project image
2. Frontend sends `DELETE /project-images/:id`
3. Service finds the record, extracts Cloudinary public ID from URL
4. Service deletes from Cloudinary (best-effort — log error if fails)
5. Service deletes database record
6. Frontend removes image from list

## Project Delete Cascade

When a project is deleted:

1. Project service calls `projectImageService.deleteByProjectId(id)`
2. For each image: extract public ID, delete from Cloudinary (best-effort)
3. Project service proceeds with Prisma delete (cascades to ProjectImage rows)

Orphaned Cloudinary files from failed deletions are acceptable for a portfolio-scale application.

## Admin UX

The `ProjectImageManager` component in `AdminProjectsPage.jsx` gains an upload section:

**Existing images list** (unchanged):
- Image preview from `ProjectImage.url`
- Alt text, sort order
- Edit / Delete buttons

**Upload section** (new):
- `[ + Upload Image ]` button
- On click: native file picker (accepts `.jpg,.jpeg,.png,.webp`)
- File selected: local preview displayed, file info shown
- Confirm: upload starts, loading spinner on button
- Success: image appears in list, preview revoked
- Error: inline error message below button
- Can cancel before confirming upload

**Accessibility:**
- File input: styled `<label>` wrapping hidden `<input type="file">`
- `aria-live="polite"` on error/status region
- Keyboard accessible
- Focus-visible on upload button
- Loading state announced

## Security

- Authentication required on upload and delete endpoints
- MIME validation against buffer content (not just header)
- 5MB file size limit (multer + service)
- Original filename never used (Cloudinary generates its own)
- API secret never exposed to frontend
- SVG not allowed
- No path traversal risk
- No secrets in error messages

## Public Portfolio

No changes. The public portfolio continues consuming `ProjectImage.url`. The only difference is that URLs now come from Cloudinary instead of manual entry. All existing rendering (featured, compact, detail, multiple images, no image) works without modification.

## Demo Seed

The seed continues with `projectImages: []`. No fake image URLs added. The upload feature is for the Admin CMS only.

## Database Changes

- Schema changed: **NO**
- Migration created: **NO**
- Migration applied: **NO**

The existing ProjectImage model (`id`, `projectId`, `url`, `altText`, `sortOrder`, `createdAt`, `updatedAt`) is sufficient.
