import { Schema, model } from 'mongoose';

export interface ICategory extends Document {
  _id: string;
  student: string;
  course: string;
  grades: Record<number, number>;
  createdAt: Date;
}

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required']
  },
  slug: {
    type: String,
    unique: true,
    required: [true, 'Slug name is required']
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

const Category = model<ICategory>('Grade', CategorySchema);
export default Category;
