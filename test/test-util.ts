import { Contact } from "@prisma/client";
import { prismaClient } from "../src/application/database";

export class UserTest {
  static async create() {
    await prismaClient.user.create({
      data: {
        username: "testuser",
        name: "Test User",
        password: await Bun.password.hash("testpassword123", {
          algorithm: "bcrypt",
          cost: 10,
        }),
        token: "test",
      },
    });
  }

  static async delete() {
    await prismaClient.user.deleteMany({
      where: {
        username: "testuser",
      },
    });
  }
}

export class ContactTest {
  static async deleteAll() {
    await prismaClient.contact.deleteMany({
      where: {
        username: "testuser",
      },
    });
  }

  static async create() {
    await prismaClient.contact.create({
      data: {
        first_name: "Alice",
        last_name: "Lie Wulan",
        email: "test@gmail.com",
        username: "testuser",
        phone: "1234567890",
      },
    });
  }

  static async createMany(n: number) {
    for (let i = 0; i < n; i++) {
      await this.create();
    }
  }

  static async get(): Promise<Contact> {
    return prismaClient.contact.findFirstOrThrow({
      where: {
        username: "testuser",
      },
    });
  }
}

export class DatabaseTest {
  static async cleanUp() {
    // Delete addresses first due to foreign key constraints
    await prismaClient.address.deleteMany({
      where: {
        contact: {
          username: "testuser",
        },
      },
    });

    // Delete contacts next
    await prismaClient.contact.deleteMany({
      where: {
        username: "testuser",
      },
    });

    // Delete users last
    await prismaClient.user.deleteMany({
      where: {
        username: "testuser",
      },
    });
  }

  static async cleanUpAll() {
    // Delete all addresses
    await prismaClient.address.deleteMany();

    // Delete all contacts
    await prismaClient.contact.deleteMany();

    // Delete all users
    await prismaClient.user.deleteMany();
  }
}
