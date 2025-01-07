import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Import database connection

class TransactionCategory extends Model {
  public id!: number;
  public name!: string;

  // Example utility method (can add more if needed)
  public static isValidName(name: string): boolean {
    return name.trim().length > 0; // Simple validation example
  }
}

TransactionCategory.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensures no duplicate categories
      validate: {
        notEmpty: true, // Prevents empty names
      },
    },
  },
  {
    sequelize,
    modelName: 'TransactionCategory',
    tableName: 'TransactionCategories', // Explicit table name
    timestamps: true, // Includes createdAt and updatedAt
  }
);

export default TransactionCategory;
