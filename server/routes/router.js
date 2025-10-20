import { Router } from 'express';
import bcrypt from 'bcrypt';
import { 
    getUsers, createUser, 
    createUserGoogle, getUserByEmail, updateLoginTime,
    verifyUser, findUserByToken, getUserInventories,
    getEditableInventories, getUserByEmailPartial  
} from '../databaseService/userService.js';
import { getInventoryById } from '../databaseService/inventoryService.js';
import { sendVerificationEmail } from './mailer.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { requireLogin, requireAdmin, requireUnblocked } from './middlewares.js';
import adminRoutes from './adminRoutes.js';
import {createInventory, updateInventory, saveChat,
   deleteInventory, saveCustomID, addEditor,
    addItem, deleteItem, saveInventoryTags,
     getLastInventories, getMostPopularInventories,
     getRandomTags
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

router.get('/getUsers', requireLogin(), requireUnblocked(), requireAdmin(), async (req, res) => {
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
       return res.status(400).json({ status: "error", message: "Missing name, surname, or email" });
     }

     const user = await getUserByEmail(email);

     const result = await createUserGoogle(name, surname, email);

     if (result) {
       return res.status(201).json({ status: "success", message: "User created successfully" });
     } else {
       return res.status(400).json({ status: "error", message: "User failed to create" });
     }

   } catch (err) {
     if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ status: "error", message: "User already exists" });
     }
     return res.status(500).json({ status: "error", message: "Internal server error" });
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

        if (err.code === 'ER_DUP_ENTRY') {
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

router.get("/getInventory/:id", requireLogin(), async (req, res) => {
  const { id } = req.params;
  const userId = req.session.user.id;

  const result = await getInventoryById(userId, id);

  if (!result.success) return res.status(404).json(result);

  res.json(result.inventory.dataValues);
});

router.get("/getUsersInventories", requireLogin(), async (req, res) => {
  const userId = req.session.user.id;

  const result = await getUserInventories(userId);

  if (!result.success) {
    return res.status(404).json(result);
  }

  res.json({ success: true, inventories: result.inventories });
});

router.post("/saveInventory", requireLogin(), async (req, res) => {
    const { inv_id, creator_id, ...fields } = req.body;
    try {
        const inv = await updateInventory(inv_id, creator_id, fields);
        res.json({ success: true, inventory: inv });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.post("/saveChat", requireLogin(), async (req, res) => {
  const { inventory_id, message } = req.body;
  const creator_email = req.session.user.email;

  try {
    const chat = await saveChat(inventory_id, creator_email, message);
    res.json({ success: true, chat });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get("/getEditableInventories", requireLogin(), async (req, res) => {
  try {
    const userId = req.session.user.id;
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

router.post('/deleteInventory', requireLogin(), async (req, res) => {
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

router.post('/saveCustomID', requireLogin(), async (req, res) => {
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

router.post("/search", async (req, res) => {
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

router.post('/addEditor', requireLogin(), async (req, res) => {

  const userId = req.session.user.id;
  const inventoryId = BigInt(req.body.data);

  try {
    const result = await addEditor(inventoryId, userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/addItem', requireLogin(), async (req, res) => {
  const { inventoryId, itemData } = req.body;
  const creatorEmail = req.session.user.email;
  try {
    const result = await addItem(inventoryId, creatorEmail, itemData);
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
  console.log(tags+" "+inventoryId)
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
export default router;

router.get('/random', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const result = await getRandomTags(limit);
  res.json(result);
});