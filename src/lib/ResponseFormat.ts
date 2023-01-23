import { NextApiResponse } from 'next';

export type TResponseFormat = {
  metadata: {
    status: number;
    message: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

export class ResponseFormat {
  res: NextApiResponse;

  constructor(
    res: NextApiResponse,
    status = 200,
    message = 'OK',
    data?: unknown
  ) {
    this.res = res;
    this.res.status(status).json({
      metadata: {
        status: status,
        message: message,
      },
      data: data,
    });
  }
}
