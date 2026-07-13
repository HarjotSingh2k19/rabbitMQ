const amqp = require("amqplib");

async function sendMail() {
    try {

        // Connect to your local RabbitMQ Docker container
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        // naming everything
        const exchange = "mail_exchange";
        const routingKey = "send_mail";
        const queueName = "mail_queue";

        // message we want to send in queue
        const message = {
            to: "abc@gmail.com",
            from: "harish@gmail.com",
            subject: "Hello TP mail",
            body: "Hello abc!!"
        }

        // creating exhange of "direct" type and queue
        await channel.assertExchange(exchange, "direct", {durable: true});
        await channel.assertQueue(queueName, {durable: true});

        // now routing key is mapped to that specific queue
        await channel.bindQueue(queueName, exchange, routingKey);

        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
        
        console.log("Mail data was sent ", message);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.log(error);
    }
} 

sendMail();