import { Kafka } from "kafkajs"
import axios from "axios"
class BrokerController {
    static async brokerTest(request, response) {
        console.log("tes")
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
                    mechanism: 'scram-sha-256',
                    username: 'd29ydGh5LWxvbmdob3JuLTEyOTc0JM73AwOzuxjilBEm3Wojj_eZoD9B-CatG_k',
                    password: 'mNcZFsLK-apQsj6u2IweXnfqH95isyY1i-ilj7CUBxI3QuzvbWLZrzfbv3OXGJjsP4Uj8Q==',
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
        
            const kafka = new Kafka({
                brokers: ['worthy-longhorn-12974-us1-kafka.upstash.io:9092'],
                sasl: {
                    mechanism: 'scram-sha-256',
                    username: 'd29ydGh5LWxvbmdob3JuLTEyOTc0JM73AwOzuxjilBEm3Wojj_eZoD9B-CatG_k',
                    password: 'mNcZFsLK-apQsj6u2IweXnfqH95isyY1i-ilj7CUBxI3QuzvbWLZrzfbv3OXGJjsP4Uj8Q==',
                },
                ssl: true,
            })

            const consumer = kafka.consumer({ groupId: 'scrapping' })

            const consume = async () => {
                await consumer.connect()
                await consumer.subscribe({ topic: 'getBca', fromBeginning: true })

                await consumer.run({
                    eachMessage: async ({ topic, partition, message }) => {
                        this.sendmessage({
                            topic: topic,
                            partition: partition,
                            message: JSON.stringify(message),
                            val:  JSON.parse(message.value)
                        })

                    },
                })
            }
            consume()

             


            return response.status(200).json({
                success: true,
                message: 'consume done'
            })
        
    }

    static async sendmessage(data){
        
        var config = {
          method: 'post',
          url: 'https://webhook.site/89a715a2-3f2a-4184-9380-f5e4d458bcfe',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : Object.keys(data.val)   
        };

        axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });

    }

}

export default BrokerController