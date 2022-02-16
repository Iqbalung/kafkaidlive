import { Kafka } from 'kafkajs'
// import axios from 'axios'
class BrokerController {
  static async brokerTest(request, response) {
    try {
      return response.status(200).json({
        success: true,
        message: request.headers
      })
    } catch (error) {
      return response.status(301).json({
        success: false,
        error: 'broker error'
      })
    }

  }

  static async brokerProduce(request, response) {
    try {
      // console.log(request.body);
      const data = request.body
      const kafka = new Kafka({
        brokers: ['worthy-longhorn-12974-us1-kafka.upstash.io:9092'],
        sasl: {
          mechanism: process.env.KAFKA_MECHANISM,
          username: process.env.KAFKA_USERNAME,
          password: process.env.KAFKA_PASSWORD,
        },
        ssl: true,
      })
      const producer = kafka.producer()

      const produce = async () => {
        await producer.connect()
        await producer.send({
          topic: 'getBca',
          messages: [
            { value: JSON.stringify(data) },
          ],
        })
        await producer.disconnect()
      }
      produce()
      return response.status(200).json({
        success: true,
        message: 'produce done'
      })
    } catch (error) {
      return response.status(301).json({
        success: true,
        message: error.message
      })
    }
  }

  static async brokerConsume(request, response) {
    try {
      const kafka = new Kafka({
        brokers: ['worthy-longhorn-12974-us1-kafka.upstash.io:9092'],
        sasl: {
          mechanism: process.env.KAFKA_MECHANISM,
          username: process.env.KAFKA_USERNAME,
          password: process.env.KAFKA_PASSWORD,
        },
        ssl: true,
      })

      const consumer = kafka.consumer({ groupId: 'scrapping' })

      const consume = async () => {
        await consumer.connect()
        await consumer.subscribe({ topic: 'getBca', fromBeginning: true })

        await consumer.run({
          eachMessage: async ({ topic, partition, message }) => {
            console.log({
              topic: topic,
              partition: partition,
              message: JSON.stringify(message),
              val: message.value.toString()
            })
          },
        })
      }
      consume()

      return response.status(200).json({
        success: true,
        message: 'consume done'
      })
    } catch (error) {
      return response.status(301).json({
        success: true,
        message: error.message
      })
    }
  }
}

export default BrokerController