import { Router } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { 
    getUsers, createUser, 
    createUserGoogle, getUserByEmail, updateLoginTime,
    verifyUser, findUserByToken, getUserByEmailPartial, 
} from '../databaseService/userService.js';
import { getInventoryById } from '../databaseService/inventoryService.js';
import { sendVerificationEmail } from './mailer.js';
import { requireLogin, requireUnblocked } from './middlewares.js';
import { searchAll } from '../databaseService/search.js'
import adminRoutes from './adminRoutes.js';
import {createInventory, updateInventory, saveChat,
    deleteInventory, saveCustomID, addEditor, deleteItem, saveInventoryTags,
    getLastInventories, getMostPopularInventories,
    getRandomTags, upsertItem, getInventoriesByTag,
    getUserInventories, getEditableInventories,getAllTags
} from '../databaseService/inventoryService.js';

const TOKEN_BYTES_LENGTH = 32;
const SALT_ROUNDS = 10;

dotenv.config();
const router = Router();

router.use('/admin', adminRoutes);

router.post('/loginGoogle', async (req, res) => {
    const { email } = req.body;
    const user = await getUserByEmail(email);
    if (!user || user.google == false) {
        return res.status(404).json({ 
                status: "error",
                message: "User not found"
        });
    }
    try {
        req.session.user = { id: user.id, email: user.email, status: user.status, is_admin: user.is_admin, name: user.name };

        await updateLoginTime(user.email);

        return res.status(200).json({
            status: "success",
            message: "Login successful",
        });

    } catch (err) {
        return res.status(500).json({ 
                status: "error",
                message: "Internal server error, please try again later"
        });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);

    if (!user) {
        return res.status(404).json({ 
                status: "error",
                message: "User not found"
        });
    }
    if (user && user.password === null) {
        return res.status(404).json({ 
                status: "error",
                message: "This account was created using Google login."
        });
    }
    try {
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ 
                status: "error",
                message: "Incorrect password"
            });
        }

        req.session.user = { id: user.id, email: user.email, status: user.status, is_admin: user.is_admin, name: user.name  };

        await updateLoginTime(user.email);

        return res.status(200).json({
            status: "success",
            message: "Login successful",
        });

    } catch (err) {
        return res.status(500).json({ 
                status: "error",
                message: "Internal server error, please try again later"
        });
    }
});

router.get("/session-user", (req, res) => {
  if (req.session.user) {
    res.json({ success: true, user: req.session.user });
  } else {
    res.json({ success: false, user: null });
  }
});

router.get('/isLoggedIn', requireLogin(), requireUnblocked(), (req, res) => {
  res.status(200).json({ user: req.session.user });
});

router.get('/getUsers', requireLogin(), requireUnblocked(), async (req, res) => {
  try {
    const users = await getUsers();
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch user(s)' });
  }
});

router.post('/registerGoogle', async (req, res) => {
  try {
    const { name, surname, email } = req.body;

    if (!name || !surname || !email) {
      return res.status(400).json({ 
        status: "error", 
        message: "Missing name, surname, or email" 
      });
    }

    const user = await getUserByEmail(email);

    if (user && user.status === 'blocked') {
      return res.status(403).json({ 
        status: "error", 
        message: "User is blocked" 
      });
    }

    const result = await createUserGoogle(name, surname, email);

    return res.status(201).json({ 
      status: "success", 
      message: "User created successfully", 
      user: result 
    });

  } catch (err) {
    if (err.name === 'GoogleUserDuplicateError') {
      return res.status(409).json({ 
        status: "error", 
        message: "User already exists" 
      });
    }

    console.error(err);
    return res.status(500).json({ 
      status: "error", 
      message: "Internal server error" 
    });
  }
});

router.post('/register', async (req, res) => {
    try {
        const { name, surname, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const verificationToken = crypto.randomBytes(TOKEN_BYTES_LENGTH).toString('hex');

        const result = await createUser(name, surname, hashedPassword, email, verificationToken);
        if (result !== undefined) {
            sendVerificationEmail(email, verificationToken);
            return res.status(201).json({ 
                status: "success",
                message: "User created successfully"
            });
        } else {
            return res.status(400).json({ 
                status: "error",
                message: "User failed to create" 
            });
        }

    } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ 
            status: "error",
            message: "User already exists" 
        });
    }

    return res.status(500).json({ 
        status: "error",
        message: "Internal server error"  
    });
}
});

router.get('/verify', async (req, res) => {
    const { token } = req.query;    

    if (!token) {
        return res.status(400).send('Invalid verification link');
    }

    try {
        const user = await findUserByToken(token);
        if (!user) {
            return res.status(400).send('Invalid or expired verification link');
        }
        if (user.status === 'blocked') {
            return res.status(403).send('User is blocked');
        }
        await verifyUser(user.email);

        res.send('Your email has been verified! You can now log in.');
    } catch (err) {
        res.status(500).send('Internal server error');
    }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Could not log out');
    }

    res.clearCookie('connect.sid'); 
    res.sendStatus(200); 
  });
});


router.post('/createInventory', requireLogin(), requireUnblocked(), async (req, res) => {
  const { name } = req.body;
  const userID = req.session.user.id;

  try {
    const item = await createInventory(userID, name);

    res.status(201).json({ status: 'success', inventoryId: item.inventoryId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Failed to create inventory' });
  }
});

router.get("/getInventory/:id", requireLogin(), requireUnblocked(), async (req, res) => {
  
  const { id } = req.params;
  const result = await getInventoryById(id);

  if (!result.success) return res.status(404).json(result);

  res.json(result.inventory.dataValues);
});

router.get("/getUsersInventories/:userId", requireLogin(), requireUnblocked(), async (req, res) => {
  const { userId } = req.params;

  const result = await getUserInventories(userId);

  if (!result.success) {
    return res.status(404).json(result);
  }

  res.json({ success: true, inventories: result.inventories });
});

router.post("/saveInventory", requireLogin(), requireUnblocked(), async (req, res) => {
    const { inv_id, creator_id, ...fields } = req.body;
    try {
        const inv = await updateInventory(inv_id, creator_id, fields);
        res.json({ success: true, inventory: inv });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.post("/saveChat", requireLogin(), requireUnblocked(), async (req, res) => {
  const { inventory_id, message } = req.body;
  const creator_email = req.session.user.email;

  try {
    const chat = await saveChat(inventory_id, creator_email, message);
    res.json({ success: true, chat });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get("/getEditableInventories/:userId", requireLogin(), requireUnblocked(), async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await getEditableInventories(userId);

    if (!result.success) {
      return res.status(500).json(result);
    }
    res.json(result);
  } catch (error) {
    console.error("Route error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/deleteInventory', requireLogin(), requireUnblocked(), async (req, res) => {
  const { inventoryId } = req.body;
  const userId = req.session.user.id;

  if (!userId || !inventoryId) {
    return res.status(400).json({ success: false, message: 'Missing userId or inventoryId' });
  }

  try {

    const result = await deleteInventory(userId, inventoryId);

    if (!result.success) {
      return res.status(404).json({ success: false, message: result.message });
    }

    return res.json({ success: true, message: result.message });
  } catch (error) {
    console.error('Error deleting inventory:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/saveCustomID', requireLogin(), requireUnblocked(), async (req, res) => {
  const user_id = req.session.user.id;
  const customID = req.body.customID;

  if (!customID) {
    return res.status(400).json({ success: false, message: "Missing customID data" });
  }

  const result = await saveCustomID(user_id, customID);
  if (!result.success) {
    return res.status(500).json(result);
  }

  res.json(result);
});

router.post("/search", requireLogin(), requireUnblocked(), async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const users = await getUserByEmailPartial(email);
    return res.json({ success: true, users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post('/addEditor', requireLogin(), requireUnblocked(), async (req, res) => {
  try {
    const { editors, inventoryId } = req.body;
    if (!inventoryId || !Array.isArray(editors)) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const editorEmails = editors.map(editor => editor.email);

    const result = await addEditor(editorEmails, inventoryId);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.post('/addItem', requireLogin(), requireUnblocked(), async (req, res) => {

  const { itemData, item_id } = req.body;
  const creator_email = req.session.user.email;

  try {
   
    const result = await upsertItem(itemData, item_id, creator_email);

    if (result.success) {
      res.status(200).json(result.item);
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/deleteItem", async (req, res) => {
  const { item_id, inv_id, creator_id } = req.body;
  
  if (!item_id || !inv_id || !creator_id) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const result = await deleteItem(item_id, inv_id, creator_id);

  if (result.success) {
    return res.json(result);
  } else {
    return res.status(404).json(result);
  }
});

router.post("/saveTags", requireLogin(), async (req, res) => {
  const { tags, inventoryId } = req.body;

  try {
    const savedTags = await saveInventoryTags(req.session.user.id, inventoryId, tags);
    res.json({ success: true, tags: savedTags });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/inventories/last', async (req, res) => {
  const result = await getLastInventories(10);
  res.json(result);
});

router.get('/inventories/popular', async (req, res) => {
  const result = await getMostPopularInventories(10);
  res.json(result);
});

router.get('/random', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const result = await getRandomTags(limit);
  res.json(result);
});

router.get('/inventoriesByTag', async (req, res) => {
  try {
    const tagId = req.query.tagId; 
    if (!tagId) return res.status(400).json({ success: false, message: 'tagId is required' });

    const inventories = await getInventoriesByTag(tagId);

    res.json({ success: true, inventories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.get('/getUserByEmail/:email', async (req, res) => {
  try {
    const {email} = req.params; 
    if (!email) return res.status(400).json({ success: false, message: 'email is required' });

    const user = await getUserByEmail(email);

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.get("/fullSearch", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  const results = await searchAll(q);
  res.json(results);
});

router.get("/getAllTags", async (req, res) => {
  try {
    const tags = await getAllTags();
    res.json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;