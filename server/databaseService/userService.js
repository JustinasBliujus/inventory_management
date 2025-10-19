import Inventory from "../databaseModels/inventory.js";
import User from "../databaseModels/user.js";
import { Op } from "sequelize";

// Get all users, ordered by last login
export async function getUsers() {
  return await User.findAll({
    attributes: ['name','surname','email','status','is_admin','last_login'],
    order: [['last_login', 'DESC']]
  });
}

// Get user by ID
export async function getUser(id) {
  return await User.findByPk(id);
}

// Update login time by email
export async function updateLoginTime(email) {
  await User.update(
    { last_login: new Date() },
    { where: { email } }
  );
}

// Block multiple users
export async function blockUsers(emails) {
  if (!emails || emails.length === 0) return;

  await User.update(
    { 
      prev_status: User.sequelize.literal(`CASE WHEN status IN ('unverified','active') THEN status ELSE prev_status END`),
      status: 'blocked'
    },
    { where: { email: { [Op.in]: emails } } }
  );
}

// Unblock multiple users
export async function unblockUsers(emails) {
  if (!emails || emails.length === 0) return;

  await User.update(
    { status: User.sequelize.col('prev_status') },
    { where: { email: { [Op.in]: emails } } }
  );
}

// Promote users
export async function promoteUsers(emails) {
  if (!emails || emails.length === 0) return;

  await User.update(
    { is_admin: true },
    { where: { email: { [Op.in]: emails } } }
  );
}

// Demote users
export async function demoteUsers(emails) {
  if (!emails || emails.length === 0) return;

  await User.update(
    { is_admin: false },
    { where: { email: { [Op.in]: emails } } }
  );
}

// Verify a user
export async function verifyUser(email) {
  await User.update(
    { status: 'verified', prev_status: 'verified' },
    { where: { email } }
  );
}

// Get user by email
export async function getUserByEmail(email) {
  return await User.findOne({ where: { email } });
}

// Delete users by emails
export async function deleteUsers(emails) {
  const deleted = await User.destroy({ where: { email: { [Op.in]: emails } } });
  return deleted;
}

// Find user by verification token
export async function findUserByToken(token) {
  return await User.findOne({ where: { verification_token: token } });
}

// Delete all unverified users
export async function deleteUnverified() {
  const deleted = await User.destroy({ where: { status: 'unverified' } });
  return deleted;
}

// Create a user
export async function createUser( name, surname, password, email, verification_token ) {
  const user = await User.create({ name, surname, password, email, verification_token });
  return user;
}

// Create a Google user
export async function createUserGoogle(name, surname, email) {
  const user = await User.create({
    name,
    surname,
    email,
    google: true,
    status: 'verified',
    prev_status: 'verified'
  });
  return user;
}

export async function getUserInventories(userId) {
  try {
    const inventories = await Inventory.findAll({
      where: { user_id: userId },
    });
    if (!inventories || inventories.length === 0) {
      return { success: false, message: "No inventories found" };
    }

    return { success: true, inventories };
  } catch (error) {
    console.error("Error fetching inventories:", error);
    return { success: false, error: error.message || error };
  }
}

export async function getEditableInventories(userId) {
  try {
    const editableInventories = await Inventory.findAll({
      include: [
        {
          model: User,
          as: "editors",
          where: { id: userId },
          through: { attributes: [] } 
        },
   
        {
          model: User,
          as: undefined, 
          attributes: ['email'], 
        }
      ]
    });

    const inventoriesWithCreatorEmail = editableInventories.map(inv => ({
      id: inv.id,
      name: inv.name,
      description: inv.description,
      is_public: inv.is_public,
      creatorEmail: inv.user?.email,
      createdAt: inv.createdAt
    }));

    return { success: true, inventories: inventoriesWithCreatorEmail };
  } catch (error) {
    console.error("Error fetching editable inventories:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserByEmailPartial(email) {
  return await User.findAll({
    where: {
      email: {
        [Op.like]: `%${email}%`  
      }
    },
    attributes: ["id", "name", "surname", "email"],
    limit: 5
  });
}