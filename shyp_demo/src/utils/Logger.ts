import { AxiosError } from "axios";
import { call, CallEffect } from "redux-saga/effects";

export class Logger{
  public static log(...args: any[]):void {
    if (this._isDev()) {
        this.console.log(...args)
    }
  }
  public static warn(...args: any[]):void {
    if (this._isDev()) {
        this.console.warn(...args)
    }
  }
  public static error(...args: any[]):void {
    if (this._isDev()) {
        this.console.error(...args)
    }
  }
  // Displays saga error message. Should be yielded
  public static sagaError(error: AxiosError, sagaName:string):CallEffect {
    if (this._isDev()){
      let message: string;
      if (error.response) {
        const { status, data } = error.response;
        message =`${sagaName}: Request failed with ${status} status and message ${data.message} `;
      } else {
        message = error.toString()
      }
      return call([this.console, 'error'], message)
    }
    return call(() => null)
  }
  public static poke<T>(value: T, label: string = ''):T {
    if (this._isDev()){
        this.console.log(`${label}: `, value);
    }
    return value
  }
  private static console = global.console;
  private static _isDev(): boolean{
    return process.env.NODE_ENV === 'development'
  }
}

export default Logger