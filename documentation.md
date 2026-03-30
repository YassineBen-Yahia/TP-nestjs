# TP NestJS API Documentation

This project is a NestJS API with 3 main resources:

- User
- Skill
- CV

The API uses TypeORM + MySQL and class-validator for request validation.

## Quick Start

Install dependencies:

```bash
npm install
```

Run in development:

```bash
npm run start:dev
```

Build:

```bash
npm run build
```

Seed CV data:

```bash
npm run seed:cvs
```

Default API base URL:

```text
http://localhost:3000
```

## Postman Setup

For all POST and PATCH requests:

- Header: `Content-Type: application/json`
- Body type: `raw`
- Format: `JSON`

Important: keys must be wrapped in double quotes (valid JSON).

## API Endpoints And Postman Bodies

### 1. User Controller

Base route: `/user`

#### POST /user

```json
{
  "username": "john",
  "email": "john@mail.com",
  "password": "123456"
}
```

#### GET /user

No body.

#### GET /user/:id

No body.

#### PATCH /user/:id

```json
{
  "username": "john_updated",
  "email": "john.updated@mail.com",
  "password": "newpass123"
}
```

#### DELETE /user/:id

No body.

#### PATCH /user/:id/restore

No body.

### 2. Skill Controller

Base route: `/skill`

#### POST /skill

```json
{
  "designation": "NestJS"
}
```

#### GET /skill

No body.

#### GET /skill/:id

No body.

#### PATCH /skill/:id

```json
{
  "designation": "TypeScript"
}
```

#### DELETE /skill/:id

No body.

#### PATCH /skill/:id/restore

No body.

### 3. CV Controller

Base route: `/cv`

#### POST /cv

```json
{
  "name": "Doe",
  "firstname": "John",
  "age": 25,
  "cin": 12345678,
  "job": "Backend Developer",
  "path": "cv-john.pdf",
  "userId": 1,
  "skillIds": [1, 2]
}
```

#### GET /cv

No body.

#### GET /cv/:id

No body.

#### PATCH /cv/:id

Full body example:

```json
{
  "name": "Doe Updated",
  "firstname": "John",
  "age": 26,
  "cin": 12345678,
  "job": "Senior Backend Developer",
  "path": "cv-john-v2.pdf",
  "userId": 1,
  "skillIds": [2]
}
```

Minimal body example:

```json
{
  "job": "Senior Backend Developer"
}
```

#### DELETE /cv/:id

No body.

#### PATCH /cv/:id/restore

No body.

## Recommended Postman Test Flow

1. Create one user with `POST /user`
2. Create 2 skills with `POST /skill`
3. Create one CV with `POST /cv` using `userId` and `skillIds`
4. Test updates with PATCH endpoints
5. Test soft delete + restore with DELETE and `/restore`

## Notes

- Validation is enabled globally.
- Invalid request payloads return HTTP 400.
- Soft delete is implemented for User, Skill, and CV.
- Deleting a user also soft deletes related CVs; restoring a user restores related CVs.
