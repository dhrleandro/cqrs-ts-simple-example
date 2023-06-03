import DomainEvent from "@modules/shared/DomainEvent";

export class Produto {

  private _batches: Batch[];
  private _events: DomainEvent[];
  private _versionNumber: number;

  constructor(readonly sku: string,
    batches: Batch[],
    versionNumber: number
  ) {
    this._batches = [...batches];
    this._events = [];
    this._versionNumber = versionNumber;
  }

  public allocate(line: OrderLine): string | undefined {
    const filteredBatches = Batch.sort(this._batches).filter(b => b.canAllocate(line));
    const batch = filteredBatches.length > 0 ? filteredBatches[0] : undefined;
    
    if (!batch) {
      this._events.push({name: 'OutOfStack', sku: line.sku});
      return undefined;
    }

    batch.allocate(line);
    this._versionNumber++;
    this._events.push({name: 'Allocated', orderId: line.orderId, sku: line.sku, qty: line.qty, batchRef: batch.reference});
    return batch.reference;
  }

  public changeBatchQuantity(reference: string, qty: number): void {
    const batch = this._batches.filter(b => b.reference === reference)[0] || undefined;
    if (!batch)
      return;
    
    batch.setPurchasedQuantity(qty);
    while (batch.allocatedQuantity < 0) {
      const line = batch.deallocateOne();
      this._events.push({name: 'Deallocated', order: line})
    }
  }

  get versionNumber(): number {
    return this._versionNumber;
  }

  get batches(): Batch[] {
    return this._batches;
  }

  get events(): DomainEvent[] {
    return this._events;
  }
}


export class OrderLine {
  constructor(readonly orderId: string,
    readonly sku: string,
    readonly qty: number
  ) {
    Object.freeze(this);
  }

  public static create(orderId: string, sku: string, qty: number): OrderLine {
    return new OrderLine(orderId, sku, qty);
  }
}


export class Batch {

  private allocations: OrderLine[];
  private purchasedQuantity: number;

  constructor(readonly reference: string,
    readonly sku: string,
    readonly qty: number,
    readonly eta?: Date
  ) {
    this.purchasedQuantity = qty;
  }

  public allocate(line: OrderLine): void {
    if (this.canAllocate(line)) {
      this.allocations.push(line);
    }
  }

  public deallocateOne(): OrderLine | undefined {
    return this.allocations.pop();
  }

  get allocatedQuantity(): number {
    return this.allocations.reduce((total, line) => total + line.qty, 0);
  }

  get availableQuantity(): number {
    return this.purchasedQuantity - this.allocatedQuantity;
  }

  public canAllocate(line: OrderLine): boolean {
    return (this.sku === line.sku && this.availableQuantity >= line.qty);
  }

  public setPurchasedQuantity(qty: number) {
    this.purchasedQuantity = qty;
  }

  public static create(reference: string, sku: string, qty: number, eta?: Date): Batch {
    return new Batch(reference, sku, qty, eta);
  }

  public static sort(batches: Batch[]): Batch[] {
    return batches.sort((self, other) => {
      const a = self.eta?.getTime();
      const b = other.eta?.getTime();
  
      if (!a && !b)
        return 0;

      if (!a)
        return -1;
      
      if (!b)
        return 1;
      
      if (a === b)
        return 0;
      
      return a > b ? 1 : -1;
    });
  }
}