import mongoose from "mongoose";

const connectDB = async () => {
  try {
      await mongoose.connect("mongodb+srv://sakman37xd:S8OllAAy71YBfNLs@pfinal.vmxs1.mongodb.net/?retryWrites=true&w=majority");

      console.log('✅ MongoDB Conectado');
  } catch (error) {
      console.error('❌ Error en la conexión a MongoDB:', error);
      process.exit(1);
  }
};

export default connectDB;
