import { Request } from 'express';
import { Types, Document, Model } from 'mongoose';

export interface AuthRequest extends Request {
  user?: any;
}

export interface SendinblueAuth {
  user: string | undefined;
  pass: string | undefined;
}

export interface SendinblueConfig {
  service: string;
  host: string | undefined;
  port: number;
  auth: SendinblueAuth;
}

export interface IUserTransaction extends Document {
  userFinancials: Types.ObjectId;
  money: number;
  createdAt: Date;
  status: string;
}

export interface IBook extends Document {
  nameBook: string;
  typeBook: string;
  author: string;
  photos: Buffer[];
  photoUrls: string[];
  publicationYear: number;
  publisher: string;
  dateOfAcquisition: Date;
  price: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  description: string;
  numberOfBooks: number;
  pages: number;
  language: string;
  genres: string[];
  slug: string;
}

export interface IReturnBookForm extends Document {
  borrower: Types.ObjectId;
  lostBooks?: {
    bookId: Types.ObjectId;
    quantity: number;
  }[];
  returnDate: Date;
  borrowBookForm: Types.ObjectId;
  fee: number;
}

export interface IReview extends Document {
  review: string;
  rating: number;
  createdAt: Date;
  book: Types.ObjectId;
  user: Types.ObjectId;
  r?: {
    book: Types.ObjectId;
  };
}

export interface IReviewModel extends Model<IReview> {
  calcAverageRatings(bookId: Types.ObjectId): Promise<void>;
}

export interface IBorrowBookForm extends Document {
  books: {
    bookId: Types.ObjectId;
    quantity: number;
  }[];
  borrower: Types.ObjectId;
  borrowDate: Date;
  expectedReturnDate: Date;
  isReturned: Boolean;
}

export enum RoleType {
  user = 'user',
  admin = 'admin'
}

export interface IUser extends Document {
  fullName: string;
  avatar: Buffer | undefined;
  avatarUrl: string | undefined;
  role: RoleType;
  email: string;
  password: string;
  passwordConfirm: string | undefined;
  passwordChangedAt: Date;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
  active: boolean;
  correctPassword: (candidatePassword: string, userPassword: string) => Promise<boolean>;
  changedPasswordAfter: (JWTTimestamp: number) => boolean;
  createPasswordResetToken: () => string;
  generateAvatarUrl: () => void;
}

export interface IFeeReceipt extends Document {
  userFinancials: Types.ObjectId;
  balance: number;
  totalDebt: number;
  amountPaid: number;
}

export interface IOrder extends Document {
  books: Types.ObjectId[];
  user: Types.ObjectId;
  price: number;
  createdAt: Date;
  paid: boolean;
}

export interface IUserFinancials extends Document {
  user: Types.ObjectId;
  balance: number;
  totalDebt: number;
}

export interface MulterFile extends Express.Multer.File {}

export interface QueryString {
  page?: string;
  sort?: string;
  limit?: string;
  fields?: string;
  [key: string]: unknown;
}

export interface IReader extends Document {
  fullName: string;
  readerType: string;
  address: string;
  dateOfBirth: Date;
  email: string;
  cardCreatedAt: Date;
  isBorrowing: Boolean;
  user: Types.ObjectId;
}

export interface IValidation extends Document {
  ageMin: number;
  ageMax: number;
  expiredMonth: number;
  publicationYear: number;
  numberOfBooks: number;
  borrowingDate: number;
  createdAt: Date;
}
