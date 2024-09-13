import mongoose from 'mongoose';

class User {
  username!: string;

  fullName!: string;

  email?: string;

  phone?: string;
}

type UserDocument = mongoose.Document & User;

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true },
    username: String,
    fullName: String,
    email: String,
    phone: String,
  },
  { timestamps: true },
);

const UserRepository = mongoose.model<UserDocument>('User', userSchema);
export { UserRepository, User };
