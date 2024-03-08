'use strict'

import {
    Schema,
    model
} from "mongoose"

const carSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "product",
        require: [true, "product is require"]
    },
    quantity: {
        type: Number,
        require: true
    },
    date: {
        type: String,
        inmutable : true
    }
}, {
    versionKey: false
})

export default model('car', carSchema)