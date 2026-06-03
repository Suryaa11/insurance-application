# Insurance Management API

Base URL: `/api/v1`

## Authentication
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

## Plans
- `GET /plans`
- `GET /plans/:id`
- `GET /plans/admin`
- `POST /plans`
- `PUT /plans/:id`
- `DELETE /plans/:id`

## Applications
- `POST /applications`
- `GET /applications/mine`
- `GET /applications/admin`
- `GET /applications/:id`
- `PATCH /applications/:id/review`

## Documents
- `GET /documents/mine`
- `GET /documents/application/:applicationId`
- `GET /documents/:id`
- `POST /documents/applications/:applicationId`
- `PUT /documents/:id/replace`
- `PATCH /documents/:id/review`

## Notifications
- `GET /notifications/mine`
- `PATCH /notifications/:id/read`
- `PATCH /notifications/read-all`

## Reports
- `GET /reports/summary`

## Dashboard
- `GET /dashboard/customer`
- `GET /dashboard/admin`

## Response Shape
```json
{
  "success": true,
  "message": "Application submitted",
  "data": {}
}
```
