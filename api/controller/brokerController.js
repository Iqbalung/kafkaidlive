import {BcaUsers} from'../model/bcaUsersModel'
import { Kafka } from 'kafkajs'
import moment from 'moment'
import cron from 'node-cron'

class BrokerController {

  static runCron(request, response) {
    let task = cron.schedule('*/3 * * * * *', () =>  {
      try {
        console.log('start', 'aa')
        
        const produce = this.getAccount()

        if (produce.status === true) {
          return response.status(200).json(produce)
        } else {
          return response.status(301).json(produce)
        }
      } catch (err) {
        console.log(err)
      }
    }, {
      scheduled: false
    })
      
    task.start()
  }

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

  static async getAccount(request, response) {
    try {
      const formatTime = 'HH:mm'
      const formatDate = 'YYYY-MM-DD'
      const formatDateTime = 'YYYY-MM-DD HH:mm:ss'
      let dateNow = moment().format(formatDate)
      const dayName = moment().format('dddd')
      if (dayName !== 'Saturday' || dayName !== 'Monday') {
        const startTime = moment('22:00', formatTime), endTime = moment('23:59', formatTime)
        if(moment().isBetween(startTime, endTime)){
          dateNow = moment(dateNow, formatDate).add(1, 'days').format(formatDate)
        }
      }
      const users = await BcaUsers.find()
      users.forEach(async user => {
        const data = {
          topic : 'getBca',
          'value' : {
            ib: user,
            date: dateNow,
            dateTimeCreated: moment().format(formatDateTime)
          }
        }
        const produce = await this.brokerProduce(data)

        return produce
      })
    } catch (error) {
      return response.status(301).json({
        success: false,
        error: error.message,
      })
    }
  }

  static async brokerProduce(data) {
    try {
      const users = data
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
      const producer = kafka.producer()

      const produce = async (data) => {
        console.log('produce', new Date().toLocaleString(), JSON.stringify(data))
        await producer.connect()
        await producer.send({
          topic: 'NewScrapping',
          messages: [
            {
              value: JSON.stringify(data),
            },
          ],
        })
        await producer.disconnect()
      }
      produce(users)
      return {
        success: true,
        message: 'produce done',
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }

  // static async brokerConsume(request, response) {
  //   try {
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

  //     const consumer = kafka.consumer({
  //       groupId: 'scrapping',
  //     })

  //     const consume = async () => {
  //       await consumer.connect()
  //       await consumer.subscribe({
  //         topic: 'getBca',
  //         fromBeginning: true,
  //       })

  //       await consumer.run({
  //         eachMessage: async ({ topic, partition, message }) => {
  //           console.log('consume '+topic)
  //           if(message.value.toString().length > 15){
  //             this.sendmessage({
  //               topic: topic,
  //               partition: partition,
  //               message: JSON.stringify(message),
  //               val: JSON.parse(message.value),
  //             })
  //           }
  //         },
  //       })
  //     }
  //     consume()

  //     return response.status(200).json({
  //       success: true,
  //       message: 'consume done',
  //     })
  //   } catch (error) {
  //     return response.status(301).json({
  //       success: true,
  //       message: error.message,
  //     })
  //   }
  // }

  // static async sendmessage(data) {
  //   const config = {
  //     method: 'post',
  //     url: process.env.BACKEND_PROCESS_URL,
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     data: Object.keys(data.val),
  //   }

  //   axios(config)
  //     .then((response) => {
  //       console.log(response.status)
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     })
  // }
}

export default BrokerController
