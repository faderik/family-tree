import { Model, model, models, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    _id: String, // =username
    name: String,
    email: String,
    password: String,
    createdAt: Date,
    personId: Schema.Types.ObjectId,
  },
  { collection: 'users' }
);

export type TUser = {
  _id: string; // =username
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  personId: Schema.Types.ObjectId | undefined;
};

export const User = (models.User as Model<TUser>) || model('User', userSchema);
