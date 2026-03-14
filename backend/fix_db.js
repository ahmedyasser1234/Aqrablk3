const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'analytics.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // 1. Check current admin avatar
    db.all("SELECT * FROM admin_settings WHERE id = 1", (err, rows) => {
        if (err) console.error(err);
        console.log('Current AdminSettings:', rows);
        
        // Let's set the avatar to the previously uploaded file
        // The file in uploads is 1773170950975-564219327.png
        // So the URL is http://localhost:3545/uploads/1773170950975-564219327.png
        // Or we can just use the absolute URL based on the file. Let's use the local API path
        const avatarUrl = 'http://localhost:3545/uploads/1773170950975-564219327.png';
        
        db.run("UPDATE admin_settings SET avatar = ? WHERE id = 1", [avatarUrl], (err) => {
            if (err) console.error(err);
            console.log('Updated admin_settings with avatar URL');
        });
    });

    // 2. Check internal_message table
    db.all("SELECT id, senderId, senderAvatar FROM internal_message WHERE senderId = 0 LIMIT 5", (err, rows) => {
        if (err) console.error(err);
        console.log('Internal messages from admin:', rows);

        // Update old messages that might have a broken or missing avatar
        // By setting senderAvatar to null for admin, the frontend will automatically fallback to the new adminAvatar!
        db.run("UPDATE internal_message SET senderAvatar = NULL WHERE senderId = 0", (err) => {
            if (err) console.error(err);
            console.log('Cleared senderAvatar in internal_message for admin, so frontend uses fallback.');
        });
    });
});

db.close();
