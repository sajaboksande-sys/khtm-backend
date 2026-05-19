import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, Alert, TextInput, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// قاعدة بيانات السائقين المسجلين في مسلاتة (تخيلها قادمة من Aiven MySQL)
const driversDatabase: Record<string, { name: string; phone: string; vehicle: string; color: string; type: 'taxi' | 'delivery' }> = {
  "1234": { name: "صلاح الطير", phone: "091223344", vehicle: "هيونداي أفانتي", color: "أصفر تـاكسي", type: "taxi" },
  "5566": { name: "عمر كعوان", phone: "092556677", vehicle: "شاحنة إيسوزو 4 طن", color: "أبيض", type: "delivery" },
  "7788": { name: "عبد الله الدوكالي", phone: "094778899", vehicle: "كيا سيراتو", color: "رصاصي", type: "taxi" },
};

// قائمة الطلبات الحية في مسلاتة
const initialRequests = [
  { id: '1', type: 'taxi', name: 'أحمد البدري', phone: '091776543', destination: 'مستشفى مسلاتة المركزى', time: 'منذ دقيقتين' },
  { id: '2', type: 'delivery', name: 'سالم الشريف', phone: '092113455', destination: 'سوق السبت (نقل أثاث منزل)', time: 'منذ 5 دقائق' },
  { id: '3', type: 'taxi', name: 'فاطمة محمد', phone: '091554322', destination: 'وسط البلاد - المحلات التجارية', time: 'منذ 12 دقيقة' },
];

export default function DriverDashboard() {
  const router = useRouter();
  
  // حالات التحكم بالدخول والبيانات
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [currentDriver, setCurrentDriver] = useState<any>(null);
  
  const [requests, setRequests] = useState(initialRequests);
  const [vehicleFilter, setVehicleFilter] = useState<'all' | 'taxi' | 'delivery'>('all');

  // دالة التحقق من رمز المرور
  const handleLogin = () => {
    const driver = driversDatabase[passcode];
    if (driver) {
      setCurrentDriver(driver);
      setIsAuthenticated(true);
      // تغيير الفلتر تلقائياً حسب نوع مركبة السائق المُراد دخوله!
      setVehicleFilter(driver.type); 
    } else {
      Alert.alert('خطأ في الدخول ❌', 'رمز المرور غير صحيح! الرجاء التواصل مع إدارة خِطّام بمسلاتة.');
      setPasscode('');
    }
  };

  const handleAccept = (id: string, name: string) => {
    Alert.alert('تم قبول الطلب ✅', `يتواصل كابتن [${currentDriver?.name}] الآن مع الزبون (${name}). سيارتك: ${currentDriver?.vehicle} (${currentDriver?.color})`);
    setRequests(requests.filter(req => req.id !== id));
  };

  const filteredRequests = requests.filter(req => {
    if (vehicleFilter === 'all') return true;
    return req.type === vehicleFilter;
  });

  // إذا لم يتم التحقق، تظهر شاشة إدخال الرمز المقفلة
  if (!isAuthenticated) {
    return (
      <View style={styles.loginContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#111827" />
        <FontAwesome5 name="lock" size={50} color="#FBBF24" style={{ marginBottom: 20 }} />
        <Text style={styles.loginTitle}>بوابة كباتن خِطّام 🚖</Text>
        <Text style={styles.loginSubtitle}>الرجاء إدخال رمز المرور السري الخاص بك للمتابعة</Text>
        
        <TextInput
          style={styles.loginInput}
          placeholder="أدخل الرمز (مثال: 1234)"
          placeholderTextColor="#6B7280"
          secureTextEntry={true}
          keyboardType="numeric"
          value={passcode}
          onChangeText={setPasscode}
          maxLength={6}
          textAlign="center"
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>تأكيد الرمز والدخول</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.exitButton} onPress={() => router.back()}>
          <Text style={styles.exitButtonText}>رجوع لتطبيق الزبائن</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // الواجهة الرئيسية للسائق بعد الدخول بنجاح
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#064E3B" />
      
      {/* هيدر الكابتن الديناميكي يعرض بياناته كاملة! */}
      <View style={styles.header}>
        <View style={styles.driverInfo}>
          <Text style={styles.driverGreeting}>مرحباً، كابتن {currentDriver.name} 👋</Text>
          <Text style={styles.driverCar}>🚗 المركبة: {currentDriver.vehicle} | لونها: {currentDriver.color}</Text>
          <Text style={styles.driverStatus}>الرقم: {currentDriver.phone} | متصل ومستعد 🟢</Text>
        </View>
        <FontAwesome5 name="user-circle" size={40} color="#10B981" />
      </View>

      {/* أزرار الفلترة والتصفية */}
      <Text style={styles.filterTitle}>تصفية الطلبات المتاحة 🛠️:</Text>
      <View style={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterButton, vehicleFilter === 'delivery' && styles.activeDeliveryButton]} onPress={() => setVehicleFilter('delivery')}>
          <FontAwesome5 name="truck" size={13} color={vehicleFilter === 'delivery' ? '#FFFFFF' : '#3B82F6'} />
          <Text style={[styles.filterButtonText, vehicleFilter === 'delivery' && styles.activeText]}>شاحنات 📦</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.filterButton, vehicleFilter === 'taxi' && styles.activeTaxiButton]} onPress={() => setVehicleFilter('taxi')}>
          <FontAwesome5 name="taxi" size={13} color={vehicleFilter === 'taxi' ? '#111827' : '#FBBF24'} />
          <Text style={[styles.filterButtonText, vehicleFilter === 'taxi' && styles.activeTaxiText]}>تاكسي 🚕</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.filterButton, vehicleFilter === 'all' && styles.activeAllButton]} onPress={() => setVehicleFilter('all')}>
          <Text style={[styles.filterButtonText, vehicleFilter === 'all' && styles.activeText]}>الكل 🌍</Text>
        </TouchableOpacity>
      </View>

      {/* قائمة الطلبات */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.requestsList}>
        {filteredRequests.length === 0 ? (
          <View style={styles.noRequestsBox}>
            <FontAwesome5 name="check-circle" size={40} color="#10B981" style={{ marginBottom: 10 }} />
            <Text style={styles.noRequestsText}>لا توجد طلبات في هذا القسم حالياً</Text>
          </View>
        ) : (
          filteredRequests.map((item) => (
            <View key={item.id} style={styles.requestCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.requestTime}>{item.time}</Text>
                <Text style={styles.badgeText}>{item.type === 'taxi' ? 'طلب تاكسي 🚕' : 'نقل وبضائع 📦'}</Text>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.detailText}>👤 <Text style={styles.boldText}>الزبون:</Text> {item.name}</Text>
                <Text style={styles.detailText}>📞 <Text style={styles.boldText}>الهاتف:</Text> {item.phone}</Text>
                <Text style={styles.detailText}>📍 <Text style={styles.boldText}>الواجهة:</Text> {item.destination}</Text>
              </View>

              <View style={styles.actionsContainer}>
                <TouchableOpacity style={[styles.acceptButton, item.type === 'delivery' && { backgroundColor: '#3B82F6' }]} onPress={() => handleAccept(item.id, item.name)}>
                  <Text style={styles.acceptButtonText}>قبول الطلب</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectButton} onPress={() => handleAccept(item.id, item.name)}>
                  <Text style={styles.rejectButtonText}>رفض</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* زر تسجيل الخروج لقفل الشاشة مرة أخرى */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => { setIsAuthenticated(false); setPasscode(''); }}>
        <Text style={styles.logoutButtonText}>تسجيل خروج الكابتن 🚪</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // تنسيقات شاشة قفل الدخول بالرمز
  loginContainer: { flex: 1, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center', padding: 25 },
  loginTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  loginSubtitle: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginBottom: 30, paddingHorizontal: 20 },
  loginInput: { width: '80%', backgroundColor: '#1F2937', color: '#FFFFFF', fontSize: 22, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#374151', letterSpacing: 4, marginBottom: 20 },
  loginButton: { width: '80%', backgroundColor: '#FBBF24', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
  loginButtonText: { color: '#111827', fontSize: 16, fontWeight: 'bold' },
  exitButton: { padding: 10 },
  exitButtonText: { color: '#9CA3AF', fontSize: 14 },

  // تنسيقات اللوحة الرئيسية
  container: { flex: 1, backgroundColor: '#111827', paddingHorizontal: 15 },
  header: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingBottom: 15, borderBottomWidth: 1, borderColor: '#1F2937' },
  driverInfo: { flex: 1, alignItems: 'flex-end', marginRight: 15 },
  driverGreeting: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  driverCar: { fontSize: 13, color: '#FBBF24', marginTop: 4 },
  driverStatus: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  
  filterTitle: { color: '#9CA3AF', fontSize: 12, textAlign: 'right', marginTop: 20, marginBottom: 8 },
  filterContainer: { flexDirection: 'row-reverse', gap: 8, marginBottom: 15 },
  filterButton: { flex: 1, flexDirection: 'row-reverse', gap: 6, backgroundColor: '#1F2937', paddingVertical: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#374151' },
  filterButtonText: { color: '#9CA3AF', fontSize: 12, fontWeight: 'bold' },
  activeTaxiButton: { backgroundColor: '#FBBF24', borderColor: '#FBBF24' },
  activeTaxiText: { color: '#111827' },
  activeDeliveryButton: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  activeAllButton: { backgroundColor: '#10B981', borderColor: '#10B981' },
  activeText: { color: '#FFFFFF' },

  requestsList: { flex: 1 },
  requestCard: { backgroundColor: '#1F2937', borderRadius: 15, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#374151' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#374151', paddingBottom: 8, marginBottom: 12 },
  requestTime: { color: '#9CA3AF', fontSize: 11 },
  badgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  cardBody: { alignItems: 'flex-end', gap: 6 },
  detailText: { color: '#D1D5DB', fontSize: 14 },
  boldText: { color: '#9CA3AF' },
  actionsContainer: { flexDirection: 'row-reverse', gap: 10, marginTop: 15, paddingTop: 10, borderTopWidth: 1, borderColor: '#374151' },
  acceptButton: { flex: 3, backgroundColor: '#10B981', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  acceptButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  rejectButton: { flex: 1, backgroundColor: '#EF4444', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  rejectButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  noRequestsBox: { alignItems: 'center', marginTop: 40 },
  noRequestsText: { color: '#9CA3AF', fontSize: 14 },
  
  logoutButton: { backgroundColor: '#1F2937', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 10, marginBottom: 15, borderWidth: 1, borderColor: '#EF4444' },
  logoutButtonText: { color: '#EF4444', fontSize: 14, fontWeight: 'bold' }
});