import { creadorProductosFaker } from "../models/mocks/index.js";

export const productosController = {
  getData: async (req, res) => {
    try {
      let products = await creadorProductosFaker(5);
      
      if (products.length > 0) {
        res.render("pages/productos", {
          products: products,
          productsExist: true,
        });
      } else {
        res.render("pages/productos", {
          products: products,
          productsExist: false,
        });
      }
    } catch (e) {
      console.log(e)
      res.status(500).send({ error });
    }
  },
};