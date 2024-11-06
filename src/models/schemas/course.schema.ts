import { Schema, model, Types } from 'mongoose';

export interface ICourse extends Document {
  name: string;
  quantity: number;
  category: Types.ObjectId;
  price: number;
  description: string;
  type: string;
}

const CourseSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Course name is required']
  },
  quantity: {
    type: Number,
    default: 0,
    required: [true, 'Quantity is required']
  },
  category: {
    type: Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  type: {
    type: String,
    enum: ['entree', 'main-course', 'dessert', 'drink']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Course = model<ICourse>('Course', CourseSchema);
export default Course;
