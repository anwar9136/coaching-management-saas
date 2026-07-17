import express from 'express'
import lectureController from '../controller/lectureController.js';
import { validateLecture } from '../middleware/validator.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', protect, lectureController.getAllLecture);
// IMPORTANT: /my-lectures MUST be defined before /:id
// Otherwise Express matches "my-lectures" as the :id parameter
router.get('/my-lectures', protect, restrictTo('admin', 'instructor'), lectureController.getMyLectures);
router.post('/', protect, restrictTo('admin'), validateLecture, lectureController.createLecture);
router.get('/:id', protect, lectureController.getLectureById);
router.patch('/:id', protect, restrictTo('admin'), lectureController.updateLecture);
router.delete('/:id', protect, restrictTo('admin'), lectureController.deleteLecture);

export default router;