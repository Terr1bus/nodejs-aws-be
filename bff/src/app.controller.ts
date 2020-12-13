import {
  Controller,
  Get,
  Req,
  Param,
  All,
  HttpService,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Method as RequestMethod } from 'axios';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { Method } from './decorators/Method';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configSerice: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  @All(':service/')
  async process(
    @Req() req: Request,
    @Res() res: Response,
    @Param() params: any,
    @Method() method: RequestMethod,
  ) {
    const { path, query, url, baseUrl, originalUrl } = req;
    const serviceUrl = this.configSerice.get(params.service.toUpperCase());
    const metaData = {
      method,
      path,
      query,
      url,
      baseUrl,
      originalUrl,
      productUrl: this.configSerice.get('PRODUCT'),
      cartUrl: this.configSerice.get('CART'),
      params,
      serviceUrl,
    };
    console.log(
      '🚀 ~ file: app.controller.ts ~ line 33 ~ AppController ~ metaData',
      metaData,
    );
    if (!serviceUrl) {
      return res.status(502).json({ message: 'Cannot process request' });
    }
    try {
      const serviceResponse = await this.httpService
        .request({
          method,
          url: `${serviceUrl}${path}`,
        })
        .toPromise();
      const data = serviceResponse.data;

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
