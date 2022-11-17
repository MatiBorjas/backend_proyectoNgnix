import { faker } from "@faker-js/faker";

export default function creadorProductosFaker(n = 5) {
    let productos = [];
    for (let i = 0; i < n; i++) {
        productos.push({
            id: faker.database.mongodbObjectId(),
            name: faker.vehicle.vehicle(),
            price: faker.commerce.price(100000, 200000, 0, "$"),
            thumbnail: faker.image.avatar()
        });
    }
    return productos;
};
