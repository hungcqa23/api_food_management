import express, { Router } from 'express';
import attendanceControllers from '~/controllers/attendance.controllers';
const router: Router = express.Router();

router.route('/').get(attendanceControllers.getAllAttendances).post(attendanceControllers.createAttendance);

router
  .route('/:id')
  .get(attendanceControllers.getAttendance)
  .patch(attendanceControllers.updateAttendance)
  .delete(attendanceControllers.deleteAttendance);

export default router;
