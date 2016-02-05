'use strict';
import expect from 'expect'
import {MutatorNode, Mutator, toSet, toArray} from '../src/js/Mutator'

describe('Mutator', () => {

  describe('MutatorNode', () => {

    it('can add a child', () => {
      const node = new MutatorNode('a', ['context1']);
      node.addChild(new MutatorNode('b', ['context2']));
      const expected = true;
      const actual = node.children.has('b');
      expect(actual).toEqual(expected);
    });

  });

  describe('Mutator', () => {

    it('creates a mutator', () => {
      const mutator = new Mutator();
      mutator.add('$.foobar', {$push: 1}, {$shift: 666});
      const expected = new Set([{$push: 1}, {$shift: 666}]);
      const actual = mutator.children.get('foobar').mutations;
      expect(actual).toEqual(expected);
    });

    it('merges mutations for a given path', () => {
      const mutator = new Mutator();
      mutator.add('$.foobar', {$push: 1});
      mutator.add('$.foobar', {$shift: 666});
      const expected = new Set([{$push: 1}, {$shift: 666}]);
      const actual = mutator.children.get('foobar').mutations;
      expect(actual).toEqual(expected);
    });

    it('chains mutations', () => {
      const mutator = new Mutator();
      mutator
        .add('$.foobar', {$push: 1})
        .add('$[foobar]', {$shift: 666});
      const expected = new Set([{$push: 1}, {$shift: 666}]);
      const actual = mutator.children.get('foobar').mutations;
      expect(actual).toEqual(expected);
    });

    it('iterates through its children', () => {
      const mutator = new Mutator();
      mutator
        .add('$.foo', {$push: 1})
        .add('$.bar', {$push: 1});
      const expected = ['foo', 'bar'];
      const actual = [];
      mutator.forEachChild(child => {
        actual.push(child.name);
      });
      expect(actual).toEqual(expected);
    });

    describe('#mergeChildren', () => {

      it('merges two mutations', () => {
        const children = [
          new MutatorNode('child-f-1'),
          new MutatorNode('child-f-2'),
          new MutatorNode('child-s-1')
        ];
        const nodeA = new MutatorNode('first', ['a', 'b'])
          .addChild(children[0])
          .addChild(children[1]);
        const nodeB = new MutatorNode('second', ['c'])
          .addChild(children[2]);
        const expected = new Map()
          .set('child-f-1', children[0])
          .set('child-f-2', children[1])
          .set('child-s-1', children[2]);

        const actual = MutatorNode.mergeChildren(nodeA, nodeB);
        expect(actual).toEqual(expected);
      });

    });

    describe('#mergeMutations', () => {

      it('merges two mutations', () => {
        const nodeA = new MutatorNode('first', ['a', 'b']);
        const nodeB = new MutatorNode('second', ['c']);
        const expected = new Set(['a', 'b', 'c']);
        const actual = MutatorNode.mergeMutations(nodeA, nodeB);
        expect(actual).toEqual(expected);
      });

    });

    describe('mutation are at the right node of the tree', () => {

      const mutator = new Mutator();
      mutator.add('$.foo', {$push: 1});
      mutator.add('$.foo.bar', {$shift: 666});

      it('stores the mutation of the first level in the first level of the tree', () => {
        const expectedFooMutation = new Set([{$push: 1}]);
        const actualFooMutation = mutator.children.get('foo').mutations;
        expect(actualFooMutation).toEqual(expectedFooMutation);
      });

      it('stores the mutation of the second level in the second level of the tree', () => {
        const expectedBarMutation = new Set([{$shift: 666}]);
        const actualBarMutation = mutator.children.get('foo').children.get('bar').mutations;
        expect(actualBarMutation).toEqual(expectedBarMutation);
      });

    });

    describe('#execute', () => {

      it('applies mutations', () => {
        const mutator = new Mutator()
          .add('$.foo', {$push: 1})
          .add('$.bar', {$unshift: 666});
        const expected = {foo: [1], bar: [666, 333]};
        const actual = mutator.execute({bar: [333]});
        expect(actual).toEqual(expected);
      });

      it('applies the mutations in order', () => {
        const mutator = new Mutator()
          .add('$.foo', {$push: 1})
          .add('$.foo', {$apply: x => x.map(y => y + 1)})
          .add('$.bar', {$apply: x => x / 2});
        const expected = {foo: [2], bar: 333};
        const actual = mutator.execute({bar: 666});
        expect(actual).toEqual(expected);
      });

    });

    describe('#toReducer', () => {

      it('creates a redux-compatible reducer', () => {
        const expected = {test: 1};
        const actual = new Mutator().toReducer()({test: 1}, {payload: {}});
        expect(actual).toEqual(expected);
      });

      it('templates keys in a mutation with values from the action', () => {
        const reducer = new Mutator()
          .add('$.foo[{entry}]', {$push: 1})
          .toReducer();
        const expected = {foo: {'my.dream.entry': [1]}};
        const actual = reducer({foo: {}}, {payload: {entry: 'my.dream.entry'}});
        expect(actual).toEqual(expected);
      });

      it('throws by default the action contains an error', () => {
        const reducer = new Mutator()
          .add('$.foo', {$push: 1})
          .toReducer();
        //const expected = {foo: [1]};
        expect(()=> {
          reducer({foo: {}}, {error: 'ouch', payload: {entry: 'my.dream.entry'}});
        }).toThrow();
      });

      it('call the error handler if the action contains an error', () => {
        const expected = {error: 'ouch', payload: {entry: 'my.dream.entry'}};
        let actual = null;
        const reducer = new Mutator()
          .add('$.foo', {$push: 1})
          .toReducer((state, action) => actual = action);
        reducer({foo: {}}, {error: 'ouch', payload: {entry: 'my.dream.entry'}});
        expect(actual).toEqual(expected);
      });

    });

  });

  describe('#toSet', () => {

    it('wraps a non Set/Array value', () => {
      const expected = new Set(['foobar']);
      const actual = toSet('foobar');
      expect(actual).toEqual(expected);
    });

    it('transforms an Array to a Set', () => {
      const expected = new Set(['foobar']);
      const actual = toSet(['foobar']);
      expect(actual).toEqual(expected);
    });

    it('does not wrap a Set', () => {
      const expected = new Set(['foobar']);
      const actual = toSet(new Set(['foobar']));
      expect(actual).toEqual(expected);
    });

  });

  describe('#toArray', () => {

    it('wraps a non array value', () => {
      const expected = ['foobar'];
      const actual = toArray('foobar');
      expect(actual).toEqual(expected);
    });

    it('does not wrap an Array', () => {
      const expected = ['foobar'];
      const actual = toArray(['foobar']);
      expect(actual).toEqual(expected);
    });

    it('transforms a Seq into an Array', () => {
      const expected = ['foobar'];
      const actual = toArray(new Set(['foobar']));
      expect(actual).toEqual(expected);
    });

  });

  describe('mutators', () => {
    const mutator = name => MutatorNode.mutators.get(name);

    describe('$shift', () => {

      it('shift values of an array by "arg" elements', () => {
        const expected = [5, 6];
        const actual = mutator('$shift')([1, 2, 5, 6], 2);
        expect(actual).toEqual(expected);
      });

      it('return an empty array when the state is not an array', () => {
        const expected = [];
        const actual = mutator('$shift')({}, 2);
        expect(actual).toEqual(expected);

      });

    });

    describe('$unshift', () => {

      it('unshift elements', () => {
        const expected = [1, 2, 5, 6];
        const actual = mutator('$unshift')([5, 6], [1, 2]);
        expect(actual).toEqual(expected);
      });

      it('coerces the state to a blank array', () => {
        const expected = [1, 2];
        const actual = mutator('$unshift')({foo: 'bar'}, [1, 2]);
        expect(actual).toEqual(expected);

      });

    });

    describe('$set', () => {

      it('sets a value of an object', () => {
        const expected = {a: 1, b: 3};
        const actual = mutator('$merge')({a: 1}, {b: 3});
        expect(actual).toEqual(expected);
      });

      it('coerces the state to a blank object', () => {
        const expected = {b: 3};
        const actual = mutator('$merge')([], {b: 3});
        expect(actual).toEqual(expected);
      });
    });

    describe('$apply', () => {

      it('applies the state to a function', () => {
        const expected = 'HELLO';
        const actual = mutator('$apply')('hello', msg => msg.toUpperCase());
        expect(actual).toEqual(expected);
      });

    });

    describe('$push/$append', () => {

      it('pushes elements into an array', () => {
        const expected = [1, 2, 3, 5];
        const actual = mutator('$push')([1, 2], [3, 5]);
        expect(actual).toEqual(expected);
      });

      it('coerces the state to a blank array', () => {
        const expected = [3, 5];
        const actual = mutator('$push')({}, [3, 5]);
        expect(actual).toEqual(expected);
      });

    });

    describe('$set', () => {

      it('sets the state to the value', () => {
        const expected = [1, 2, 3, 5];
        const actual = mutator('$set')('whatever', [1, 2, 3, 5]);
        expect(actual).toEqual(expected);
      });

    });

    describe('$take (truncate)', () => {

      it('takes n elements from an array', () => {
        const expected = [1, 2];
        const actual = mutator('$take')([1, 2, 3, 5], 2);
        expect(actual).toEqual(expected);
      });

      it('coerces the state to a blank array', () => {
        const expected = [];
        const actual = mutator('$take')({}, 3);
        expect(actual).toEqual(expected);
      });

    });

    describe('$remove', () => {

      it('removes all keys specified from an object', () => {
        const expected = {c: 3, d: 4};
        const actual = mutator('$delete')({a: 1, b: 2, c: 3, d: 4}, ['a', 'b']);
        expect(actual).toEqual(expected);
      });

      it('coerces the state to a blank object', () => {
        const expected = {};
        const actual = mutator('$delete')([], ['a', 'b']);
        expect(actual).toEqual(expected);
      });

    });

  });

})
;
