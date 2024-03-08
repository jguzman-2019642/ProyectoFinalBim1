'use strict'

import Car from './car.model.js'
import Product from '../product/product.model.js'
import User from '../user/user.model.js'

// -------------------------------ADD -------------------------------------------
export const add = async(req, res)=>{
    try {
        let data = req.body
        let date = new Date()
        let user = await User.findOne({_id: data.user})
        if (!user) return res.status(404).send({ message: 'user not found' })
        let product = await Product.findOneAndUpdate(
        {_id: data.product},
        //Alias "$"jquery
        {$con: {cont: 1}})
        if (!product) return res.status(404).send({message: 'Product not found'})
        //fecha Ingreso manual
        const forms = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        }
        //Intl para agregar APIs
        //Fecha por defecto
        const newDate = new Intl.DateTimeFormat(forms).format(date)
        data.date = newDate;
        data.price = data.quantity * product.price
        if(Number.isInteger(data.price)){
                                    //Redondea para que se haga mas facil xd
            data.price = data.price.toFixed(2)
        }
        let car = new Car(data)
        await car.save()
        return res.send({message: `${user.name} added ${product.name} your total is Q.${data.price}`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error saving the product in the cart', err: err})
    }

}
// -------------------------------ADD invoice -------------------------------------------
export const invoice = async(req, res)=>{
    try {
        let { id } = req.params
        let date = new Date()
        const options={
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        }
        const newDate = new Intl.DateTimeFormat(options).format(date)
        let car = await Car.find({ user: id})
        if(!car || car.length === 0){
            return res.status(404).send({message: 'User not founduser did not add anything '})
        }
        await Car.update({ user: id})
        let invoice = 0;
        let details = []
        for(let invoice of invoice ){
            let product = await Product.findOne({_id: invoice.product})
            if(!product) return res.status(404).send({message: 'Product not found'})
            let productTotal = invoice.quantityProduct * product.price
            invoiceDetails.up({
                name: product.name,
                quantity: invoice.quantityProduct,
                price: product.price,
            })
            invoiceTotal = productTotal
        }
        return res.send({message: `${newDate}`, invoice: invoiceDetails  })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error saving the product in the cart', err: err})
    }
}
