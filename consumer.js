const amqp = require("amqplib");

async function recieveMail() {
    try {
        
        // Connect to your local RabbitMQ Docker container
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        // making queue
        const queueName = "mail_queue";
        await channel.assertQueue(queueName, {durable: true});

        channel.consume(queueName, (message) => {
            if(message != null){
                console.log("Recieve message ", JSON.parse(message.content));
                channel.ack(message);
            }
        })
        
    } catch (error) {
        console.log(error);
    }
}

recieveMail();