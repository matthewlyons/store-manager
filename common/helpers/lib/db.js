require('dotenv').config();
const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');

let DB = process.env.MONGO_URI;

const User = require('../../models/User');

module.exports = {
  connectDB() {
    console.log(DB);
    mongoose
      .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      })
      .then(async () => {
        console.log('MongoDB Connected');
        let users = await module.exports.checkUsers();
        if (users == 0) {
          module.exports.createAdmin();
        }
      })
      .catch((err) => console.log(err));
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
