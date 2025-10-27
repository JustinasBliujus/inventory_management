import { Sequelize } from 'sequelize';
import User from "../databaseModels/user.js";
import { Op } from "sequelize";

export async function getUsers() {
  return await User.findAll({
    attributes: ['id','name','surname','email','status','is_admin','last_login'],
    order: [['last_login', 'DESC']]
  });
}

export async function getUser(id) {
  return await User.findByPk(id);
}

export async function updateLoginTime(email) {
  await User.update(
    { last_login: new Date() },
    { where: { email } }
  );
}

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

export async function unblockUsers(emails) {
  if (!emails || emails.length === 0) return;

  await User.update(
    { status: User.sequelize.col('prev_status') },
    { where: { email: { [Op.in]: emails } } }
  );
}

export async function promoteUsers(emails) {
  if (!emails || emails.length === 0) return;

  await User.update(
    { is_admin: true },
    { where: { email: { [Op.in]: emails } } }
  );
}

export async function demoteUsers(emails) {
  if (!emails || emails.length === 0) return;

  await User.update(
    { is_admin: false },
    { where: { email: { [Op.in]: emails } } }
  );
}

export async function verifyUser(email) {
  await User.update(
    { status: 'verified', prev_status: 'verified' },
    { where: { email } }
  );
}

export async function getUserByEmail(email) {

  return await User.findOne({ where: { email } });
}

export async function deleteUsers(emails) {
  const deleted = await User.destroy({ where: { email: { [Op.in]: emails } } });
  return deleted;
}

export async function findUserByToken(token) {
  return await User.findOne({ where: { verification_token: token } });
}

export async function deleteUnverified() {
  const deleted = await User.destroy({ where: { status: 'unverified' } });
  return deleted;
}

export async function createUser( name, surname, password, email, verification_token ) {
  const user = await User.create({ name, surname, password, email, verification_token });
  return user;
}

export async function createUserGoogle(name, surname, email) {
  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults: {
      name,
      surname,
      email,
      google: true,
      status: 'verified',
      prev_status: 'verified'
    }
  });

  if (!created) {
    if (user.google) {
      const error = new Error('User already exists as a Google account');
      error.name = 'GoogleUserDuplicateError';
      throw error;
    }

    user.name = name || user.name;
    user.surname = surname || user.surname;
    user.google = true;
    user.prev_status = 'verified';
    user.status = 'verified';
    await user.save();
  }

  return user;
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