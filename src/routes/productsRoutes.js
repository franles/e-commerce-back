import express from 'express'
import { createProduct, updateProduct, getProductById, getAllProducts, deleteProducts } from '../controllers/productsControllers.js'

const router = express.Router()

//Rutas publicas
router.get('/', getAllProducts)//obtener todos los productos

router.get('/:id', getProductById)//obtener producto por id


//Rutas protegidas (Admins)
router.post('/', createProduct) //crear producto

router.put('/:id', updateProduct) //actualizar producto

router.delete('/:id', deleteProducts) //eliminar producto

export default router