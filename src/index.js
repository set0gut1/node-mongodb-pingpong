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
  try {
    db = await MongoClient.connect(HOSTNAME)
    const collection = db.collection('test')
    await collection.drop()
    await collection.insert({ foo: randomInt })
    while (true) {
      const requestBeginTime = moment()
      const result = await collection.find({ foo: randomInt })
      const requestCompleteTime = moment()
      const data = await result.toArray()
      assert.equal(data[0].foo, randomInt)
      const timeFromBase = requestBeginTime - baseTime
      const latency = requestCompleteTime - requestBeginTime
      console.log(`${timeFromBase}\t${latency}`)
    }
  } catch (err) {
    console.error(err)
    db.close()
  }
}

main()
