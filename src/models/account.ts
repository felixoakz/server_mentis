import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Import database connection

class Account extends Model {
  public id!: number;
  public name!: string;
  public type!: 'main' | 'credit_card' | 'savings' | 'investment';
  public balance!: number;
  public credit_limit!: number;
  public reset_day?: number;
  public user_id!: number;

  // Example utility method (can add more if needed)
  public isCreditCard(): boolean {
    return this.type === 'credit_card';
  }
}

Account.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('main', 'credit_card', 'savings', 'investment'),
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
    },
    credit_limit: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
    },
    reset_day: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'Account',
    tableName: 'Accounts',
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

export default Account;
