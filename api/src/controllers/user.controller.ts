import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import UserService from '../services/user.service';
import updateUserValidator from '../validators/user.validator';

export default class UserController {
  /**
   * Get a user.
   * @route GET /user
   */
  static async getUser(req: Request, res: Response) {
    const user = await UserService.getUser(req.user!.did);

    return res.json(
      user || {
        userId: req.user!.did,
        fullName: req.user!.fullName,
      },
    );
  }

  /**
   * Update a user.
   * @route PUT /user
   */
  static async updateUser(req: Request, res: Response) {
    // verify params
    await Promise.all(updateUserValidator.map((validator) => validator.run(req)));
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new Error('Parameter error');
    }

    // update user
    const updateData = {
      username: req.body.username,
      fullName: req.user!.fullName,
      email: req.body.email,
      phone: req.body.phone,
    };

    await UserService.updateUser(req.user!.did, updateData);

    return res.json({
      result: 'ok',
    });
  }
}
