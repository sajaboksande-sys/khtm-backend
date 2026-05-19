import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, StatusBar, Alert, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DeliveryScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<any>(null);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [clientName, setClientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cargoType, setCargoType] = useState('');
  const [destination, setDestination] = useState('');

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

  const handleDeliverySubmit = () => {
    if (!clientName.trim() || !phoneNumber.trim() || !cargoType.trim() || !destination.trim()) {
      Alert.alert('تنبيه ⚠️', 'الرجاء ملء جميع الحقول لتأكيد طلب النقل.');
      return;
    }

    setModalVisible(false);
    Alert.alert(
      'تم تسجيل طلب النقل! 🎉',
      `شكراً يا ${clientName}، جاري البحث عن أقرب شاحنة نقل في مسلاتة لتوصيل (${cargoType}) إلى (${destination}).`
    );
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
          <Marker coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }} title="موقع البضاعة الحالية" pinColor="blue" />
        )}
      </MapView>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <FontAwesome5 name="arrow-right" size={18} color="#111827" />
      </TouchableOpacity>

      <View style={styles.bottomCard}>
        <Text style={styles.cardTitle}>نقل بضائع وأثاث 📦</Text>
        <Text style={styles.cardSubtitle}>حدد موقع الشحن الحالي على الخريطة</Text>

        <TouchableOpacity style={styles.confirmButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.confirmButtonText}>تأكيد الموقع وطلب شاحنة</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{alignItems: 'center'}}>
              <View style={styles.modalCloseLine} />
              <Text style={styles.modalTitle}>تفاصيل شحنة النقل 📦</Text>
              <Text style={styles.modalSubtitle}>أدخل تفاصيل البضاعة ليتم تسعير المشوار بدقة</Text>

              <Text style={styles.inputLabel}>اسم صاحب الشحنة</Text>
              <TextInput style={styles.input} placeholder="مثال: علي محمد" placeholderTextColor="#9CA3AF" value={clientName} onChangeText={setClientName} textAlign="right" />

              <Text style={styles.inputLabel}>رقم الهاتف</Text>
              <TextInput style={styles.input} placeholder="مثال: 092XXXXXXX" placeholderTextColor="#9CA3AF" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} textAlign="right" />

              <Text style={styles.inputLabel}>نوع البضاعة (شنو بتنقل؟)</Text>
              <TextInput style={styles.input} placeholder="مثال: أثاث منزل، إسمنت، مواد غذائية" placeholderTextColor="#9CA3AF" value={cargoType} onChangeText={setCargoType} textAlign="right" />

              <Text style={styles.inputLabel}>مكان التنزيل (وين ماشي؟)</Text>
              <TextInput style={styles.input} placeholder="مثال: سوق السبت، قصر الأخيار، طرابلس" placeholderTextColor="#9CA3AF" value={destination} onChangeText={setDestination} textAlign="right" />

              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleDeliverySubmit}>
                  <Text style={styles.submitButtonText}>تأكيد الطلب</Text>
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
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#3B82F6', textAlign: 'right', marginBottom: 6 },
  cardSubtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'right', marginBottom: 25 },
  confirmButton: { backgroundColor: '#3B82F6', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  confirmButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1F2937', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, width: '100%', maxHeight: '85%' },
  modalCloseLine: { width: 50, height: 5, backgroundColor: '#4B5563', borderRadius: 10, marginBottom: 15 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#3B82F6', textAlign: 'center', marginBottom: 5 },
  modalSubtitle: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginBottom: 20 },
  inputLabel: { width: '100%', color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', textAlign: 'right', marginBottom: 6 },
  input: { width: Dimensions.get('window').width - 50, backgroundColor: '#111827', color: '#FFFFFF', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#374151', marginBottom: 15, fontSize: 16 },
  modalButtonsContainer: { flexDirection: 'row-reverse', gap: 15, marginTop: 10, width: '100%' },
  submitButton: { flex: 2, backgroundColor: '#3B82F6', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { flex: 1, backgroundColor: '#374151', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  cancelButtonText: { color: '#9CA3AF', fontSize: 16, fontWeight: 'bold' }
});