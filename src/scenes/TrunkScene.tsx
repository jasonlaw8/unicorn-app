import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useGame } from '../context/GameContext';
import {
  RIBBON_DEFINITIONS,
  TACK_SHOP_ITEMS,
  UNICORN_DEFINITIONS,
  RibbonEarned,
} from '../types';

const DEFAULT_UNICORN = {
  id: 'purple' as const,
  name: 'Mystery Unicorn',
  color: '#9B59B6',
  maneColor: '#D4A5E5',
  emoji: '🦄',
};

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const formatRibbonDate = (timestamp: number): string => {
  const d = new Date(timestamp);
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
};

const TrunkScene: React.FC = () => {
  const { state, returnToBarn, goToShop } = useGame();
  const { inventory, totalPoints, level } = state;

  const unicornDef =
    UNICORN_DEFINITIONS.find((u) => u.id === state.selectedUnicorn) ??
    DEFAULT_UNICORN;

  // Sort ribbons newest first
  const sortedRibbons: RibbonEarned[] = [...inventory.ribbons].sort(
    (a, b) => b.date - a.date,
  );

  const ownedItems = TACK_SHOP_ITEMS.filter((item) =>
    inventory.ownedItemIds.includes(item.id),
  );

  const isEquipped = (id: string) =>
    Object.values(inventory.equippedItems).includes(id);

  // Stats summary
  const totalRibbons = inventory.ribbons.length;
  const bestPlace =
    totalRibbons > 0
      ? Math.min(...inventory.ribbons.map((r) => r.place))
      : null;

  const getRibbonDef = (place: number) =>
    RIBBON_DEFINITIONS.find((r) => r.place === place);

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
        <View style={styles.headerCenter}>
          <Text style={styles.title}>🧳 Tack Trunk</Text>
          <Text style={styles.headerSubtitle}>
            {unicornDef.emoji} {unicornDef.name}
          </Text>
        </View>
        <View style={styles.headerStats}>
          <Text style={styles.headerLevel}>Lv {level}</Text>
          <Text style={styles.headerPoints}>{totalPoints} pts</Text>
        </View>
      </View>

      {/* ── Ribbon Wall ──────────────────────────────────────────────────────── */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>🎀 Ribbons Won</Text>
          {totalRibbons > 0 && (
            <View style={styles.countPill}>
              <Text style={styles.countPillText}>{totalRibbons}</Text>
            </View>
          )}
        </View>

        {sortedRibbons.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🏟️</Text>
            <Text style={styles.emptyTitle}>No ribbons yet</Text>
            <Text style={styles.emptySubtitle}>
              Go compete — your first ribbon is waiting!
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ribbonScroll}
          >
            {sortedRibbons.map((ribbon) => {
              const def = getRibbonDef(ribbon.place);
              const ribbonHex = def?.hex ?? '#888888';
              const ribbonLabel = def?.label ?? `${ribbon.place}th Place`;
              const unicornForRibbon =
                UNICORN_DEFINITIONS.find((u) => u.id === ribbon.unicornId) ??
                DEFAULT_UNICORN;

              return (
                <View key={ribbon.id} style={styles.ribbonCard}>
                  {/* Rosette circle */}
                  <View
                    style={[
                      styles.rosetteOuter,
                      { borderColor: ribbonHex },
                    ]}
                  >
                    <View
                      style={[styles.rosetteInner, { backgroundColor: ribbonHex }]}
                    >
                      <Text style={styles.rosettePlace}>{ribbon.place}</Text>
                    </View>
                  </View>

                  {/* Ribbon tails */}
                  <View style={styles.ribbonTails}>
                    <View
                      style={[styles.ribbonTail, { backgroundColor: ribbonHex }]}
                    />
                    <View
                      style={[
                        styles.ribbonTail,
                        styles.ribbonTailRight,
                        { backgroundColor: ribbonHex },
                      ]}
                    />
                  </View>

                  {/* Label */}
                  <Text style={styles.ribbonLabel}>{ribbonLabel}</Text>
                  <Text style={styles.ribbonDifficulty}>
                    {ribbon.difficulty.charAt(0).toUpperCase() +
                      ribbon.difficulty.slice(1)}
                  </Text>
                  <Text style={styles.ribbonUnicorn}>
                    {unicornForRibbon.emoji} {unicornForRibbon.name}
                  </Text>
                  <Text style={styles.ribbonDate}>
                    {formatRibbonDate(ribbon.date)}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* ── My Tack ──────────────────────────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎽 My Tack</Text>

        {ownedItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🛍️</Text>
            <Text style={styles.emptyTitle}>Tack room is empty</Text>
            <Text style={styles.emptySubtitle}>
              Visit the tack shop to gear up!
            </Text>
          </View>
        ) : (
          <View style={styles.tackGrid}>
            {ownedItems.map((item) => {
              const equipped = isEquipped(item.id);
              return (
                <View
                  key={item.id}
                  style={[styles.tackCard, equipped && styles.tackCardEquipped]}
                >
                  <Text style={styles.tackEmoji}>{item.emoji}</Text>
                  <Text style={styles.tackName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  {equipped && (
                    <View style={styles.equippedBadge}>
                      <Text style={styles.equippedBadgeText}>Equipped</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* ── Stats Summary ────────────────────────────────────────────────────── */}
      <View style={styles.statsCard}>
        <Text style={styles.statsCardTitle}>Trophy Room Summary</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalRibbons}</Text>
            <Text style={styles.statLabel}>Ribbons</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            {bestPlace !== null ? (
              <>
                <Text style={styles.statValue}>
                  {bestPlace === 1
                    ? '🥇'
                    : bestPlace === 2
                    ? '🥈'
                    : bestPlace === 3
                    ? '🥉'
                    : `${bestPlace}th`}
                </Text>
                <Text style={styles.statLabel}>Best Place</Text>
              </>
            ) : (
              <>
                <Text style={styles.statValue}>—</Text>
                <Text style={styles.statLabel}>Best Place</Text>
              </>
            )}
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalPoints}</Text>
            <Text style={styles.statLabel}>Total Pts</Text>
          </View>
        </View>
      </View>

      {/* Shop Button */}
      <TouchableOpacity style={styles.shopButton} onPress={goToShop}>
        <Text style={styles.shopButtonText}>🛍️ Visit Tack Shop</Text>
      </TouchableOpacity>
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
    marginBottom: 18,
    gap: 8,
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#D4AF37',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C4A46C',
    marginTop: 2,
  },
  headerStats: {
    alignItems: 'flex-end',
    gap: 2,
  },
  headerLevel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D4AF37',
  },
  headerPoints: {
    fontSize: 13,
    fontWeight: '700',
    color: '#A08060',
  },

  // ── Section ──────────────────────────────────────────────────────────────────
  section: {
    backgroundColor: '#2A1810',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#4A3020',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#D4AF37',
    marginBottom: 14,
  },
  countPill: {
    backgroundColor: '#D4AF37',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 14,
  },
  countPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A0F0A',
  },

  // ── Empty State ──────────────────────────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#C4A46C',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8D6E63',
    textAlign: 'center',
  },

  // ── Ribbon Cards ─────────────────────────────────────────────────────────────
  ribbonScroll: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  ribbonCard: {
    width: 110,
    backgroundColor: '#1A0F0A',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A3020',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  rosetteOuter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  rosetteInner: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rosettePlace: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  ribbonTails: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  ribbonTail: {
    width: 10,
    height: 18,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    transform: [{ skewX: '-8deg' }],
  },
  ribbonTailRight: {
    transform: [{ skewX: '8deg' }],
  },
  ribbonLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E8D5B0',
    textAlign: 'center',
    marginBottom: 2,
  },
  ribbonDifficulty: {
    fontSize: 11,
    color: '#A08060',
    textAlign: 'center',
    marginBottom: 2,
  },
  ribbonUnicorn: {
    fontSize: 11,
    color: '#C4A46C',
    textAlign: 'center',
    marginBottom: 2,
  },
  ribbonDate: {
    fontSize: 11,
    color: '#8D6E63',
    textAlign: 'center',
  },

  // ── Tack Grid ────────────────────────────────────────────────────────────────
  tackGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tackCard: {
    width: 84,
    backgroundColor: '#1A0F0A',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A3020',
  },
  tackCardEquipped: {
    borderColor: '#D4AF37',
    backgroundColor: '#2A1A05',
  },
  tackEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  tackName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C4A46C',
    textAlign: 'center',
    lineHeight: 13,
    marginBottom: 4,
  },
  equippedBadge: {
    backgroundColor: '#B8860B',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  equippedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // ── Stats Card ───────────────────────────────────────────────────────────────
  statsCard: {
    backgroundColor: '#2A1810',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#D4AF37',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  statsCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#E8D5B0',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8D6E63',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#4A3020',
  },

  // ── Shop Button ──────────────────────────────────────────────────────────────
  shopButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  shopButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A0F0A',
  },
});

export default TrunkScene;
