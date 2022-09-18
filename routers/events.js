const { Router } = require('express');
const router = Router()
const {MongoClient, ObjectId} = require('mongodb');
// const url = require('url');
// const querystring = require('querystring');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'eventDB';

async function main() {
    await client.connect();
  }
  
main()
.then(console.log('db running'))
.catch(console.error)

var collection = client.db("eventDB").collection('collection');

// fetching event by id
router.get('/events/?', async(req,res) =>{
    const id = req.query._id
    const doc = await collection.findOne({id:id})
    res.send(doc)
})

// fetching events by pagination
router.get('/events/?' , async(req,res) =>{
    const sort = { createdAt:-1}
    let limit = parseInt(req.query.limit)
    let page =  parseInt(req.query.page)
    let skip = (page-1)*limit
    const k = []
    const ndoc = await collection.find({}).sort(sort).limit(limit).skip(skip)
    await ndoc.forEach( async(v) =>{
        k.push(v);
    });
    // console.log(k.length);
    res.send(k)
})

//creating a new event
router.post('/events' , async(req, res) =>{
    const newEvent = req.body;
    newEvent['createdAt'] = new Date()
    newEvent['updatedAt'] = new Date()

    try {
        const newdoc = await collection.insertOne(newEvent);
        res.send(newdoc)
    }
    catch(e) {
        console.log('Error ',e);
    }
})

// updating an event details
router.put('/events/:id' , async(req,res) =>{
    const id = req.params.id
    const newDoc= { $set: req.body}
    try{
    const returnNewDoc = await collection.findOneAndUpdate({_id:ObjectId(id)}, newDoc, {upsert:true, returnNewDocument:true});
    returnNewDoc.value['updatedAt'] = new Date()
    res.send(returnNewDoc)

    }
    catch(e){
        console.log("error" , e);
        res.send(e)
    }
})

// deleteing a document by its id
router.delete('/events/:id' , async(req,res) =>{
    const id = req.params.id
    const deleteConfirm = await collection.deleteOne({_id:ObjectId(id)})
    res.send(deleteConfirm)

})

module.exports = router