import { Document, Schema, model } from 'mongoose';

export interface IGenshinGachaItem extends Document {
	type: string;
	image: string;
	name: string;
	rarity: number;
	bannerExclusive: boolean;
}

export const GenshinGachaItemSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rarity: {
    type: Number,
    required: true,
  },
  bannerExclusive: {
  	type: Boolean,
    default: false,
  },
});

export const GenshinGachaItem = model<IGenshinGachaItem>('GenshinGachaItem', GenshinGachaItemSchema);
