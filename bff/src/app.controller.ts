import {
  Controller,
  Get,
  Req,
  Param,
  All,
  HttpService,
  Res,
  Body,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Method as RequestMethod } from 'axios';
import { Request, Response } from 'express';
import { CacheService } from './cache.service';
import { Method } from './decorators/Method';

const isGetProductListRequest = (
  service: string,
  path: string,
  method: string,
): boolean => service === 'product' && path === '/products' && method === 'GET';

@Controller()
export class AppController {
  constructor(
    private readonly cacheService: CacheService,
    private readonly configSerice: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  @All(':service/')
  async process(
    @Req() req: Request,
    @Res() res: Response,
    @Param() params: any,
    @Body() body: any,
    @Method() method: RequestMethod,
  ) {
    const { path, query, url, baseUrl, originalUrl } = req;

    const serviceUrl = this.configSerice.get(params.service);

    const metaData = {
      method,
      path,
      query,
      url,
      baseUrl,
      originalUrl,
      productUrl: this.configSerice.get('product'),
      cartUrl: this.configSerice.get('cart'),
      params,
      serviceUrl,
      body: JSON.stringify(body),
    };
    console.log(
      '🚀 ~ file: app.controller.ts ~ line 33 ~ AppController ~ metaData',
      metaData,
    );

    if (!serviceUrl) {
      return res.status(502).json({ message: 'Cannot process request' });
    }

    const getProductsListRequest = isGetProductListRequest(
      params.service,
      path,
      method,
    );
    try {
      let data: Record<string, unknown>;
      if (getProductsListRequest && !this.cacheService.isEmpty()) {
        data = this.cacheService.getCache()!;
      } else {
        const serviceResponse = await this.httpService
          .request({
            method,
            url: `${serviceUrl}${path}`,
            ...(Object.keys(body).length !== 0 && { data: body }),
          })
          .toPromise();
        data = serviceResponse.data;
        if (getProductsListRequest) {
          this.cacheService.setCache(data);
        }
      }

      return res.json(data);
    } catch (e) {
      const status = e?.response?.status;
      const data = e?.response?.data;
      if (status && data) {
        return res.status(status).json(data);
      }
      return res
        .status(500)
        .json({ message: 'Something went wrong', meta: e?.code });
    }
  }
}
