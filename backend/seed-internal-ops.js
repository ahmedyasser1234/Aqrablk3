const { DataSource } = require('typeorm');
const bcrypt = require('bcrypt');
const path = require('path');

// Entity definition (minimal for seeding)
const AdminSettings = {
    name: "AdminSettings",
    columns: {
        id: { primary: true, type: "int" },
        name: { type: "varchar" },
        avatar: { type: "varchar", nullable: true },
        password: { type: "varchar" }
    }
};

async function seed() {
    const dbPath = path.join(__dirname, 'analytics.db');
    console.log('Connecting to database at:', dbPath);

    const AppDataSource = new DataSource({
        type: "sqlite",
        database: dbPath,
        entities: [AdminSettings],
        synchronize: true,
    });

    try {
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");

        const adminRepo = AppDataSource.getRepository("AdminSettings");
        const hashed = await bcrypt.hash('admin123', 10);

        // Seed Admin (ID 1)
        await adminRepo.save({ 
            id: 1, 
            name: 'المدير', 
            password: hashed 
        });
        console.log('✅ Admin (id: 1) seeded/updated with password: admin123');

        // Seed Chairman (ID 2)
        await adminRepo.save({ 
            id: 2, 
            name: 'مجلس الإدارة', 
            password: hashed 
        });
        console.log('✅ Chairman (id: 2) seeded/updated with password: admin123');

        await AppDataSource.destroy();
    } catch (err) {
        console.error("Error during Data Source initialization", err);
    }
}

seed();
