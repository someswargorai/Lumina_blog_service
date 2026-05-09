import amqp from 'amqplib';
import dotenv from 'dotenv';
dotenv.config();

async function sendMail(followers: {email:string}[], subject: string, message: string) {

    try {
        const mailExchange = "mail_exchange";
        const mailQueue = "mail_queue";

        const connection = await amqp.connect(process.env.AMQP_URL!);
        const channel = await connection.createChannel();
        const routingKey = "bind_key";

        await channel.assertExchange(mailExchange, "direct", { durable: true });
        await channel.assertQueue(mailQueue, {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': 'dlq_exchange',
                'x-dead-letter-routing-key': 'bind_key'
            }
        });
        
        channel.bindQueue(mailQueue, mailExchange, routingKey);
        for(let i=0; i<followers?.length; i++){
            channel.publish(mailExchange, routingKey, Buffer.from(JSON.stringify({ email: followers[i].email, subject, message })));
        }
        console.log(`[x] Sent ${message}`);

    } catch (err) {
        console.log(err);
    }

}

export default sendMail;