type Options = {
  message: string;
  code: number;
  meta?: any;
};

export class HttpError extends Error {
  public code: number;

  public meta: any = {};

  constructor(options: Options) {
    super(options.message);
    this.code = options.code;
    if (options.meta !== undefined) {
      this.meta = options.meta;
    }
  }
}
