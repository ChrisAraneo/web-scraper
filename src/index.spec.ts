import { concat } from './index';

describe('concat function', () => {
  test('concatenates "Hello" and "World" to equal "HelloWorld"', () => {
    expect(concat('Hello', 'World')).toBe('HelloWorld');
  });

  test('concatenates "foo" and "bar" to equal "foobar"', () => {
    expect(concat('foo', 'bar')).toBe('foobar');
  });

  test('concatenates empty string and "test" to equal "test"', () => {
    expect(concat('', 'test')).toBe('test');
  });

  test('concatenates "Type" and "Script" to equal "TypeScript"', () => {
    expect(concat('Type', 'Script')).toBe('TypeScript');
  });
});
