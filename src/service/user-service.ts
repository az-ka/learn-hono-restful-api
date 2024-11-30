import { prismaClient } from "../application/database";
import {
  LoginUserRequest,
  RegisterUserRequest,
  toUserResponse,
  UserResponse,
} from "../model/user-model";
import { userValidation } from "../validation/user-validation";
import { HTTPException } from "hono/http-exception";

export class UserService {
  static async register(request: RegisterUserRequest): Promise<UserResponse> {
    request = userValidation.REGISTER.parse(request);

    const totalUserWithSameUsername = await prismaClient.user.count({
      where: {
        username: request.username,
      },
    });

    if (totalUserWithSameUsername !== 0) {
      throw new HTTPException(400, {
        message: "Username already taken",
      });
    }

    request.password = await Bun.password.hash(request.password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    const user = await prismaClient.user.create({
      data: request,
    });

    return toUserResponse(user);
  }

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    request = userValidation.LOGIN.parse(request);

    let user = await prismaClient.user.findUnique({
      where: {
        username: request.username,
      },
    });

    if (!user) {
      throw new HTTPException(401, {
        message: "Invalid username or password",
      });
    }

    const passwordMatch = await Bun.password.verify(
      request.password,
      user.password,
      "bcrypt",
    );

    if (!passwordMatch) {
      throw new HTTPException(401, {
        message: "Invalid username or password",
      });
    }

    user = await prismaClient.user.update({
      where: {
        username: request.username,
      },
      data: {
        token: crypto.randomUUID(),
      },
    });

    const response = toUserResponse(user);
    response.token = user.token!;

    return response;
  }
}
