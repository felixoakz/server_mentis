import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Import database connection

class Transaction extends Model {
  public id!: number;
  public account_id!: number;
  public source_account_id?: number;
  public value!: number;
  public description?: string;
  public date!: Date;
  public user_id!: number;
  public category_id?: number;

  // Example utility method
  public isExpense(): boolean {
    return this.value < 0; // Returns true for negative values (expenses)
  }
}

Transaction.init(
  {
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Accounts', // Foreign key reference
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    source_account_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Optional for transfers
      references: {
        model: 'Accounts',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Foreign key reference
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'TransactionCategories', // Foreign key reference
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  },
  {
    sequelize,
    modelName: 'Transaction',
    tableName: 'Transactions', // Explicit table name
    timestamps: true, // Includes createdAt and updatedAt
  }
);

export default Transaction;
