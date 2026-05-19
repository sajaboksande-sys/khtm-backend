import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, StatusBar, Alert, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function TaxiScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<any>(null);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [passengerName, setPassengerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [destination, setDestination] = useState('');

  // حالة جديدة: هل قبل السائق الطلب؟ لكي تظهر الأيقونة والبطاقة الحية للعميل
  const [isDriverAssigned, setIsDriverAssigned] = useState(false);

  const msallataRegion = {
    latitude: 32.5786,
    longitude: 14.0439,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  };

  useEffect(() => {
    async function getLiveLocation() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          setLocation(currentLocation);
        }
      } catch (error) {
        console.log("استخدام الموقع الافتراضي لمسلاتة");
      }
    }
    getLiveLocation();
  }, []);

  const handleOrderSubmit = () => {
    if (!passengerName.trim() || !phoneNumber.trim() || !destination.trim()) {
      Alert.alert('تنبيه ⚠️', 'الرجاء ملء جميع البيانات لتأكيد طلب التاكسي.');
      return;
    }

    setModalVisible(false);
    
    // محاكاة: بعد 3 ثوانٍ من إرسال الزبون للطلب، يقوم سائق بقبوله وتظهر الأيقونة للعميل!
    Alert.alert('تم إرسال الطلب 📨', 'جاري البحث عن أقرب كابتن في مسلاتة...');
    
    setTimeout(() => {
      setIsDriverAssigned(true); // تفعيل أيقونة تتبع السائق القادم للزبون
    }, 4000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={msallataRegion}
        region={
          location && location.coords
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.015,
              }
            : msallataRegion
        }
        showsUserLocation={true}
      >
        {location && location.coords && (
          <Marker coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }} title="موقعي الحالي" />
        )}
      </MapView>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <FontAwesome5 name="arrow-right" size={18} color="#111827" />
      </TouchableOpacity>

      {/* لوحة التحكم السفلية المتغيرة ديناميكياً */}
      {!isDriverAssigned ? (
        <View style={styles.bottomCard}>
          <Text style={styles.cardTitle}>تحديد نقطة الانطلاق 📍</Text>
          <Text style={styles.cardSubtitle}>الخريطة جاهزة في مدينة مسلاتة</Text>

          <TouchableOpacity style={styles.confirmButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.confirmButtonText}>تأكيد الموقع وطلب تاكسي</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* 🚖 أيقونة وبطاقة حركة السائق القادم للزبون الحية! */
        <View style={[styles.bottomCard, { backgroundColor: '#10B981' }]}>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={[styles.cardTitle, { color: '#FFFFFF' }]}>الكابتن في الطريق إليك ⚡</Text>
            <FontAwesome5 name="running" size={24} color="#FFFFFF" />
          </View>
          
          <View style={styles.driverLiveStatusBox}>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.driverLiveName}>👤 السائق: صلاح الطير</Text>
              <Text style={styles.driverLiveCar}>🚗 سيارة: هيونداي أفانتي (أصفر تـاكسي)</Text>
              <Text style={styles.driverLivePhone}>📞 هاتف: 091223344</Text>
            </View>
            <FontAwesome5 name="taxi" size={35} color="#FBBF24" />
          </View>
          
          <TouchableOpacity style={styles.cancelTripButton} onPress={() => setIsDriverAssigned(false)}>
            <Text style={styles.cancelTripText}>إلغاء الرحلة</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* الـ Modal الخاص بإدخال البيانات */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{alignItems: 'center'}}>
              <View style={styles.modalCloseLine} />
              <Text style={styles.modalTitle}>بيانات طلب التاكسي 🚕</Text>
              <Text style={styles.modalSubtitle}>أدخل بياناتك ليصلك كابتن خطّام بأسرع وقت</Text>

              <Text style={styles.inputLabel}>الاسم بالكامل</Text>
              <TextInput style={styles.input} placeholder="مثال: ساجا أحمد" placeholderTextColor="#9CA3AF" value={passengerName} onChangeText={setPassengerName} textAlign="right" />

              <Text style={styles.inputLabel}>رقم الهاتف</Text>
              <TextInput style={styles.input} placeholder="مثال: 091XXXXXXX" placeholderTextColor="#9CA3AF" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} textAlign="right" />

              <Text style={styles.inputLabel}>الواجهة (وين ماشي؟)</Text>
              <TextInput style={styles.input} placeholder="مثال: وسط البلاد، مستشفى مسلاتة" placeholderTextColor="#9CA3AF" value={destination} onChangeText={setDestination} textAlign="right" />

              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleOrderSubmit}>
                  <Text style={styles.submitButtonText}>تأكيد وإرسال الطلب</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>إلغاء</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height, position: 'absolute' },
  backButton: { position: 'absolute', top: 50, right: 20, backgroundColor: '#FFFFFF', padding: 15, borderRadius: 50, zIndex: 10, elevation: 8 },
  bottomCard: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#111827', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 40, zIndex: 10, elevation: 15 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'right', marginBottom: 6 },
  cardSubtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'right', marginBottom: 25 },
  confirmButton: { backgroundColor: '#FBBF24', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  confirmButtonText: { color: '#111827', fontSize: 18, fontWeight: 'bold' },
  
  // تنسيقات صندوق الكابتن الحي القادم للعميل
  driverLiveStatusBox: { backgroundColor: '#1F2937', borderRadius: 12, padding: 15, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#374151' },
  driverLiveName: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  driverLiveCar: { color: '#FBBF24', fontSize: 12, marginTop: 4 },
  driverLivePhone: { color: '#9CA3AF', fontSize: 12, marginTop: 2 },
  cancelTripButton: { backgroundColor: '#EF4444', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  cancelTripText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1F2937', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, width: '100%', maxHeight: '85%' },
  modalCloseLine: { width: 50, height: 5, backgroundColor: '#4B5563', borderRadius: 10, marginBottom: 15 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#FBBF24', textAlign: 'center', marginBottom: 5 },
  modalSubtitle: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginBottom: 20 },
  inputLabel: { width: '100%', color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', textAlign: 'right', marginBottom: 6 },
  input: { width: Dimensions.get('window').width - 50, backgroundColor: '#111827', color: '#FFFFFF', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#374151', marginBottom: 15, fontSize: 16 },
  modalButtonsContainer: { flexDirection: 'row-reverse', gap: 15, marginTop: 10, width: '100%' },
  submitButton: { flex: 2, backgroundColor: '#FBBF24', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  submitButtonText: { color: '#111827', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { flex: 1, backgroundColor: '#374151', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  cancelButtonText: { color: '#9CA3AF', fontSize: 16, fontWeight: 'bold' }
});