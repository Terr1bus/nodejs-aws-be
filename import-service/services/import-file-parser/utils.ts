import { IProduct } from '../../../types';

export const castProductRecord = (data: Record<string, string>): IProduct => {
  return Object.keys(data).reduce((accum, key) => {
    const val = data[key];
    const intVal = parseInt(val, 10);
    const floatVal = parseFloat(val);
    const numberVal = Number(val);
    if (intVal.toString() === val) {
      accum[key] = intVal;
    } else if (floatVal.toString() === val) {
      accum[key] = floatVal;
    } else if (numberVal.toString() === val) {
      accum[key] = numberVal;
    } else {
      accum[key] = val;
    }
    return accum;
  }, {} as IProduct);
};
