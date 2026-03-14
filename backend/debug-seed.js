const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'analytics.db');
console.log('Target database:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Connection error:', err.message);
        process.exit(1);
    }
});

const post = {
    titleAr: 'كيف يمكن للهوية البصرية أن تسرع نمو علامتك التجارية في 2026',
    titleEn: 'How Visual Identity Can Rocket Your Brand Growth in 2026',
    contentAr: '<p>في عالم تزداد فيه المنافسة الرقمية، لم تعد الهوية البصرية مجرد شعار جميل، بل أصبحت لغة التواصل الأولى بينك وبين عملائك. في عام 2026، يتوقع العملاء تجربة بصرية متكاملة تعكس الاحترافية والثقة.</p>' +
        '<h3>لماذا الهوية البصرية مهمة؟</h3>' +
        '<ul>' +
        '<li><strong>التركيز الذهني:</strong> تساعد الهوية القوية في ترسيخ علامتك في ذاكرة العميل.</li>' +
        '<li><strong>الاحترافية:</strong> التصميم المتقن يعطي انطباعاً بالموثوقية والجودة.</li>' +
        '<li><strong>التميز:</strong> في بحر من المنافسين، هويتك هي ما يجعلك مختلفاً.</li>' +
        '</ul>' +
        '<p>في "أقرب"، نحن نؤمن أن الموشن جرافيك والتصوير الاحترافي هما قلب الهوية البصرية الحديثة. استثمر في مظهرك الرقمي اليوم لتجني ثمار النمو غداً.</p>',
    contentEn: '<p>In an increasingly competitive digital world, visual identity is no longer just a pretty logo; it has become the primary language of communication between you and your customers. In 2026, customers expect a seamless visual experience that reflects professionalism and trust.</p>' +
        '<h3>Why Visual Identity Matters?</h3>' +
        '<ul>' +
        '<li><strong>Mental Focus:</strong> A strong identity helps cement your brand in the customer\'s memory.</li>' +
        '<li><strong>Professionalism:</strong> Masterful design gives an impression of reliability and quality.</li>' +
        '<li><strong>Differentiation:</strong> In a sea of competitors, your identity is what makes you different.</li>' +
        '</ul>' +
        '<p>At "Aqrab", we believe that motion graphics and professional photography are the heart of modern visual identity. Invest in your digital appearance today to reap the rewards of growth tomorrow.</p>',
    imagePath: '/uploads/blog_visual_identity_cover.png',
    slug: 'visual-identity-growth-2026',
    categoryAr: 'تسويق رقمي',
    categoryEn: 'Digital Marketing',
    createdAt: new Date().toISOString()
};

db.serialize(() => {
    // 1. Check if table exists
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='blog'", (err, row) => {
        if (err) {
            console.error('Schema check error:', err.message);
            return;
        }
        if (!row) {
            console.log('Table "blog" does not exist! Creating it...');
            db.run("CREATE TABLE blog (id INTEGER PRIMARY KEY AUTOINCREMENT, titleAr TEXT, titleEn TEXT, contentAr TEXT, contentEn TEXT, imagePath TEXT, slug TEXT, categoryAr TEXT, categoryEn TEXT, createdAt DATETIME)");
        }
    });

    // 2. Clear existing (optional, but good for testing)
    db.run("DELETE FROM blog WHERE slug = ?", [post.slug]);

    // 3. Insert
    const query = `INSERT INTO blog (titleAr, titleEn, contentAr, contentEn, imagePath, slug, categoryAr, categoryEn, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(query, [
        post.titleAr, post.titleEn, post.contentAr, post.contentEn,
        post.imagePath, post.slug, post.categoryAr, post.categoryEn, post.createdAt
    ], function (err) {
        if (err) {
            console.error('Insertion error:', err.message);
        } else {
            console.log('✅ Success! Post inserted with ID:', this.lastID);
            db.get("SELECT COUNT(*) as total FROM blog", (err, row) => {
                console.log('Current total blog posts:', row.total);
            });
        }
    });
});

db.close();
