'use strict'

import Car from './car.model.js'
import Product from '../product/product.model.js'
import User from '../user/user.model.js'
//import para PDF
import PDFDocument from 'pdfkit'
import fs from 'fs'
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// -------------------------------ADD -------------------------------------------
export const add = async (req, res) => {
    try {
        let data = req.body
        let date = new Date()
        let user = await User.findOne({ _id: data.user })
        if (!user) return res.status(404).send({ message: 'user not found' })
        let product = await Product.findOneAndUpdate(
            { _id: data.product },
            //Alias "$"jquery
            { $con: { cont: 1 } })
        if (!product) return res.status(404).send({ message: 'Product not found' })
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
        if (Number.isInteger(data.price)) {
            //Redondea para que se haga mas facil
            data.price = data.price.toFixed(2)
        }
        let car = new Car(data)
        await car.save()
        return res.send({ message: `${user.name} added ${product.name} your total is Q.${data.price}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error saving the product in the cart', err: err })
    }

}
// -------------------------------ADD invoice -------------------------------------------
/*
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
*/
export const invoice = async (req, res) => {
    try {
        let { id } = req.params
        let date = new Date()
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        }
        const newDate = new Intl.DateTimeFormat(options).format(date)
        let car = await Car.find({ user: id })
        if (!car || car.length === 0) {
            return res.status(404).send({ message: 'User not found or user did not add anything ' })
        }
        await Car.updateMany({ user: id }, { $set: { processed: true } }); // Update all user's cart items as processed
        let invoiceDetails = []; // Define invoiceDetails to store details of the invoice
        let totalAmount = 0;
        for (let item of car) {
            let product = await Product.findOne({ _id: item.product })
            if (!product) return res.status(404).send({ message: 'Product not found' })
            let productTotal = item.quantity * product.price
            invoiceDetails.push({
                name: product.name,
                quantity: item.quantity,
                price: product.price,
            });
            totalAmount += productTotal;
        }
        const invoiceData = {
            date: newDate,
            items: invoiceDetails
        };
        const outputPath = path.join(__dirname, 'invoice.pdf'); // Define output path for PDF
        generateInvoicePDF(invoiceData, outputPath); // Generate PDF
        return res.send({ message: `${newDate}`, invoice: invoiceDetails })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error generating the invoice', err: err })
    }
}
// obtener Factura
export const getInvoice = async (req, res) => {
    try {
        let { search } = req.body
        // Verificar si el ID de usuario en el token coincide con el ID de usuario en la solicitud
        if (tokenUserId !== search) {
            return res.status(401).send({ message: "No estás autorizado para realizar esta acción." });
        }

        let invoice = await Car.find({ user: search }).populate('user', ['name']);
        if (!purchase || purchase.length === 0) return res.status(404).send({ message: 'Purchase not found' });

        return res.send({ message: 'Purchase found', purchase });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error getting purchase' });
    }
}
// generarPDF de factura
// Función para generar un PDF de la factura

export const generateInvoicePDF = async (invoice) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const __filename = fileURLToPath(import.meta.url);
        const currentDir = dirname(__filename);
        const invoicesDir = join(currentDir, '..', '..', 'invoices');
        const pdfPath = join(invoicesDir, `InvoiceNo.${invoice._id}.pdf`);

        const stream = doc.pipe(fs.createWriteStream(pdfPath));

        doc.fontSize(20).text('Invoice', { align: 'center' }).moveDown();

        doc.fontSize(12).text(`User: ${invoice.user}`, { align: 'left' });
        doc.text(`Date: ${invoice.date}`, { align: 'left' }).moveDown();

        doc.text('Invoice Items:', { align: 'left' }).moveDown();

        for (const item of invoice.items) {
            doc.text(`- Item: ${item.item}, Quantity: ${item.quantity}, Unit Price: ${item.unitPrice}`, { align: 'left' });
        }

        doc.moveDown().text(`Total: ${invoice.totalAmount}`, { align: 'right' });

        doc.end();

        stream.on('finish', () => {
            resolve(pdfPath);
        });

        stream.on('error', (err) => {
            reject(err);
        });
    });
};