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

describe("GET /api/contacts", async () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.createMany(25);
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should be able to search contacts", async () => {
    const response = await app.request("/api/contacts", {
      method: "GET",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data.length).toBe(10);
    expect(body.paging.current_page).toBe(1);
    expect(body.paging.total_page).toBe(3);
    expect(body.paging.size).toBe(10);
  });

  it("should be able to search using name", async () => {
    let response = await app.request("/api/contacts?name=Wulan", {
      method: "GET",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(200);

    let body = await response.json();
    expect(body.data.length).toBe(10);
    expect(body.paging.current_page).toBe(1);
    expect(body.paging.total_page).toBe(3);
    expect(body.paging.size).toBe(10);

    response = await app.request("/api/contacts?name=lice", {
      method: "GET",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(200);

    body = await response.json();
    expect(body.data.length).toBe(10);
    expect(body.paging.current_page).toBe(1);
    expect(body.paging.total_page).toBe(3);
    expect(body.paging.size).toBe(10);
  });

  it("should be able to search using phone", async () => {
    const response = await app.request("/api/contacts?phone=1234567890", {
      method: "GET",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data.length).toBe(10);
    expect(body.paging.current_page).toBe(1);
    expect(body.paging.total_page).toBe(3);
    expect(body.paging.size).toBe(10);
  });

  it("should be able to search using email", async () => {
    const response = await app.request("/api/contacts?email=test@gmail.com", {
      method: "GET",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data.length).toBe(10);
    expect(body.paging.current_page).toBe(1);
    expect(body.paging.total_page).toBe(3);
    expect(body.paging.size).toBe(10);
  });

  it("should be able to search without result", async () => {
    let response = await app.request("/api/contacts?name=Azka", {
      method: "GET",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(200);

    let body = await response.json();
    expect(body.data.length).toBe(0);
    expect(body.paging.current_page).toBe(1);
    expect(body.paging.total_page).toBe(0);
    expect(body.paging.size).toBe(10);

    response = await app.request("/api/contacts?phone=0987654321", {
      method: "GET",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(200);

    body = await response.json();
    expect(body.data.length).toBe(0);
    expect(body.paging.current_page).toBe(1);
    expect(body.paging.total_page).toBe(0);
    expect(body.paging.size).toBe(10);

    response = await app.request("/api/contacts?email=azka@gmail.com", {
      method: "GET",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(200);

    body = await response.json();
    expect(body.data.length).toBe(0);
    expect(body.paging.current_page).toBe(1);
    expect(body.paging.total_page).toBe(0);
    expect(body.paging.size).toBe(10);
  });

  it("should be able to search with pagination", async () => {
    let response = await app.request("/api/contacts?page=2&size=5", {
      method: "GET",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(200);

    let body = await response.json();

    expect(body.data.length).toBe(5);
    expect(body.paging.current_page).toBe(2);
    expect(body.paging.total_page).toBe(5);
    expect(body.paging.size).toBe(5);
  });
});
