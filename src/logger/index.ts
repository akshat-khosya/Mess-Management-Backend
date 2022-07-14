import pino from "pino";
import _ from "lodash";
import path from "path";
import dayjs from "dayjs";

class Logger {
  private _logger!: pino.Logger;
  private _streams: any;
  private _logDir: any;

  constructor(logDir?: string) {
    this._logDir = _.defaultTo(logDir, path.join(process.cwd(), "logs"));
  }

  init(opts: pino.LoggerOptions) {
    // creates a new pino logger and computed to write to STDOUT with pino-pretty or
    // to log files is NODE_ENV != DEV
    this._logger = pino(
      { ...opts, ...this.shouldUsePinoPretty() },
      pino.multistream([...this._streams])
    );

    // added a default pino-pretty logger to log config to STDOUT
    this.getPrivateLogger().info("Logger initialized with %o options", {
      ...opts,
      ...this.shouldUsePinoPretty(),
    });
  }

  createStreams(streamList: { level: string; name: string }[]) {
    this._streams = streamList.map((stream) => ({
      level: stream.level,
      stream: pino.destination(this.createSonicBoom(stream.name)),
    }));
  }

  private createSonicBoom(name: string) {
    return pino.destination({
      dest: `${this._logDir}/${name}.log`,
      sync: true,
      append: true,
    });
  }

  private shouldUsePinoPretty() {
    if (_.get(process, "env.NODE_ENV", "DEV") === "DEV") {
      return {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
      };
    }

    return {};
  }

  // this logger can be used to log pino-pretty based logs in to STDOUT only which are
  // not written to log files
  private getPrivateLogger() {
    return pino({
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      },
      base: {
        pid: false,
      },
    });
  }

  log() {
    return this._logger;
  }
}

// create a new logger instanse
const logger = new Logger();

// prepare all streams and corresponding log files
logger.createStreams([
  { level: "info", name: "info" },
  { level: "error", name: "error" },
  { level: "debug", name: "debug" },
  { level: "warn", name: "warn" },
  { level: "fatal", name: "fatal" },
  { level: "trace", name: "trace" },
]);

// initialize logger with pino logger options
logger.init( {
        transport: {
            target: "pino-pretty",
        },
        base: {
            pid: false,
        },
        timestamp: () => `,"time":"${dayjs().format("YYYY-MM-DD HH:mm:ss")}"`,
    });

export default logger.log();