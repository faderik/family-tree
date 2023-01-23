import { Model, model, models, Schema } from "mongoose";

const familySchema = new Schema({
  _id: String,
  password : String,
  name: String,
}, { collection: 'families' })

type TFamily = {
  _id: string,
  password: string,
  name: string,
};

export const Family = models.Family as Model<TFamily> || model('Family', familySchema);