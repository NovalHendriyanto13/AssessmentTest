import { Sequelize } from "sequelize";

export default (sequelize, DataTypes) => {
  const Invoice = sequelize.define("invoices", {
    invoice_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invoice_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    sales_person: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  }, {
    classMethods: {},
    freezeTableName: true,
    tableName: 'invoices',
  });

  return Invoice;
}
