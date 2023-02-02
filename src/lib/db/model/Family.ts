import { Model, model, models, Schema } from 'mongoose';

const familySchema = new Schema(
  {
    _id: String,
    name: String,
    userId: String,
    oldestId: Schema.Types.ObjectId,
  },
  { collection: 'families' }
);

export type TFamily = {
  _id: string;
  userId: string;
  name: string;
  oldestId: Schema.Types.ObjectId;
};

export const Family =
  (models.Family as Model<TFamily>) || model('Family', familySchema);
