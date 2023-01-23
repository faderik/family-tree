import { Model, model, models, Schema } from 'mongoose';

const personSchema = new Schema(
  {
    name: String,
    gender: String,
    birthDate: Date,
    coupleId: Schema.Types.ObjectId,
    dadId: Schema.Types.ObjectId,
    momId: Schema.Types.ObjectId,
    deathDate: Date,
  },
  { collection: 'persons' }
);

export type TPerson = {
  _id: Schema.Types.ObjectId;
  name: string;
  gender: 'male' | 'female';
  birthDate: Date;
  coupleId: Schema.Types.ObjectId | undefined;
  dadId: Schema.Types.ObjectId | undefined;
  momId: Schema.Types.ObjectId | undefined;
  deathDate: Date | undefined;
};

export const Person =
  (models.Family as Model<TPerson>) || model('Person', personSchema);
