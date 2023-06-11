import * as express from "express"
import { response } from "../utils"
import { ApiController } from "../api/ApiController"
import { ClienteDTO } from "../dtos/cliente/cliente.dto"
const router = express.Router()

const apiController = ApiController.Instance

router.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  return response(apiController.clienteController.listar(), res, next)
})

router.get("/:id", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  return response(apiController.clienteController.buscarUm(req.params.id), res, next)
})

router.post("/", ClienteDTO.validate, (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const body = req.body
  return response(
    apiController.clienteController.criar({
      cpf: body.cpf,
      email: body.email,
      nome: body.nome,
    }),
    res,
    next
  )
})

router.patch("/:id", ClienteDTO.validate, (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const body = req.body
  return response(
    apiController.clienteController.editar(req.params.id, {
      cpf: body.cpf,
      email: body.email,
      nome: body.nome,
    }),
    res,
    next
  )
})

router.delete("/:id", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    return response(apiController.clienteController.deletar(req.params.id), res, next)
  })

export default router
