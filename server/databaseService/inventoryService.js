import Inventory from "../databaseModels/inventory.js";
import Item from "../databaseModels/item.js";
import User from "../databaseModels/user.js";
import Chat from "../databaseModels/chat.js";
import CustomID from "../databaseModels/customID.js";
import '../databaseModels/associations.js';

export async function createInventory(userId, name, description = '', customFields = {}) {
  try {
    const inventory = await Inventory.create({
      user_id: userId,
      name,
      description,
      ...customFields
    });

    await CustomID.create({
      inventory_id: inventory.id,
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

export async function updateInventory(inv_id, user_id, fields) {
  const inv = await Inventory.findOne({ where: { id: inv_id, user_id } });
  if (!inv) throw new Error("Inventory not found");

  await inv.update(fields);

  return inv;
}

export async function saveChat(inventory_id, creator_email, message) {
  if (!message || !creator_email || !inventory_id) {
    throw new Error("Missing required fields");
  }

  const chat = await Chat.create({
    inventory_id,
    creator_email,
    message
  });

  return chat;
}

export async function deleteInventory(user_id, inv_id) {
    try {
        const inventory = await Inventory.findOne({ where: { id: inv_id, user_id } });

        if (!inventory) {
            return { success: false, message: 'Inventory not found or permission denied.' };
        }

        await inventory.destroy();

        return { success: true, message: 'Inventory deleted successfully.' };
    } catch (error) {
        console.error('Error deleting inventory:', error);
        return { success: false, error };
    }
}

export async function saveCustomID(user_id, customID) {
  try {
    const { inventory_id } = customID;

    if (!inventory_id) {
      throw new Error("inventory_id is required in customID");
    }
    const inventory = await Inventory.findOne({ where: { id: inventory_id, user_id } });
    if (!inventory) {
      return { success: false, message: "Inventory not found or permission denied" };
    }

    const existing = await CustomID.findOne({ where: { inventory_id } });

    if (existing) {
      await existing.update(customID);
    } else {

      await CustomID.create(customID);
    }

    return { success: true, message: "CustomID saved successfully" };
  } catch (error) {
    console.error("Error saving CustomID:", error);
    return { success: false, error };
  }
}
export async function addEditor(inventoryId, userId) {
  try {
    const inventory = await Inventory.findByPk(inventoryId);
    const user = await User.findByPk(userId);

    if (!inventory || !user) {
      throw new Error('Inventory or User not found');
    }

    await inventory.addEditor(user);

    return { success: true, message: 'User added as editor successfully' };
  } catch (error) {
    console.error('Error adding editor:', error);
    return { success: false, error: error.message };
  }
}

export async function addItem(inventoryId, creatorEmail, itemData = {}) {
  try {
    const inventory = await Inventory.findByPk(inventoryId);
    if (!inventory) {
      throw new Error("Inventory not found");
    }

    const user = await User.findOne({ where: { email: creatorEmail } });
    if (!user) {
      throw new Error("User not found");
    }

    const item = await Item.create({
      inventory_id: inventoryId,
      creator_email: creatorEmail,
      ...itemData
    });

    return { success: true, item };
  } catch (error) {
    console.error("Error adding item:", error);
    return { success: false, error: error.message };
  }
}
export async function deleteItem(item_id, inv_id, user_id) {
  try {
    // 1. Find inventory and ensure it belongs to user
    const inventory = await Inventory.findOne({
      where: { id: inv_id, user_id }
    });

    if (!inventory) {
      return { success: false, message: "Inventory not found or permission denied" };
    }

    // 2. Find the item in that inventory
    const item = await Item.findOne({
      where: { id: item_id, inventory_id: inv_id }
    });

    if (!item) {
      return { success: false, message: "Item not found in this inventory" };
    }

    // 3. Delete the item
    await item.destroy();

    return { success: true, message: "Item deleted successfully" };
  } catch (error) {
    console.error("Error deleting item:", error);
    return { success: false, error: error.message };
  }
}