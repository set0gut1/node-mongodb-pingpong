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
  const client = await MongoClient.connect(HOSTNAME)
  const db = await client.db(DB_NAME)
  const collection = db.collection(COLLECTION_NAME)
  try {
    await collection.drop()
    await collection.insert({ foo: randomInt })
    while (true) {
      const requestBeginTime = moment()
      try {
        const result = await collection.findOne({ foo: randomInt })
        const requestCompleteTime = moment()
        assert.equal(result.foo, randomInt)
        const timeFromBase = requestBeginTime - baseTime
        const latency = requestCompleteTime - requestBeginTime
        console.log(`${timeFromBase}\t${latency}`)
      } catch (err) {
        const timeFromBase = requestBeginTime - baseTime
        console.log(`${timeFromBase}\t${JSON.stringify(err)}`)
      }
    }
  } catch (err) {
    console.error(err)
  }
}

main()
