import { Request, Response, NextFunction } from 'express';

export interface UpdateOneFn {
  (req: Request, res: Response, next: NextFunction): Promise<Response<any>> | void;
}

export interface CreateOneFn {
  (req: Request, res: Response, next: NextFunction): Promise<Response<any>> | void;
}

export interface DeleteOneFn {
  (req: Request, res: Response, next: NextFunction): Promise<Response<any>> | void;
}

export interface GetAllFn {
  (req: Request, res: Response, next: NextFunction): Promise<Response<any>> | void;
}

export interface PopOptions {
  path: string;
}
