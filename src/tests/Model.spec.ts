import { OrderLine } from "@modules/allocate/domain/model";

test('Order Line', () => {
  const line = new OrderLine('1', 'MESA-QUADRADA', 2);
  expect(line.orderId).toBe('1');
  expect(line.sku).toBe('MESA-QUADRADA');
  expect(line.qty).toBe(2);
});