# Inventory Management API

A backend-only inventory management system built with Node.js and Express. Item data is stored in a runtime array and is reset whenever the process restarts; no database or file persistence is used.

## Setup

1. Install Node.js 18 or newer.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env` and set `PORT` if needed.
4. Start the server with `npm start`.

The health endpoint is `GET /health`. The API listens on port `3000` by default.

## Item shape

```json
{
  "id": "generated-uuid",
  "name": "Mechanical Keyboard",
  "category": "Electronics",
  "quantity": 8,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

`name` and `category` must be non-empty strings, and `quantity` must be a non-negative integer.

## Endpoints

All responses use JSON with a `success` field. Successful reads return `data`; errors return an `error` message.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/items` | Get all items |
| `GET` | `/api/items/:id` | Get one item |
| `POST` | `/api/items` | Create an item; requires `name`, `category`, and `quantity` |
| `PUT` | `/api/items/:id` | Replace item fields; requires all item fields |
| `PATCH` | `/api/items/:id` | Update one or more item fields |
| `DELETE` | `/api/items/:id` | Delete an item |

`GET /api/items` accepts optional query parameters:

- `category` — case-insensitive exact match
- `quantity` — exact quantity
- `minQuantity` and `maxQuantity` — inclusive quantity bounds
- `search` — case-insensitive substring match in the item name

Filters can be combined. Invalid bodies, filter values, unknown fields, missing items, and unknown routes return appropriate HTTP error statuses and JSON messages.

## Testing

Run the API tests with `npm test`.
