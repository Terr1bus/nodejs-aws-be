import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { validateImportProducts } from './importProducts.validation';
import { HttpError } from '../../../utils/HttpError';
import { ApiGatewayError } from '../../../utils/ApiGatewayError';
import { getFileUploadSignedUrl } from './importProducts.service';
import { ApiGatewayResult } from '../../../utils/ApiGatewayResult';

interface ImportProductsFileEvent extends APIGatewayProxyEvent {
  queryStringParameters: {
    name: string;
  };
}

export const importProductsFile: APIGatewayProxyHandler = async (
  event: ImportProductsFileEvent,
  _context
) => {
  console.log({ event });
  try {
    const { queryStringParameters } = event;
    const validationResult = validateImportProducts(queryStringParameters);
    if (validationResult.valid === false) {
      throw new HttpError({ message: 'Validation failed', code: 400 });
    }

    const signedUrl = await getFileUploadSignedUrl(queryStringParameters.name);

    return new ApiGatewayResult({ body: { uploadUrl: signedUrl } }).addCors();
  } catch (e) {
    console.log({ error: e });
    return ApiGatewayError.handleError(e);
  }
};
