import factory from './factory.controllers';
import catchAsync from '~/utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import { MESSAGES } from '~/constants/messages';
import { calculateEndDate } from '~/utils/date';
import Attendance, { AttendanceType } from '~/models/schemas/attendance.schema';
import AppError from '~/utils/app-error';

const createAttendance = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { courseId, courseName, dateOfWeeks, dateOfStart, sessions } = req.body;
  const dates: string[] = [];
  const dateOfEnd = calculateEndDate({
    dateOfStart: dateOfStart,
    numberOfSessions: sessions,
    weeklySchedule: dateOfWeeks,
    dates
  });

  const doc = await Attendance.create({
    courseId,
    courseName,
    dateOfWeeks,
    dateOfEnd,
    dateOfStart,
    dates,
    sessions
  });

  res.status(201).json({
    status: MESSAGES.CREATED_SUCCESSFULLY,
    data: {
      doc
    }
  });
});

const getAllAttendances = factory.getAll(Attendance);

const getAttendance = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const attendances: AttendanceType[] | null = await Attendance.find({
    courseId: req.params.id
  });

  if (!attendances) {
    return next(new AppError(MESSAGES.NO_DOCUMENT_WAS_FOUND, 404));
  }

  // Filter out entries where studentId is null
  const doc = attendances.filter(attendance => attendance.studentId !== null);

  res.status(200).json({
    status: 'success',
    data: {
      doc
    }
  });
});

const deleteAttendance = factory.deleteOne(Attendance);
const updateAttendance = factory.updateOne(Attendance);

export default {
  getAllAttendances,
  getAttendance,
  createAttendance,
  deleteAttendance,
  updateAttendance
};
