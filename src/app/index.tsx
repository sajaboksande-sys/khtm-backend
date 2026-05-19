import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TouchableWithoutFeedback, Alert, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// حساب عرض الشاشة بدقة لاستخدامه في شريط الإعلانات
const { width } = Dimensions.get('window');

export default function App() {
  const router = useRouter();

  const handleSecretDriverAccess = () => {
    Alert.alert(
      'وضع الكابتن 🚖',
      'جاري الانتقال إلى لوحة تحكم سائقي خِطّام في مسلاتة...',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'دخول', onPress: () => router.push('/driver/dashboard') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      
      {/* الهوية والترحيب مع الحركة السرية */}
      <View style={styles.header}>
        <TouchableWithoutFeedback onLongPress={handleSecretDriverAccess}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.logoText}>خِطّام</Text>
          </View>
        </TouchableWithoutFeedback>
        <Text style={styles.subtitleText}>توصيلك ونقلك في مسلاتة صار أسهل</Text>
      </View>

      {/* 📢 شريط الإعلانات والأخبار المتنور */}
      <View style={styles.adBannerContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled>
          <View style={[styles.adSlide, { width: width - 40 }]}>
            <FontAwesome5 name="bullhorn" size={14} color="#FBBF24" style={{ marginLeft: 8 }} />
            <Text style={styles.adText}>خصم 15% على مشاوير النقل الخارجي من مسلاتة هذا الأسبوع! 🔥</Text>
          </View>
          <View style={[styles.adSlide, { width: width - 40 }]}>
            <FontAwesome5 name="shield-alt" size={14} color="#10B981" style={{ marginLeft: 8 }} />
            <Text style={styles.adText}>جميع كباتن خِطّام معتمدين ومسجلين رسمياً لأمانك 🛡️</Text>
          </View>
        </ScrollView>
      </View>

      {/* خيارات التطبيق للزبائن */}
      <View style={styles.optionsContainer}>
        
        {/* زر التاكسي */}
        <TouchableOpacity 
          style={[styles.card, styles.taxiCard]} 
          activeOpacity={0.8}
          onPress={() => router.push('/taxi')}
        >
          <FontAwesome5 name="taxi" size={35} color="#FBBF24" style={{ marginLeft: 15 }} />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>طلب تاكسي 🚕</Text>
            <Text style={styles.cardDescription}>مشاويرك اليومية داخل وخارج مسلاتة بسرعة</Text>
          </View>
        </TouchableOpacity>

        {/* زر النقل والبضائع */}
        <TouchableOpacity 
          style={[styles.card, styles.deliveryCard]} 
          activeOpacity={0.8}
          onPress={() => router.push('/delivery')}
        >
          <FontAwesome5 name="truck" size={30} color="#3B82F6" style={{ marginLeft: 15 }} />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>نقل وبضائع 📦</Text>
            <Text style={styles.cardDescription}>نقل أثاث، بضائع، أو آليات بكل سهولة</Text>
          </View>
        </TouchableOpacity>

      </View>

      {/* الفوتر السفلي */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>صُنع بكل فخر لأهالي مسلاتة ❤️</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827', paddingHorizontal: 20 },
  header: { alignItems: 'center', marginTop: 30, marginBottom: 20 },
  logoText: { fontSize: 45, fontWeight: 'bold', color: '#FBBF24', marginBottom: 10 },
  subtitleText: { fontSize: 15, color: '#9CA3AF', textAlign: 'center' },
  
  adBannerContainer: { backgroundColor: '#1F2937', borderRadius: 12, height: 45, marginBottom: 20, borderWidth: 1, borderColor: '#374151', overflow: 'hidden' },
  adSlide: { height: 45, flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 15 },
  adText: { color: '#E5E7EB', fontSize: 11, fontWeight: 'bold', textAlign: 'right', flex: 1 },

  optionsContainer: { flex: 1, justifyContent: 'center', gap: 20, marginBottom: 40 },
  card: { flexDirection: 'row-reverse', alignItems: 'center', padding: 20, borderRadius: 15, backgroundColor: '#1F2937', borderWidth: 1, elevation: 4 },
  taxiCard: { borderColor: '#FBBF24' },
  deliveryCard: { borderColor: '#3B82F6' },
  cardTextContainer: { flex: 1, alignItems: 'flex-end' },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 5 },
  cardDescription: { fontSize: 13, color: '#9CA3AF', textAlign: 'right' },
  footer: { alignItems: 'center', marginBottom: 20 },
  footerText: { color: '#4B5563', fontSize: 12 }
});