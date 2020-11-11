import Ajv from 'ajv';
import { ValidationResult, Validator } from '../../../utils/Validation/Validator';

const ajv = new Ajv();

type ImportFileType = {
  fileName: string;
};

const schema = {
  type: 'object',
  properties: {
    fileName: {
      type: 'string',
    },
  },
  required: ['fileName'],
  additionalProperties: false,
};

export const validateImportProducts = (data: any): ValidationResult => {
  return new Validator().compile(schema).validate(data).getResult();
};
