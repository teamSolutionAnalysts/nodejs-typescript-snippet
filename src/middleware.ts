import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export class Middleware {
  public authenticateUser = async (req: Request, res: Response, next: () => void) => {
    // Check Auth Token here
    next();
  }
  public setGlobalRquestId = (req: Request, res: Response, next: () => void) => {

    if (!req.globalRequestId) {
      req.globalRequestId = uuidv4();
    }
    next();
  }
  public setMicroserviceRequestId = (req: Request, res: Response, next: () => void) => {

    if (!req.msRequestId) {
      req.msRequestId = uuidv4();
    }
    next();
  }
}
