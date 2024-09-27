import { SetMetadata } from "@nestjs/common";
import { RolesType } from "../enums/roles-type";

export const Roles = (...roles: RolesType[]): any => SetMetadata('roles', roles);