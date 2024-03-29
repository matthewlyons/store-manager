require('dotenv').config();
const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');

const { MongoMemoryServer } = require('mongodb-memory-server');

const User = require('../../models/User');

module.exports = {
  async connectDB(URI) {
    let DB;
    if (URI) {
      DB = URI;
    } else {
      if (process.env.NODE_ENV === 'test') {
        mongoServer = new MongoMemoryServer();
        DB = await mongoServer.getUri();
      } else {
        DB = process.env.MONGO_URI;
      }
    }
    console.log(DB);
    return new Promise((resolve, reject) => {
      mongoose
        .connect(DB, {
          useNewUrlParser: true,
          useCreateIndex: true,
          useFindAndModify: false,
          useUnifiedTopology: true
        })
        .then(async () => {
          let users = await module.exports.checkUsers();
          if (users == 0) {
            module.exports.createAdmin();
          }
          resolve('MongoDB Connected');
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },
  async checkUsers() {
    let users = await User.find();
    return users.length;
  },
  async createAdmin() {
    console.log('Creating Admin');
    let admin = {
      name: 'Admin',
      access: 0
    };
    const AdminUser = new User(admin);
    AdminUser.password = await module.exports.hashPassword('Default');
    AdminUser.save()
      .then((User) => {
        console.log('Created Admin');
      })
      .catch((err) => {
        console.log('Failed To Create Admin');
      });
  },
  async hashPassword(password) {
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);
    return hash;
  }
};
