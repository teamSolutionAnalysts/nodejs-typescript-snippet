import * as i18n from "i18n";
import { Constants } from "../config/constants";
import { Failure } from "./error";

export class ResponseBuilder {

  public static successMessage(code?: number, msg?: string): ResponseBuilder {
    const rb: ResponseBuilder = new ResponseBuilder();
    rb.responseCode = code || 200;
    rb.responseMessage = msg || null;
    return rb;
  }

  public static errorMessage(msg?: any): ResponseBuilder {
    const rb: ResponseBuilder = new ResponseBuilder();
    rb.responseCode = 500;
    rb.error = msg != null ? msg : i18n.__("ERR_INTERNAL_SERVER");
    return rb;
  }

  public static badRequest(msg: any): ResponseBuilder {
    const rb: ResponseBuilder = new ResponseBuilder();
    rb.responseCode = 400;
    rb.error = msg;
    return rb;
  }

  public static data(result: Json, msg?: string): ResponseBuilder {
    const rb: ResponseBuilder = new ResponseBuilder();
    rb.responseCode = 200;
    rb.result = result;
    rb.responseMessage = msg || null;
    return rb;
  }

  public static errorData(result: Json, msg?: string, code?: number, pager?: any): ResponseBuilder {
    const rb: ResponseBuilder = new ResponseBuilder();
    rb.responseCode = code || 500;
    rb.result = result;
    rb.pager = pager || {};
    rb.error = msg != null ? msg : i18n.__("ERR_INTERNAL_SERVER");
    return rb;
  }

  public static error(err: Failure) {
    const rb: ResponseBuilder = new ResponseBuilder();
    if (err.type === Constants.BAD_DATA) {
      rb.responseCode = 400;
      rb.error = err.title;
      rb.result = err.data || null;
      return rb;
    }
    rb.responseCode = 500;
    rb.error = err.title || i18n.__("ERR_INTERNAL_SERVER");
    rb.result = err.data || null;
    return rb;
  }

  public static commonForError(msg: any, code: number): ResponseBuilder {
    const rb: ResponseBuilder = new ResponseBuilder();
    rb.responseCode = code;
    rb.error = msg;
    return rb;
  }

  public responseCode: number;
  public responseMessage: string;
  public error: string;
  public result: any;
  public description: string;

  public pager: any;
}
