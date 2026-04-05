import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { UNICORN_DEFINITIONS, UnicornColor } from '../types';
import GlowWrapper from '../components/GlowWrapper';
import { useGame } from '../context/GameContext';

const NUM_PAIRS = 5;

// ─── 3D Stall Door ────────────────────────────────────────────────────────────

interface StallDoorProps {
  unicorn: (typeof UNICORN_DEFINITIONS)[number];
  isSelected: boolean;
  side: 'left' | 'right';
  onPress: () => void;
  scale: number;
}

const StallDoor: React.FC<StallDoorProps> = ({
  unicorn,
  isSelected,
  side,
  onPress,
  scale,
}) => {
  const isLight =
    unicorn.id === 'white' ||
    unicorn.id === 'yellow' ||
    unicorn.id === 'mint' ||
    unicorn.id === 'babyBlue';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.stallDoor,
        isSelected && styles.stallDoorSelected,
        {
          transform: [
            { perspective: 600 },
            { rotateY: side === 'left' ? '8deg' : '-8deg' },
          ],
        },
      ]}
    >
      {/* Stall interior background */}
      <View style={[styles.stallInterior, { backgroundColor: unicorn.color + '25' }]}>
        {/* Hay bedding at bottom */}
        <View style={styles.hayBedding}>
          <Text style={styles.hayText}>🌾🌾🌾</Text>
        </View>

        {/* Water bucket */}
        <View style={styles.waterBucket}>
          <Text style={styles.bucketText}>🪣</Text>
        </View>
      </View>

      {/* Half-door (bottom) */}
      <View style={styles.halfDoorBottom}>
        {/* Wood grain lines */}
        <View style={styles.doorPlank1} />
        <View style={styles.doorPlank2} />
        <View style={styles.doorPlank3} />
        {/* Door hardware */}
        <View style={styles.doorLatch}>
          <View style={styles.latchKnob} />
        </View>
      </View>

      {/* Unicorn peeking over the half door */}
      <View style={styles.unicornPeek}>
        <Text style={[styles.peekEmoji, { fontSize: Math.max(40, 60 * scale) }]}>
          {unicorn.emoji}
        </Text>
      </View>

      {/* Nameplate */}
      <View style={styles.nameplate}>
        <Text
          style={[
            styles.nameplateText,
            isLight && { color: '#2C1A06' },
          ]}
        >
          {unicorn.name}
        </Text>
      </View>

      {/* Selection glow overlay */}
      {isSelected && (
        <View style={styles.selectedOverlay}>
          <Text style={styles.selectedCrown}>👑</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// ─── BarnScene ────────────────────────────────────────────────────────────────

const BarnScene: React.FC = () => {
  const { state, selectUnicorn, goToShop, goToTrunk, goToCare } = useGame();
  const [position, setPosition] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const { height } = useWindowDimensions();

  const ribbonCount = state.inventory.ribbons.length;
  const bondHearts = Math.round((state.bondLevel / 100) * 5);

  // Build 5 pairs
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

  // Animate position changes
  const animateToPosition = useCallback(
    (newPos: number) => {
      setPosition(newPos);
      slideAnim.setValue(0);
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 120,
        friction: 14,
      }).start();
    },
    [slideAnim]
  );

  const moveForward = useCallback(() => {
    setPosition((prev) => {
      const next = Math.min(prev + 1, NUM_PAIRS - 1);
      if (next !== prev) animateToPosition(next);
      return next;
    });
  }, [animateToPosition]);

  const moveBackward = useCallback(() => {
    setPosition((prev) => {
      const next = Math.max(prev - 1, 0);
      if (next !== prev) animateToPosition(next);
      return next;
    });
  }, [animateToPosition]);

  // Keyboard navigation (web)
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleKeyDown = (e: Event) => {
      const ke = e as KeyboardEvent;
      if (ke.key === 'ArrowUp' || ke.key === 'w' || ke.key === 'W') {
        ke.preventDefault();
        moveForward();
      } else if (ke.key === 'ArrowDown' || ke.key === 's' || ke.key === 'S') {
        ke.preventDefault();
        moveBackward();
      }
    };

    const doc = typeof document !== 'undefined' ? document : null;
    doc?.addEventListener('keydown', handleKeyDown);
    return () => doc?.removeEventListener('keydown', handleKeyDown);
  }, [moveForward, moveBackward]);

  const handleSelectUnicorn = useCallback(
    (id: UnicornColor) => selectUnicorn(id),
    [selectUnicorn]
  );

  // ─── Render stall rows with 3D depth ────────────────────────────

  const renderDepthRows = () => {
    const rows: React.ReactNode[] = [];

    for (let i = 0; i < NUM_PAIRS; i++) {
      const distance = i - position; // negative = behind, 0 = here, positive = ahead

      // Only render -1 to +3 range
      if (distance < -1 || distance > 3) continue;

      // Scale: current = 1.0, further = smaller
      let scale: number;
      let yOffset: number;
      let zIndex: number;
      let opacity: number;

      if (distance === 0) {
        // Current position: large, near bottom
        scale = 1.0;
        yOffset = 0;
        zIndex = 100;
        opacity = 1;
      } else if (distance > 0) {
        // Ahead: progressively smaller toward vanishing point
        scale = 1 / (1 + distance * 0.4);
        yOffset = -distance * (height * 0.13);
        zIndex = 90 - distance;
        opacity = Math.max(0.25, 1 - distance * 0.25);
      } else {
        // Behind: fading out below
        scale = 0.6;
        yOffset = 60;
        zIndex = 50;
        opacity = 0.15;
      }

      const pair = pairs[i];
      const isCurrentPair = distance === 0;

      rows.push(
        <Animated.View
          key={i}
          style={[
            styles.depthRow,
            {
              zIndex,
              opacity,
              transform: [
                { translateY: yOffset },
                { scale },
              ],
            },
          ]}
        >
          {/* Stall number indicator */}
          <View style={styles.stallNumberRow}>
            <View style={styles.stallNumberBadge}>
              <Text style={styles.stallNumberText}>{i * 2 + 1}</Text>
            </View>
            <View style={styles.aisleIndicator}>
              {isCurrentPair && (
                <Text style={styles.youAreHere}>▼ You are here</Text>
              )}
            </View>
            <View style={styles.stallNumberBadge}>
              <Text style={styles.stallNumberText}>{i * 2 + 2}</Text>
            </View>
          </View>

          {/* The two stall doors */}
          <View style={styles.stallPairRow}>
            {/* Left stall */}
            <View style={styles.stallSide}>
              {isCurrentPair ? (
                <GlowWrapper
                  active={state.selectedUnicorn !== pair.left.id}
                  color="#FFD700"
                  style={styles.stallGlow}
                >
                  <StallDoor
                    unicorn={pair.left}
                    isSelected={state.selectedUnicorn === pair.left.id}
                    side="left"
                    onPress={() => handleSelectUnicorn(pair.left.id)}
                    scale={scale}
                  />
                </GlowWrapper>
              ) : (
                <StallDoor
                  unicorn={pair.left}
                  isSelected={state.selectedUnicorn === pair.left.id}
                  side="left"
                  onPress={() => {}}
                  scale={scale}
                />
              )}
            </View>

            {/* Aisle center */}
            <View style={styles.aisleCenterStrip}>
              <View style={styles.aisleFloorBoard} />
              <View style={styles.aisleFloorBoard} />
              <View style={styles.aisleFloorBoard} />
            </View>

            {/* Right stall */}
            <View style={styles.stallSide}>
              {isCurrentPair ? (
                <GlowWrapper
                  active={state.selectedUnicorn !== pair.right.id}
                  color="#FFD700"
                  style={styles.stallGlow}
                >
                  <StallDoor
                    unicorn={pair.right}
                    isSelected={state.selectedUnicorn === pair.right.id}
                    side="right"
                    onPress={() => handleSelectUnicorn(pair.right.id)}
                    scale={scale}
                  />
                </GlowWrapper>
              ) : (
                <StallDoor
                  unicorn={pair.right}
                  isSelected={state.selectedUnicorn === pair.right.id}
                  side="right"
                  onPress={() => {}}
                  scale={scale}
                />
              )}
            </View>
          </View>

          {/* Tack trunk for selected unicorn */}
          {isCurrentPair &&
            (state.selectedUnicorn === pair.left.id ||
              state.selectedUnicorn === pair.right.id) && (
              <GlowWrapper active color="#C8960C" style={styles.trunkGlow}>
                <TouchableOpacity
                  onPress={goToTrunk}
                  style={styles.tackTrunk}
                  activeOpacity={0.85}
                >
                  <Text style={styles.trunkEmoji}>🧳</Text>
                  <Text style={styles.trunkLabel}>Tack Trunk</Text>
                  <View style={styles.ribbonBadge}>
                    <Text style={styles.ribbonBadgeText}>
                      🎀 {ribbonCount}
                    </Text>
                  </View>
                </TouchableOpacity>
              </GlowWrapper>
            )}
        </Animated.View>
      );
    }

    return rows;
  };

  return (
    <View style={styles.container}>
      {/* ── 3D Ceiling ─────────────────────────────────────────────── */}
      <View style={styles.ceiling}>
        <View style={styles.ceilingBeam} />
        <View style={styles.ceilingRafter1} />
        <View style={styles.ceilingRafter2} />
        <View style={styles.ceilingRafter3} />
        <Text style={styles.lanternL}>🏮</Text>
        <Text style={styles.lanternR}>🏮</Text>
      </View>

      {/* ── 3D Floor with perspective ──────────────────────────────── */}
      <View style={styles.floorContainer}>
        <View style={styles.floor3D}>
          {/* Floor planks */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <View
              key={i}
              style={[
                styles.floorPlank,
                i % 2 === 0
                  ? { backgroundColor: '#8B6B4A' }
                  : { backgroundColor: '#7A5C3C' },
              ]}
            />
          ))}
        </View>
      </View>

      {/* ── Vanishing point / corridor walls ───────────────────────── */}
      <View style={styles.corridorLeft} />
      <View style={styles.corridorRight} />
      <View style={styles.vanishingGlow} />

      {/* ── HUD ─────────────────────────────────────────────────────── */}
      <View style={styles.hud}>
        <View style={styles.hudRow}>
          <View style={styles.hudBadge}>
            <Text style={styles.hudIcon}>💰</Text>
            <Text style={styles.hudValue}>{state.shopPoints}</Text>
          </View>
          <View style={styles.hudBadge}>
            <Text style={styles.hudIcon}>⭐</Text>
            <Text style={styles.hudValue}>{state.totalPoints}</Text>
          </View>
          <View style={[styles.hudBadge, styles.lvlBadge]}>
            <Text style={styles.lvlText}>Lv {state.level}</Text>
          </View>
        </View>

        <View style={styles.bondRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Text key={i} style={styles.bondHeart}>
              {i <= bondHearts ? '❤️' : '🤍'}
            </Text>
          ))}
        </View>

        <View style={styles.hudRow}>
          <TouchableOpacity style={styles.hudBtn} onPress={goToShop}>
            <Text style={styles.hudBtnEmoji}>🛍️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.hudBtn} onPress={goToTrunk}>
            <Text style={styles.hudBtnEmoji}>🧳</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.hudBtn} onPress={goToCare}>
            <Text style={styles.hudBtnEmoji}>🐾</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Title ───────────────────────────────────────────────────── */}
      <View style={styles.titleArea}>
        <Text style={styles.title}>✨ Cloud Barn ✨</Text>
        <Text style={styles.subtitle}>
          Walk to a stall and tap a unicorn
        </Text>
      </View>

      {/* ── 3D Depth Stall Rows ─────────────────────────────────────── */}
      <View style={styles.depthContainer}>{renderDepthRows()}</View>

      {/* ── Navigation Controls ─────────────────────────────────────── */}
      <View style={styles.navBar}>
        <View style={styles.navControls}>
          <TouchableOpacity
            style={[styles.arrowBtn, position === 0 && styles.arrowBtnDisabled]}
            onPress={moveBackward}
            disabled={position === 0}
          >
            <Text style={styles.arrowText}>▼ Back</Text>
          </TouchableOpacity>

          <View style={styles.positionIndicator}>
            <View style={styles.positionDots}>
              {pairs.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.positionDot,
                    i === position && styles.positionDotActive,
                    i < position && styles.positionDotPassed,
                  ]}
                />
              ))}
            </View>
            <Text style={styles.positionLabel}>
              Stall {position * 2 + 1}-{position * 2 + 2} of 10
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.arrowBtn,
              position === NUM_PAIRS - 1 && styles.arrowBtnDisabled,
            ]}
            onPress={moveForward}
            disabled={position === NUM_PAIRS - 1}
          >
            <Text style={styles.arrowText}>▲ Walk</Text>
          </TouchableOpacity>
        </View>

        {Platform.OS === 'web' && (
          <Text style={styles.keyHint}>
            Use ↑↓ arrow keys or W/S to walk
          </Text>
        )}

        {/* Bottom action */}
        {state.selectedUnicorn ? (
          <TouchableOpacity
            style={styles.rideBtn}
            onPress={() =>
              selectUnicorn(state.selectedUnicorn as UnicornColor)
            }
            activeOpacity={0.85}
          >
            <Text style={styles.rideBtnText}>🏇 Go to Cross Ties →</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.selectHint}>
            Walk to a stall and tap a unicorn to begin
          </Text>
        )}
      </View>
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const DARK_WOOD = '#2A1507';
const MID_WOOD = '#5C3A1E';
const LIGHT_WOOD = '#8B6B4A';
const GOLD = '#FFD700';
const DEEP_GOLD = '#C8960C';
const CREAM = '#FFF8EE';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0D06',
  },

  // ── 3D Ceiling ──────────────────────────────────────────────────
  ceiling: {
    height: 54,
    backgroundColor: DARK_WOOD,
    zIndex: 20,
    overflow: 'hidden',
    borderBottomWidth: 3,
    borderBottomColor: '#4A2A14',
  },
  ceilingBeam: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: '#0E0704',
  },
  ceilingRafter1: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: MID_WOOD,
    opacity: 0.8,
  },
  ceilingRafter2: {
    position: 'absolute',
    top: 24,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: MID_WOOD,
    opacity: 0.55,
  },
  ceilingRafter3: {
    position: 'absolute',
    top: 38,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: MID_WOOD,
    opacity: 0.35,
  },
  lanternL: {
    position: 'absolute',
    top: 8,
    left: 14,
    fontSize: 22,
  },
  lanternR: {
    position: 'absolute',
    top: 8,
    right: 14,
    fontSize: 22,
  },

  // ── 3D Floor ────────────────────────────────────────────────────
  floorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '35%',
    zIndex: 1,
    overflow: 'hidden',
  },
  floor3D: {
    flex: 1,
    transform: [{ perspective: 300 }, { rotateX: '35deg' }],
    flexDirection: 'row',
  },
  floorPlank: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#5C3A20',
  },

  // ── Corridor walls ──────────────────────────────────────────────
  corridorLeft: {
    position: 'absolute',
    top: 54,
    left: 0,
    width: '12%',
    bottom: 0,
    backgroundColor: '#3E2210',
    borderRightWidth: 3,
    borderRightColor: '#5C3A1E',
    zIndex: 2,
    transform: [{ perspective: 400 }, { rotateY: '-6deg' }],
  },
  corridorRight: {
    position: 'absolute',
    top: 54,
    right: 0,
    width: '12%',
    bottom: 0,
    backgroundColor: '#3E2210',
    borderLeftWidth: 3,
    borderLeftColor: '#5C3A1E',
    zIndex: 2,
    transform: [{ perspective: 400 }, { rotateY: '6deg' }],
  },
  vanishingGlow: {
    position: 'absolute',
    top: 100,
    left: '30%',
    right: '30%',
    height: 60,
    backgroundColor: 'rgba(135,206,235,0.15)',
    borderRadius: 30,
    zIndex: 1,
  },

  // ── HUD ──────────────────────────────────────────────────────────
  hud: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'rgba(20,10,4,0.92)',
    borderBottomWidth: 2,
    borderBottomColor: GOLD,
    zIndex: 30,
  },
  hudRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hudBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.4)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 3,
  },
  hudIcon: { fontSize: 11 },
  hudValue: { fontSize: 12, fontWeight: '800', color: GOLD },
  lvlBadge: {
    backgroundColor: 'rgba(200,150,12,0.2)',
    borderColor: DEEP_GOLD,
  },
  lvlText: { fontSize: 12, fontWeight: '800', color: DEEP_GOLD },
  bondRow: {
    flexDirection: 'row',
    gap: 1,
  },
  bondHeart: { fontSize: 12 },
  hudBtn: {
    backgroundColor: 'rgba(255,215,0,0.15)',
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  hudBtnEmoji: { fontSize: 16 },

  // ── Title ────────────────────────────────────────────────────────
  titleArea: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
    zIndex: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: GOLD,
    textShadowColor: 'rgba(255,215,0,0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 11,
    color: 'rgba(255,248,238,0.5)',
    fontStyle: 'italic',
    letterSpacing: 0.8,
    marginTop: 2,
  },

  // ── 3D Depth Container ───────────────────────────────────────────
  depthContainer: {
    flex: 1,
    zIndex: 10,
    paddingHorizontal: '14%',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  depthRow: {
    marginBottom: 6,
  },

  // ── Stall number row ─────────────────────────────────────────────
  stallNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
    paddingHorizontal: 4,
  },
  stallNumberBadge: {
    backgroundColor: 'rgba(200,150,12,0.25)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: DEEP_GOLD,
  },
  stallNumberText: {
    fontSize: 9,
    fontWeight: '800',
    color: GOLD,
  },
  aisleIndicator: {
    alignItems: 'center',
  },
  youAreHere: {
    fontSize: 10,
    fontWeight: '800',
    color: GOLD,
    textShadowColor: GOLD,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },

  // ── Stall pair row ───────────────────────────────────────────────
  stallPairRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 6,
  },
  stallSide: {
    flex: 1,
  },
  stallGlow: {
    borderRadius: 8,
  },
  aisleCenterStrip: {
    width: 16,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  aisleFloorBoard: {
    width: 8,
    height: 14,
    backgroundColor: '#5C3A1E',
    borderRadius: 2,
    opacity: 0.4,
  },

  // ── Stall Door ───────────────────────────────────────────────────
  stallDoor: {
    borderRadius: 8,
    borderWidth: 3,
    borderColor: MID_WOOD,
    backgroundColor: '#4A2A14',
    minHeight: 120,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  stallDoorSelected: {
    borderColor: GOLD,
    shadowColor: GOLD,
    shadowOpacity: 0.6,
    shadowRadius: 14,
  },

  // ── Stall Interior ──────────────────────────────────────────────
  stallInterior: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  hayBedding: {
    backgroundColor: 'rgba(218,165,32,0.15)',
    paddingVertical: 4,
    alignItems: 'center',
  },
  hayText: {
    fontSize: 12,
    opacity: 0.5,
  },
  waterBucket: {
    position: 'absolute',
    bottom: 4,
    right: 6,
  },
  bucketText: {
    fontSize: 14,
    opacity: 0.6,
  },

  // ── Half door bottom ─────────────────────────────────────────────
  halfDoorBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '42%',
    backgroundColor: '#6B3F1E',
    borderTopWidth: 4,
    borderTopColor: '#8B5E3C',
    overflow: 'hidden',
  },
  doorPlank1: {
    position: 'absolute',
    top: '25%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  doorPlank2: {
    position: 'absolute',
    top: '55%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  doorPlank3: {
    position: 'absolute',
    top: '80%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  doorLatch: {
    position: 'absolute',
    top: '35%',
    right: 8,
    width: 12,
    height: 20,
    backgroundColor: '#A0A0A0',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#808080',
    alignItems: 'center',
    justifyContent: 'center',
  },
  latchKnob: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D4AF37',
    borderWidth: 1,
    borderColor: '#B8960C',
  },

  // ── Unicorn peeking ──────────────────────────────────────────────
  unicornPeek: {
    position: 'absolute',
    top: '5%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  peekEmoji: {
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },

  // ── Nameplate ────────────────────────────────────────────────────
  nameplate: {
    position: 'absolute',
    top: 4,
    left: 8,
    right: 8,
    backgroundColor: '#C8960C',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4AF37',
    zIndex: 6,
  },
  nameplateText: {
    fontSize: 9,
    fontWeight: '900',
    color: CREAM,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // ── Selected overlay ──────────────────────────────────────────────
  selectedOverlay: {
    position: 'absolute',
    bottom: '44%',
    right: 4,
    zIndex: 10,
  },
  selectedCrown: {
    fontSize: 18,
  },

  // ── Tack trunk ───────────────────────────────────────────────────
  trunkGlow: {
    marginTop: 4,
    borderRadius: 8,
    alignSelf: 'center',
  },
  tackTrunk: {
    backgroundColor: DARK_WOOD,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: DEEP_GOLD,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: DEEP_GOLD,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  trunkEmoji: { fontSize: 18 },
  trunkLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: GOLD,
  },
  ribbonBadge: {
    backgroundColor: 'rgba(255,215,0,0.18)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.4)',
  },
  ribbonBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: GOLD,
  },

  // ── Navigation bar ───────────────────────────────────────────────
  navBar: {
    backgroundColor: 'rgba(20,10,4,0.95)',
    borderTopWidth: 2,
    borderTopColor: GOLD,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    zIndex: 20,
  },
  navControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 8,
  },
  arrowBtn: {
    backgroundColor: 'rgba(255,215,0,0.2)',
    borderWidth: 2,
    borderColor: GOLD,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    minWidth: 80,
    alignItems: 'center',
  },
  arrowBtnDisabled: {
    opacity: 0.3,
    borderColor: '#555',
  },
  arrowText: {
    fontSize: 14,
    fontWeight: '900',
    color: GOLD,
  },
  positionIndicator: {
    alignItems: 'center',
    gap: 4,
    flexDirection: 'column',
  },
  positionDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  positionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 2,
  },
  positionDotActive: {
    backgroundColor: GOLD,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  positionDotPassed: {
    backgroundColor: DEEP_GOLD,
  },
  positionLabel: {
    fontSize: 10,
    color: 'rgba(255,248,238,0.6)',
    fontWeight: '600',
  },
  keyHint: {
    fontSize: 10,
    color: 'rgba(255,215,0,0.5)',
    fontStyle: 'italic',
    marginBottom: 6,
  },

  // ── Bottom action ────────────────────────────────────────────────
  rideBtn: {
    backgroundColor: GOLD,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    shadowColor: DEEP_GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 7,
    borderWidth: 2,
    borderColor: DEEP_GOLD,
  },
  rideBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: DARK_WOOD,
    letterSpacing: 0.5,
  },
  selectHint: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,248,238,0.5)',
    fontStyle: 'italic',
  },
});

export default BarnScene;
