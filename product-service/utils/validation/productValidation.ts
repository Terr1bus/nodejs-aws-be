import { ValidationResult, Validator } from '../../../utils/Validation';

const productValidationSchema = {
  type: 'object',
  required: ['title', 'count', 'price'],
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    count: {
      type: 'integer',
      minimum: 0,
    },
    price: {
      type: 'number',
      minimum: 0,
    },
  },
};

export const validateProduct = (
  data: Record<string, unknown>
): ValidationResult =>
  new Validator().compile(productValidationSchema).validate(data).getResult();
