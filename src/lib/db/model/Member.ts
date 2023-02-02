import { Model, model, models, Schema } from 'mongoose';

const memberSchema = new Schema(
  {
    name: String,
    gender: String,
    birthDate: Date,
    deathDate: Date,
    parentId: Schema.Types.ObjectId,
    coupleId: Schema.Types.ObjectId,
    familyId: String,
    createdAt: Date,
  },
  { collection: 'members' }
);

export type TMember = {
  _id: Schema.Types.ObjectId & string;
  name?: string;
  gender?: string;
  birthDate?: Date;
  deathDate?: Date;
  parentId?: Schema.Types.ObjectId;
  coupleId?: Schema.Types.ObjectId;
  familyId?: string;
  createdAt?: Date;
};

export const Member =
  (models.Member as Model<TMember>) || model('Member', memberSchema);
