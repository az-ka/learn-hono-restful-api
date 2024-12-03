import { describe, it, expect, afterEach, beforeEach } from "bun:test";
import { ContactTest, UserTest } from "./test-util";
import app from "../src";

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await ContactTest.delete();
    await UserTest.create();
  });

  afterEach(async () => {
    await ContactTest.delete();
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
