import Command from "@modules/shared/Command";

export class Allocate extends Command {
  constructor(readonly orderId: string,
    readonly sku: string,
    readonly qty: number
  ) {}
}

export class CreateBatch extends Command {
  constructor(readonly ref: string,
    readonly sku: string,
    readonly qty: number,
    readonly eta?: Date
  ) {}
}

export class ChangeBatchQuantity extends Command {
  constructor(readonly ref: string, readonly qty: number) {}
}