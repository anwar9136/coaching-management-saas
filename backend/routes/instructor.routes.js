import express from 'express'
import instructorController from '../controller/instructorController.js';
import { validatorInstructor } from '../middleware/validator.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/',protect, instructorController.getAllInstructor )
router.post('/', protect, restrictTo('admin'), validatorInstructor, instructorController.createInstructor)
router.get('/pending', protect, restrictTo('admin'), instructorController.getPendingInstructor)
router.post('/approve', protect, restrictTo('admin'), instructorController.approveInstructor)
router.post('/reject', protect, restrictTo('admin'), instructorController.rejectInstructor)
router.delete('/:id',protect, restrictTo('admin'), instructorController.deleteInstructor)
router.get('/:id/details',protect, instructorController.getInstructorDetails)
router.patch('/:id',protect, restrictTo('admin', 'instructor'), instructorController.updateInstructor)

export default router;     