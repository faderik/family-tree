import * as mongoose from 'mongoose';

const connectMongo = async () => {
  return (
    mongoose.set('strictQuery', false).connect(process.env.MONGODB_URI ?? ''),
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
};

export default connectMongo;
