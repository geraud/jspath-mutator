'use strict';
import expect from 'expect'

import {CommonTokenStream, InputStream} from 'antlr4'

import {JsonPathLexer} from  '../src/js/parser/JsonPathLexer'
import {JsonPathParser} from '../src/js/parser/JsonPathParser'
import {JsonPathVisitor} from '../src/js/parser/JsonPathVisitor'

import {JsonPathCompiler, createParser} from '../src/js/parser/JsonPathCompiler'

describe('JsonPathCompiler', () => {

  describe('parser', () => {
    let visitor;

    beforeEach(() => visitor = new JsonPathCompiler());

    describe('#parseJsonPath', () => {
      const parse = input => makeParser(input).parseJsonPath().accept(visitor);

      it('parses a path', () => {
        const expected = [{index: 'toto'}, {slice: [1, 5, 1]}, {descent: 'titi'}];
        const actual = parse('$.toto[1,5]..titi');
        expect(actual).toEqual(expected);
      });

    });

    describe('#recursiveDescent', () => {
      const parse = input => makeParser(input).recursiveDescent().accept(visitor);

      it('parses a descent (recursive scan)', () => {
        const expected = {descent: 'titi'};
        const actual = parse('..titi');
        expect(actual).toEqual(expected);
      });

    });

    describe('#bracketAccess', () => {
      const parse = input => makeParser(input).bracketAccess().accept(visitor);

      it('parses a numeric index access', () => {
        const expected = {index: 666};
        const actual = parse('[666]');
        expect(actual).toEqual(expected);
      });

      it('parses a named access', () => {
        const expected = {index: 'foobar'};
        const actual = parse('[foobar]');
        expect(actual).toEqual(expected);
      });

      it('parses an array section', () => {
        const expected = {slice: [1, 10, 2]};
        const actual = parse('[1:10:2]');
        expect(actual).toEqual(expected);
      });

      it('parses a simple section', () => {
        const expected = {slice: [1, -1, 1]};
        const actual = parse('[1,-1]');
        expect(actual).toEqual(expected);
      });

      it('parses an indexed field when the index is numeric', () => {
        const expected = {index: 666};
        const actual = parse('[666]');
        expect(actual).toEqual(expected);
      });

    });

    describe('#interpolation', () => {
      const parse = input => makeParser(input).interpolation().accept(visitor);

      it('parses an interpolation', () => {
        const expected = {interpolation: '${test}'};
        const actual = parse('{test}');
        expect(actual).toEqual(expected);
      });

    });

    describe('#selector', () => {
      const parse = input => makeParser(input).selector().accept(visitor);

      it('parses a splat selector', () => {
        const expected = '*';
        const actual = parse('*');
        expect(actual).toEqual(expected);
      });

    });

    describe('#arraySlice', () => {
      const parse = input => makeParser(input).arraySlice().accept(visitor);

      it('parses a slice containing an #arraySection', () => {
        const expected = {slice: [1, 13, 2]};
        const actual = parse('1:13:2');
        expect(actual).toEqual(expected);
      });

      it('parses a simple section', () => {
        const expected = {slice: [2, 6, 1]};
        const actual = parse('2,6');
        expect(actual).toEqual(expected);
      });

    });

    describe('#arraySection', () => {
      const parse = input => makeParser(input).arraySection().accept(visitor);

      it('parses a section with all three params set', () => {
        const expected = [1, 13, 2];
        const actual = parse('1:13:2');
        expect(actual).toEqual(expected);
      });

      it('parses a section with the last param missing', () => {
        const expected = [1, 13, 1];
        const actual = parse('1:13');
        expect(actual).toEqual(expected);
      });

      it('parses a section with the first and last param missing', () => {
        const expected = [0, 13, 1];
        const actual = parse(':13');
        expect(actual).toEqual(expected);
      });

    });

    describe('#simpleSection', () => {
      const parse = input => makeParser(input).simpleSection().accept(visitor);

      it('parses a simple section', () => {
        const expected = [1, 3, 1];
        const actual = parse('1, 3');
        expect(actual).toEqual(expected);
      });
    });

    describe('#fieldIndex', () => {
      const parse = input => makeParser(input).fieldIndex().accept(visitor);

      it('parses an numeric index', () => {
        const expected = {index: 123};
        const actual = parse('123');
        expect(actual).toEqual(expected);
      });

      it('parses a textual index', () => {
        const expected = {index: 'foobar'};
        const actual = parse('foobar');
        expect(actual).toEqual(expected);
      });

    });

  });
});

const makeParser = input => {
  const parser = createParser(input);
  parser.setTrace();
  return parser;
};

