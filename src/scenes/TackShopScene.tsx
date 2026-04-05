import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useGame } from '../context/GameContext';
import {
  TACK_SHOP_ITEMS,
  UNICORN_DEFINITIONS,
  TackCategory,
  TackShopItem,
} from '../types';
import GlowWrapper from '../components/GlowWrapper';

const DEFAULT_UNICORN = {
  id: 'purple' as const,
  name: 'Mystery Unicorn',
  color: '#9B59B6',
  maneColor: '#D4A5E5',
  emoji: '🦄',
};

type FilterTab = 'all' | TackCategory;

interface TabDefinition {
  key: FilterTab;
  label: string;
}

const TABS: TabDefinition[] = [
  { key: 'all',           label: 'All' },
  { key: 'bridles',       label: 'Bridles 👑' },
  { key: 'saddles',       label: 'Saddles 🐴' },
  { key: 'boots',         label: 'Boots 👢' },
  { key: 'saddlePads',    label: 'Saddle Pads 🌟' },
  { key: 'careEquipment', label: 'Care 🧹' },
  { key: 'treats',        label: 'Treats 🍎' },
];

const NON_EQUIPPABLE: TackCategory[] = ['treats', 'careEquipment'];

const TackShopScene: React.FC = () => {
  const { state, purchaseItem, equipItem, returnToBarn, goToTrunk } = useGame();
  const { shopPoints, inventory } = state;

  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const unicornDef =
    UNICORN_DEFINITIONS.find((u) => u.id === state.selectedUnicorn) ??
    DEFAULT_UNICORN;

  const visibleItems: TackShopItem[] =
    activeTab === 'all'
      ? TACK_SHOP_ITEMS
      : TACK_SHOP_ITEMS.filter((item) => item.category === activeTab);

  const isOwned = (id: string) => inventory.ownedItemIds.includes(id);

  const isEquipped = (id: string) =>
    Object.values(inventory.equippedItems).includes(id);

  const canAfford = (price: number) => shopPoints >= price;

  const isEquippable = (category: TackCategory) =>
    !NON_EQUIPPABLE.includes(category);

  const handleItemPress = (item: TackShopItem) => {
    if (!isOwned(item.id)) {
      if (canAfford(item.price)) {
        purchaseItem(item.id);
      }
    } else if (isEquippable(item.category)) {
      equipItem(item.id);
    }
  };

  const renderItemCard = (item: TackShopItem) => {
    const owned = isOwned(item.id);
    const equipped = isEquipped(item.id);
    const affordable = canAfford(item.price);
    const glowActive = affordable && !owned;

    return (
      <GlowWrapper
        key={item.id}
        active={glowActive}
        color="#D4AF37"
        style={styles.cardWrapper}
      >
        <TouchableOpacity
          style={[
            styles.itemCard,
            !affordable && !owned && styles.itemCardDimmed,
          ]}
          onPress={() => handleItemPress(item)}
          activeOpacity={0.75}
        >
          {/* Badges row */}
          <View style={styles.badgeRow}>
            {equipped && (
              <View style={[styles.badge, styles.badgeEquipped]}>
                <Text style={styles.badgeText}>✓ Equipped</Text>
              </View>
            )}
            {!equipped && owned && (
              <View style={[styles.badge, styles.badgeOwned]}>
                <Text style={styles.badgeText}>✓ Owned</Text>
              </View>
            )}
          </View>

          {/* Emoji */}
          <Text style={styles.itemEmoji}>{item.emoji}</Text>

          {/* Name */}
          <Text style={styles.itemName}>{item.name}</Text>

          {/* Effect */}
          <Text style={styles.itemEffect}>{item.effect}</Text>

          {/* Price */}
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>💰 {item.price} pts</Text>
          </View>
        </TouchableOpacity>
      </GlowWrapper>
    );
  };

  // Split visible items into pairs for the 2-column grid
  const itemRows: TackShopItem[][] = [];
  for (let i = 0; i < visibleItems.length; i += 2) {
    itemRows.push(visibleItems.slice(i, i + 2));
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={returnToBarn}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🛍️ Tack Shop</Text>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>💰 {shopPoints} pts</Text>
        </View>
      </View>

      {/* Unicorn info */}
      <View style={[styles.unicornBanner, { borderColor: unicornDef.color }]}>
        <Text style={styles.unicornEmoji}>{unicornDef.emoji}</Text>
        <Text style={styles.unicornName}>Shopping for {unicornDef.name}</Text>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScrollView}
        contentContainerStyle={styles.tabContainer}
      >
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.tabActive,
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Item Grid */}
      <View style={styles.itemGrid}>
        {itemRows.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.itemRow}>
            {row.map((item) => renderItemCard(item))}
            {/* Fill empty slot in last row if odd count */}
            {row.length === 1 && <View style={styles.cardWrapper} />}
          </View>
        ))}
      </View>

      {/* Trunk shortcut */}
      <TouchableOpacity style={styles.trunkButton} onPress={goToTrunk}>
        <Text style={styles.trunkButtonText}>🧳 View My Tack Trunk</Text>
      </TouchableOpacity>

      {/* Bottom tip */}
      <View style={styles.tipRow}>
        <Text style={styles.tipText}>
          💡 Equipped items boost your unicorn&apos;s performance!
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#1A0F0A',
  },
  container: {
    padding: 16,
    paddingBottom: 48,
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  backButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#3E2723',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6D4C41',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D4AF37',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#D4AF37',
    textAlign: 'center',
    flex: 1,
  },
  pointsBadge: {
    backgroundColor: '#D4AF37',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A0F0A',
  },

  // ── Unicorn Banner ───────────────────────────────────────────────────────────
  unicornBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A1810',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    gap: 10,
  },
  unicornEmoji: {
    fontSize: 32,
  },
  unicornName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#C4A46C',
  },

  // ── Category Tabs ────────────────────────────────────────────────────────────
  tabScrollView: {
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#3E2723',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6D4C41',
  },
  tabActive: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 3,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C4A46C',
  },
  tabTextActive: {
    color: '#1A0F0A',
    fontWeight: '800',
  },

  // ── Item Grid ────────────────────────────────────────────────────────────────
  itemGrid: {
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cardWrapper: {
    flex: 1,
  },
  itemCard: {
    backgroundColor: '#2A1810',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6D4C41',
    minHeight: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  itemCardDimmed: {
    opacity: 0.5,
  },
  badgeRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
    minHeight: 22,
  },
  badge: {
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeOwned: {
    backgroundColor: '#2E7D32',
  },
  badgeEquipped: {
    backgroundColor: '#B8860B',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  itemEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#E8D5B0',
    textAlign: 'center',
    marginBottom: 4,
  },
  itemEffect: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#A08060',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 15,
  },
  priceBadge: {
    backgroundColor: '#3E2723',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#D4AF37',
    marginTop: 'auto',
  },
  priceText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D4AF37',
  },

  // ── Trunk Button ─────────────────────────────────────────────────────────────
  trunkButton: {
    backgroundColor: '#3E2723',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  trunkButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#D4AF37',
  },

  // ── Tip ──────────────────────────────────────────────────────────────────────
  tipRow: {
    marginTop: 16,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#8D6E63',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default TackShopScene;
