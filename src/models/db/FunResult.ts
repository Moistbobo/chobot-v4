import { Document, Schema, model } from 'mongoose';


export interface IFunObject extends Document {
    lastUpdate: string,
    value: number
}

export interface IFunResult extends Document {
    userID: string,
    gay: IFunObject,
    iq: IFunObject,
    racist: IFunObject
}

export const FunObjectSchema = new Schema({
  lastUpdate: {
    type: String,
    default: 0,
    required: true,
  },
  value: Number,
});

const defaultFunObject = {
  lastUpdate: '1970-01-01T00:00:00Z',
};

export const FunResultSchema = new Schema({
  userID: {
    type: String,
    required: true,
    unique: true,
  },
  gay: {
    type: FunObjectSchema,
    default: defaultFunObject,
  },
  iq: {
    type: FunObjectSchema,
    default: defaultFunObject,
  },
  racist: {
    type: FunObjectSchema,
    default: defaultFunObject,
  },
});

const FunResult = model<IFunResult>('FunResult', FunResultSchema);
export default FunResult;
