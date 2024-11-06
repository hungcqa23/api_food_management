import { Schema, model, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { IUser } from '../interfaces/model.interfaces';
import { MESSAGES } from '../../constants/messages';

const UserSchema = new Schema({
  fullName: {
    type: String,
    required: [true, MESSAGES.FULL_NAME_IS_REQUIRED]
  },
  email: {
    type: String,
    required: [true, MESSAGES.EMAIL_IS_REQUIRED],
    unique: true
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, MESSAGES.PASSWORD_IS_REQUIRED],
    minlength: 9,
    select: false
  },
  address: {
    type: String
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
});

UserSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<Boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp: number = this.passwordChangedAt.getTime() / 1000;
    return changedTimestamp > JWTTimestamp;
  }
  return false;
};

UserSchema.methods.createPasswordResetToken = function (): string {
  // 1) Generate a random token using uuid
  const resetToken = uuidv4();

  // 2) Hash the token and store it in the user document
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // 3) Set an expiration time for the token (10 mins)
  this.passwordResetExpires = Date.now() + 10 * 1000 * 60;

  return resetToken;
};

UserSchema.methods.generateAvatarUrl = function () {
  const avatarUrl = `${process.env.APP_URL}/api/v1/users/${this._id}/avatar`;
  this.avatarUrl = avatarUrl;
};

UserSchema.statics.generateAvatarUrl = async function (userId: Types.ObjectId) {
  const avatarUrl = `${process.env.APP_URL}/api/v1/users/${userId}/avatar`;
  await this.updateOne({ _id: userId }, { avatarUrl: avatarUrl });
};

UserSchema.pre('save', async function (next): Promise<void> {
  if (!this.isModified('password')) return next();
  // Generate salt
  const salt = await bcrypt.genSalt(10);

  if (this.password) this.password = await bcrypt.hash(this.password, salt);

  next();
});

UserSchema.pre<IUser>('save', function (next): void {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

UserSchema.pre<IUser>('save', function (next): void {
  if (this.avatar) {
    const avatarUrl = `${process.env.APP_URL}/api/v1/users/${this._id}/avatar`;
    this.avatarUrl = avatarUrl;
  }
  next();
});

const User = model<IUser>('User', UserSchema);

export default User;
