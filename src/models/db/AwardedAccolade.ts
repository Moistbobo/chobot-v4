import { Document, Schema, model } from 'mongoose';

export interface IAwardedAccolade extends Document{
    code: string,
    userId: string,
    serverId: string,
    awardedById: string,
    awardedOn: string,
    reason: string,
}

export const AwardedAccoladeSchema = new Schema({
  code: {
    required: true,
    type: String,
  },
  userId: {
    required: true,
    type: String,
  },
  serverId: {
    required: true,
    type: String,
  },
  awardedById: {
    required: true,
    type: String,
  },
  awardedOn: {
    type: Date,
    default: Date.now,
  },
  reason: String,
});

const AwardedAccolade = model<IAwardedAccolade>('AwardedAccolade', AwardedAccoladeSchema);
export default AwardedAccolade;
