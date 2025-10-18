import { Router } from 'express';
import { 
  blockUsers, unblockUsers, promoteUsers, demoteUsers, deleteUsers, deleteUnverified 
} from '../databaseService/userService.js';
import { requireLogin, requireAdmin, requireUnblocked } from './middlewares.js';

const router = Router();
router.use(requireLogin(), requireUnblocked(), requireAdmin());

router.post('/block', async (req, res) => {
    try {
        const emails = req.body.emails;
        if (!emails || emails.length === 0) return res.status(400).json({ message: 'No emails provided' });

        const result = await blockUsers(emails);

        if (emails.includes(req.session.user.email)) {
            req.session.destroy(err => {
                if (err) console.error(err);
                return res.status(200).json({ message: 'You blocked yourself. Session ended.' });
            });
            return;
        }

        res.json({ result, message: 'User(s) blocked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to block user(s)' });
    }
});

router.post('/unblock', async (req, res) => {
    try {
        const emails = req.body.emails;
        if (!emails || emails.length === 0) return res.status(400).json({ message: 'No emails provided' });

        const result = await unblockUsers(emails);
        res.json({ result, message: 'User(s) unblocked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to unblock user(s)' });
    }
});

router.post('/promote', async (req, res) => {
    try {
        const emails = req.body.emails;
        if (!emails || emails.length === 0) return res.status(400).json({ message: 'No emails provided' });

        const result = await promoteUsers(emails);
        res.json({ result, message: 'User(s) promoted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to promote user(s)' });
    }
});

router.post('/demote', async (req, res) => {
    try {
        const emails = req.body.emails;
        if (!emails || emails.length === 0) return res.status(400).json({ message: 'No emails provided' });

        const result = await demoteUsers(emails);

        if (emails.includes(req.session.user.email)) {
            req.session.destroy(err => {
                if (err) console.error(err);
                return res.status(200).json({ message: 'You demoted yourself. Session ended.' });
            });
            return;
        }

        res.json({ result, message: 'User(s) demoted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to demote user(s)' });
    }
});

router.delete('/delete', async (req, res) => {
    try {
        const emails = req.body.emails;
        if (!emails || emails.length === 0) return res.status(400).json({ message: 'No emails provided' });

        const result = await deleteUsers(emails);

        if (emails.includes(req.session.user.email)) {
            req.session.destroy(err => {
                if (err) console.error(err);
                return res.status(200).json({ message: 'You deleted yourself. Session ended.' });
            });
            return;
        }

        res.json({ result, message: 'User(s) deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete user(s)' });
    }
});

router.delete('/unverified', async (req, res) => {
    try {
        const result = await deleteUnverified();

        if (req.session.user.status === 'unverified') {
            req.session.destroy(err => {
                if (err) console.error(err);
                return res.status(200).json({ message: 'You deleted yourself. Session ended.' });
            });
            return;
        }

        res.json({ result, message: 'Unverified user(s) deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete unverified user(s)' });
    }
});

export default router;
