import { Document, Schema, model } from 'mongoose';

export interface IAccolade extends Document{
    name: string,
    code: string,
    image: string,
    description: string,
    serverId: string,
    type: 'medal' | 'ribbon' | 'collectible'
}

export const AccoladeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  code: String,
  image: String,
  description: String,
  serverId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['medal', 'ribbon', 'collectible'],
  },
});

const Accolade = model<IAccolade>('Accolade', AccoladeSchema);
export default Accolade;
