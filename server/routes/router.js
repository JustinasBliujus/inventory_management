import { Router } from 'express';
import bcrypt from 'bcrypt';
import { getUsers, blockUsers, createUser, createUserGoogle, getUserByEmail, updateLoginTime, unblockUsers, deleteUsers, deleteUnverified, verifyUser, findUserByToken, promoteUsers, demoteUsers } from '../database.js';
import { sendVerificationEmail } from './mailer.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { requireLogin, requireAdmin, requireUnblocked } from './middlewares.js';

const TOKEN_BYTES_LENGTH = 32;
const SALT_ROUNDS = 10;

dotenv.config();
const router = Router();

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
        req.session.user = { email: user.email, status: user.status, is_admin: user.is_admin };

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

        req.session.user = { email: user.email, status: user.status, is_admin: user.is_admin };

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

router.post('/admin/block', requireLogin(),requireUnblocked(), requireAdmin(), async (req, res) => {
    try {
        const emails = req.body.emails;
        if (!emails || emails.length === 0) {
            return res.status(400).json({ message: 'No emails provided' });
        }

        const result = await blockUsers(emails);

        if (emails.includes(req.session.user.email)) {
            req.session.destroy(err => {
                if (err) console.error('Failed to destroy session:', err);
                return res.status(200).json({ message: 'You have blocked yourself. Session ended.' });
            });
            return;
        }
        
        res.json({ result, message: 'User(s) blocked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to block user(s)' });
    }
});

router.post('/admin/unblock', requireLogin(), requireUnblocked(), requireAdmin(), async (req, res) => {
    try {
        const emails = req.body.emails;
        if (!emails || emails.length === 0) {
            return res.status(400).json({ message: 'No emails provided' });
        }

        const result = await unblockUsers(emails);
        res.json({ result, message: 'User(s) unblocked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to unblock user(s)' });
    }
});

router.post('/admin/promote', requireLogin(), requireUnblocked(), requireAdmin(), async (req, res) => {
    try {
        const emails = req.body.emails;
        console.log(emails)
        if (!emails || emails.length === 0) {
            return res.status(400).json({ message: 'No emails provided' });
        }

        const result = await promoteUsers(emails);
        res.json({ result, message: 'User(s) promoted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to promote user(s)' });
    }
});

router.post('/admin/demote', requireLogin(), requireUnblocked(), requireAdmin(), async (req, res) => {
    try {
        const emails = req.body.emails;
        if (!emails || emails.length === 0) {
            return res.status(400).json({ message: 'No emails provided' });
        }
        
        const result = await demoteUsers(emails);

        if (emails.includes(req.session.user.email)) {
            req.session.destroy(err => {
                if (err) console.error('Failed to destroy session:', err);
                return res.status(200).json({ message: 'You have demoted yourself. Session ended.' });
            });
            return;
        }

        res.json({ result, message: 'User(s) demoted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to demote user(s)' });
    }
});

router.delete('/admin/delete', requireLogin(), requireUnblocked(), requireAdmin(), async (req, res) => {
    try {
        const emails = req.body.emails;
        if (!emails || emails.length === 0) {
            return res.status(400).json({ message: 'No emails provided' });
        }
        
        const result = await deleteUsers(emails);

        if (emails.includes(req.session.user.email)) {
            req.session.destroy(err => {
                if (err) console.error('Failed to destroy session:', err);
                return res.status(200).json({ message: 'You have deleted yourself. Session ended.' });
            });
            return;
        }

        res.json({ result, message: 'User(s) deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete user(s)' });
    }
});

router.delete('/admin/unverified', requireLogin(), requireUnblocked(), requireAdmin(), async (req, res) => {
    try {

        const result = await deleteUnverified();

        if (req.session.user.status === 'unverified') {
            req.session.destroy(err => {
                if (err) console.error('Failed to destroy session:', err);
                return res.status(200).json({ message: 'You have deleted yourself. Session ended.' });
            });
            return;
        }

        res.json({ result, message: 'User(s) deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete user(s)' });
    }
});

router.post('/registerGoogle', async (req, res) => {
    try {
        const { name, surname, email, } = req.body;
        const user = await getUserByEmail(email);
        
        const result = await createUserGoogle(name, surname, email);

        if (result !== undefined) {
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
        console.log(user)
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

export default router;