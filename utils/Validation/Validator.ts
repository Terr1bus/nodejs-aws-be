import Ajv, { ErrorObject, Options, ValidateFunction } from 'ajv';

export type ValidationResult = {
  valid: boolean;
  errors: ErrorObject[] | null;
};

export class Validator {
  public ajv = new Ajv();

  public validateFunction: ValidateFunction;

  public errors: ErrorObject[] | null;

  public isValid: boolean;

  constructor(options?: Options) {
    if (options) {
      this.ajv = new Ajv(options);
    }
  }

  public compile(schema: any): this {
    this.validateFunction = this.ajv.compile(schema);
    return this;
  }

  public validate(data: any): this {
    const isValid = this.validateFunction(data);
    this.isValid = Boolean(isValid);
    if (isValid) {
      this.errors = null;
    } else {
      this.errors = this.validateFunction.errors;
    }

    return this;
  }

  public getResult(): ValidationResult {
    return {
      valid: this.isValid,
      errors: this.errors,
    };
  }
}
