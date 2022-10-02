const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    _id: Number,
    tags: Array,
    line_items: Array,
    shipping_address: Array,
    created_at: String,
    financial_status: String,
    center: String,
    store: String,
    area: String
},{
    collection: 'orders'
})

module.exports = mongoose.model('orders', orderSchema)