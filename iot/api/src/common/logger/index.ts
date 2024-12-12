/** @format */
import chalk from 'chalk';
import { FastifyBaseLogger, FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import pino from 'pino';

import { Any } from '@/@types/any';

export class Logger implements FastifyBaseLogger {
  static levels: pino.LevelWithSilent[] = [
    'fatal',
    'error',
    'warn',
    'info',
    'debug',
    'trace',
    'silent',
  ];
  static consoleLevelMap: {
    [level in pino.Level]: 'error' | 'warn' | 'info' | 'debug' | 'trace';
  } = {
    fatal: 'error',
    error: 'error',
    warn: 'warn',
    info: 'info',
    debug: 'debug',
    trace: 'trace',
  };
  static serialisedLevel: {
    [level in pino.Level]: string;
  } = {
    fatal: 'fatal',
    error: 'error',
    warn: 'warn ',
    info: 'info ',
    debug: 'debug',
    trace: 'trace',
  };

  level: pino.Level = 'info';

  loggedRequests: Set<string> = new Set();

  constructor() {}
  child = () => new Logger();

  log = (level: pino.LevelWithSilent, ...args: Any[]) => {
    if (level !== 'silent' && Logger.levels.indexOf(level) <= Logger.levels.indexOf(this.level)) {
      if (args[0]?.err) {
        console[Logger.consoleLevelMap[level]](
          Logger.serialiseLevel(level) + ' ' + Logger.serialiseResponse(args[0]?.res, args[0]?.err)
        );
        this.loggedRequests.add(args[0]?.req?.id);
        return;
      }

      if (args[0]?.req) {
        // console[Logger.consoleLevelMap[level]](
        //   Logger.serialiseLevel(level) + ' ' + Logger.serialiseRequest(args[0].req)
        // );
        return;
      }

      if (args[0]?.res) {
        if (!this.loggedRequests.has(args[0]?.res?.request?.id)) {
          console[Logger.consoleLevelMap[level]](
            Logger.serialiseLevel(level) + ' ' + Logger.serialiseResponse(args[0].res)
          );
          this.loggedRequests.delete(args[0]?.res?.request?.id);
        }
        return;
      }

      console[Logger.consoleLevelMap[level]](Logger.serialiseLevel(level), ...args);
    }
  };

  fatal = (...args: Any[]) => this.log('fatal', ...args);
  error = (...args: Any[]) => this.log('error', ...args);
  warn = (...args: Any[]) => this.log('warn', ...args);
  info = (...args: Any[]) => this.log('info', ...args);
  debug = (...args: Any[]) => this.log('debug', ...args);
  trace = (...args: Any[]) => this.log('trace', ...args);
  silent = (...args: Any[]) => this.log('silent', ...args);

  static serialiseId = (id: FastifyRequest['id']) => {
    return id.replace('req-', '').padStart(6, '0');
  };

  static serialiseLevel = (level: pino.Level) => {
    if (Logger.consoleLevelMap[level] === 'error') return chalk.red(Logger.serialisedLevel[level]);
    if (Logger.consoleLevelMap[level] === 'warn')
      return chalk.yellow(Logger.serialisedLevel[level]);
    if (Logger.consoleLevelMap[level] === 'debug') return chalk.cyan(Logger.serialisedLevel[level]);
    if (Logger.consoleLevelMap[level] === 'trace') return chalk.blue(Logger.serialisedLevel[level]);

    return Logger.serialisedLevel[level];
  };

  static serialiseMethod = (method: FastifyRequest['method']) => {
    if (method.toLowerCase() === 'get') return chalk.green(method);
    if (method.toLowerCase() === 'patch') return chalk.cyan(method);
    if (method.toLowerCase() === 'post') return chalk.blue(method);
    if (method.toLowerCase() === 'delete') return chalk.red(method);
    return method;
  };

  static serialiseStatusCode = (statusCode: FastifyReply['statusCode']) => {
    if (statusCode >= 200 && statusCode < 300) return chalk.green(statusCode);
    if (statusCode >= 300 && statusCode < 400) return chalk.yellow(statusCode);
    if (statusCode >= 400) return chalk.red(statusCode);
    return statusCode;
  };

  static serialiseResponseTime = (time: FastifyReply['elapsedTime']) => {
    if (time >= 1000)
      return `${(time / 1000).toLocaleString('en-GB', { maximumFractionDigits: 1 })}s`;

    return `${time.toLocaleString('en-GB', { maximumFractionDigits: 1 })}ms`;
  };

  static serialiseRequest = (request: FastifyRequest) => {
    let msg = `[${request.id}] ${Logger.serialiseMethod(request.method)} ${request.url.split('?')[0]}`;

    if (request.query) {
      msg += `\n${' '.repeat(7 + `[${request.id}]`.length)}QUERY: ${JSON.stringify(request.query)}`;
    }
    if (request.body) {
      msg += `\n${' '.repeat(7 + `[${request.id}]`.length)}BODY: ${JSON.stringify(request.body)}`;
    }

    return msg;
  };

  static serialiseResponse = (response: FastifyReply, error?: FastifyError) => {
    const request = response.request;
    const id = Logger.serialiseId(request.id);
    const initialPadding = `${' '.repeat(7 + `[${id}]`.length)}`;

    if (error) logger.error(`[${id}]`, error);

    let msg = `[${id}] ${Logger.serialiseMethod(request.method)} ${request.url.split('?')[0]}`;

    if (request.query) {
      msg += `\n${initialPadding} ?: ${JSON.stringify(request.query)}`;
    }
    if (request.body) {
      msg += `\n${initialPadding} ≡: ${JSON.stringify(request.body)}`;
    }

    msg += `\n${initialPadding} ↩: ${Logger.serialiseStatusCode(response.statusCode)}`;

    if (error) {
      msg += `\n${initialPadding} !: ${chalk.red(error)}`;
    }

    msg += `\n${initialPadding} Δ: ${Logger.serialiseResponseTime(response.elapsedTime)}`;

    return msg;
  };
}

export const logger = new Logger();
