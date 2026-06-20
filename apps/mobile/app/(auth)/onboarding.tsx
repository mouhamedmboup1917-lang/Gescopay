import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  FlatList,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { T } from '@/constants/i18n';
import { TOUCH_MIN, contentContainer, TS } from '@/constants/Responsive';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'One Wallet,\nAll Your Wallets',
    subtitle: 'Connect Wave, Orange Money, Free Money, and all your other wallets in one single place.',
    icon: 'wallet-outline',
    color: '#00A8A8',
    bgColors: ['#0A2342', '#143567'] as [string, string],
    accent: '#00A8A8',
  },
  {
    id: '2',
    title: 'One Universal\nQR Code',
    subtitle: 'A single QR code. Your customers pay from any mobile wallet in seconds.',
    icon: 'qr-code-outline',
    color: '#FF7A00',
    bgColors: ['#0A2342', '#1A1A2E'] as [string, string],
    accent: '#FF7A00',
  },
  {
    id: '3',
    title: 'Instant\nPayments',
    subtitle: 'Send and receive money, create virtual cards, and manage your finances in real-time.',
    icon: 'flash-outline',
    color: '#22C55E',
    bgColors: ['#0A2342', '#0D3324'] as [string, string],
    accent: '#22C55E',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace('/(auth)/welcome');
    }
  };

  const skip = () => router.replace('/(auth)/welcome');

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <LinearGradient colors={item.bgColors} style={styles.slide}>
            <View style={contentContainer}>
              {/* Decorative circles */}
              <View style={[styles.circle, { backgroundColor: `${item.color}20`, top: -50, right: -60 }]} />
              <View style={[styles.circleSmall, { backgroundColor: `${item.color}15`, bottom: 150, left: -40 }]} />

              <View style={styles.centerAlign}>
                {/* Illustration */}
                <View style={[styles.iconContainer, { backgroundColor: `${item.color}20`, borderColor: `${item.color}40` }]}>
                  <View style={[styles.iconInner, { backgroundColor: item.color }]}>
                    <Ionicons name={item.icon as any} size={60} color="#FFFFFF" />
                  </View>
                </View>

                {/* Text */}
                <View style={styles.textContainer}>
                  <Text style={[styles.title, { color: '#FFFFFF' }]}>{item.title}</Text>
                  <Text style={styles.subtitle}>{item.subtitle}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        )}
      />

      {/* Bottom controls */}
      <View style={styles.bottomContainer}>
        <View style={contentContainer}>
          {/* Dots */}
          <View style={styles.dotsContainer}>
            {slides.map((_, index) => {
              const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [8, 24, 8],
                extrapolate: 'clamp',
              });
              const dotOpacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.4, 1, 0.4],
                extrapolate: 'clamp',
              });
              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.dot,
                    { width: dotWidth, opacity: dotOpacity, backgroundColor: slides[currentIndex]?.accent ?? '#00A8A8' },
                  ]}
                />
              );
            })}
          </View>

          {/* Buttons */}
          <View style={styles.buttonsRow}>
            <TouchableOpacity onPress={skip} style={[styles.skipButton, { minHeight: TOUCH_MIN, justifyContent: 'center' }]} accessibilityLabel={T.common.skip}>
              <Text style={styles.skipText}>{T.common.skip}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={goNext} style={[styles.nextButton, { minHeight: TOUCH_MIN }]} accessibilityLabel={T.common.next}>
              <LinearGradient
                colors={['#00A8A8', '#007575']}
                style={styles.nextGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.nextText}>
                  {currentIndex === slides.length - 1 ? T.common.continue : T.common.next}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A2342' },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 200,
  },
  centerAlign: { alignItems: 'center', justifyContent: 'center' },
  circle: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  circleSmall: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  iconInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  textContainer: { alignItems: 'center' },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 48 : 32,
    paddingTop: 24,
    backgroundColor: 'rgba(10,35,66,0.95)',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  skipText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  nextGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 28,
  },
  nextText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
