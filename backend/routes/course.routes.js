import express from 'express'
import courseController from '../controller/courseController.js';
import { validateCourse } from '../middleware/validator.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', protect, courseController.getAllCourses);
router.post('/', protect, restrictTo('admin'), validateCourse, courseController.createCourse);
router.get('/:id', protect, courseController.getCourseById);
router.patch('/:id', protect, restrictTo('admin'), validateCourse, courseController.updateCourse);
router.delete('/:id', protect, restrictTo('admin'), courseController.deleteCourse);

export default router;