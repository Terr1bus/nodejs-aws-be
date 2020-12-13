import { Method as RequestMethod } from 'axios';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Method = createParamDecorator<unknown, unknown, string>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const method: RequestMethod = request.method;
    return method;
  },
);
