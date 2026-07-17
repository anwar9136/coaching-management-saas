import {body, validationResult} from 'express-validator'

// Helper to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array()
        });
    }
    next();
};

// Instructor validator (for direct creation — not currently used in routes)
export const validatorInstructor = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

    body('email')
        .trim()
        .isEmail().withMessage('Please provide a valid email'),

    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    body('experience')
        .optional()
        .isInt({ min: 0 }).withMessage('Experience must be a positive number'),

    handleValidationErrors
];

// Course Validation
export const validateCourse = [
    body('name')
        .trim()
        .notEmpty().withMessage('Course name is required'),

    body('level')
        .isIn(['Beginner', 'Intermediate', 'Advanced'])
        .withMessage('Level must be Beginner, Intermediate or Advanced'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),

    handleValidationErrors
];

// Lecture Validation
// date is OPTIONAL — a lecture can be created without a date/time
// (when no instructor is assigned yet). Date becomes required only
// when an instructorId is provided (enforced in the controller).
export const validateLecture = [
    body('title')
        .trim()
        .notEmpty().withMessage('Lecture title is required'),

    body('date')
        .optional({ checkFalsy: true })
        .isISO8601().withMessage('Date must be in valid format (YYYY-MM-DD)'),

    body('courseId')
        .notEmpty().withMessage('Course ID is required')
        .isMongoId().withMessage('Invalid Course ID format'),

    body('instructorId')
        .optional({ checkFalsy: true })
        .isMongoId().withMessage('Invalid Instructor ID format'),

    body('startTime')
        .optional({ checkFalsy: true }),

    body('endTime')
        .optional({ checkFalsy: true }),

    handleValidationErrors
];

export default { validatorInstructor, validateCourse, validateLecture }