import { Schema, model, Types } from 'mongoose';

const CourseSchema = new Schema({
  courses: {
    type: [Types.ObjectId],
    ref: 'Course',
    required: [true, 'Course is required']
  },
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  note: {
    type: String,
    required: [true, 'Note is required']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled']
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

const Order = model('Order', CourseSchema);
export default Order;
