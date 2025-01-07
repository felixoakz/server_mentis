import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sequelize from '../config/database';

class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;

  public static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10); // 10 is the salt rounds
  }

  public validatePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }

  public generateAuthToken(): string {
    const payload = { id: this.id, username: this.username };
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
  }
}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
  }
);

export default User;
