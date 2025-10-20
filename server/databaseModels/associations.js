import User from "./user.js";
import Inventory from "./inventory.js";
import Item from "./item.js";
import Chat from "./chat.js";
import Tag from "./tag.js";
import CustomID from "./customID.js";

User.hasMany(Inventory, { foreignKey: "user_id", onDelete: "CASCADE" });
Inventory.belongsTo(User, { foreignKey: "user_id" });

Inventory.hasMany(Item, { foreignKey: "inventory_id", as: "items", onDelete: "CASCADE" });
Item.belongsTo(Inventory, { foreignKey: "inventory_id", onDelete: "CASCADE" });

Inventory.hasMany(Chat, { foreignKey: "inventory_id", as: "chats", onDelete: "CASCADE" });
Chat.belongsTo(Inventory, { foreignKey: "inventory_id", onDelete: "CASCADE" });

Inventory.hasOne(CustomID, { foreignKey: "inventory_id", as: "customID", onDelete: "CASCADE" });
CustomID.belongsTo(Inventory, { foreignKey: "inventory_id", onDelete: "CASCADE" });

Inventory.belongsToMany(User, { through: "inventory_editors", as: "editors", foreignKey: "inventory_id", otherKey: "user_id" });
User.belongsToMany(Inventory, { through: "inventory_editors", as: "editable_inventories", foreignKey: "user_id", otherKey: "inventory_id" });

Inventory.belongsToMany(Tag, { through: "inventory_tag", as: "tags", foreignKey: "inventory_id", otherKey: "tag_id" });
Tag.belongsToMany(Inventory, { through: "inventory_tag", as: "inventories", foreignKey: "tag_id", otherKey: "inventory_id" });
