const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // تم إضافة حزمة الحماية لضمان استقبال الطلبات من الهواتف بأمان

const app = express();

// تفعيل الحزم الأساسية
app.use(cors()); 
app.use(express.json()); // لتمكين السيرفر من قراءة بيانات JSON القادمة من التطبيق

// 🔌 إعدادات الاتصال بقاعدة البيانات السحابية الحية المحدثة لبيئات الرفع
const dbConfig = {
    host: 'khatam2-sajaboksande-bbbb.j.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_7I97K6M7K6z55Lg_y7Z',
    port: 21435,
    database: 'khattan_db', 
    ssl: {
        rejectUnauthorized: false // تضمن قبول شهادة Aiven السحابية من خوادم Render الخارجية
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// إنشاء مجموعة اتصالات مستمرة (Pool) لضمان سرعة واستقرار الـ API وتجنب انقطاع الاتصال
const pool = mysql.createPool(dbConfig);

// --- 🌐 الـ API Endpoints الخاصة بالتطبيق ---

// 1️⃣ فحص تشغيل السيرفر (Root Endpoint)
app.get('/', (req, res) => {
    res.send('🚀 سيرفر تطبيق خِطّام يعمل بنجاح ومربوط بالسحاب على منصة Render!');
});

// 2️⃣ إرسال طلب جديد (من تطبيق الراكب)
app.post('/api/trips', (req, res) => {
    const { passenger_name, phone_number, destination, service_type } = req.body;
    
    if (!passenger_name || !phone_number || !destination || !service_type) {
        return res.status(400).json({ error: 'الرجاء إدخال جميع البيانات المطلوبة' });
    }

    const query = 'INSERT INTO trips (passenger_name, phone_number, destination, service_type) VALUES (?, ?, ?, ?)';
    pool.query(query, [passenger_name, phone_number, destination, service_type], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: '✅ تم إرسال طلبك بنجاح', tripId: results.insertId });
    });
});

// 3️⃣ جلب الطلبات النشطة (لتطبيق السائقين) مع الفرز تلقائياً بناءً على نوع الخدمة
app.get('/api/trips', (req, res) => {
    const { type } = req.query; 
    
    let query = "SELECT * FROM trips WHERE status = 'pending'";
    const params = [];

    if (type) {
        query += " AND service_type = ?";
        params.push(type);
    }

    query += " ORDER BY created_at DESC";

    pool.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 4️⃣ التحقق من الكود السري للسائق وتسجيل دخوله بالتطبيق
app.post('/api/drivers/login', (req, res) => {
    const { passcode } = req.body;

    if (!passcode) {
        return res.status(400).json({ error: 'الرجاء إدخال الرمز السري' });
    }

    const query = 'SELECT * FROM drivers WHERE passcode = ?';
    pool.query(query, [passcode], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (results.length === 0) {
            return res.status(401).json({ error: '❌ الرمز السري غير صحيح' });
        }
        
        res.json({ message: '🔑 تم تسجيل الدخول بنجاح', driver: results[0] });
    });
});

// 5️⃣ قبول السائق للطلب أو تحديث حالته (مستلم، مكتمل، ملغي)
app.put('/api/trips/:id', (req, res) => {
    const tripId = req.params.id;
    const { status, driver_name } = req.body;

    const query = 'UPDATE trips SET status = ?, driver_name = ? WHERE id = ?';
    pool.query(query, [status, driver_name, tripId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `🔄 تم تحديث حالة الطلب بنجاح إلى ${status}` });
    });
});

// --- 🛫 تشغيل السيرفر السحابي الديناميكي ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`📡 السيرفر السحابي يعمل الآن بكفاءة على المنفذ: ${PORT}`);
});