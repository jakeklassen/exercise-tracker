import { UserDto } from '#app/modules/user/user.dto.js';
import { Static, Type } from '@sinclair/typebox';

export const UserListDto = Type.Array(UserDto);

export type UserListDtoType = Static<typeof UserListDto>;
