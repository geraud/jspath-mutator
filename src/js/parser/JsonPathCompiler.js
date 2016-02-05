import {CommonTokenStream, InputStream} from 'antlr4'

import {JsonPathLexer} from  './JsonPathLexer'
import {JsonPathParser} from './JsonPathParser'
import {JsonPathVisitor} from './JsonPathVisitor'

export const parse = input => {
  return createParser(input).parseJsonPath().accept(new JsonPathCompiler());
};

export const createParser = input => {
  const chars = new InputStream(input);
  const lexer = new JsonPathLexer(chars);
  const tokens = new CommonTokenStream(lexer);
  return new JsonPathParser(tokens);
};

export class JsonPathCompiler extends JsonPathVisitor {

  visitParseJsonPath(ctx) {
    return this.visit(ctx, 0);
  }

  visitJsonPath(ctx) {
    return this.visitChildren(ctx.accessSpec());
  }

  visitAccessSpec(ctx) {
    return this.visit(ctx, 0);
  }

  visitDotAccess(ctx) {
    return {index: this.visit(ctx.selector())};
  }

  visitRecursiveDescent(ctx) {
    return {descent: this.visit(ctx.selector())};
  }

  visitSelector(ctx) {
    return this.visit(ctx, 0);
  }

  visitBracketAccess(ctx) {
    return this.visit(ctx.bracketExpression());
  }

  visitBracketExpression(ctx) {
    return this.visit(ctx, 0);
  }

  visitInterpolation(ctx) {
    return {interpolation: '$' + ctx.Interpolation().getText()};
  }

  visitFieldIndex(ctx) {
    return {index: ctx.Identifier() ? ctx.Identifier().getText() : parseInt(ctx.NumericIndex().getText())};
  }

  visitArraySlice(ctx) {
    return {slice: this.visit(ctx, 0)};
  }

  visitArraySection(ctx) {
    return [
      ctx.startSection ? parseInt(ctx.startSection.text) : 0,
      ctx.endSection ? parseInt(ctx.endSection.text) : -1,
      ctx.stepSection ? parseInt(ctx.stepSection.text) : 1
    ];
  }

  visitSimpleSection(ctx) {
    return [
      parseInt(ctx.startSection.text),
      parseInt(ctx.endSection.text),
      1
    ];
  }

  visitTerminal(ctx) {
    return ctx.getText();
  }

  visitErrorNode(ctx) {
    console.log(ctx);
  }

  visit(ctx, index) {
    if (typeof index === 'undefined') {
      return ctx.accept(this);
    } else {
      return ctx.getChild(index).accept(this);
    }
  }

  visitChildren(contexts) {
    return contexts.map(x => x.accept(this));
  }

  bubble(children, resultBuilder) {
    if (children.length == 1) {
      return this.visit(children[0]);
    } else {
      return resultBuilder(this.visitChildren(children));
    }
  }

}

