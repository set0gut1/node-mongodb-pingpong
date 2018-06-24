/***
setting.
if username and password is required,
you can use `mongodb://${USERNAME}:${PASSWORD}@127.0..0.1:27017/${DATABASE}`
***/
const DATABASE = 'pingpong'
const HOSTNAME = `mongodb://127.0.0.1:27017/${DATABASE}`

import mongodb from 'mongodb'
import moment from 'moment'
import assert from 'assert'

const MongoClient = mongodb.MongoClient
const baseTime = moment()

const randomInt = Math.ceil(Math.random() * 100000)

const main = async () => {
  let db
  let collection
  try {
    db = await MongoClient.connect(HOSTNAME)
    collection = db.collection('test')
    await collection.drop()
    await collection.insert({ foo: randomInt })
    db.close()
    while (true) {
      const requestBeginTime = moment()
      try {
        db = await MongoClient.connect(HOSTNAME)
        collection = db.collection('test')
        const result = await collection.findOne({ foo: randomInt })
        const requestCompleteTime = moment()
        assert.equal(result.foo, randomInt)
        const timeFromBase = requestBeginTime - baseTime
        const latency = requestCompleteTime - requestBeginTime
        console.log(`${timeFromBase}\t${latency}`)
        db.close()
      } catch (err) {
        const timeFromBase = requestBeginTime - baseTime
        console.log(`${timeFromBase}\t${JSON.stringify(err)}`)
        db.close()
      }
    }
  } catch (err) {
    console.error(err)
    db.close()
  }
}

main()
