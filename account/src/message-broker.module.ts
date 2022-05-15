import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'message-broker',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'accounts',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'accounts',
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class MessageBroker {}
