import { Sequelize } from "sequelize";

export default (sequelize, DataTypes) => {
  const InvoiceLines = sequelize.define("invoice_lines", {
    invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
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
    tableName: 'invoice_lines',
  });

  return InvoiceLines;
}
