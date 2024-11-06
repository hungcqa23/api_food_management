import express, { Router } from 'express';
import studentControllers from '~/controllers/student.controllers';
const router: Router = express.Router();

router.route('/').get(studentControllers.getAllStudent).post(studentControllers.createStudent);
router.route('/recovery/:id').post(studentControllers.recoverStudent);
router
  .route('/:id')
  .get(studentControllers.getStudent)
  .patch(studentControllers.updateStudent)
  .delete(studentControllers.deleteStudent);

export default router;
