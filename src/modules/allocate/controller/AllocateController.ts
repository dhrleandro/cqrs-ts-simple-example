import BaseController from "@modules/shared/BaseController";
import { Request, Response } from "express";

export default class AllocateController extends BaseController {

  constructor() {
    super();
  }

  public async handle(request: Request, response: Response): Promise<void> {
    response.json({ message: "AllocateController - Hello TS - Path Mapping 🚀" });
  }
}