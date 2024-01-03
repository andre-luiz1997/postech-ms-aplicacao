import * as express from "express";
const router = express.Router();
import clienteRoutes from "./cliente.route";
import itensRoutes from "./item.route";

router.use('/clientes',clienteRoutes);
router.use('/itens',itensRoutes);

// 404
router.use(function (req, res) {
  res.status(404).json({
    status: "404 - Route not found",
  });
});

export default router;
