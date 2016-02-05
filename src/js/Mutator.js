import {parse} from './parser/JsonPathCompiler'
import _ from 'lodash';

export class MutatorNode {

  constructor(name, mutations = new Set(), children = new Map()) {
    this.name = name;
    this.mutations = toSet(mutations);
    this.children = children;
  }

  addChild(node) {
    if (this.children.has(node.name)) {
      const child = this.children.get(node.name);
      const newChild = MutatorNode.merge(child, node);
      this.children.set(node.name, newChild);
    } else {
      this.children.set(node.name, node);
    }
    return this;
  }

  key(context = {}) {
    const key = this.name;
    if (key.length > 1 && key[0] == '$') {
      return _.template(key)(context);
    } else {
      return key;
    }
  }

  forEachChild(handler) {
    this.children.forEach(handler);
  };

  static merge(l, r) {
    if (l.name != r.name) {
      throw new Error('cannot merge two nodes with different keys');
    }
    const newContext = MutatorNode.mergeMutations(l, r);
    const newChildren = MutatorNode.mergeChildren(l, r);
    return new MutatorNode(l.name, newContext, newChildren);
  }

  static mergeMutations(l, r) {
    return toSet([...l.mutations, ...r.mutations]);
  }

  static mergeChildren(l, r) {
    const newChildren = new Map();
    const allNames = new Set([...l.children.keys(), ...r.children.keys()]);
    allNames.forEach(name => {
      const l_node = l.children.get(name);
      const r_node = r.children.get(name);
      if (!!l_node && !!r_node) {
        newChildren.set(name, MutatorNode.merge(l_node, r_node));
      } else if (!!l_node) {
        newChildren.set(name, l_node);
      } else if (!!r_node) {
        newChildren.set(name, r_node);
      } else {
        throw new Error('cannot process node. invalid state');
      }
    });
    return newChildren;
  }

  static mutate(state, node, context) {
    const newState = _.clone(state);
    node.forEachChild(child => {
      const key = child.key(context);
      newState[key] = MutatorNode.mutate(state[key], child, context);
    });
    return MutatorNode.applyMutations(newState, node.mutations);
  }

  static applyMutations(state, mutations) {
    mutations.forEach(commandGroup => {
      _.forEach(commandGroup, (args, command) => {
        const handler = MutatorNode.mutators.get(command);
        if (handler) {
          state = handler(state, args);
        } else {
          throw new Error(`unknown mutation command ${command}`);
        }
      });
    });
    return state;
  }

  static mutators = new Map();

  static addHandler(...args) {
    const handler = args.pop();
    args.forEach(name => MutatorNode.mutators.set(name, handler));
    return this;
  }

}

export class Mutator extends MutatorNode {

  constructor() {
    super('$');
  }

  add(path, ...mutations) {
    const [head, ...tail] = parseIndexes(path);
    let lastNode = new MutatorNode(head, mutations);
    tail.forEach(index => {
      const node = new MutatorNode(index);
      if (lastNode) {
        node.addChild(lastNode);
      }
      lastNode = node;
    });
    this.addChild(lastNode);
    return this;
  }

  execute(state, context) {
    return MutatorNode.mutate(state, this, context);
  };

  static defaultHandlerError = (state, {error}) => {
    throw error;
  };

  toReducer(handleError = MutatorNode.defaultHandlerError) {
    return (state, {payload, error}) => {
      if (error) {
        return handleError(state, {payload, error})
      } else {
        return this.execute(state, payload);
      }
    };
  }

  static addHandler(...args) {
    MutatorNode.addHandler(...args);
    return this;
  }
}

const ensureArray = mutation => (state, arg) => {
  let newState = state;
  if (!_.isArray(newState)) {
    newState = [];
  }
  return mutation(newState, arg);
};

const ensureObject = mutation => (state, arg) => {
  let newState = state;
  if (!_.isPlainObject(newState)) {
    newState = {};
  }
  return mutation(newState, arg);
};

Mutator
  .addHandler('$apply', (state, arg) => {
    return arg(state);
  })
  .addHandler('$merge', ensureObject((state, arg) => {

    return _.merge(state, arg)
  }))
  .addHandler('$push', '$append', ensureArray((state = [], arg) => {
    state.push(...toArray(arg));
    return state;
  }))
  .addHandler('$set', (_state, arg) => {
    return arg;
  })
  .addHandler('$unshift', ensureArray((state, arg) => {
    state.unshift(...toArray(arg));
    return state;
  }))
  .addHandler('$shift', ensureArray((state, count) => {
    _.times(count, () => state.shift());
    return state;
  }))
  .addHandler('$take', ensureArray((state, arg) => {
    return _.take(state, arg);
  }))
  .addHandler('$remove', '$delete', ensureObject((state, arg) => {
    return _.omit(state, ...toArray(arg));
  }));

export const parseIndexes = input =>
  parse(input).reverse().map(({index, interpolation}) => {
    if (typeof index == 'undefined' && typeof interpolation == 'undefined') {
      throw new Error(`Cannot create a mutator from path ${path} - Only index and interpolation access is supported`);
    }
    return (index || interpolation).toString()
  });

export const toSet = x => {
  if (x instanceof Set) {
    return x;
  } else if (Array.isArray(x)) {
    return new Set(x);
  } else {
    return new Set([x]);
  }
};

export const toArray = x => {
  if (x instanceof Array) {
    return x;
  } else if (x instanceof Set) {
    return [...x];
  } else {
    return [x];
  }
};
