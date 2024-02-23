'use strict'

import Product from './product.model.js'
import { checkUpdate } from '../utils/validator.js'
import Category from '../category/category.model.js'

export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'test function is running' })
}
// -------------------------------ADD PRODUCT-------------------------------------------
export const add = async (req, res) => {
    try {
        let data = req.body
        let category = await Category.findOne({ _id: data.category })
        if (!category) return res.status(404).send({ message: 'Category not found' })
        let product = new Product(data)
        await product.save()
        return res.send({ message: 'Product saved succesfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error saving product', err: err })
    }
}
// --------------------------------------------------------------------------
// -------------------------------UPDATE PRODUCT-------------------------------------------
export const update = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        let updateProduct = await Product.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updateProduct) return res.status(401).send({ message: 'Product not found and not updated' })
        return res.send({ message: 'Updated Product', updateProduct })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating product' })
    }
}
// -------------------------------DELETE PRODUCT-------------------------------------------
export const deleteP = async (req, res) => {
    try {
        let { id } = req.params
        let deletedProduct = await Product.findOneAndDelete({ _id: id })
        if (!deletedProduct) return res.status(404).send({ message: 'Product not found and not deleted' })
        return res.send({ message: `Product ${deletedProduct.name} deleted successfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting Product' })
    }
}
// -------------------------------LIST PRODUCT-------------------------------------------
export const list = async (req, res) => {
    try {
        let product = await Product.find()
        if (product.length === 0) return res.status(400).send({ message: 'Product not found' })
        return res.send({ product })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Product not found' })
    }
}

export const listName = async (req, res) => {
    try {
        let { name } = req.body
        let product = await Product.findOne({ name: name })
        if (!product) return res.status(404).send({ message: 'No product has this name' })
        return res.send({ message: 'Product found', product })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error when listing by name' })
    }
}

// -------------------------------LIST CATEGORY-------------------------------------------
export const listCategory = async(req,res)=>{
    try {
        let {id} = req.body
        let product = await Product.find({category: id}).populate('category',['name','description'])
        if(product.length === 0) return res.status(400).send({message: 'Not found products in this category'})
        return res.send({product})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message:'Not found products'})
    }
}
