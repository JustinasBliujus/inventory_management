import { Router } from 'express';
import bcrypt from 'bcrypt';
import { 
    getUsers, createUser, 
    createUserGoogle, getUserByEmail, updateLoginTime,
    verifyUser, findUserByToken,  
} from '../databaseService/userService.js';
import { getInventoryById } from '../databaseService/inventoryService.js';
import { sendVerificationEmail } from './mailer.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { requireLogin, requireAdmin, requireUnblocked } from './middlewares.js';
import adminRoutes from './adminRoutes.js';
import {createInventory} from '../databaseService/inventoryService.js';

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
        req.session.user = { id: user.id, email: user.email, status: user.status, is_admin: user.is_admin };

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

        req.session.user = { id: user.id, email: user.email, status: user.status, is_admin: user.is_admin };

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

export default router;