import { connect } from 'mongoose';

const connectMongo = async () => {
  return (
    connect(process.env.MONGODB_URI ?? ''),
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
};

export default connectMongo;
