const amqp = require("amqplib");

async function recieveMail() {
    try {
        
        // Connect to your local RabbitMQ Docker container
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        // making queue
        const queueForSubUser = "subscribed_users_mail_queue";
        await channel.assertQueue(queueForSubUser, {durable: true});

        channel.consume(queueForSubUser, (message) => {
            if(message != null){
                console.log("Recieve message for Sub user ", JSON.parse(message.content));
                channel.ack(message);
            }
        })
        
    } catch (error) {
        console.log(error);
    }
}

recieveMail();