import mongoose from 'mongoose';

export class Database {
  #uri;

  constructor(uri) {
    this.#uri = uri;
  }

  async connect() {
    mongoose.connection.on('disconnected', () => console.warn('MongoDB desconectado'));
    await mongoose.connect(this.#uri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB está conectado');
  }

  async disconnect() {
    await mongoose.disconnect();
  }
}
