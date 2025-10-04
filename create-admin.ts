import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { generateHashedPassword } from './lib/db/utils';
import { user } from './lib/db/schema';
import { eq } from 'drizzle-orm';

async function createAdminUser() {
  // Database connection
  const client = postgres(process.env.POSTGRES_URL!);
  const db = drizzle(client);

  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123456'; // Change this to a secure password

  try {
    // Check if admin user already exists
    const existingUser = await db.select().from(user).where(eq(user.email, adminEmail));
    
    if (existingUser.length > 0) {
      console.log('Admin user already exists with email:', adminEmail);
      return;
    }

    // Hash the password
    const hashedPassword = generateHashedPassword(adminPassword);

    // Create the admin user
    const result = await db.insert(user).values({
      email: adminEmail,
      password: hashedPassword,
    }).returning();

    console.log('Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('User ID:', result[0].id);
    console.log('\nPlease change the password after first login!');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await client.end();
  }
}

createAdminUser();