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
  static async delete() {
    await prismaClient.contact.deleteMany({
      where: {
        username: "testuser",
      },
    });
  }
}
