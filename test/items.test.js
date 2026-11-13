import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import app from "../src/app.js";

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("supports validated inventory CRUD and query operations", async () => {
  const emptyList = await fetch(`${baseUrl}/api/items`);
  assert.equal(emptyList.status, 200);
  assert.deepEqual((await emptyList.json()).data, []);

  const invalidCreate = await fetch(`${baseUrl}/api/items`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "Keyboard", category: "Electronics" }),
  });
  assert.equal(invalidCreate.status, 400);
  assert.equal((await invalidCreate.json()).success, false);

  const createResponse = await fetch(`${baseUrl}/api/items`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "  Mechanical Keyboard ",
      category: "Electronics",
      quantity: 8,
    }),
  });
  assert.equal(createResponse.status, 201);
  const created = (await createResponse.json()).data;
  assert.equal(created.name, "Mechanical Keyboard");
  assert.equal(created.quantity, 8);

  const getResponse = await fetch(`${baseUrl}/api/items/${created.id}`);
  assert.equal(getResponse.status, 200);
  assert.equal((await getResponse.json()).data.id, created.id);

  const quantityResponse = await fetch(
    `${baseUrl}/api/items?quantity=8&category=electronics`,
  );
  assert.equal(quantityResponse.status, 200);
  assert.deepEqual(
    (await quantityResponse.json()).data.map((item) => item.id),
    [created.id],
  );

  const filteredResponse = await fetch(
    `${baseUrl}/api/items?category=electronics&minQuantity=5&search=keyboard`,
  );
  assert.equal(filteredResponse.status, 200);
  assert.deepEqual(
    (await filteredResponse.json()).data.map((item) => item.id),
    [created.id],
  );

  const updateResponse = await fetch(`${baseUrl}/api/items/${created.id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ quantity: 3 }),
  });
  assert.equal(updateResponse.status, 200);
  assert.equal((await updateResponse.json()).data.quantity, 3);

  const invalidFilter = await fetch(`${baseUrl}/api/items?quantity=-1`);
  assert.equal(invalidFilter.status, 400);

  const deleteResponse = await fetch(`${baseUrl}/api/items/${created.id}`, {
    method: "DELETE",
  });
  assert.equal(deleteResponse.status, 200);

  const missingResponse = await fetch(`${baseUrl}/api/items/${created.id}`);
  assert.equal(missingResponse.status, 404);
  assert.deepEqual(await missingResponse.json(), {
    success: false,
    error: "Item not found",
  });
});
