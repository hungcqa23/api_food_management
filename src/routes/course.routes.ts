import express, { Router } from 'express';
import courseControllers from '~/controllers/course.controllers';
const router: Router = express.Router();

router.route('/').get(courseControllers.getAllCourse).post(courseControllers.createCourse);
router.get('/statistics', courseControllers.getStatistics);
router.get('/course-name', courseControllers.getCourseName);
router.get('/course-ids/:courseName', courseControllers.getCourseIdByCourseName);
router.post('/notify', courseControllers.notifyStudents);
router.post('/recovery/:id', courseControllers.recoverCourse);
router
  .route('/:id')
  .get(courseControllers.getCourse)
  .patch(courseControllers.updateCourse)
  .delete(courseControllers.deleteCourse);

export default router;
