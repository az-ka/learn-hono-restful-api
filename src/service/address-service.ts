import { Address, User } from "@prisma/client";
import {
  CreateAddressRequest,
  AddressResponse,
  toAddressResponse,
  GetAddressRequest,
  UpdateAddressRequest,
} from "../model/address-model";
import { AddressValidation } from "../validation/address-validation";
import { ContactService } from "./contact-service";
import { prismaClient } from "../application/database";
import { HTTPException } from "hono/http-exception";

export class AddressService {
  static async create(
    user: User,
    request: CreateAddressRequest,
  ): Promise<AddressResponse> {
    request = AddressValidation.CREATE.parse(request);
    await ContactService.contactMustExist(user, request.contact_id);

    const address = await prismaClient.address.create({
      data: request,
    });

    return toAddressResponse(address);
  }

  static async get(
    User: User,
    request: GetAddressRequest,
  ): Promise<AddressResponse> {
    request = AddressValidation.GET.parse(request);

    await ContactService.contactMustExist(User, request.contact_id);

    const address = await this.addressMustExist(request.contact_id, request.id);

    return toAddressResponse(address);
  }

  static async addressMustExist(
    contact_id: number,
    address_id: number,
  ): Promise<Address> {
    const address = await prismaClient.address.findFirst({
      where: {
        contact_id,
        id: address_id,
      },
    });

    if (!address) {
      throw new HTTPException(404, {
        message: "Address not found",
      });
    }

    return address;
  }

  static async update(
    user: User,
    request: UpdateAddressRequest,
  ): Promise<AddressResponse> {
    request = AddressValidation.UPDATE.parse(request);

    await ContactService.contactMustExist(user, request.contact_id);

    await this.addressMustExist(request.contact_id, request.id);

    const address = await prismaClient.address.update({
      where: {
        id: request.id,
        contact_id: request.contact_id,
      },
      data: request,
    });

    return toAddressResponse(address);
  }
}
