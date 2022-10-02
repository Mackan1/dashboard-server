const express = require('express');
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

//const { FS } = require("./modules/floship");
const { SHOPIFY } = require("./modules/shopify");
//const SHOPIFYAPI = new SHOPIFY ("https://nordgreencom.myshopify.com", "")

const mongoose = require('mongoose');
const mongo = require('./mongo.js');
//mongoose.connect(``, { useNewUrlParser: true, useUnifiedTopology: true });

const data = require('./excludedJP.js')
//markus krag test
mongoose.connect(``, { useNewUrlParser: true, useUnifiedTopology: true });

const orderSchema = require('./order-schema.js');
const Stores = {
  JP: {
    api_key: "",
    api_password: "",
    store_url: "https://nordgreen-jp.myshopify.com",
    webshipper_company_code: "NG",
    webshipper_country_code: "JP",
    webshipper_order_channel_id: 11,
  },
  KR: {
    api_key: "",
    api_password: "",
    store_url: "https://nordgreen-kr.myshopify.com",
    webshipper_company_code: "NG",
    webshipper_country_code: "KR",
    webshipper_order_channel_id: 12,
  },
  JPIN: {
    api_key: "",
    api_password: "",
    store_url: "https://nordgreen-influencer-jp.myshopify.com",
    webshipper_company_code: "NG",
    webshipper_country_code: "JPIN",
    webshipper_order_channel_id: 3,
  },
  KRIN: {
    api_key: "",
    api_password: "",
    store_url: "https://nordgreen-influencer-kr.myshopify.com",
    webshipper_company_code: "NG",
    webshipper_country_code: "KRIN",
    webshipper_order_channel_id: 3,
  },
  COM: {
    api_key: "",
    api_password: "",
    store_url: "https://nordgreencom.myshopify.com",
    webshipper_company_code: "NG",
    webshipper_country_code: "GL",
    webshipper_order_channel_id: 3,
  },
  INF: {
    api_key: "",
    api_password: "",
    store_url: "https://nordgreen-influencer.myshopify.com",
    webshipper_company_code: "NG",
    webshipper_country_code: "INF",
    webshipper_order_channel_id: 3,
  },
  DK: {
    api_key: "",
    api_password: "",
    store_url: "https://nordgreen.myshopify.com",
    webshipper_company_code: "NG",
    webshipper_country_code: "DK",
    webshipper_order_channel_id: 5,
  },
  DE: {
    api_key: "",
    api_password: "",
    store_url: "https://nordgreen-de.myshopify.com",
    webshipper_company_code: "NG",
    webshipper_country_code: "DE",
    webshipper_order_channel_id: 4,
  },
  TW: {
    api_key: "",
    api_password: "",
    store_url: "https://nordgreen-taiwan.myshopify.com",
    webshipper_company_code: "NG",
    webshipper_country_code: "TW",
    webshipper_order_channel_id: 16,
  },
  UK: {
    api_key: "",
    api_password: "",
    store_url: "https://nordgreen-uk.myshopify.com",
    webshipper_company_code: "NG",
    webshipper_country_code: "UK",
    webshipper_order_channel_id: 6,
  },
  CN: {
    api_key: "",
    api_password: "",
    store_url: "https://nordgreen-cn.myshopify.com",
    webshipper_company_code: "NG",
    webshipper_country_code: "CN",
    webshipper_order_channel_id: 15,
  },
};



const floshipTag = { tags: /Floship/i }
const noFloshipTag = { tags: { $not: /Floship/ } }




// app.post('/postfilter', async (req, res)=>{
//    let body = req.body
//    let from = body.from
//    let to = body.to
//    const dateFilter = { //query today up to tonight
//       created_at: {
//           $gte: new Date(from).toISOString(), 
//           $lt: new Date(to).toISOString()
//       }
//   }

//    const floshipTagAndDate = { $and: [floshipTag, dateFilter]}
//    const noFloshipTagAndDate = { $and: [noFloshipTag, dateFilter]}

//    const noFloshipCount = await orderSchema.countDocuments(noFloshipTagAndDate)
//    const FloshipCount = await orderSchema.countDocuments(floshipTagAndDate)
//    const JSON = {
//       "notFloshipCount": noFloshipCount,
//       "floShipCount": FloshipCount
//    }
//    res.send(JSON)    
//  }) 


//  async function insertMongoData (){
//      for(var storeName in Stores){
//        console.log("Inserting " + storeName)
//       const SHOPIFYAPI = new SHOPIFY (Stores[storeName].store_url, Stores[storeName].api_password)
//       const fullfilments = await SHOPIFYAPI.getFulfilledOrders("2021-09-01","2022-01-01")
//       await fullfilments.forEach((order)=>{
//         if(!("shipping_address" in order) || order["shipping_address"] == undefined){
//             order["shipping_address"] = {
//             "country_code": "Unkown",
//             "zip": "Unkown"
//           }
//          }
//           if(storeName == "JP" || storeName == "JPIN"){
//             if (order["shipping_address"]["zip"] != null){
//               let orderZip = order["shipping_address"]["zip"]
//               if(data.excludeList.some(zipCode => orderZip.includes(zipCode))){
//                 order.area = "Remote area"
//               }else {
//                 order.area = "Not remote"
//               }
//             }
//           }
//             order['_id'] = order['id']; // Assign new key
//             delete order['id']; // Delete old key
//             let tag =  order.tags.toUpperCase()
//             tag = tag.replace(/\s/g,'')
//             tag = tag.replace(/[^a-z0-9_,-]/gi, '');
//             order.tags = tag.split(",")
//             let store = order.name
//             if (store.includes("NGJP")){
//               order.store = "Japan"
//             } else if (store.includes("NGGL")){
//               order.store = "Global"
//             } else if (store.includes("NGCN")){
//               order.store = "China"
//             } else if (store.includes("NGUK")){
//               order.store = "UK"
//             } else if (store.includes("NGTW")){
//               order.store = "Taiwan"
//             } else if (store.includes("NGDE")){
//               order.store = "Germany"
//             } else if (store.includes("NGKR")){
//               order.store = "Korea"
//             } else if (store.includes("NGKRIN")){
//               order.store = "Korea (influencer store)"
//             } else if (store.includes("NGDK")){
//               order.store = "Denmark"
//             } else if (store.includes("NGINF")){
//               order.store = "Influencer store"
//             } else if (store.includes("NGJPIN")){
//               order.store = "Japan (influencer store)"
//             } else {
//               order.store = "Undefined"
//             }
//          if (tag.includes("FLOSHIP")){
//             order.center = "Floship"
//          } else {
//             order.center = "Link"
//          }
        
//       })
//       const connectToMongoDB = async () => {
//          await mongo().then( async (mongoose)=>{
//             try {
//                console.log("Connected to mongoDB")  
//                  await orderSchema.insertMany(fullfilments, { "ordered": false })
//                 console.log("Done")
//             } finally {
//                mongoose.connection.close()
//             }
//          })
//       }
//       try {
//         await connectToMongoDB()
//       } catch (error) {
//         console.log("Error: "+error)
//       }
      
//      }
//  }


// insertMongoData ()


//  app.get("/fullfiled", async (req, res)=>{
   
//      const fullfilments = await SHOPIFYAPI.getFulfilledOrders("2022-01-01","2022-01-03")
//       fullfilments.forEach((order)=>{
          
//           let tag =  order.tags
//             tag = tag.toUpperCase()
//             tag = tag.replace(/\s/g,'')
//             tag = tag.split(",")
//             order.tags = tag
//          if (tag.includes("FLOSHIP")){
//             order.fulfillment = "Floship"
//          } else {
//             order.fulfillment = "Link"
//          }
//       })
//     res.send(fullfilments)
//  })
  app.get("/fulfillmentStatus", async (req, res)=>{
      let tabledata = [
  {
    "$unwind": "$line_items"
  },
  {
    "$group": {
      "_id": {
        "__alias_0": "$line_items.fulfillment_status"
      }
    }
  },
  {
    "$project": {
      "_id": 0,
      "__alias_0": "$_id.__alias_0"
    }
  },
  {
    "$project": {
      "group": "$__alias_0",
      "_id": 0
    }
  },
  {
    "$sort": {
      "group": 1
    }
  },
  {
    "$limit": 50000
  }
]
  
  await orderSchema.aggregate(tabledata).exec(function(err, data){
        if (data){
          res.send(data)
        } else {
            console.log(err)
            console.log("failure")
        }
      })  
  })

  app.get("/shops", async (req, res)=>{
    let tabledata = [
  {
    "$group": {
      "_id": {
        "__alias_0": "$store"
      }
    }
  },
  {
    "$project": {
      "_id": 0,
      "__alias_0": "$_id.__alias_0"
    }
  },
  {
    "$project": {
      "group": "$__alias_0",
      "_id": 0
    }
  },
  {
    "$sort": {
      "group": 1
    }
  },
  {
    "$limit": 50000
  }
]
  await orderSchema.aggregate(tabledata).exec(function(err, data){
        if (data){
          res.send(data)
        } else {
            console.log(err)
            console.log("failure")
        }
      })  
  })

 
  app.get("/center", async (req, res)=>{
    let tabledata = [
  {
    "$group": {
      "_id": {
        "__alias_0": "$center"
      }
    }
  },
  {
    "$project": {
      "_id": 0,
      "__alias_0": "$_id.__alias_0"
    }
  },
  {
    "$project": {
      "group": "$__alias_0",
      "_id": 0
    }
  },
  {
    "$sort": {
      "group": 1
    }
  },
  {
    "$limit": 50000
  }
]
await orderSchema.aggregate(tabledata).exec(function(err, data){
      if (data){
        res.send(data)
      } else {
          console.log(err)
          console.log("failure")
      }
    })  
 })

 app.get("/status", async (req, res)=>{
    let tabledata = [
  {
    "$group": {
      "_id": {
        "__alias_0": "$financial_status"
      }
    }
  },
  {
    "$project": {
      "_id": 0,
      "__alias_0": "$_id.__alias_0"
    }
  },
  {
    "$project": {
      "group": "$__alias_0",
      "_id": 0
    }
  },
  {
    "$sort": {
      "group": 1
    }
  },
  {
    "$limit": 50000
  }
]
await orderSchema.aggregate(tabledata).exec(function(err, data){
      if (data){
        res.send(data)
      } else {
          console.log(err)
          console.log("failure")
      }
    })  
 })

app.get("/tags", async (req, res)=>{

    let tabledata = [
  {
    "$unwind": "$tags"
  },
  {
    "$group": {
      "_id": {
        "__alias_0": "$tags"
      }
    }
  },
  {
    "$project": {
      "_id": 0,
      "__alias_0": "$_id.__alias_0"
    }
  },
  {
    "$project": {
      "group": "$__alias_0",
      "_id": 0
    }
  },
  {
    "$sort": {
      "group": 1
    }
  },
  {
    "$limit": 50000
  }
]
    await orderSchema.aggregate(tabledata).exec(function(err, data){
      if (data){
        res.send(data)
      } else {
          console.log(err)
          console.log("failure")
      }
    })  
 })

 app.get("/countries", async (req, res)=>{

    let tabledata = [
  {
    "$unwind": "$shipping_address"
  },
  {
    "$group": {
      "_id": {
        "__alias_0": "$shipping_address.country_code"
      }
    }
  },
  {
    "$project": {
      "_id": 0,
      "__alias_0": "$_id.__alias_0"
    }
  },
  {
    "$project": {
      "group": "$__alias_0",
      "_id": 0
    }
  },
  {
    "$sort": {
      "group": 1
    }
  },
  {
    "$limit": 50000
  }
]
    await orderSchema.aggregate(tabledata).exec(function(err, data){
      if (data){
        res.send(data)
      } else {
          console.log(err)
          console.log("failure")
      }
    })  
 })

 app.post('/postfilter', async (req, res)=>{
   let body = req.body
   let from = body[0].from
   let to = body[0].to
   superFilter = { //query today up to tonight
      "created_at": {
          "$gte": new Date(from).toISOString(), 
          "$lt": new Date(to).toISOString()
      },
      "store": body[1].store,
      'shipping_address.country_code': body[2]['shipping_address.country_code']
  } 

  let tabledata;
  function insertDate(superFilter){
   tabledata = [
   {
    "$match": superFilter
   },
  {
    "$unwind": "$shipping_address"
  },
  {
    "$group": {
      "_id": {
        "__alias_0": "$center"
      },
      "__alias_1": {
        "$sum": {
          "$cond": [
            {
              "$ne": [
                {
                  "$type": "$shipping_address.country_code"
                },
                "missing"
              ]
            },
            1,
            0
          ]
        }
      }
    }
  },
  {
    "$project": {
      "_id": 0,
      "__alias_0": "$_id.__alias_0",
      "__alias_1": 1
    }
  },
  {
    "$project": {
      "group": "$__alias_0",
      "value": "$__alias_1",
      "_id": 0
    }
  },
  {
    "$sort": {
      "group": 1
    }
  },
  {
    "$limit": 50000
  }
]
  }
  insertDate(superFilter)
   await orderSchema.aggregate(tabledata).exec(function(err, data){
      if (data){
         res.send(data)
         } else {
            console.log(err)
            console.log("failure")
         }
         })  
 }) 

 app.post('/postTagsfilter', async (req, res)=>{
  let store = req.body
  let tabledata;
  function insertDate(store){
   tabledata = [
    {
    "$match": store
   },
  {
    "$unwind": "$tags"
  },
  {
    "$group": {
      "_id": {
        "__alias_0": "$tags"
      }
    }
  },
  {
    "$project": {
      "_id": 0,
      "__alias_0": "$_id.__alias_0"
    }
  },
  {
    "$project": {
      "group": "$__alias_0",
      "_id": 0
    }
  },
  {
    "$sort": {
      "group": 1
    }
  },
  {
    "$limit": 50000
  }
]
  }
  insertDate(store)
   await orderSchema.aggregate(tabledata).exec(function(err, data){
      if (data){
         res.send(data)
         } else {
            console.log(err)
            console.log("failure")
         }
         })  
 }) 


 app.get('/everyday',async (req,res)=>{
   let from = new Date()
   let to = new Date()
   from.setDate(from.getDate()-1)
   try{
    await insertMongoData(from, to)
    res.send("success")
   }
   catch(err){
     console.log(err)
     res.send(err)
   }
 })


app.listen(4000, () => console.log("app is listening on port ", 4000));


 async function insertMongoData (to, from){
     for(var storeName in Stores){
       console.log("Inserting " + storeName)
      const SHOPIFYAPI = new SHOPIFY (Stores[storeName].store_url, Stores[storeName].api_password)
      const fullfilments = await SHOPIFYAPI.getFulfilledOrders(to.toISOString(),from.toISOString())
      await fullfilments.forEach((order)=>{
           if(!("shipping_address" in order) || order["shipping_address"] == undefined){
            order["shipping_address"] = {
            "country_code": "Unkown",
            "zip": "Unkown"
          }
         }
          if(storeName == "JP" || storeName == "JPIN"){
            if (order["shipping_address"]["zip"] != null){
              let orderZip = order["shipping_address"]["zip"]
              if(data.excludeList.some(zipCode => orderZip.includes(zipCode))){
                order.area = "Remote area"
              }else {
                order.area = "Not remote"
              }
            }
          }
            order['_id'] = order['id']; // Assign new key
            delete order['id']; // Delete old key
            let tag =  order.tags.toUpperCase()
            tag = tag.replace(/\s/g,'')
            tag = tag.replace(/[^a-z_,-]/gi, '')
            order.tags = tag.split(",")
            let store = order.name
            if (store.includes("NGJP")){
              order.store = "Japan"
            } else if (store.includes("NGGL")){
              order.store = "Global"
            } else if (store.includes("NGCN")){
              order.store = "China"
            } else if (store.includes("NGUK")){
              order.store = "UK"
            } else if (store.includes("NGTW")){
              order.store = "Taiwan"
            } else if (store.includes("NGDE")){
              order.store = "Germany"
            } else if (store.includes("NGKR")){
              order.store = "Korea"
            } else if (store.includes("NGKRIN")){
              order.store = "Korea (influencer store)"
            } else if (store.includes("NGDK")){
              order.store = "Denmark"
            } else if (store.includes("NGINF")){
              order.store = "Influencer store"
            } else if (store.includes("NGJPIN")){
              order.store = "Japan (influencer store)"
            } else {
              order.store = "Undefined"
            }
         if (tag.includes("FLOSHIP")){
            order.center = "Floship"
         } else {
            order.center = "Link"
         }
      })
      const connectToMongoDB = async () => {
         await mongo().then( async (mongoose)=>{
            try {
               console.log("Connected to mongoDB")  
                 await orderSchema.insertMany(fullfilments, { "ordered": false })
                console.log("Done")
            } finally {
               mongoose.connection.close()
            }
         })
      }
      try {
        await connectToMongoDB()
      } catch (error) {
        console.log("Error: "+error)
      }
     }
 }




// app.get("/test", async (req, res)=>{

//     let tabledata = [
//   {
//     "$match": {"$and": [{"tags": new RegExp("OK", "i")}]}
//    }
// ]
//     await orderSchema.aggregate(tabledata).exec(function(err, data){
//       if (data){
//         console.log("success")
//         res.send(data)
//       } else {
//           console.log(err)
//           console.log("failure")
//       }
//     })  
//  })