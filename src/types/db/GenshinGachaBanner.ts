import { Document, Schema, model } from 'mongoose';

export interface IGenshinGachaBanner extends Document {
	type: string;
	name: string;
	name_lower: string;
	date: string;
	description: string;
	bannerImg: string;
	featuredItems: string[]; // string[] of id's
	excludedItems: string[];
	SSRPityThreshold: number;
}

export const GenshinGachaBannerSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  name_lower: {
  	type: String,
    required: true,
  },
  date: {
  	type: String,
    required: true,
  },
  description: String,
  featuredItems: {
  	type: [String],
    required: true,
  },
  excludedItems: {
  	type: [String],
	  default: [],
  },
  SSRPityThreshold: {
  	type: Number,
    default: 90,
  },
});

export const GenshinGachaBanner = model<IGenshinGachaBanner>('GenshinGachaBanner', GenshinGachaBannerSchema);
