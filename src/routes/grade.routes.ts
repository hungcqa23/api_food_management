import express, { Router } from 'express';
import gradeControllers from '~/controllers/grade.controllers';
const router: Router = express.Router();

router.route('/').get(gradeControllers.getAllGrades);

router
  .route('/:id')
  .get(gradeControllers.getGrade)
  .patch(gradeControllers.updateGrade)
  .delete(gradeControllers.deleteGrade);

export default router;
