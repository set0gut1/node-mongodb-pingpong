

/***
setting.
if username and password is required,
you can use `mongodb://${USERNAME}:${PASSWORD}@127.0..0.1:27017/${DATABASE}`
***/
const DATABASE = 'pingpong'
const HOSTNAME = `mongodb://127.0.0.1:27017/${DATABASE}`

import mongodb from 'mongodb'
import moment from 'moment'

const MongoClient = mongodb.MongoClient
const baseTime = moment()

const main = async () => {
  const db = await MongoClient.connect(HOSTNAME)
  const collection = db.collection('test')
  await collection.drop()
  await collection.insert({ foo: 100 })
  while (true) {
    const requestBeginTime = moment()
    const result = await collection.find({ foo: 100 })
    const requestCompleteTime = moment()
    const timeFromBase = requestBeginTime - baseTime
    const latency = requestCompleteTime - requestBeginTime
    console.log(`${timeFromBase}\t${latency}`)
  }
}

main()
