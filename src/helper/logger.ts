/* eslint-disable jsdoc/require-jsdoc */
import kleur from "kleur";

export const defaultColors = ["#F54180", "#338EF7"] as const;

const logPrefix = kleur.bold(kleur.blue("Snack Money CLI:"));

export type PrefixLogType = Extract<
  keyof typeof Logger,
  "error" | "info" | "log" | "warn" | "success"
>;

export class Logger {
  constructor() {}

  static log(...args: Parameters<typeof console.log>) {
    console.log(logPrefix, ...args);
  }

  static info(...args: Parameters<typeof console.info>) {
    console.info(logPrefix, ...args.map((item) => kleur.blue(item)));
  }

  static success(...args: Parameters<typeof console.info>) {
    console.info(logPrefix, ...args.map((item) => kleur.green(item)));
  }

  static warn(...args: Parameters<typeof console.warn>) {
    console.warn(logPrefix, ...args.map((item) => kleur.yellow(item)));
  }

  static error(...args: Parameters<typeof console.error>) {
    console.error(logPrefix, ...args.map((item) => kleur.red(item)));
  }

  static grey(...args: Parameters<typeof console.log>) {
    console.log(logPrefix, ...args.map((item) => kleur.gray(item)));
  }

  static newLine(lines?: number) {
    if (!lines) lines = 1;

    for (let i = 0; i < lines; i++) this.log();
  }
}
