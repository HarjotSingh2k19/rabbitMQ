const amqp = require("amqplib");

async function recieveMail() {
    try {
        
        // Connect to your local RabbitMQ Docker container
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        // making queue
        const queueForNormalUser = "users_mail_queue";
        await channel.assertQueue(queueForNormalUser, {durable: true});

        channel.consume(queueForNormalUser, (message) => {
            if(message != null){
                console.log("Recieve message for Normal user ", JSON.parse(message.content));
                channel.ack(message);
            }
        })
        
    } catch (error) {
        console.log(error);
    }
}

recieveMail();