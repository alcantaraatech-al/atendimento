import { QueryInterface } from "sequelize";
import { v4 as uuidv4 } from "uuid";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("Settings", { key: "userApiToken" });
    return queryInterface.bulkInsert(
      "Settings",
      [
        {
          key: "userApiToken",
          value: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.bulkDelete("Settings", {});
  }
};
