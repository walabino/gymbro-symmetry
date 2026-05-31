import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  console.log('🔄 Starting database initialization...');

  try {
    // Read SQL file
    const sqlPath = path.resolve(__dirname, '../../gymbro_complete_schema.sql');
    
    if (!fs.existsSync(sqlPath)) {
      console.error('❌ SQL schema file not found. Please create gymbro_complete_schema.sql first.');
      return;
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute SQL
    await pool.query(sql);
    
    console.log('✅ Database initialized successfully!');
    console.log('📊 Tables created and seed data inserted.');
    console.log('\n🔐 Test users:');
    console.log('   Admin: admin@gymbro.com / password123');
    console.log('   Coach: coach@gymbro.com / password123');
    console.log('   Alumno: alumno@gymbro.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
