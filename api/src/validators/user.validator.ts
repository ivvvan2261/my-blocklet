import { body, check } from 'express-validator';

const updateUserValidator = [
  check('username', 'Username cannot be empty.').notEmpty(),
  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail({ gmail_remove_dots: false }),
  body('phone').optional({ checkFalsy: true }).isMobilePhone('zh-CN').withMessage('Please enter a valid phone number.'),
];

export default updateUserValidator;
