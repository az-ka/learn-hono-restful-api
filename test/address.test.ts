import { expect, describe, it, beforeEach, afterEach } from "bun:test";
import { AddressTest, ContactTest, DatabaseTest, UserTest } from "./test-util";
import app from "../src";

describe("POST /api/contact/{contact_id}/addresses", () => {
  beforeEach(async () => {
    await DatabaseTest.cleanUpAll();
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await DatabaseTest.cleanUpAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should rejected if request is invalid", async () => {
    const contact = await ContactTest.get();

    const response = await app.request(
      "/api/contacts/" + contact.id + "/addresses",
      {
        method: "POST",
        headers: {
          Authorization: "test",
        },
        body: JSON.stringify({
          city: "",
          postal_code: "",
        }),
      },
    );

    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  });

  it("should rejected if contact does not exist", async () => {
    const contact = await ContactTest.get();
    const response = await app.request(
      "/api/contacts/" + (contact.id + 1) + "/addresses",
      {
        method: "POST",
        headers: {
          Authorization: "test",
        },
        body: JSON.stringify({
          city: "Jakarta",
          postal_code: "12345",
          street: "Jl. Jendral Sudirman",
          province: "DKI Jakarta",
          country: "Indonesia",
        }),
      },
    );

    expect(response.status).toBe(404);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  });

  it("should create address successfully", async () => {
    const contact = await ContactTest.get();

    const response = await app.request(
      "/api/contacts/" + contact.id + "/addresses",
      {
        method: "POST",
        headers: {
          Authorization: "test",
        },
        body: JSON.stringify({
          city: "Jakarta",
          postal_code: "12345",
          street: "Jl. Jendral Sudirman",
          province: "DKI Jakarta",
          country: "Indonesia",
        }),
      },
    );

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.id).toBeDefined();
    expect(body.data.city).toBe("Jakarta");
    expect(body.data.postal_code).toBe("12345");
    expect(body.data.street).toBe("Jl. Jendral Sudirman");
    expect(body.data.province).toBe("DKI Jakarta");
    expect(body.data.country).toBe("Indonesia");
  });
});

describe("GET /api/contact/{contact_id}/addresses/{id}", () => {
  beforeEach(async () => {
    await DatabaseTest.cleanUpAll();
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.create();
    await AddressTest.create();
  });

  afterEach(async () => {
    await DatabaseTest.cleanUpAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should rejected if address not found", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();

    const response = await app.request(
      "/api/contacts/" + contact.id + "/addresses/" + (address.id + 1),
      {
        method: "GET",
        headers: {
          Authorization: "test",
        },
      },
    );

    expect(response.status).toBe(404);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  });

  it("should success if address found", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();

    const response = await app.request(
      "/api/contacts/" + contact.id + "/addresses/" + address.id,
      {
        method: "GET",
        headers: {
          Authorization: "test",
        },
      },
    );

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.id).toBe(address.id);
    expect(body.data.city).toBe(address.city);
    expect(body.data.postal_code).toBe(address.postal_code);
    expect(body.data.street).toBe(address.street);
    expect(body.data.province).toBe(address.province);
    expect(body.data.country).toBe(address.country);
  });
});

describe("PUT /api/contact/{contact_id}/addresses/{id}", () => {
  beforeEach(async () => {
    await DatabaseTest.cleanUpAll();
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.create();
    await AddressTest.create();
  });

  afterEach(async () => {
    await DatabaseTest.cleanUpAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should rejected if request is invalid", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();

    const response = await app.request(
      "/api/contacts/" + contact.id + "/addresses/" + address.id,
      {
        method: "PUT",
        headers: {
          Authorization: "test",
        },
        body: JSON.stringify({
          country: "",
          city: "",
          postal_code: "",
        }),
      },
    );

    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  });

  it("should rejected if address not found", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();

    const response = await app.request(
      "/api/contacts/" + contact.id + "/addresses/" + (address.id + 1),
      {
        method: "PUT",
        headers: {
          Authorization: "test",
        },
        body: JSON.stringify({
          city: "Jakarta",
          postal_code: "12345",
          street: "Jl. Jendral Sudirman",
          province: "DKI Jakarta",
          country: "Indonesia",
        }),
      },
    );

    expect(response.status).toBe(404);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  });

  it("should success if request is valid", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();

    const response = await app.request(
      "/api/contacts/" + contact.id + "/addresses/" + address.id,
      {
        method: "PUT",
        headers: {
          Authorization: "test",
        },
        body: JSON.stringify({
          city: "Jakarta",
          postal_code: "12345",
          street: "Jl. Jendral Sudirman",
          province: "DKI Jakarta",
          country: "Indonesia",
        }),
      },
    );

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.id).toBe(address.id);
    expect(body.data.city).toBe("Jakarta");
    expect(body.data.postal_code).toBe("12345");
    expect(body.data.street).toBe("Jl. Jendral Sudirman");
    expect(body.data.province).toBe("DKI Jakarta");
    expect(body.data.country).toBe("Indonesia");
  });
});
