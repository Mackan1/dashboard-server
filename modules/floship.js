//import axios from 'axios'
const axios = require('axios')

class FS {
    constructor(url, token){
        this.url =url;
        this.token = token;
    }
    getOptions(method, path){
        return {
            headers:{
                Authorization: 'Token ' + this.token
            },
            method: method,
            url: this.url+path,
        }
    }
    async getproducts(){
        try{
            const options = this.getOptions('get', '/products/?limit=1000')
            const products = await this.request(options)
            return products;
        }
        catch(err){
            console.log(err.message)
            console.log(err.toJSON())
        }
    }
    
    async postOrder(jsonData){
        try{
            const options = this.getOptions('post', '/orders/')
            options.data = jsonData
            const order = await this.request(options)
            return order.data;
        }
        catch(err){
            console.log(err.message)
            console.log(err.toJSON())
        }
    }
    async getOrderCount(orderName){
        try{
            const options = this.getOptions('get', '/orders/?include=company,billing_address,shipping_address,order_line_items&customer_reference=' + orderName)
            const order = await this.request(options)
            return order.data.count;
        }
        catch(err){
            console.log(err.message)
            console.log(err.toJSON())
        }
    }
    async floshipFullfilments(){
        var d = new Date();
        d.setDate(d.getDate()-7);
        const options = this.getOptions('get', '/orders?status=fulfilled&limit=800&update_date_from='+d.toISOString())
        console.log(options)
        try{
            const orders = await this.request(options)
            return orders
        }
        catch(error){
            console.log(error.message)
            return error
        }
        
    }
    async getOrders(){
        const options = this.getOptions('get', '/orders?include=company,billing_address,shipping_address,order_line_items&order=created_at+desc')
        try{
            const orders = await this.request(options)
            return orders
        }
        catch(error){
            console.log(error.message)
            return error
        }
        
    }
    async request(options){
        return await axios.request(options)
    }
}

module.exports = {
    FS
}