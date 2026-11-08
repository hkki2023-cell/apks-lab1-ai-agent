'use strict';

const { add, greet, main } = require('../src/hello');

test('BasicAddition', () => {
  expect(add(2, 3)).toBe(5);
  expect(add(-1, 1)).toBe(0);
});

test('GreetDefault', () => {
  expect(greet()).toBe('Hello, World!');
});

test('GreetName', () => {
  expect(greet('Lviv')).toBe('Hello, Lviv!');
});

test('MainReturnsZero', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  expect(main([])).toBe(0);
  expect(spy).toHaveBeenCalledWith('Hello, World!');
  spy.mockRestore();
});
