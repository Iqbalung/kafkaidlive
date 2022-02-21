import { Kafka } from 'kafkajs'
import axios from 'axios'
class BrokerController {
  static async brokerTest(request, response) {
    try {
      return response.status(200).json({
        success: true,
        message: request.headers,
      })
    } catch (error) {
      return response.status(301).json({
        success: false,
        error: 'broker error',
      })
    }
  }

  // static async brokerProduce(request, response) {
  //   try {
  //     const data = request.body
  //     const kafka = new Kafka({
  //       clientId: 'my-app',
  //       brokers: ['worthy-longhorn-12974-us1-kafka.upstash.io:9092'],
  //       sasl: {
  //         mechanism: process.env.KAFKA_MECHANISM,
  //         username: process.env.KAFKA_USERNAME,
  //         password: process.env.KAFKA_PASSWORD,
  //       },
  //       ssl: true,
  //     })
  //     const producer = kafka.producer()

  //     const produce = async () => {
  //       await producer.connect()
  //       await producer.send({
  //         topic: 'getBca',
  //         messages: [
  //           {
  //             value: JSON.stringify(data),
  //           },
  //         ],
  //       })
  //       await producer.disconnect()
  //     }
  //     produce()
  //     return response.status(200).json({
  //       success: true,
  //       message: 'produce done',
  //     })
  //   } catch (error) {
  //     return response.status(301).json({
  //       success: true,
  //       message: error.message,
  //     })
  //   }
  // }

  static async brokerConsume(request, response) {
    try {
      const kafka = new Kafka({
        clientId: 'my-app',
        brokers: ['native-meerkat-14805-us1-kafka.upstash.io:9092'],
        sasl: {
          mechanism: process.env.KAFKA_MECHANISM,
          username: process.env.KAFKA_USERNAME,
          password: process.env.KAFKA_PASSWORD,
        },
        ssl: true,
      })

      const consumer = kafka.consumer({
        groupId: 'newscrapping',
      })

      const consume = async () => {
        console.log('consume')
        await consumer.connect()
        await consumer.subscribe({
          topic: 'NewScrapping',
          fromBeginning: true,
        })

        await consumer.run({
          eachMessage: async ({ topic, partition, message }) => {
            console.log('consume '+topic)
            if(message.value.toString().length > 15){
              console.log('data parse', JSON.parse(message.value))
              this.sendmessage({
                topic: topic,
                partition: partition,
                message: JSON.stringify(message),
                val: JSON.parse(message.value),
              })
            }
          },
        })
      }
      consume()

      return response.status(200).json({
        success: true,
        message: 'consume done',
      })
    } catch (error) {
      return response.status(301).json({
        success: true,
        message: error.message,
      })
    }
  }

  static async sendmessage(data) {
    const config = {
      method: 'post',
      url: process.env.BACKEND_PROCESS_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      data: Object.keys(data.val),
      datas: Object.keys(data.val[0]),
    }
    console.log(config)
    axios(config)
      .then((response) => {
        console.log('status', response.status)
        console.log('data ',response.status.data)
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log('response ', error.response.data)
          console.log('response ', error.response.status)
          console.log('response ', error.response.headers)
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log('request ',error.request)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message)
        }
        console.log(error.config)
      })
  }
}

export default BrokerController
