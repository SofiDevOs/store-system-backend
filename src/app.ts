import { PORT } from "./config/envs.config";
import { Server } from "./model/server";




const server = new Server(Number(PORT));
server.listen();
