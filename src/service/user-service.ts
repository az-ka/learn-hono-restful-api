import { prismaClient } from "../application/database";
import { RegisterUserRequest, toUserResponse, UserResponse } from "../model/user-model";
import { userValidation } from "../validation/user-validation";
import { HTTPException } from "hono/http-exception";

export class UserService {
    static async register(request: RegisterUserRequest): Promise<UserResponse> {
       request = userValidation.REGISTER.parse(request);
    
       const totalUserWithSameUsername = await prismaClient.user.count({
            where: {
                username: request.username
            }
       });

       if (totalUserWithSameUsername !== 0) {
           throw new HTTPException(400, {
                message: 'Username already taken'
           });
       }

       request.password = await Bun.password.hash(request.password, {
        algorithm: 'bcrypt',
        cost: 10
       });

       const user = await prismaClient.user.create({
        data: request
       })

       return toUserResponse(user);
    }
}