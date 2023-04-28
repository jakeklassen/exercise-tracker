import { MigrationContext } from '#app/providers/umzug.js';

const UNIQUE_USERNAME_INDEX_NAME = 'username_1';

export async function up({
  context: { mongoose, UserModel: UserModelResource },
}: MigrationContext): Promise<void> {
  const session = await (
    await mongoose
  ).startSession({
    causalConsistency: false,
  });

  const UserModel = await UserModelResource;

  await session.withTransaction(async () => {
    await UserModel.collection.createIndex(
      {
        username: 1,
      },
      {
        background: true,
        unique: true,
        name: UNIQUE_USERNAME_INDEX_NAME,
      },
    );
  });

  session.endSession();
}

export async function down({
  context: { mongoose, UserModel: UserModelResource },
}: MigrationContext): Promise<void> {
  const session = await (
    await mongoose
  ).startSession({
    causalConsistency: false,
  });

  const UserModel = await UserModelResource;

  await session.withTransaction(async () => {
    const iterator = UserModel.collection.listIndexes();
    while (await iterator.hasNext()) {
      console.log(await iterator.next());
    }

    await UserModel.collection.dropIndex(UNIQUE_USERNAME_INDEX_NAME, {
      writeConcern: {
        w: 1,
      },
    });
  });

  session.endSession();
}
