import DomainEvent from "@modules/shared/DomainEvent";

export class Allocated extends DomainEvent {
  constructor(readonly orderId: string,
    readonly sku: string,
    readonly qty: number,
    readonly batchref: string
  ) {}
}

export class Deallocated extends DomainEvent {
  constructor(readonly orderId: string,
    readonly sku: string,
    readonly qty: number
  ) {}
}

export class OutOfStock extends DomainEvent {
  constructor(readonly sku: string) {}
}