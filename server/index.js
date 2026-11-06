import express from 'express';
import dotenv from 'dotenv';
import { supabase, seedProductsIfEmpty } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

// Seed catalog on startup if table is ready & empty
if (process.env.SEED_PRODUCTS_ON_START === 'true') seedProductsIfEmpty();

// Verify identity before any private or mutating operation. The service-role
// Supabase client bypasses RLS, so API authorization is mandatory.
async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Please sign in first.' });
  try {
    const { data, error } = await supabase.auth.getUser(authHeader.slice(7));
    if (error || !data?.user) return res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
    req.user = data.user;
    next();
  } catch (err) {
    console.error('Authentication failed:', err);
    res.status(401).json({ error: 'Could not verify your session.' });
  }
}
async function requireAdmin(req, res, next) {
  const { data, error } = await supabase.from('profiles').select('role').eq('id', req.user.id).single();
  if (error || data?.role !== 'admin') return res.status(403).json({ error: 'Administrator access required.' });
  next();
}
function ownUser(req, res, next) {
  const supplied = req.body?.userId || req.query?.userId;
  if (supplied && supplied !== req.user.id) return res.status(403).json({ error: 'You cannot access another account.' });
  next();
}
async function ownPet(req, res, next) {
  const { data, error } = await supabase.from('pets').select('user_id').eq('id', req.params.id).maybeSingle();
  if (error) return res.status(500).json({ error: 'Could not verify pet ownership.' });
  if (!data) return res.status(404).json({ error: 'Pet not found.' });
  if (data.user_id !== req.user.id) return res.status(403).json({ error: 'Access denied.' });
  next();
}
async function ownBooking(req, res, next) {
  const { data, error } = await supabase.from('bookings').select('user_id').eq('id', req.params.id).maybeSingle();
  if (error) return res.status(500).json({ error: 'Could not verify booking ownership.' });
  if (!data) return res.status(404).json({ error: 'Booking not found.' });
  if (data.user_id !== req.user.id) return res.status(403).json({ error: 'Access denied.' });
  next();
}

// API Status
app.get('/api/status', (req, res) => {
  res.json({ status: 'running', database: 'supabase-postgresql' });
});

// ==========================================
// AUTH ROUTES
// ==========================================

// Register a new user via the backend (uses service-role key – avoids false
// "email already exists" errors that the anon-key signUp can produce on the
// frontend when email confirmation is enabled or an unconfirmed account exists)
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  // ── Basic validation ───────────────────────────────────────────────────────
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  if (name.trim().length < 2) {
    return res.status(400).json({ error: 'Please enter your full name (at least 2 characters).' });
  }

  try {
    // Use the admin API so we always get a definitive, accurate error
    // (the anon-key signUp silently succeeds for duplicate emails when
    //  email confirmation is enabled, causing false "already exists" errors)
    const { data, error } = await supabase.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password,
      user_metadata: { name: name.trim() },
      email_confirm: true, // confirmed immediately so user can log in right away
    });

    if (error) {
      console.error('Register error:', error.message);

      // ── Translate raw Supabase messages into friendly user-facing ones ──────
      const msg = error.message.toLowerCase();
      if (msg.includes('already been registered') || msg.includes('already exists') || msg.includes('duplicate')) {
        return res.status(409).json({ error: 'An account with this email already exists. Please log in or use a different email.' });
      }
      if (msg.includes('invalid email') || msg.includes('unable to validate email')) {
        return res.status(400).json({ error: 'The email address you entered is not valid.' });
      }
      if (msg.includes('password') && msg.includes('weak')) {
        return res.status(400).json({ error: 'Your password is too weak. Try adding numbers or symbols.' });
      }
      if (msg.includes('rate limit') || msg.includes('too many')) {
        return res.status(429).json({ error: 'Too many attempts. Please wait a moment and try again.' });
      }

      // Fallback: send Supabase's original message
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Registration successful', userId: data.user?.id });
  } catch (err) {
    console.error('Register exception:', err);
    res.status(500).json({ error: 'Something went wrong on our end. Please try again shortly.' });
  }
});

// ==========================================
// PRODUCTS ROUTES
// ==========================================

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch products' });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(data);
  } catch (error) {
    console.error('Fetch product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Add new product (Admin)
app.post('/api/products', authenticateUser, requireAdmin, async (req, res) => {
  const { name, price, stock, image, description } = req.body;
  if (!name || price === undefined || stock === undefined) {
    return res.status(400).json({ error: 'Name, price, and stock are required' });
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name,
        price: Number(price),
        stock: Number(stock),
        image: image || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600',
        description: description || ''
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: error.message || 'Failed to add product' });
  }
});

// Edit product (Admin)
app.put('/api/products/:id', authenticateUser, requireAdmin, async (req, res) => {
  const { name, price, stock, image, description } = req.body;
  if (!name || price === undefined || stock === undefined) {
    return res.status(400).json({ error: 'Name, price, and stock are required' });
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        name,
        price: Number(price),
        stock: Number(stock),
        image,
        description
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Edit product error:', error);
    res.status(500).json({ error: error.message || 'Failed to edit product' });
  }
});

// Delete product (Admin)
app.delete('/api/products/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Product deleted successfully', id: Number(req.params.id) });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete product' });
  }
});

// ==========================================
// PETS ROUTES
// ==========================================

// Get user's pets
app.get('/api/pets', authenticateUser, ownUser, async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Fetch pets error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch pets' });
  }
});

// Get single pet
app.get('/api/pets/:id', authenticateUser, ownPet, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    res.json(data);
  } catch (error) {
    console.error('Fetch pet error:', error);
    res.status(500).json({ error: 'Failed to fetch pet' });
  }
});

// Add new pet
app.post('/api/pets', authenticateUser, ownUser, async (req, res) => {
  const userId = req.user.id;
  const { name, type, breed, age, ageUnit, notes } = req.body;

  if (!userId || !name) {
    return res.status(400).json({ error: 'userId and name are required' });
  }

  try {
    const { data, error } = await supabase
      .from('pets')
      .insert([{
        user_id: userId,
        name,
        type: type || 'Unknown',
        breed: breed || '',
        age: age ? Number(age) : null,
        age_unit: ageUnit || 'years',
        notes: notes || ''
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Add pet error:', error);
    res.status(500).json({ error: error.message || 'Failed to add pet' });
  }
});

// Edit pet
app.put('/api/pets/:id', authenticateUser, ownPet, async (req, res) => {
  const { name, type, breed, age, ageUnit, notes } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const { data, error } = await supabase
      .from('pets')
      .update({
        name,
        type: type || 'Unknown',
        breed: breed || '',
        age: age ? Number(age) : null,
        age_unit: ageUnit || 'years',
        notes: notes || ''
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Edit pet error:', error);
    res.status(500).json({ error: error.message || 'Failed to edit pet' });
  }
});

// Delete pet
app.delete('/api/pets/:id', authenticateUser, ownPet, async (req, res) => {
  try {
    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Pet deleted successfully', id: Number(req.params.id) });
  } catch (error) {
    console.error('Delete pet error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete pet' });
  }
});

// ==========================================
// BOOKINGS ROUTES
// ==========================================

// Get bookings
app.get('/api/bookings', authenticateUser, ownUser, async (req, res) => {
  const userId = req.user.id;

  try {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        pets ( name )
      `)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const formatted = (data || []).map(b => ({
      ...b,
      petName: b.pets?.name || 'Unknown',
      serviceName: b.service
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Fetch bookings error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch bookings' });
  }
});

// Add booking
app.post('/api/bookings', authenticateUser, ownUser, async (req, res) => {
  const userId = req.user.id;
  const { petId, service, date, time, notes } = req.body;

  if (!userId || !petId || !service || !date || !time) {
    return res.status(400).json({ error: 'userId, petId, service, date, and time are required' });
  }

  try {
    const { data: pet, error: petErr } = await supabase.from('pets').select('user_id').eq('id', petId).maybeSingle();
    if (petErr || !pet || pet.user_id !== req.user.id) return res.status(403).json({ error: 'Invalid pet for this account.' });
    const { data: newBooking, error: insertErr } = await supabase
      .from('bookings')
      .insert([{
        user_id: userId,
        pet_id: Number(petId),
        service,
        date,
        time,
        notes: notes || ''
      }])
      .select(`
        *,
        pets ( name )
      `)
      .single();

    if (insertErr) throw insertErr;

    const formatted = {
      ...newBooking,
      petName: newBooking.pets?.name || 'Unknown',
      serviceName: newBooking.service
    };

    res.status(201).json(formatted);
  } catch (error) {
    console.error('Add booking error:', error);
    res.status(500).json({ error: error.message || 'Failed to add booking' });
  }
});

// Cancel/delete booking
app.delete('/api/bookings/:id', authenticateUser, ownBooking, async (req, res) => {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Booking cancelled successfully', id: Number(req.params.id) });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: error.message || 'Failed to cancel booking' });
  }
});

// ==========================================
// ORDERS ROUTES
// ==========================================

// Get user's orders
app.get('/api/orders', authenticateUser, ownUser, async (req, res) => {
  const userId = req.user.id;

  try {
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch orders' });
  }
});

// Create new order
app.post('/api/orders', authenticateUser, ownUser, async (req, res) => {
  const userId = req.user.id;
  const { items, total, instructions } = req.body;

  if (!userId || !items || !Array.isArray(items) || items.length === 0 || total === undefined) {
    return res.status(400).json({ error: 'userId, items, and total are required' });
  }

  try {
    const { data: orderData, error: orderErr } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        items,
        total: Number(total),
        instructions: instructions || '',
        status: 'pending'
      }])
      .select()
      .single();

    if (orderErr) throw orderErr;

    // Decrement product stock levels in Supabase
    for (const item of items) {
      if (item.productId) {
        const { data: product } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.productId)
          .single();

        if (product) {
          const newStock = Math.max(0, (product.stock || 0) - Number(item.quantity));
          await supabase.from('products').update({ stock: newStock }).eq('id', item.productId);
        }
      }
    }

    res.status(201).json(orderData);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: error.message || 'Failed to place order' });
  }
});

// Vercel imports the Express app as a serverless handler.
export default app;

// Keep the existing local `npm run dev` workflow unchanged.
if (process.env.VERCEL !== '1' && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
}
