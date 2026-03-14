const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'analytics.db');
const db = new sqlite3.Database(dbPath);

const blog = {
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
    // Check if table exists (it should, but just in case)
    db.run("CREATE TABLE IF NOT EXISTS blog (id INTEGER PRIMARY KEY AUTOINCREMENT, titleAr TEXT, titleEn TEXT, contentAr TEXT, contentEn TEXT, imagePath TEXT, slug TEXT, categoryAr TEXT, categoryEn TEXT, createdAt DATETIME)");

    const stmt = db.prepare("INSERT INTO blog (titleAr, titleEn, contentAr, contentEn, imagePath, slug, categoryAr, categoryEn, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

    stmt.run([
        blog.titleAr, blog.titleEn, blog.contentAr, blog.contentEn,
        blog.imagePath, blog.slug, blog.categoryAr, blog.categoryEn, blog.createdAt
    ], function (err) {
        if (err) {
            console.error('❌ Error seeding blog:', err.message);
        } else {
            console.log('✅ Sample blog post seeded successfully! ID:', this.lastID);
        }
    });

    stmt.finalize();
});

db.close();
