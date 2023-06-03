import { Batch, OrderLine } from "@modules/allocate/domain/model";


test('Test allocating to a batch reduces the avaiable quantity', () => {
    const batch = Batch.create('batch-001', 'SMALL-TABLE', 20, new Date());
    const line = OrderLine.create('order-ref', 'SMALL-TABLE', 2);

    batch.allocate(line);

    expect(batch.availableQuantity).toBe(18);
});

type BatchOrder = {
    batch: Batch,
    line: OrderLine
}

function makeBatchAndLine(sku: string, batchQty: number, lineQty: number): BatchOrder {
    return {
        batch: Batch.create('batch-001', sku, batchQty),
        line: OrderLine.create('order-123', sku, lineQty)
    } as BatchOrder;
}

test('Test can allocate if avaiable greater than required', () => {
    const batchOrder = makeBatchAndLine('ELEGANT-LAMP', 20, 2);
    const largeBatch = batchOrder.batch;
    const smallLine = batchOrder.line;

    expect(largeBatch.canAllocate(smallLine)).toBe(true);
});

test('Test cannot allocate if avaiable smaller than required', () => {
    const batchOrder = makeBatchAndLine('ELEGANT-LAMP', 2, 20);
    const smallBatch = batchOrder.batch;
    const largeLine = batchOrder.line;

    expect(smallBatch.canAllocate(largeLine)).toBe(false);
});

test('Test can allocate if avaiable equal to required', () => {
    const { batch, line } = makeBatchAndLine('ELEGANT-LAMP', 2, 2);

    expect(batch.canAllocate(line)).toBe(true);
});

test('Test cannot allocate if skus do not match', () => {
    const batch = Batch.create('batch-001', 'UNCOMFORTABLE-CHAIR', 100, undefined);

    const differentSkuLine = OrderLine.create('order-123', 'EXPENSIVE-TOASTER', 10);

    expect(batch.canAllocate(differentSkuLine)).toBe(false);
});

test('Test allocation is idempotent', () => {
    const { batch, line } = makeBatchAndLine('ANGULAR-DESK', 20, 2);

    batch.allocate(line);
    batch.allocate(line);

    expect(batch.availableQuantity).toBe(18);
});