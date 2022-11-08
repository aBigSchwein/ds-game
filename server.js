import path from 'path';
import express from 'express';
import { PORT } from './config.js';
import Logging from './logging.js';
import router from './routes/index.js';
import { Server } from 'socket.io';
import Handler from './routes/Handler.js';

const app = express();

app.set('port', PORT);
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

const server = app.listen(app.get('port'), async () => {
	Logging('SUCCESS', `App listening on port ${app.get('port')}!`);
});
const io = new Server(server);
Handler(io);