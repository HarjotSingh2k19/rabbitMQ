const amqp = require("amqplib");

async function sendMail() {
    try {

        // Connect to your local RabbitMQ Docker container
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        // naming everything
        const exchange = "mail_exchange";
        const routingKeyForSubUser = "send_mail_to_subscribed_users";
        const routingKeyForNormalUser = "send_mail_to_users";
        const queueForSubUser = "subscribed_users_mail_queue";
        const queueForNormalUser = "users_mail_queue";

        // message we want to send in queue
        const message = {
            to: "normalUser@gmail.com",
            from: "harish@gmail.com",
            subject: "Hello TP mail",
            body: "Hello abc!!"
        }

        // creating exhange of "direct" type and queue
        await channel.assertExchange(exchange, "direct", {durable: true});

        await channel.assertQueue(queueForSubUser, {durable: true});
        await channel.assertQueue(queueForNormalUser, {durable: true});

        // now routing key is mapped to that specific queue
        await channel.bindQueue(queueForSubUser, exchange, routingKeyForSubUser);
        await channel.bindQueue(queueForNormalUser, exchange, routingKeyForNormalUser);

        channel.publish(exchange, routingKeyForSubUser, Buffer.from(JSON.stringify(message)));
        
        console.log("Mail data was sent ", message);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.log(error);
    }
} 

sendMail();