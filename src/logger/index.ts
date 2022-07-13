import logger from "pino";
import dayjs from "dayjs";
const pretty = require('pino-pretty');
const logdir = "/media/akshi/Hard Disk/Backend/Mess-Management-Backend/logs";
const createSonicBoom = (dest: string) =>
    logger.destination({ dest: dest, append: true, sync: true })

const streams: logger.DestinationStream | logger.StreamEntry | (logger.DestinationStream | logger.StreamEntry)[] = [
    { stream: createSonicBoom(`${logdir}/info.log`) }, 
    { level: 'error', stream: createSonicBoom(`${logdir}/error.log`) },
    { level: 'debug', stream: createSonicBoom(`${logdir}/debug.log`) },
    { level: 'warn', stream: createSonicBoom(`${logdir}/warn.log`) },
    { level: 'fatal', stream: createSonicBoom(`${logdir}/fatal.log`) },
    { level: 'trace', stream: createSonicBoom(`${logdir}/trace.log`) },
    {stream:pretty({
        colorize: true,
        sync:true,
        })}

];

const log = logger(
    {
        transport: {
            target: "pino-pretty",
        },
        base: {
            pid: false,
        },
        timestamp: () => `,"time":"${dayjs().format("YYYY-MM-DD HH:mm:ss")}"`,
    }, logger.multistream(streams)

);
export default log;
