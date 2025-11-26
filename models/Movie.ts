import mongoose, { Schema, Document } from 'mongoose';

export interface IMovie extends Document {
  id: string;
  title: string;
  releaseDate: Date;
  genre: string[];
  runtime: number; // in minutes
  plotSummary: string;
  posterUrl: string; // URL to a movie poster image
  trailerUrl: string;
  rating: number; // Calculated average rating
  reviewCount: number; // Number of reviews
}

const MovieSchema: Schema = new Schema({
  title: { type: String, required: true, unique: true },
  releaseDate: { type: Date, required: true },
  genre: [{ type: String, required: true }],
  runtime: { type: Number },
  plotSummary: { type: String },
  posterUrl: { type: String },
  trailerUrl: { type: String },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
}, {
  timestamps: true
});

export default (mongoose.models.Movie || mongoose.model<IMovie>('Movie', MovieSchema)) as mongoose.Model<IMovie>;
