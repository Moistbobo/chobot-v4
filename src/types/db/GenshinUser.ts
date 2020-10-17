import { Document, Schema, model } from 'mongoose';

export interface IGenshinUser extends Document{
	userId: string;
	totalRolls: number;
	rollHistory: any;
	bannerPity: any;
}

export const GenshinUserSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  totalRolls: {
    type: Number,
	  default: 0,
  },
  rollHistory: {
    type: Map,
    of: Number,
	  default: {},
  },
  bannerPity: {
  	type: Map,
	  of: Number,
	  default: {},
  },
});

export const GenshinUser = model<IGenshinUser>('GenshinUser', GenshinUserSchema);
