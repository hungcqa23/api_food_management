import express, { Router } from 'express';
import tuitionFeeControllers from '~/controllers/tuition-fee.controllers';
const router: Router = express.Router();

router.route('/').get(tuitionFeeControllers.getAllTuitionFees).post(tuitionFeeControllers.createTuitionFee);

router
  .route('/:id')
  .get(tuitionFeeControllers.getTuitionFee)
  .patch(tuitionFeeControllers.updateTuitionFee)
  .delete(tuitionFeeControllers.deleteTuitionFee);

export default router;
