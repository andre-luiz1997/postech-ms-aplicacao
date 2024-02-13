import { emptyToUndefined } from "src/shared/utils";
import { IMessagingQueue, IMessagingQueueProps } from "../ports/queue";
import * as rabbitMQ from 'amqplib/callback_api';
import config from "src/shared/config";

export class RabbitQueue implements IMessagingQueue {
    static connectionString: string;
    static connection?: rabbitMQ.Connection;
    private static instance?: RabbitQueue;
    static props: IMessagingQueueProps;
    static channel?: rabbitMQ.Channel;

    public static get Instance() {
        return this.instance || (this.instance = new this())
      }

    private constructor() {
        RabbitQueue.props = {
            host: config.queue.host,
            port: config.queue.port,
            password: config.queue.password,
            user: config.queue.user,
        } 
        this.createConnectionString();
    }

    private createConnectionString() {
        const {host, password, user, port} = RabbitQueue.props;
        RabbitQueue.connectionString = `${host}:${port}`;
        if (emptyToUndefined(user) && emptyToUndefined(password)) {
            RabbitQueue.connectionString = `${user}:${password}@${RabbitQueue.connectionString}`;
        }
        RabbitQueue.connectionString = `amqp://` + RabbitQueue.connectionString
    }


    async connect(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            rabbitMQ.connect(RabbitQueue.connectionString, (err, connection) => {
                if(err) reject(err);
                RabbitQueue.connection = connection;
                RabbitQueue.createChannel().then(() => {
                    resolve(true);
                })
            })
        });
    }

    private static async createChannel() {
        return new Promise<void>((resolve, reject) => {
            RabbitQueue.connection.createChannel((err, channel) => {
                if(err) reject(err);
                RabbitQueue.channel = channel;
                resolve();
            })
        })
    }

    addQueue(queue_name: string) {
        RabbitQueue.channel.assertQueue(queue_name, {durable: true});
        RabbitQueue.channel.prefetch(0);
    }

    subscribeToQueue(queue_name: string, callback: Function) {
        RabbitQueue.channel.consume(queue_name, (data) => callback(data), {noAck: true})
    }

    publishToQueue (queue_name: string, data: string) {
        RabbitQueue.channel.sendToQueue(queue_name, Buffer.from(data));
    }
}