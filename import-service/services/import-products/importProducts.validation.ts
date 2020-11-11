import {
  ValidationResult,
  Validator,
} from '../../../utils/Validation/Validator';

type ImportFileType = {
  fileName: string;
};

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
  },
  required: ['name'],
  additionalProperties: false,
};

export const validateImportProducts = (data: any): ValidationResult => {
  return new Validator().compile(schema).validate(data).getResult();
};
