import { Request, Response } from "express";

export default abstract class BaseController {

  abstract handle(request: Request, response: Response): Promise<void>;
}