// 🌐 تم ضبط الرابط بناءً على الـ IP الداخلي لجهازكِ الحالي ومستعد للموبايل
const BASE_URL = 'http://192.168.1.177:3000'; 

// 1️⃣ دالة إرسال طلب جديد (من تطبيق الراكب)
export const createTrip = async (passengerName, phone, destination, serviceType) => {
    try {
        const response = await fetch(`${BASE_URL}/api/trips`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                passenger_name: passengerName,
                phone_number: phone,
                destination: destination,
                service_type: serviceType // 'taxi' أو 'delivery'
            })
        });
        return await response.json();
    } catch (error) {
        console.error("خطأ في إرسال الطلب:", error);
        return { error: "تعذر الاتصال بالسيرفر" };
    }
};

// 2️⃣ دالة جلب الطلبات المنتظرة (لتطبيق السائق) مع الفرز تلقائياً
export const getPendingTrips = async (type) => {
    try {
        const response = await fetch(`${BASE_URL}/api/trips?type=${type}`);
        return await response.json();
    } catch (error) {
        console.error("خطأ في جلب الطلبات:", error);
        return [];
    }
};

// 3️⃣ دالة تسجيل دخول السائق بالرمز السري (Passcode)
export const loginDriver = async (passcode) => {
    try {
        const response = await fetch(`${BASE_URL}/api/drivers/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ passcode })
        });
        return await response.json();
    } catch (error) {
        console.error("خطأ في تسجيل الدخول:", error);
        return { error: "تعذر الاتصال بالسيرفر" };
    }
};

// 4️⃣ دالة قبول الطلب أو تحديث حالته (من قبل السائق)
export const updateTripStatus = async (tripId, status, driverName) => {
    try {
        const response = await fetch(`${BASE_URL}/api/trips/${tripId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, driver_name: driverName })
        });
        return await response.json();
    } catch (error) {
        console.error("خطأ في تحديث الطلب:", error);
        return { error: "تعذر الاتصال بالسيرفر" };
    }
};