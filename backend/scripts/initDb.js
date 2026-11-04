const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDb() {
  try {
    console.log('📝 Connecting to MySQL...');
    console.log(`Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`User: ${process.env.DB_USER || 'root'}`);
    console.log(`Database: ${process.env.DB_NAME || 'sekolah_db'}`);

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    console.log('✅ Connected to MySQL server');

    const dbName = process.env.DB_NAME || 'sekolah_db';
    
    // Drop database jika sudah ada
    console.log(`\n🗑️  Dropping old database "${dbName}" if exists...`);
    await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\`;`);
    console.log(`✅ Old database dropped`);

    // Create database baru
    console.log(`\n📝 Creating new database "${dbName}"...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`✅ Database "${dbName}" created.`);

    // Now sync with Sequelize
    const sequelize = require('../config/database');
    console.log('\n📝 Syncing Sequelize models...');
    await sequelize.sync({ force: false });
    console.log('✅ All models synced successfully!');

    await connection.end();
    console.log('\n🎉 Database initialization completed!');
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  }
}

initDb();
