import { Static, Type } from '@sinclair/typebox';

const ExerciseDto = Type.Object({
	description: Type.String(),
	duration: Type.Integer({
		minimum: 0,
	}),
	date: Type.String(),
});

export const UserDto = Type.Object({
	_id: Type.String(),
	username: Type.String(),
	log: Type.Array(ExerciseDto),
	createdAt: Type.String(),
	updatedAt: Type.String(),
});

export type UserDtoType = Static<typeof UserDto>;
