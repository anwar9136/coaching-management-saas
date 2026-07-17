import express from 'express'
import programController from '../controller/programController.js'
import { protect, restrictTo } from '../middleware/authMiddleware.js'

const router = express.Router();

router.get('/', protect, programController.getAllPrograms);
router.post('/', protect, restrictTo('admin'), programController.createProgram);
router.get('/:id', protect, programController.getProgramById);
router.patch('/:id', protect, restrictTo('admin'), programController.updateProgram);
router.delete('/:id', protect, restrictTo('admin'), programController.deleteProgram);

export default router;
