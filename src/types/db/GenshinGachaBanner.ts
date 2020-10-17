import { Document, Schema, model } from 'mongoose';

export interface IGenshinGachaBanner extends Document {
	type: string;
	name: string;
	featuredItems: string[]; // string of id's
	regularItems: string[];
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
  featuredItems: {
  	type: [String],
    required: true,
  },
  regularItems: {
  	type: [String],
    required: true,
  },
});

export const GenshinGachaBanner = model<IGenshinGachaBanner>('GenshinGachaBanner', GenshinGachaBannerSchema);
