import { faker } from "@faker-js/faker";

export default async function creadorId() {
  const id = faker.database.mongodbObjectId();

  return id;
};

