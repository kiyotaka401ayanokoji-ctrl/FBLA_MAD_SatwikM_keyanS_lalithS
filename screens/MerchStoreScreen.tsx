import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - SPACING.lg * 2 - SPACING.md) / 2;

interface MerchItem {
  id: string;
  name: string;
  price: number;
  category: 'apparel' | 'accessories' | 'awards';
  image: any;
}

interface CartItem extends MerchItem {
  quantity: number;
}

const MERCH_ITEMS: MerchItem[] = [
  {
    id: '1',
    name: 'FBLA Tie',
    price: 20.00,
    category: 'accessories',
    image: require('../assets/images/large_FBLA-Tie-w-Dela-Logo-StepRepeat-2.jpeg'),
  },
  {
    id: '2',
    name: 'Polo Shirt',
    price: 35.00,
    category: 'apparel',
    image: require('../assets/images/Polo_member__3_.png'),
  },
  {
    id: '3',
    name: 'Ladies Dark Navy Blazer',
    price: 50.00,
    category: 'apparel',
    image: require('../assets/images/LadiesDarkNavyBlazer.jpg'),
  },
  {
    id: '4',
    name: 'Mens Dark Navy Blazer',
    price: 50.00,
    category: 'apparel',
    image: require('../assets/images/MensDarkNavyBlazer.jpg'),
  },
  {
    id: '5',
    name: 'Navy Sweatshirt',
    price: 40.00,
    category: 'apparel',
    image: require('../assets/images/NavySweatshirtv3__1_.png'),
  },
  {
    id: '6',
    name: 'Navy Pants',
    price: 30.00,
    category: 'apparel',
    image: require('../assets/images/large_2534-007-MensMicrofiber-NavyPants.jpg'),
  },
  {
    id: '7',
    name: 'Navy Washed Dad Cap',
    price: 15.00,
    category: 'accessories',
    image: require('../assets/images/NavyWashedDadCap-Photoroom.png'),
  },
  {
    id: '8',
    name: 'Navy Skirt',
    price: 25.00,
    category: 'apparel',
    image: require('../assets/images/Navy Skirt.jpg'),
  },
];

interface MerchStoreScreenProps {
  navigation: any;
}

export default function MerchStoreScreen({ navigation }: MerchStoreScreenProps) {
  const { colors, isDarkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const categories = [
    { id: 'all', label: 'All Items', icon: 'grid-view' as const },
    { id: 'apparel', label: 'Apparel', icon: 'checkroom' as const },
    { id: 'accessories', label: 'Accessories', icon: 'shopping-bag' as const },
    { id: 'awards', label: 'Awards', icon: 'emoji-events' as const },
  ];

  const filteredItems = selectedCategory === 'all'
    ? MERCH_ITEMS
    : MERCH_ITEMS.filter(item => item.category === selectedCategory);

  const addToCart = (item: MerchItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    setShowCart(false);
    Alert.alert(
      'Checkout',
      `Total: $${getTotalPrice().toFixed(2)}\n\nIn a production app, this would redirect to Stripe payment. For now, this is a demo.`,
      [
        {
          text: 'Complete Purchase',
          onPress: () => {
            Alert.alert('Success!', 'Order placed successfully! 🎉');
            setCart([]);
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleBuyNow = (item: MerchItem) => {
    Alert.alert(
      'Buy Now',
      `Purchase ${item.name} for $${item.price.toFixed(2)}?\n\nIn a production app, this would redirect to Stripe payment. For now, this is a demo.`,
      [
        {
          text: 'Complete Purchase',
          onPress: () => {
            Alert.alert('Success!', `${item.name} purchased successfully! 🎉`);
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0F1419' : '#D4E3F7' }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: colors.surface }]}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Merch Store</Text>
        <TouchableOpacity
          style={[styles.cartButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowCart(true)}
        >
          <MaterialIcons name="shopping-cart" size={24} color="#FFFFFF" />
          {getTotalItems() > 0 && (
            <View style={[styles.cartBadge, { backgroundColor: colors.secondary }]}>
              <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Category Filters */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {categories.map((category, index) => (
            <Animated.View
              key={category.id}
              entering={FadeInDown.delay(index * 50).springify()}
            >
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: selectedCategory === category.id ? colors.primary : colors.surface,
                  },
                  SHADOWS.small,
                ]}
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name={category.icon}
                  size={18}
                  color={selectedCategory === category.id ? '#FFFFFF' : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: selectedCategory === category.id ? '#FFFFFF' : colors.textSecondary,
                    },
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      {/* Products Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsContainer}
      >
        <Text style={[styles.resultsText, { color: colors.textLight }]}>
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} available
        </Text>

        <View style={styles.productsGrid}>
          {filteredItems.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.delay(index * 80).springify()}
              style={styles.productCardWrapper}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.productCard}
              >
                <BlurView
                  intensity={isDarkMode ? 40 : 60}
                  tint={isDarkMode ? 'dark' : 'light'}
                  style={[styles.productBlur, SHADOWS.large]}
                >
                  <View
                    style={[
                      styles.productCardInner,
                      {
                        borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.8)',
                        borderWidth: 1.5,
                        backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.3)',
                      },
                    ]}
                  >
                    <View style={[styles.productImageContainer, { backgroundColor: colors.background }]}>
                      <Image
                        source={item.image}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    </View>

                    <View style={styles.productInfo}>
                      <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
                        {item.name}
                      </Text>
                      <View style={styles.productFooter}>
                        <Text style={[styles.productPrice, { color: colors.primary }]}>
                          ${item.price.toFixed(2)}
                        </Text>
                        <TouchableOpacity
                          style={[styles.addButton, { backgroundColor: colors.primary }]}
                          onPress={() => addToCart(item)}
                        >
                          <MaterialIcons name="add" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </BlurView>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* Cart Modal */}
      <Modal
        visible={showCart}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCart(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            entering={FadeIn.duration(200)}
            style={[styles.cartModal, { backgroundColor: isDarkMode ? '#1A1F2E' : '#FFFFFF' }]}
          >
            <View style={styles.cartHeader}>
              <Text style={[styles.cartTitle, { color: colors.text }]}>Shopping Cart</Text>
              <TouchableOpacity onPress={() => setShowCart(false)}>
                <MaterialIcons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            {cart.length === 0 ? (
              <View style={styles.emptyCart}>
                <MaterialIcons name="shopping-cart" size={80} color={colors.textLight} />
                <Text style={[styles.emptyCartText, { color: colors.textSecondary }]}>
                  Your cart is empty
                </Text>
              </View>
            ) : (
              <>
                <ScrollView style={styles.cartItems}>
                  {cart.map((item) => (
                    <View key={item.id} style={[styles.cartItem, { borderBottomColor: colors.border }]}>
                      <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                      <View style={styles.cartItemInfo}>
                        <Text style={[styles.cartItemName, { color: colors.text }]}>{item.name}</Text>
                        <Text style={[styles.cartItemPrice, { color: colors.primary }]}>
                          ${item.price.toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.cartItemActions}>
                        <View style={styles.quantityControls}>
                          <TouchableOpacity
                            style={[styles.quantityButton, { backgroundColor: colors.surface }]}
                            onPress={() => updateQuantity(item.id, -1)}
                          >
                            <MaterialIcons name="remove" size={18} color={colors.text} />
                          </TouchableOpacity>
                          <Text style={[styles.quantityText, { color: colors.text }]}>{item.quantity}</Text>
                          <TouchableOpacity
                            style={[styles.quantityButton, { backgroundColor: colors.surface }]}
                            onPress={() => updateQuantity(item.id, 1)}
                          >
                            <MaterialIcons name="add" size={18} color={colors.text} />
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                          <MaterialIcons name="delete" size={24} color={colors.error || '#EF4444'} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                <View style={[styles.cartFooter, { borderTopColor: colors.border }]}>
                  <View style={styles.totalRow}>
                    <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Subtotal</Text>
                    <Text style={[styles.totalPrice, { color: colors.text }]}>
                      ${getTotalPrice().toFixed(2)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.checkoutButton, { backgroundColor: colors.primary }]}
                    onPress={handleCheckout}
                  >
                    <MaterialIcons name="payment" size={24} color="#FFFFFF" />
                    <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  filterContainer: {
    marginBottom: SPACING.md,
  },
  filterContent: {
    paddingHorizontal: SPACING.lg,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
  },
  filterText: {
    ...TYPOGRAPHY.bodySmall,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
  productsContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },
  resultsText: {
    ...TYPOGRAPHY.bodySmall,
    marginBottom: SPACING.md,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  productCardWrapper: {
    width: CARD_WIDTH,
  },
  productCard: {
    width: '100%',
  },
  productBlur: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  productCardInner: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  productImageContainer: {
    width: '100%',
    height: CARD_WIDTH * 1.1,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: SPACING.sm,
  },
  productName: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    marginBottom: 2,
    minHeight: 25,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    ...TYPOGRAPHY.captionBold,
    fontWeight: '700',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyNowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Cart Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  cartModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingTop: SPACING.lg,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  cartTitle: {
    ...TYPOGRAPHY.h2,
  },
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyCartText: {
    ...TYPOGRAPHY.bodyMedium,
    marginTop: SPACING.md,
  },
  cartItems: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  cartItem: {
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.md,
  },
  cartItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cartItemName: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
    marginBottom: 4,
  },
  cartItemPrice: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '700',
  },
  cartItemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    ...TYPOGRAPHY.bodyMedium,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
  cartFooter: {
    borderTopWidth: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  totalLabel: {
    ...TYPOGRAPHY.h3,
  },
  totalPrice: {
    ...TYPOGRAPHY.h2,
    fontWeight: '700',
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    ...TYPOGRAPHY.h4,
    fontWeight: '700',
  },
});