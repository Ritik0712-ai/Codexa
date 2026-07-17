import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const demoMode = req.app.locals.demoMode;
    const demoStorage = req.app.locals.demoStorage;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Demo mode
    if (demoMode) {
      // Check if user exists
      for (const user of demoStorage.users.values()) {
        if (user.email === email) {
          return res.status(400).json({ error: 'Email already registered' });
        }
      }

      const userId = uuidv4();
      const passwordHash = await bcrypt.hash(password, 12);
      const accessToken = uuidv4();
      const refreshToken = uuidv4();

      const user = {
        id: userId,
        name,
        email,
        role: 'USER',
        createdAt: new Date().toISOString(),
      };

      demoStorage.users.set(userId, { ...user, passwordHash });
      demoStorage.sessions.set(refreshToken, { userId, expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 });

      return res.status(201).json({ user, accessToken, refreshToken });
    }

    // Production mode - requires Prisma
    return res.status(500).json({ error: 'Database not configured. Run in demo mode or set DATABASE_URL.' });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const demoMode = req.app.locals.demoMode;
    const demoStorage = req.app.locals.demoStorage;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Demo mode
    if (demoMode) {
      let foundUser: any = null;
      for (const user of demoStorage.users.values()) {
        if (user.email === email) {
          foundUser = user;
          break;
        }
      }

      if (!foundUser) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, foundUser.passwordHash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const accessToken = uuidv4();
      const refreshToken = uuidv4();

      demoStorage.sessions.set(refreshToken, { userId: foundUser.id, expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 });

      return res.json({
        user: {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
        },
        accessToken,
        refreshToken,
      });
    }

    // Production mode
    return res.status(500).json({ error: 'Database not configured. Run in demo mode or set DATABASE_URL.' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const demoMode = req.app.locals.demoMode;
    const demoStorage = req.app.locals.demoStorage;

    if (demoMode && refreshToken) {
      demoStorage.sessions.delete(refreshToken);
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

export default router;
