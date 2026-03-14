import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function seed() {
    console.log('Starting seed process...');
    const db = await open({
        filename: './analytics.db',
        driver: sqlite3.Database
    });

    const titleAr = 'كيف يمكن للهوية البصرية أن تسرع نمو علامتك التجارية في 2026';
    const titleEn = 'How Visual Identity Can Rocket Your Brand Growth in 2026';
    const contentAr = '<p>في عالم تزداد فيه المنافسة الرقمية، لم تعد الهوية البصرية مجرد شعار جميل، بل أصبحت لغة التواصل الأولى بينك وبين عملائك. في عام 2026، يتوقع العملاء تجربة بصرية متكاملة تعكس الاحترافية والثقة.</p>' +
        '<h3>لماذا الهوية البصرية مهمة؟</h3>' +
        '<ul>' +
        '<li><strong>التركيز الذهني:</strong> تساعد الهوية القوية في ترسيخ علامتك في ذاكرة العميل.</li>' +
        '<li><strong>الاحترافية:</strong> التصميم المتقن يعطي انطباعاً بالموثوقية والجودة.</li>' +
        '<li><strong>التميز:</strong> في بحر من المنافسين، هويتك هي ما يجعلك مختلفاً.</li>' +
        '</ul>' +
        '<p>في "أقرب"، نحن نؤمن أن الموشن جرافيك والتصوير الاحترافي هما قلب الهوية البصرية الحديثة. استثمر في مظهرك الرقمي اليوم لتجني ثمار النمو غداً.</p>';
    const contentEn = '<p>In an increasingly competitive digital world, visual identity is no longer just a pretty logo; it has become the primary language of communication between you and your customers. In 2026, customers expect a seamless visual experience that reflects professionalism and trust.</p>' +
        '<h3>Why Visual Identity Matters?</h3>' +
        '<ul>' +
        '<li><strong>Mental Focus:</strong> A strong identity helps cement your brand in the customer\'s memory.</li>' +
        '<li><strong>Professionalism:</strong> Masterful design gives an impression of reliability and quality.</li>' +
        '<li><strong>Differentiation:</strong> In a sea of competitors, your identity is what makes you different.</li>' +
        '</ul>' +
        '<p>At "Aqrab", we believe that motion graphics and professional photography are the heart of modern visual identity. Invest in your digital appearance today to reap the rewards of growth tomorrow.</p>';
    const imagePath = '/uploads/blog_visual_identity_cover.png';
    const slug = 'visual-identity-growth-2026';
    const categoryAr = 'تسويق رقمي';
    const categoryEn = 'Digital Marketing';
    const createdAt = new Date().toISOString();

    const query = 'INSERT INTO blog (titleAr, titleEn, contentAr, contentEn, imagePath, slug, categoryAr, categoryEn, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    await db.run(query, [
        titleAr, titleEn, contentAr, contentEn,
        imagePath, slug, categoryAr, categoryEn, createdAt
    ]);

    console.log('✅ Sample blog post seeded successfully!');
    await db.close();
}

seed().catch(err => {
    console.error('❌ Error seeding blog:', err);
    process.exit(1);
});
