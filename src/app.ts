import { Server } from './model/server';
import { PORT } from './config/envs.config';

const server = new Server( Number(PORT) );
server.listen();