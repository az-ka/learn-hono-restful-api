import { describe, it, expect, afterEach, beforeEach } from "bun:test";
import app from "../src";
import { logger } from "../src/application/logging";
import { UserTest } from "./test-util";

describe("POST /api/users", () => {
  afterEach(async () => {
    await UserTest.delete();
  });

  it("should reject register new user if request is invalid", async () => {
    const response = await app.request("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username: "",
        password: "",
        name: "",
      }),
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });

  it("should reject register new user if username is already taken", async () => {
    await UserTest.create();

    const response = await app.request("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username: "testuser",
        password: "testpassword123",
        name: "Test User",
      }),
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });

  it("should register new user success", async () => {
    const response = await app.request("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username: "testuser",
        password: "testpassword123",
        name: "Test User",
      }),
    });

    const body = await response.json();
    logger.debug(body);

    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();

    expect(body.data.username).toBe("testuser");
    expect(body.data.name).toBe("Test User");
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should be able to login", async () => {
    const response = await app.request("/api/users/login", {
      method: "POST",
      body: JSON.stringify({
        username: "testuser",
        password: "testpassword123",
      }),
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data.token).toBeDefined();
  });

  it("should be rejected if username is wrong", async () => {
    const response = await app.request("/api/users/login", {
      method: "POST",
      body: JSON.stringify({
        username: "testuserwrong",
        password: "testpassword123",
      }),
    });

    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  });

  it("should be rejected if password is wrong", async () => {
    const response = await app.request("/api/users/login", {
      method: "POST",
      body: JSON.stringify({
        username: "testuser",
        password: "testpassword123wrong",
      }),
    });

    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  });
});

describe("GET /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should be able to get current user", async () => {
    const response = await app.request("api/users/current", {
      method: "GET",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.username).toBe("testuser");
    expect(body.data.name).toBe("Test User");
  });

  it("should be rejected if token is invalid", async () => {
    const response = await app.request("api/users/current", {
      method: "GET",
      headers: {
        Authorization: "wrong",
      },
    });

    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  });

  it("should not be able to get user if there is no Authorization header", async () => {
    const response = await app.request("api/users/current", {
      method: "GET",
    });

    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  });
});

describe("PATCH /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should rejected if request is invalid", async () => {
    const response = await app.request("api/users/current", {
      method: "PATCH",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        name: "",
        password: "",
      }),
    });

    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  });

  it("should be able to update name", async () => {
    const response = await app.request("api/users/current", {
      method: "PATCH",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        name: "Test",
      }),
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.name).toBe("Test");
  });

  it("should be able to update password", async () => {
    let response = await app.request("/api/users/current", {
      method: "PATCH",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        password: "testpassword123new",
      }),
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();

    response = await app.request("/api/users/login", {
      method: "POST",
      body: JSON.stringify({
        username: "testuser",
        password: "testpassword123new",
      }),
    });

    expect(response.status).toBe(200);
  });
});

describe("DELETE /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should be able to logout", async () => {
    const response = await app.request("/api/users/current", {
      method: "DELETE",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeTrue();
  });

  it("should not be able to logout", async () => {
    let response = await app.request("/api/users/current", {
      method: "DELETE",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeTrue();

    response = await app.request("/api/users/current", {
      method: "DELETE",
      headers: {
        Authorization: "test",
      },
    });

    expect(response.status).toBe(401);
  });
});
