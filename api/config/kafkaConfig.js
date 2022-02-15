export default class KafkaConfig {
    kafkaConnect() {
        try {
            const {
                Kafka
            } = require('kafkajs')

            const kafka = new Kafka({
                brokers: ['{{ BOOTSTRAP_ENDPOINT }}'],
                sasl: {
                    mechanism: 'scram-sha-512',
                    username: '{{ UPSTASH_KAFKA_USERNAME }}',
                    password: '{{ UPSTASH_KAFKA_PASSWORD }}',
                },
                ssl: true,
            })
        } catch (error) {
            console.log(error)
        }
    }
}