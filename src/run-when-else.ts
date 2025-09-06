export function runWhenElse<T1, T2>(
  condition: boolean,
  fn: () => T1,
  elseFn: () => T2,
): T1 | T2 {
  if (condition) {
    return fn();
  }

  return elseFn();
}
