import consola from 'consola';
import { SHOW_LOGS, LOG_LEVELS } from './config.js';

const Logging = (type, data) => {
    if (SHOW_LOGS === true) {
        if (LOG_LEVELS.includes('SILLY') && type === 'SILLY') {
            consola.log(JSON.stringify(data));
        }
        else if (LOG_LEVELS.includes('DEBUG') && type === 'DEBUG') {
            consola.log(data);
        }
        else if (LOG_LEVELS.includes('ERROR') && type === 'ERROR') {
            consola.error(data);
        }
        else if (LOG_LEVELS.includes('INFO') && type === 'INFO') {
            consola.info(data);
        }
        else if (LOG_LEVELS.includes('SUCCESS') && type === 'SUCCESS') {
            consola.success(data);
        }
    }
    return;
}

export default Logging;