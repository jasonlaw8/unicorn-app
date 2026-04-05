import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { UNICORN_DEFINITIONS, UnicornColor } from '../types';
import GlowWrapper from '../components/GlowWrapper';
import { useGame } from '../context/GameContext';

// ─── Stall Card ──────────────────────────────────────────────────────────────

interface StallCardProps {
  unicorn: (typeof UNICORN_DEFINITIONS)[number];
  isSelected: boolean;
  ribbonCount: number;
  onPress: () => void;
  onTrunkPress: () => void;
}

const StallCard: React.FC<StallCardProps> = ({
  unicorn,
  isSelected,
  ribbonCount,
  onPress,
  onTrunkPress,
}) => {
  const isLight =
    unicorn.id === 'white' ||
    unicorn.id === 'yellow' ||
    unicorn.id === 'mint' ||
    unicorn.id === 'babyBlue';

  const nameColor = isLight ? '#2C1A06' : '#FFF8EE';

  return (
    <View style={styles.stallOuter}>
      {/* Stall door frame */}
      <GlowWrapper
        active={!isSelected}
        color="#FFD700"
        style={styles.glowShell}
      >
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.85}
          style={[
            styles.stallCard,
            { backgroundColor: unicorn.color },
            isSelected && styles.stallCardSelected,
          ]}
        >
          {/* Horizontal wood-grain accent lines */}
          <View style={styles.woodGrain1} />
          <View style={styles.woodGrain2} />

          {/* Selected crown badge */}
          {isSelected && (
            <View style={styles.crownBadge}>
              <Text style={styles.crownText}>👑</Text>
            </View>
          )}

          <View style={styles.stallContent}>
            <Text style={styles.stallEmoji}>{unicorn.emoji}</Text>
            <Text style={[styles.stallName, { color: nameColor }]}>
              {unicorn.name}
            </Text>
          </View>
        </TouchableOpacity>
      </GlowWrapper>

      {/* Tack trunk attached below selected stall */}
      {isSelected && (
        <GlowWrapper active color="#C8960C" style={styles.trunkGlow}>
          <TouchableOpacity
            onPress={onTrunkPress}
            activeOpacity={0.85}
            style={styles.tackTrunk}
          >
            <Text style={styles.trunkEmoji}>🧳</Text>
            <Text style={styles.trunkLabel}>Trunk</Text>
            <View style={styles.ribbonBadge}>
              <Text style={styles.ribbonBadgeText}>🎀 {ribbonCount}</Text>
            </View>
          </TouchableOpacity>
        </GlowWrapper>
      )}
    </View>
  );
};

// ─── BarnScene ───────────────────────────────────────────────────────────────

const BarnScene: React.FC = () => {
  const { state, selectUnicorn, goToShop, goToTrunk, goToCare } = useGame();

  const ribbonCount = state.inventory.ribbons.length;

  // Build pairs: left = index 0,2,4,6,8  right = index 1,3,5,7,9
  const pairs: Array<{
    left: (typeof UNICORN_DEFINITIONS)[number];
    right: (typeof UNICORN_DEFINITIONS)[number];
  }> = [];
  for (let i = 0; i < UNICORN_DEFINITIONS.length; i += 2) {
    pairs.push({
      left: UNICORN_DEFINITIONS[i],
      right: UNICORN_DEFINITIONS[i + 1],
    });
  }

  const bondHearts = Math.round((state.bondLevel / 100) * 5);

  return (
    <View style={styles.container}>
      {/* ── Sky background ─────────────────────────────────────────── */}
      <View style={styles.skyBg} />
      <View style={styles.skyFade} />

      {/* ── Barn ceiling / overhead structure ──────────────────────── */}
      <View style={styles.ceilingWrapper} pointerEvents="none">
        {/* Rafters */}
        <View style={styles.rafter1} />
        <View style={styles.rafter2} />
        <View style={styles.rafter3} />
        {/* Ridge beam */}
        <View style={styles.ridgeBeam} />
        {/* Lanterns */}
        <Text style={styles.lanternLeft}>🏮</Text>
        <Text style={styles.lanternRight}>🏮</Text>
      </View>

      {/* ── Perspective aisle floor ─────────────────────────────────── */}
      <View style={styles.aisleFloorWrapper} pointerEvents="none">
        {/* Left angled wall */}
        <View style={styles.leftWall} />
        {/* Right angled wall */}
        <View style={styles.rightWall} />
        {/* Central dark floor runner */}
        <View style={styles.aisleRunner} />
      </View>

      {/* ── Top HUD ────────────────────────────────────────────────── */}
      <View style={styles.hud}>
        <View style={styles.hudLeft}>
          {/* Points */}
          <View style={styles.hudBadge}>
            <Text style={styles.hudBadgeLabel}>💰</Text>
            <Text style={styles.hudBadgeValue}>{state.shopPoints}</Text>
          </View>
          {/* Total */}
          <View style={styles.hudBadge}>
            <Text style={styles.hudBadgeLabel}>⭐</Text>
            <Text style={styles.hudBadgeValue}>{state.totalPoints}</Text>
          </View>
          {/* Level */}
          <View style={[styles.hudBadge, styles.levelBadge]}>
            <Text style={styles.levelText}>Lv {state.level}</Text>
          </View>
        </View>

        {/* Bond hearts */}
        <View style={styles.bondMeter}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Text key={i} style={styles.bondHeart}>
              {i <= bondHearts ? '❤️' : '🤍'}
            </Text>
          ))}
        </View>

        {/* Nav buttons */}
        <View style={styles.hudRight}>
          <TouchableOpacity style={styles.hudBtn} onPress={goToShop}>
            <Text style={styles.hudBtnIcon}>🛍️</Text>
            <Text style={styles.hudBtnLabel}>Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.hudBtn} onPress={goToTrunk}>
            <Text style={styles.hudBtnIcon}>🧳</Text>
            <Text style={styles.hudBtnLabel}>Trunk</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.hudBtn} onPress={goToCare}>
            <Text style={styles.hudBtnIcon}>🐾</Text>
            <Text style={styles.hudBtnLabel}>Care</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Barn title ──────────────────────────────────────────────── */}
      <View style={styles.barnTitleRow}>
        <Text style={styles.barnTitle}>✨ Cloud Barn ✨</Text>
        <Text style={styles.barnSubtitle}>Choose your unicorn</Text>
      </View>

      {/* ── Stall aisle scroll ─────────────────────────────────────── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Aisle label */}
        <View style={styles.aisleLabelRow}>
          <View style={styles.aisleLabel}>
            <Text style={styles.aisleLabelText}>← STALLS</Text>
          </View>
          <View style={styles.aisleCenter}>
            <Text style={styles.aisleCenterText}>AISLE</Text>
          </View>
          <View style={styles.aisleLabel}>
            <Text style={styles.aisleLabelText}>STALLS →</Text>
          </View>
        </View>

        {pairs.map(({ left, right }, pairIndex) => (
          <View key={pairIndex} style={styles.stallRow}>
            {/* Left stall */}
            <View style={styles.stallSlot}>
              <StallCard
                unicorn={left}
                isSelected={state.selectedUnicorn === left.id}
                ribbonCount={ribbonCount}
                onPress={() => selectUnicorn(left.id)}
                onTrunkPress={goToTrunk}
              />
            </View>

            {/* Aisle gap */}
            <View style={styles.aisleGap}>
              {/* Aisle flooring detail */}
              <View style={styles.aisleGapInner}>
                <View style={styles.aisleBoard} />
                <View style={styles.aisleBoard} />
                <View style={styles.aisleBoard} />
              </View>
            </View>

            {/* Right stall */}
            <View style={styles.stallSlot}>
              <StallCard
                unicorn={right}
                isSelected={state.selectedUnicorn === right.id}
                ribbonCount={ribbonCount}
                onPress={() => selectUnicorn(right.id)}
                onTrunkPress={goToTrunk}
              />
            </View>
          </View>
        ))}

        <View style={styles.scrollBottomSpacer} />
      </ScrollView>

      {/* ── Bottom action bar ───────────────────────────────────────── */}
      <View style={styles.bottomBar}>
        {state.selectedUnicorn ? (
          <TouchableOpacity
            style={styles.rideButton}
            onPress={() => selectUnicorn(state.selectedUnicorn as UnicornColor)}
            activeOpacity={0.85}
          >
            <Text style={styles.rideButtonText}>
              🏇 Go to Cross Ties →
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.selectPrompt}>
            🏇 Select a unicorn to ride!
          </Text>
        )}
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const DARK_WOOD = '#3B1F0A';
const MID_WOOD = '#5C3A1E';
const LIGHT_WOOD = '#8B5E3C';
const FLOOR_WOOD = '#A0724A';
const CREAM = '#FFF8EE';
const GOLD = '#FFD700';
const DEEP_GOLD = '#C8960C';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B3E5FC',
  },

  // ── Background layers ────────────────────────────────────────────
  skyBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#B3E5FC',
  },
  skyFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: FLOOR_WOOD,
    opacity: 0.22,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },

  // ── Ceiling / rafters ────────────────────────────────────────────
  ceilingWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 52,
    backgroundColor: DARK_WOOD,
    zIndex: 5,
    overflow: 'hidden',
  },
  ridgeBeam: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#1A0D03',
  },
  rafter1: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: MID_WOOD,
    opacity: 0.8,
  },
  rafter2: {
    position: 'absolute',
    top: 22,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: MID_WOOD,
    opacity: 0.6,
  },
  rafter3: {
    position: 'absolute',
    top: 36,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: MID_WOOD,
    opacity: 0.4,
  },
  lanternLeft: {
    position: 'absolute',
    top: 8,
    left: 12,
    fontSize: 24,
  },
  lanternRight: {
    position: 'absolute',
    top: 8,
    right: 12,
    fontSize: 24,
  },

  // ── Perspective floor / walls ────────────────────────────────────
  aisleFloorWrapper: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    height: 70,
    zIndex: 3,
    overflow: 'hidden',
  },
  leftWall: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '42%',
    height: '100%',
    backgroundColor: '#C49A6C',
    borderBottomRightRadius: 40,
    transform: [{ skewY: '4deg' }],
    opacity: 0.7,
  },
  rightWall: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '42%',
    height: '100%',
    backgroundColor: '#C49A6C',
    borderBottomLeftRadius: 40,
    transform: [{ skewY: '-4deg' }],
    opacity: 0.7,
  },
  aisleRunner: {
    position: 'absolute',
    bottom: 0,
    left: '30%',
    right: '30%',
    height: '60%',
    backgroundColor: DARK_WOOD,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    opacity: 0.5,
  },

  // ── HUD ──────────────────────────────────────────────────────────
  hud: {
    marginTop: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'rgba(59, 31, 10, 0.88)',
    borderBottomWidth: 2,
    borderBottomColor: GOLD,
    zIndex: 10,
  },
  hudLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hudBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 3,
  },
  hudBadgeLabel: {
    fontSize: 12,
  },
  hudBadgeValue: {
    fontSize: 13,
    fontWeight: '800',
    color: GOLD,
  },
  levelBadge: {
    backgroundColor: 'rgba(200, 150, 12, 0.25)',
    borderColor: DEEP_GOLD,
  },
  levelText: {
    fontSize: 13,
    fontWeight: '800',
    color: DEEP_GOLD,
  },
  bondMeter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  bondHeart: {
    fontSize: 14,
  },
  hudRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hudBtn: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  hudBtnIcon: {
    fontSize: 16,
  },
  hudBtnLabel: {
    fontSize: 9,
    color: GOLD,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // ── Barn title ───────────────────────────────────────────────────
  barnTitleRow: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
    zIndex: 4,
  },
  barnTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: CREAM,
    textShadowColor: GOLD,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    letterSpacing: 1,
  },
  barnSubtitle: {
    fontSize: 12,
    color: 'rgba(255,248,238,0.65)',
    fontStyle: 'italic',
    marginTop: 2,
    letterSpacing: 0.8,
  },

  // ── Scroll ───────────────────────────────────────────────────────
  scrollView: {
    flex: 1,
    zIndex: 4,
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 20,
  },

  // ── Aisle labels ─────────────────────────────────────────────────
  aisleLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginHorizontal: 4,
  },
  aisleLabel: {
    flex: 45,
    alignItems: 'center',
  },
  aisleCenter: {
    flex: 10,
    alignItems: 'center',
  },
  aisleLabelText: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(59,31,10,0.55)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  aisleCenterText: {
    fontSize: 8,
    fontWeight: '700',
    color: 'rgba(59,31,10,0.4)',
    letterSpacing: 1.5,
  },

  // ── Stall row ────────────────────────────────────────────────────
  stallRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  stallSlot: {
    flex: 45,
  },
  aisleGap: {
    flex: 10,
    alignItems: 'center',
    paddingTop: 8,
  },
  aisleGapInner: {
    width: 12,
    gap: 6,
    alignItems: 'center',
  },
  aisleBoard: {
    width: 6,
    height: 18,
    backgroundColor: DARK_WOOD,
    borderRadius: 2,
    opacity: 0.35,
  },

  // ── Stall outer wrapper ──────────────────────────────────────────
  stallOuter: {
    alignItems: 'stretch',
  },
  glowShell: {
    borderRadius: 10,
  },

  // ── Stall card ───────────────────────────────────────────────────
  stallCard: {
    borderRadius: 10,
    borderWidth: 3,
    borderColor: MID_WOOD,
    minHeight: 110,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: DARK_WOOD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
    padding: 10,
  },
  stallCardSelected: {
    borderColor: GOLD,
    borderWidth: 3,
    shadowColor: GOLD,
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  woodGrain1: {
    position: 'absolute',
    top: '28%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  woodGrain2: {
    position: 'absolute',
    top: '60%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.10)',
  },
  crownBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  crownText: {
    fontSize: 14,
  },
  stallContent: {
    alignItems: 'center',
  },
  stallEmoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  stallName: {
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // ── Tack trunk ───────────────────────────────────────────────────
  trunkGlow: {
    marginTop: 4,
    borderRadius: 8,
  },
  tackTrunk: {
    backgroundColor: DARK_WOOD,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: DEEP_GOLD,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    shadowColor: DEEP_GOLD,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  trunkEmoji: {
    fontSize: 18,
  },
  trunkLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: GOLD,
    letterSpacing: 0.5,
  },
  ribbonBadge: {
    backgroundColor: 'rgba(255,215,0,0.18)',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.4)',
    marginLeft: 'auto',
  },
  ribbonBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: GOLD,
  },

  // ── Bottom bar ───────────────────────────────────────────────────
  bottomBar: {
    backgroundColor: DARK_WOOD,
    borderTopWidth: 2,
    borderTopColor: GOLD,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    zIndex: 10,
  },
  rideButton: {
    backgroundColor: GOLD,
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 28,
    shadowColor: DEEP_GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 7,
    borderWidth: 2,
    borderColor: DEEP_GOLD,
  },
  rideButtonText: {
    fontSize: 17,
    fontWeight: '900',
    color: DARK_WOOD,
    letterSpacing: 0.5,
  },
  selectPrompt: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,248,238,0.7)',
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
  scrollBottomSpacer: {
    height: 8,
  },
});

export default BarnScene;
