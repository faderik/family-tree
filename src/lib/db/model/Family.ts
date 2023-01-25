import { Model, model, models, Schema } from 'mongoose';

const familySchema = new Schema(
  {
    _id: String,
    name: String,
    userId: String,
  },
  { collection: 'families' }
);

export type TFamily = {
  _id: string;
  userId: string;
  name: string;
};

export const Family =
  (models.Family as Model<TFamily>) || model('Family', familySchema);
