import { UserDto } from '#app/modules/user/user.dto.js';
import { Static, Type } from '@sinclair/typebox';

export const CreateUserDto = Type.Object({
	username: Type.String({
		minLength: 3,
	}),
});

export type CreateUserDtoType = Static<typeof CreateUserDto>;

export const CreateUserOkResponseDto = UserDto;

export type CreateUserOkResponseDtoType = Static<
	typeof CreateUserOkResponseDto
>;
