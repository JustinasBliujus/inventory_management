import Inventory from "../databaseModels/inventory.js";
import Item from "../databaseModels/item.js";
import User from "../databaseModels/user.js";
import Chat from "../databaseModels/chat.js";
import Tag from "../databaseModels/tag.js";
import CustomID from "../databaseModels/customID.js";
import '../databaseModels/associations.js';
import { literal } from "sequelize";

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



export async function getInventoryById(inventory_id) {
  try {
    console.log(inventory_id, "IN INVENTORY SERVICE")
    const inventory = await Inventory.findOne({
      where: { id: inventory_id },
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
        },
        {
          model: Tag,
          as: "tags",         
          attributes: ["id", "name"],
          through: { attributes: [] } 
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

export async function addEditor(editors, inventory_id) {
  try {

    const inventory = await Inventory.findByPk(inventory_id);
    if (!inventory) {
      throw new Error('Inventory not found');
    }

    for (const email of editors) {
      const user = await User.findOne({ where: { email } });
      if (user) {
        await inventory.addEditor(user); 
      } else {
        console.warn(`User with email ${email} not found`);
      }
    }

    return { success: true, message: 'Editors added successfully' };
  } catch (error) {
    console.error('Error adding editors:', error);
    return { success: false, error: error.message };
  }
}

export async function upsertItem(itemData, item_id, creator_email) {
  try {
    const inventory = await Inventory.findByPk(itemData.inventory_id);
    if (!inventory) {
      throw new Error("Inventory not found");
    }

    let item;

    if (item_id) {
      item = await Item.findOne({
        where: { inventory_id: itemData.inventory_id, id: item_id },
      });

      if (item) {
        await item.update(itemData);
        console.log(`Item ${item_id} updated successfully.`);
      }
    }

    if (!item) {
      item = await Item.create({
        ...itemData,
        inventory_id: itemData.inventory_id,
        creator_email: creator_email,
      });
      console.log(`Item ${item.id} created successfully.`);
    }

    return { success: true, item };
  } catch (error) {
    console.error("Error upserting item:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteItem(item_id, inv_id, user_id) {
  try {
    const inventory = await Inventory.findOne({
      where: { id: inv_id, user_id }
    });

    if (!inventory) {
      return { success: false, message: "Inventory not found or permission denied" };
    }

    const item = await Item.findOne({
      where: { id: item_id, inventory_id: inv_id }
    });

    if (!item) {
      return { success: false, message: "Item not found in this inventory" };
    }

    await item.destroy();

    return { success: true, message: "Item deleted successfully" };
  } catch (error) {
    console.error("Error deleting item:", error);
    return { success: false, error: error.message };
  }
}

export async function saveInventoryTags(userId, inventoryId, tags) {
  if (!Array.isArray(tags)) {
    throw new Error("Tags must be an array");
  }
  if (tags.some(tag => !/^[a-zA-Z]{1,15}$/.test(tag))) {
    throw new Error("Tags must be letters only, max 15 characters");
  }
  if (tags.length > 3) {
    throw new Error("Maximum 3 tags allowed");
  }

  const inventory = await Inventory.findOne({
    where: { id: inventoryId, user_id: userId }
  });
  if (!inventory) throw new Error("Inventory not found");

  const tagRecords = [];
  for (const tagName of tags) {
    const [tag] = await Tag.findOrCreate({ where: { name: tagName } });
    tagRecords.push(tag);
  }

  await inventory.setTags(tagRecords);

  return tagRecords.map(t => t.name);
}

export async function getLastInventories(limit = 10) {
  try {
    const inventories = await Inventory.findAll({
    attributes: ['id','user_id', 'name', 'description', 'category', 'createdAt'],
    include: [
      {
        model: User,
        attributes: ['id','email', 'name'] 
      }
    ],
    order: [['createdAt', 'DESC']],
    limit
  });

    return { success: true, inventories };
  } catch (err) {
    console.error("Error fetching last inventories:", err);
    return { success: false, error: err.message };
  }
}

export async function getMostPopularInventories(limit = 10) {
  try {
    const inventories = await Inventory.findAll({
      attributes: [
        'id',
        'user_id',
        'name',
        'description',
        'category',
        [literal(`(
          SELECT COUNT(*)
          FROM items AS item
          WHERE item.inventory_id = inventory.id
        )`), 'itemCount']
      ],
      include: [
        {
          model: User,
          attributes: ['id', 'email', 'name']
        }
      ],
      order: [[literal('itemCount'), 'DESC']],
      limit
    });

    return { success: true, inventories };
  } catch (err) {
    console.error("Error fetching popular inventories:", err);
    return { success: false, error: err.message };
  }
}

export async function getRandomTags(limit = 10) {
  try {
    const tags = await Tag.findAll({
      attributes: ['id', 'name'],
      include: [{
        model: Inventory,
        as: 'inventories',  
        required: true      
      }],
      order: literal('RAND()'), 
      limit
    });

    return { success: true, tags };
  } catch (err) {
    console.error('Error fetching random tags:', err);
    return { success: false, error: err.message };
  }
}

export async function getInventoriesByTag(tagId) {
  const tag = await Tag.findByPk(tagId, {
    include: [{
      model: Inventory,
      as: 'inventories',
      through: { attributes: [] } 
    }]
  });

  if (!tag) return [];

  return tag.inventories; 
}