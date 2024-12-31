import { describe, it, expect, afterEach, beforeEach } from "bun:test";
import { ContactTest, UserTest } from "./test-util";
import app from "../src";

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should rejected if contact is invalid", async () => {
    const response = await app.request("/api/contacts", {
      method: "POST",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "",
      }),
    });

    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  });

  it("should rejected if contact is valid(only first_name", async () => {
    const response = await app.request("/api/contacts", {
      method: "POST",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "Test",
      }),
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.first_name).toBe("Test");
    expect(body.data.last_name).toBeNull();
    expect(body.data.email).toBeNull();
    expect(body.data.phone).toBeNull();
  });

  it("should rejected if contact is valid", async () => {
    const response = await app.request("/api/contacts", {
      method: "POST",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "Test",
        last_name: "Test",
        email: "test@gmail.com",
        phone: "1234567890",
      }),
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.first_name).toBe("Test");
    expect(body.data.last_name).toBe("Test");
    expect(body.data.email).toBe("test@gmail.com");
    expect(body.data.phone).toBe("1234567890");
  });
});

describe("GET /api/contacts/:id", () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should get 404 if contact not found", async () => {
    const contact = await ContactTest.get();

    const response = await app.request("/api/contacts/" + (contact.id + 1), {
      method: "GET",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(404);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  });

  it("should get contact, if contact exists", async () => {
    const contact = await ContactTest.get();

    const response = await app.request("/api/contacts/" + contact.id, {
      method: "GET",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();

    expect(body.data.id).toBe(contact.id);
    expect(body.data.first_name).toBe(contact.first_name);
    expect(body.data.last_name).toBe(contact.last_name);
    expect(body.data.email).toBe(contact.email);
    expect(body.data.phone).toBe(contact.phone);
  });
});

describe("PUT /api/contacts/:id", async () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should reject request if invalid", async () => {
    const contact = await ContactTest.get();

    const response = await app.request("/api/contacts/" + contact.id, {
      method: "PUT",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "",
      }),
    });

    expect(response.status).toBe(400);
    const body = await response.json();

    expect(body.errors).toBeDefined();
  });

  it("should reject request if contact not found", async () => {
    const contact = await ContactTest.get();

    const response = await app.request("/api/contacts/" + (contact.id + 1), {
      method: "PUT",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "Test",
      }),
    });

    expect(response.status).toBe(404);
    const body = await response.json();

    expect(body.errors).toBeDefined();
  });

  it("should update contact if valid", async () => {
    const contact = await ContactTest.get();

    const response = await app.request("/api/contacts/" + contact.id, {
      method: "PUT",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "Test",
        last_name: "Test",
        email: "testUpdate@gmail.com",
        phone: "1234567890",
      }),
    });

    expect(response.status).toBe(200);

    const body = await response.json();

    expect(body.data).toBeDefined();
    expect(body.data.first_name).toBe("Test");
    expect(body.data.last_name).toBe("Test");
    expect(body.data.email).toBe("testUpdate@gmail.com");
    expect(body.data.phone).toBe("1234567890");
  });
});

describe("DELETE /api/contacts/:id", async () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should reject request if contact not found", async () => {
    const contact = await ContactTest.get();

    const response = await app.request("/api/contacts/" + (contact.id + 1), {
      method: "DELETE",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(404);
    const body = await response.json();

    expect(body.errors).toBeDefined();
  });

  it("should delete contact if valid", async () => {
    const contact = await ContactTest.get();

    const response = await app.request("/api/contacts/" + contact.id, {
      method: "DELETE",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(200);
    const body = await response.json();

    expect(body.data).toBeDefined();
    expect(body.data).toBe(true);
  });
});
