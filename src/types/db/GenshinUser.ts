import { Document, Schema, model } from 'mongoose';

export interface IGenshinUser extends Document{
	userId: string;
	totalRolls: number;
	totalPity: number;
	rollHistory: any;
	bannerPity: any;
	SSRObtained: number;
	SRObtained: number;
	RObtained: number;
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
  totalPity: {
  	type: Number,
    default: 0,
  },
  SSRObtained: {
  	type: Number,
    default: 0,
  },
  SRObtained: {
    type: Number,
    default: 0,
  },
  RObtained: {
    type: Number,
    default: 0,
  },
});

export const GenshinUser = model<IGenshinUser>('GenshinUser', GenshinUserSchema);
