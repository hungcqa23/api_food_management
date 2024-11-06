import { NextFunction, Request, Response } from 'express';
import { Model, Document } from 'mongoose';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/app-error';
import APIFeatures from '../utils/api-features';
import { GetAllFn, CreateOneFn, UpdateOneFn, DeleteOneFn, PopOptions } from '../models/interfaces/factory.interfaces';
import { MESSAGES } from '../constants/messages';
import HTTP_STATUS from '~/constants/httpStatus';

const getAll = (Model: Model<any>): GetAllFn => {
  return catchAsync(async (req: Request, res: Response) => {
    let filter = {};
    if (req.params.id) filter = { book: req.params.id };
    const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().paginate();

    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      data: {
        doc
      }
    });
  });
};

const updateOne = (Model: Model<any>): UpdateOneFn => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc: Document | null = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError(MESSAGES.NO_DOCUMENT_WAS_FOUND, HTTP_STATUS.NOT_FOUND));
    }

    res.status(200).json({
      status: MESSAGES.UPDATED_SUCCESSFULLY,
      data: {
        doc
      }
    });
  });
};

const createOne = (Model: Model<any>): CreateOneFn => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: MESSAGES.CREATED_SUCCESSFULLY,
      data: {
        doc
      }
    });
  });
};

const deleteOne = (Model: Model<any>): DeleteOneFn => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError(MESSAGES.NO_DOCUMENT_WAS_FOUND, 404));
    }

    res.status(204).json({
      status: MESSAGES.DELETED_SUCCESSFULLY,
      data: null
    });
  });
};

const getOne = (Model: Model<any>, popOptions?: PopOptions) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(new AppError(MESSAGES.NO_DOCUMENT_WAS_FOUND, HTTP_STATUS.NOT_FOUND));
    }
    if (popOptions) doc = await doc.populate(popOptions);

    res.status(200).json({
      status: 'success',
      data: {
        doc
      }
    });
  });
};

export default {
  getAll,
  getOne,
  updateOne,
  createOne,
  deleteOne
};
