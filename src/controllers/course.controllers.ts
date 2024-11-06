import Course, { CourseType } from '~/models/schemas/course.schema';
import factory from './factory.controllers';
import catchAsync from '~/utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import { MESSAGES } from '~/constants/messages';
import { calculateEndDate } from '~/utils/date';
import Student, { StudentType } from '~/models/schemas/student.schema';
import AppError from '~/utils/app-error';
import Email from '~/utils/email';

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const { courseId, courseName, dateOfWeeks, dateOfStart, sessions, tuitionFee } = req.body;
  const dates: string[] = [];
  const dateOfEnd = calculateEndDate({
    dateOfStart: dateOfStart,
    numberOfSessions: sessions,
    weeklySchedule: dateOfWeeks,
    dates
  });

  const doc = await Course.create({
    courseId,
    courseName,
    dateOfWeeks,
    dateOfEnd: dates[dates.length - 1] || dateOfEnd,
    dateOfStart,
    dates,
    sessions,
    tuitionFee
  });

  res.status(201).json({
    status: MESSAGES.CREATED_SUCCESSFULLY,
    data: {
      doc
    }
  });
});
const getStatistics = catchAsync(async (req: Request, res: Response) => {
  const courses = await Course.find({
    active: true
  });
  const students: StudentType[] = await Student.find({
    active: true
  });
  const studentsSet = new Set(students.map(student => student.email));

  res.status(201).json({
    status: MESSAGES.CREATED_SUCCESSFULLY,
    data: {
      numberCourses: courses.length,
      numberStudents: studentsSet.size
    }
  });
});
const recoverCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const course: CourseType | null = await Course.findByIdAndUpdate(req.params.id, { active: true });

  if (!course) {
    return next(new AppError(MESSAGES.NO_DOCUMENT_WAS_FOUND, 404));
  }

  res.status(200).json({
    status: MESSAGES.UPDATED_SUCCESSFULLY
  });
});
const getCourseName = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Find distinct course names
  const uniqueCourseNames: string[] = await Course.find({
    active: true
  }).distinct('courseName');

  // Send the unique list of course names in the response
  res.status(200).json({
    success: true,
    doc: uniqueCourseNames
  });
});
const getCourseIdByCourseName = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const courses: CourseType[] | null = await Course.find({ courseName: req.params.courseName });
  if (!courses) {
    return next(new AppError(MESSAGES.NO_DOCUMENT_WAS_FOUND, 404));
  }

  const courseIds = courses.map(course => course.courseId);

  res.status(200).json({
    success: true,
    courseIds
  });
});
const notifyStudents = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { courseName, message } = req.body;

  if (courseName === 'Tất cả') {
    const students = await Student.find({ active: true });
    const uniqueEmails: Set<string> = new Set();

    students.forEach(student => {
      // Đảm bảo rằng mỗi địa chỉ email là duy nhất
      if (student.email && !uniqueEmails.has(student.email)) {
        uniqueEmails.add(student.email);
      }
    });
    // Chuyển Set thành mảng để có thể sử dụng map
    const studentEmails: string[] = Array.from(uniqueEmails);

    await Promise.all(studentEmails.map(email => new Email({ email }).sendNotification(message)));

    return res.status(200).json({
      message: 'Gửi mail tất cả thành công!',
      studentEmails
    });
  }

  const course = await Course.findOne({ courseName });
  if (!course) {
    return next(new AppError(MESSAGES.NO_DOCUMENT_WAS_FOUND, 404));
  }
  const students = await Student.find({
    active: true,
    courseId: course._id
  });
  await Promise.all(students.map(student => new Email({ email: student.email }).sendNotification(message)));

  res.status(200).json({
    message: 'Gửi mail thành công!'
  });
});

const getAllCourse = factory.getAll(Course);
const getCourse = factory.getOne(Course);
const deleteCourse = factory.deleteOne(Course);
const updateCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.active === false) {
    const course = await Course.findByIdAndUpdate(req.params.id, {
      active: false,
      numberOfStudents: 0
    });
    await Student.updateMany(
      {
        courseId: course?._id
      },
      {
        $set: {
          active: false
        }
      }
    );
    res.status(204).json({
      status: MESSAGES.DELETED_SUCCESSFULLY
    });
  } else return factory.updateOne(Course);
});

export default {
  getAllCourse,
  getCourse,
  getCourseName,
  getCourseIdByCourseName,
  getStatistics,
  notifyStudents,
  createCourse,
  deleteCourse,
  updateCourse,
  recoverCourse
};
