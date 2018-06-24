/***
setting.
if username and password is required,
you can use `mongodb://${USERNAME}:${PASSWORD}@127.0..0.1:27017/${DATABASE}`
***/
const HOSTNAME = `mongodb://127.0.0.1:27017`
const DB_NAME = 'pingpong'
const COLLECTION_NAME = 'test'

import mongodb from 'mongodb'
import moment from 'moment'
import assert from 'assert'

const MongoClient = mongodb.MongoClient
const baseTime = moment()

const randomInt = Math.ceil(Math.random() * 100000)

const main = async () => {
  let client
  let db
  let collection
  try {
    client = await MongoClient.connect(HOSTNAME)
    db = await client.db(DB_NAME)
    collection = db.collection(COLLECTION_NAME)
    console.log(collection)
    await collection.drop()
    await collection.insert({ foo: randomInt })
    client.close()
    while (true) {
      const requestBeginTime = moment()
      try {
        client = await MongoClient.connect(HOSTNAME)
        db = await client.db(DB_NAME)
        collection = db.collection(COLLECTION_NAME)
        const result = await collection.findOne({ foo: randomInt })
        const requestCompleteTime = moment()
        assert.equal(result.foo, randomInt)
        const timeFromBase = requestBeginTime - baseTime
        const latency = requestCompleteTime - requestBeginTime
        console.log(`${timeFromBase}\t${latency}`)
        client.close()
      } catch (err) {
        const timeFromBase = requestBeginTime - baseTime
        console.log(`${timeFromBase}\t${JSON.stringify(err)}`)
        client.close()
      }
    }
  } catch (err) {
    console.error(err)
    client.close()
  }
}

main()
