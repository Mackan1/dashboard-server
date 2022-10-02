// import axios from 'axios';
// import tg from './tradegecko.js';
const axios = require('axios')

class SHOPIFY {
    constructor(url, token){
        this.url = url;
        this.token = token;
    }
    async setupWebshipperOrder(tgOrder){
        return {
                "data": {
                  "type": "orders",
                  "attributes": {
                    "delivery_address": this.unfoldAddress(tgOrder.addresses, tgOrder.order.shipping_address_id, tgOrder.companies[0]),
                    "sender_address": {
                      "company_name": "link-logistics",
                      "address_1": "Vallensbaekvej 51-53",
                      "zip": "2600",
                      "city": "Brøndby",
                      "country_code": "DK"
                    },
                    "original_shipping": this.getShippingMethod(tgOrder.order_line_items),
                    "order_lines": this.formatProductsResponse(await this.findProducts(tgOrder.order_line_items)),
                    "ext_ref": tgOrder.order.order_number
                  },
                  "relationships": {
                    "order_channel": {
                        "data": {
                            "id": this.order_channel,
                            "type": "order_channels"
                        }
                    }
                }
            }
        }
    }
    getOptions(method, path){
        return {
            headers:{
                "X-Shopify-Access-Token": this.token,
                "Content-Type": 'application/json'
            },
            method: method,
            url: this.url+path
        }
    }
    getOptionsWithUrl(method, path, url, token){
        return {
            headers:{
                "X-Shopify-Access-Token": token,
                "Content-Type": 'application/json'
            },
            method: method,
            url: url+path
        }
    }
    getOptionsWithFullUrl(method, fullurl){
        return {
            headers:{
                "X-Shopify-Access-Token": this.token,
                "Content-Type": 'application/json'
            },
            method: method,
            url: fullurl
        }
    }
    async getUnfulfilledOrders(){
        const options = this.getOptions('get', '/admin/api/2020-07/orders.json?fulfillment_status=unfulfilled&limit=250')
        console.log(options)
        const unfulfilledOrders = await this.request(options);
        if(unfulfilledOrders.headers.link && unfulfilledOrders.headers.link.indexOf('rel="next"')>-1){
            return this.resolveForCursorbased(unfulfilledOrders.data.orders, unfulfilledOrders, options)
        }
        else{
            return unfulfilledOrders.data.orders;
        }
    }
    async getFulfilledOrders(from, to){
        const options = this.getOptions('get', '/admin/api/2020-07/orders.json?status=any&limit=250&created_at_min='+from+'&created_at_max='+to)
        console.log(options)
        const fulfilledOrders = await this.request(options);
        if(fulfilledOrders.headers.link && fulfilledOrders.headers.link.indexOf('rel="next"')>-1){
            return this.resolveForCursorbased(fulfilledOrders.data.orders, fulfilledOrders, options)
        }
        else{
            return fulfilledOrders.data.orders;
        }
    }


    async getFloshipOrders(){
        const options = this.getOptions('get', '/admin/api/2022-01/orders.json?tags=floship&limit=250')
        console.log(options)
        const floshipOrders = await this.request(options);
        return floshipOrders.data
    }



    async delayRequest(ms) {
        return new Promise((resolve, reject) => {
          try {
            setTimeout(() => {
              resolve()
            }, ms)
          } catch(error) {
            reject()
          }
        })
      }
    async addOrderFulfillment(orderId, fulfillmentData){
        const options = this.getOptions('post', '/admin/api/2020-07/orders/'+ orderId+'/fulfillments.json')
        console.log(options)
        console.log(fulfillmentData)
        options.data = JSON.stringify(fulfillmentData);
        try{
            const response = await this.request(options);
        } catch(e){
            console.log(e.message);
        }
    }
    async resolveForCursorbased(results, response, options){
        await this.delayRequest(1000)
        if(response.headers.link && response.headers.link.indexOf('rel="next"')>-1){
          let ArrayURL =  response.headers.link.split(' ')
          let nextLink = ''
          for(var i = 0; i < ArrayURL.length; i++){
            if(ArrayURL[i].indexOf('rel="next"')>-1){
              nextLink = ArrayURL[i-1].replace('<', '').replace('>','').replace(';', '')
            }
          }
          const nextResponse = await this.request(this.getOptionsWithFullUrl('get', nextLink))
          const data = nextResponse.data.orders
          results = results.concat(data)
          return await this.resolveForCursorbased(results, nextResponse, options)
        }
        else{
          return results
        }
      }
      async cursorBasedRequest(path, options) {
        return new Promise(async (resolve, reject) => {
          try {
            const pathURL = new URL(path)
            const pathSearchParams = pathURL.searchParams
            let requests = []
            let result = []
            let search = new URLSearchParams()
            pathSearchParams.forEach((value, name) => {
              search.append(name, value)
            })
            search = search.toString()
            options.resolveWithFullResponse = true
            console.log(`${pathURL.origin}${pathURL.pathname}?${search}`)
            const response = await request.get(`${pathURL.origin}${pathURL.pathname}?${search}`, options)
            const data = JSON.parse(response.body)
            for (const name in data) {
              const value = data[name]
      
              if (isArray(value)) {
                value.forEach(object => {
                  result.push(object)
                })
              } else if (isObject(value)) {
                result.push(value)
              }
            }
            
            let results = await resolveForCursorbased(result, response, options)
            resolve(results)
          } catch(error) {
            console.error('[ERROR]', error.stack)
          }
        })
      }
    async tagOrder(orderId, tag, url, token){
        let options = null;
        await sleep(8000)
        if(url){
            options = this.getOptionsWithUrl('get', '/admin/api/2020-07/orders.json?name='+orderId +'&status=any', url, token)
        }
        else{
            options = this.getOptions('get', '/admin/api/2020-07/orders.json?name='+orderId + '&status=any')
        }
        console.log('options', options);
        try{
            const response = await this.request(options);
            if(response.data){
                console.log(response.data)
                let tags = response.data.orders[0].tags
                if(tags.indexOf(tag)<0){
                    tags += ', '
                    tags += tag
                    let id = response.data.orders[0].id
                    let options1 = null;
                    if(url){
                        options1 = this.getOptionsWithUrl('put', '/admin/api/2020-07/orders/'+id+'.json', url, token)
                    }
                    else{
                        options1 = this.getOptions('put', '/admin/api/2020-07/orders/'+id+'.json')
                    }
                    options1.data = JSON.stringify({
                        order:{
                            tags: tags
                        }
                    });
                    const response1 = await this.request(options1);
                }
            }
        } catch(e){
            console.log('errr',e.message);
        }
    }
    async saveOrder(json){
        try{
            const options = this.getOptions('post', '/orders')
            options.data = json
            const order = await this.request(options)
            return order;
        }
        catch(err){
            console.log(err.message)
            console.log(err.toJSON())
        }
    }
    async request(options){
        return await axios.request(options)
    }
    getShippingMethod(lineItems){
        for(const item of lineItems){
            if(item.line_type == 'shipping'){
                return {
                    'shipping_code': item.label,
                    'shipping_name': item.label,
                    'price': item.price,
                    'vat_percent': item.tax_rate
                }
            }
        }
    }
    unfoldAddress = (addresses, id, company)=>{
        for(const address of addresses){
            if(address.id == id){
                return {
                    "att_contact": address.first_name + " " + address.last_name,
                    "company_name": address.company_name,
                    "address_1": address.address1,
                    "address_2": address.address2,
                    "zip": address.zip_code,
                    "city": address.city,
                    "country_code": address.country_code,
                    "email": company.email
                }
            }
        }
    }
    async findProducts(lineItems){
        try{
        const products = []
        
        for(const item of lineItems){
            if(item.line_type == 'product'){
                let productResponse = await this.tgapi.findVariant(item.variant_id)
                let product = productResponse.data.variant
                product.quantity = parseFloat(item.quantity)
                product.price = parseFloat(item.price)
                products.push(product)
            }
        }
        return products
        
        } catch(err){
            console.log(err);
        }
    }
    formatProductsResponse(products){
        const formatedResponse = []
        products.forEach((product, idx, array) =>{
            formatedResponse.push({
                "sku": product.sku,
                "description": product.name,
                "quantity": product.quantity,
                "location": "",
                "country_of_origin": "DK",
                "unit_price": product.price,
                "ext_ref": product.product_id,
                "weight": product.weight_value,
                "weight_unit": product.weight_unit
            })
        })
        return formatedResponse;
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

//export default SHOPIFY

module.exports = {
    SHOPIFY
}