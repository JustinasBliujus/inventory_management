import Inventory from "../databaseModels/inventory.js";
import Item from "../databaseModels/item.js";
import User from "../databaseModels/user.js";
import Chat from "../databaseModels/chat.js";
import CustomID from "../databaseModels/customID.js";
import '../databaseModels/associations.js';

export async function createInventory(userId, name, description = '', customID = '', customFields = {}) {
  try {
    const inventory = await Inventory.create({
      user_id: userId,
      name,
      description,
      customID,
      ...customFields  
    });

    return { success: true, inventoryId: inventory.id };
  } catch (error) {
    console.error('Error creating inventory:', error);
    return { success: false, error };
  }
}

export async function getInventoryById(userId, inventoryId) {
  try {
    const inventory = await Inventory.findOne({
      where: { id: inventoryId, user_id: userId },
      include: [
        {
          model: Item,
          as: "items",
        },
        {
          model: User,
          as: "editors",
          attributes: ["id", "name", "email"], 
          through: { attributes: [] } 
        },
        {
          model: Chat,
          as: "chats",
        },
        {
          model: CustomID,
          as: "customID",
        }
      ]
    });

    if (!inventory) return { success: false, message: "Inventory not found" };

    return { success: true, inventory };
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return { success: false, error };
  }
}