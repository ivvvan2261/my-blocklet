import { UserRepository } from '../schemas/user.schema';

export default class UserService {
  static getUser(userId: string) {
    return UserRepository.findOne({ userId }, { _id: 0, userId: 1, username: 1, fullName: 1, email: 1, phone: 1 });
  }

  static async updateUser(userId: string, updateData: any) {
    // verify username
    const usernameExists = await UserRepository.countDocuments({
      username: updateData.username,
      userId: { $ne: userId },
    });
    if (usernameExists) {
      throw new Error('Username exists');
    }

    let user = await UserRepository.findOne({ userId });

    // create or update a user
    if (user) {
      user = Object.assign(user, updateData);
      await user!.save();
    } else {
      user = await UserRepository.create({
        userId,
        ...updateData,
      });
    }

    return user;
  }
}
