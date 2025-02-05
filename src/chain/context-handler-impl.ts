import { ContextBuilder } from '../context-builder';
import { Optional } from '../context';
import { ChainCondition, CustomCondition, RenameFieldContextItem } from '../context-items';
import { CustomValidator, RenameEvaluator } from '../base';
import { Bail } from '../context-items/bail';
import { ContextHandler } from './context-handler';
import { ValidationChain } from './validation-chain';

export class ContextHandlerImpl<Chain> implements ContextHandler<Chain> {
  constructor(private readonly builder: ContextBuilder, private readonly chain: Chain) {}

  bail() {
    this.builder.addItem(new Bail());
    return this.chain;
  }

  if(condition: CustomValidator | ValidationChain) {
    if ('run' in condition) {
      this.builder.addItem(new ChainCondition(condition));
    } else if (typeof condition === 'function') {
      this.builder.addItem(new CustomCondition(condition));
    } else {
      throw new Error('express-validator: condition is not a validation chain nor a function');
    }
    return this.chain;
  }

  optional(options: Optional | true = true) {
    if (typeof options === 'boolean') {
      this.builder.setOptional(options ? { checkFalsy: false, nullable: false } : false);
    } else {
      this.builder.setOptional({
        checkFalsy: !!options.checkFalsy,
        nullable: !!options.nullable,
      });
    }

    return this.chain;
  }

  rename(evaluator: RenameEvaluator) {
    this.builder.addItem(new RenameFieldContextItem(evaluator));
    return this.chain;
  }
}
