import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  movieId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Requires user authentication setup (e.g., NextAuth.js)
  username: string;
  rating: number; // 1 to 5 stars
  comment: string;
}

const ReviewSchema: Schema = new Schema({
  movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, {
  timestamps: true
});

export default (mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema)) as mongoose.Model<IReview>;
