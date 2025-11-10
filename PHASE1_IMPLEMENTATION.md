# Phase 1 Implementation Plan - Foundation

**Timeline:** Months 1-2
**Status:** In Progress
**Started:** 2025-11-10

---

## Overview

Phase 1 focuses on foundational infrastructure for mobile/web support:
1. Progressive Web App (PWA) capabilities
2. Mobile touch control system
3. Responsive UI framework
4. Performance optimizations for mobile

## Objectives

- ✅ Complete rebranding to Fishy (DONE)
- 🚧 PWA manifest and service worker (IN PROGRESS)
- 🔲 Mobile touch controls
- 🔲 Responsive design system
- 🔲 Mobile optimization

---

## 1. PWA Enhancements

### 1.1 Web App Manifest
**File:** `/wasm_resources/manifest.json`

```json
{
  "name": "Fishy - Dive into 8-bit Chaos",
  "short_name": "Fishy",
  "description": "Tactical 2D shooter with 8-bit style",
  "start_url": "/",
  "display": "fullscreen",
  "orientation": "landscape",
  "background_color": "#000000",
  "theme_color": "#8bcfcf",
  "icons": [
    {
      "src": "icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["games", "action"],
  "screenshots": [
    {
      "src": "screenshots/gameplay-1.png",
      "sizes": "1280x720",
      "type": "image/png"
    }
  ]
}
```

**Tasks:**
- [x] Create manifest.json
- [ ] Generate PWA icons (72x72 to 512x512)
- [ ] Add screenshots for app stores
- [ ] Link manifest in index.html

### 1.2 Service Worker
**File:** `/wasm_resources/service-worker.js`

**Features:**
- Cache game assets for offline play
- Cache WASM binary
- Cache audio files
- Cache images/sprites
- Network-first strategy for game updates
- Cache-first for static assets

**Cache Strategy:**
```javascript
// Cache name versioning
const CACHE_NAME = 'fishy-v1.0.0';
const RUNTIME_CACHE = 'fishy-runtime-v1.0.0';

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/fishy.js',
  '/fishy_bg.wasm',
  // Add critical assets
];
```

**Tasks:**
- [x] Create service worker
- [ ] Implement caching strategies
- [ ] Add cache versioning
- [ ] Test offline functionality
- [ ] Add update notification UI

### 1.3 Install Prompt
**File:** `/wasm_resources/install-prompt.js`

**Features:**
- Detect if app is installable
- Show custom install button
- Handle beforeinstallprompt event
- Track installation analytics

**Tasks:**
- [ ] Create install prompt UI
- [ ] Add install button to menu
- [ ] Implement prompt deferral
- [ ] Add "Add to Home Screen" instructions

### 1.4 PWA Optimization
- [ ] Add meta tags for mobile browsers
- [ ] Implement splash screens
- [ ] Add iOS-specific meta tags
- [ ] Configure viewport for mobile
- [ ] Add preload hints for critical resources

---

## 2. Mobile Touch Controls

### 2.1 Architecture

**New Module:** `src/input/touch.rs`

```rust
// Touch input system for mobile devices
pub struct TouchControls {
    pub virtual_joystick: VirtualJoystick,
    pub action_buttons: ActionButtons,
    pub enabled: bool,
}

pub struct VirtualJoystick {
    pub position: Vec2,
    pub radius: f32,
    pub dead_zone: f32,
    pub current_touch: Option<TouchId>,
}

pub struct ActionButtons {
    pub jump: TouchButton,
    pub shoot: TouchButton,
    pub grab: TouchButton,
    pub slide: TouchButton,
}

pub struct TouchButton {
    pub position: Vec2,
    pub radius: f32,
    pub pressed: bool,
    pub touch_id: Option<TouchId>,
}
```

### 2.2 Virtual Joystick

**Features:**
- Dynamic joystick (appears where user touches)
- Fixed position option
- Visual feedback (circle outline)
- Smooth interpolation
- Configurable dead zone

**Implementation Tasks:**
- [ ] Create joystick component
- [ ] Render joystick overlay (egui)
- [ ] Handle touch events
- [ ] Map joystick to movement input
- [ ] Add visual customization

### 2.3 Action Buttons

**Layout:**
```
         [Jump]

[Grab]        [Shoot]

         [Slide]
```

**Features:**
- Large touch targets (64x64 minimum)
- Visual press feedback
- Customizable layout
- Haptic feedback (if available)

**Implementation Tasks:**
- [ ] Create button components
- [ ] Design button sprites/UI
- [ ] Handle multi-touch
- [ ] Add button press animations
- [ ] Implement haptic feedback (WASM API)

### 2.4 Touch Input Translation

**File:** `src/input/touch_translation.rs`

**Responsibilities:**
- Convert touch events to game inputs
- Handle multi-touch scenarios
- Prevent accidental touches
- Support gestures (swipe, pinch)

**Tasks:**
- [ ] Implement touch-to-input mapping
- [ ] Add gesture recognition
- [ ] Handle edge cases (touches outside controls)
- [ ] Add touch input debugging overlay

### 2.5 Mobile Detection

**File:** `src/platform/mobile_detection.rs`

```rust
pub fn is_mobile_device() -> bool {
    // Check user agent
    // Check touch support
    // Check screen size
}

pub fn is_touch_device() -> bool {
    // Detect touch capability
}

pub enum DeviceType {
    Desktop,
    Tablet,
    Phone,
}

pub fn detect_device_type() -> DeviceType {
    // Based on screen size and capabilities
}
```

**Tasks:**
- [ ] Implement device detection
- [ ] Auto-enable touch controls on mobile
- [ ] Adjust UI based on device type
- [ ] Add manual toggle for touch controls

---

## 3. Responsive UI System

### 3.1 UI Scaling

**Goals:**
- Support 320px to 4K resolutions
- Maintain aspect ratio
- Scale UI elements appropriately
- Readable text on all devices

**Implementation:**
```rust
pub struct ResponsiveUI {
    pub base_width: f32,
    pub base_height: f32,
    pub scale_factor: f32,
    pub device_type: DeviceType,
}

impl ResponsiveUI {
    pub fn calculate_scale(&mut self, window_size: Vec2) {
        // Calculate appropriate scale factor
    }

    pub fn scaled_font_size(&self, base_size: f32) -> f32 {
        base_size * self.scale_factor
    }
}
```

**Tasks:**
- [ ] Create responsive UI component
- [ ] Update menu systems with scaling
- [ ] Adjust HUD for mobile
- [ ] Test on various screen sizes
- [ ] Add safe area support (notches)

### 3.2 Adaptive Layouts

**Features:**
- Vertical layout for portrait mode
- Horizontal layout for landscape
- Compact mode for small screens
- Full mode for desktop

**Tasks:**
- [ ] Design mobile menu layouts
- [ ] Implement layout switching
- [ ] Update pause menu for mobile
- [ ] Simplify player select screen
- [ ] Optimize map select for touch

### 3.3 Touch-Friendly UI

**Requirements:**
- Minimum 44x44 point touch targets
- Adequate spacing between elements
- Visual feedback on press
- Swipe navigation support
- Large, readable fonts

**Tasks:**
- [ ] Audit all UI elements
- [ ] Increase button sizes for mobile
- [ ] Add swipe gestures to menus
- [ ] Improve button press feedback
- [ ] Test with actual devices

---

## 4. Performance Optimization

### 4.1 Mobile Performance Targets

- **Frame Rate:** 60 FPS on mid-range devices (2020+)
- **Memory:** <200MB RAM usage
- **Load Time:** <5 seconds to playable
- **Battery:** <10% per hour of gameplay

### 4.2 WASM Optimizations

**Build Configuration:**
```toml
[profile.release-wasm]
inherits = "release"
opt-level = "z"  # Optimize for size
lto = true
codegen-units = 1
```

**Tasks:**
- [ ] Create wasm-specific build profile
- [ ] Enable wasm-opt in build
- [ ] Analyze WASM binary size
- [ ] Remove unused code (tree shaking)
- [ ] Compress WASM with Brotli

### 4.3 Asset Optimization

**Strategies:**
- Compress textures (WebP, BC7)
- Downscale sprites for mobile
- Lazy load non-essential assets
- Use texture atlases efficiently
- Stream audio instead of loading all

**Tasks:**
- [ ] Create mobile asset variants
- [ ] Implement progressive loading
- [ ] Optimize audio files (OGG bitrate)
- [ ] Compress texture atlases
- [ ] Add loading progress indicator

### 4.4 Rendering Optimization

**Techniques:**
- GPU instancing for sprites
- Frustum culling
- Level of detail (LOD) for effects
- Batch draw calls
- Limit particle counts

**Tasks:**
- [ ] Profile rendering performance
- [ ] Implement sprite batching
- [ ] Add quality settings
- [ ] Create mobile preset (lower quality)
- [ ] Test on low-end devices

---

## 5. Testing & Validation

### 5.1 Device Testing Matrix

**Phones:**
- iPhone 12 Mini (iOS 17) - Small screen
- iPhone 14 Pro (iOS 17) - Notch handling
- Samsung Galaxy S21 (Android 13)
- Google Pixel 6 (Android 14)
- Budget device: ~2019 model

**Tablets:**
- iPad Air (iOS 17)
- Samsung Galaxy Tab S7 (Android 13)

**Browsers:**
- Chrome (Android/Desktop)
- Safari (iOS)
- Firefox (Android/Desktop)
- Edge (Android/Desktop)

### 5.2 Test Scenarios

- [ ] Install as PWA
- [ ] Offline gameplay
- [ ] Touch controls responsiveness
- [ ] UI scaling on different sizes
- [ ] Performance under load (4 players)
- [ ] Battery drain
- [ ] Audio playback
- [ ] Orientation changes
- [ ] App switching (background/foreground)

### 5.3 Metrics to Track

- [ ] Install conversion rate
- [ ] Session length on mobile
- [ ] Touch control usability
- [ ] Frame rate statistics
- [ ] Load time by device
- [ ] Crash rate
- [ ] User feedback

---

## 6. Documentation

### 6.1 Developer Docs

**Files to Create:**
- `docs/mobile-development.md` - Mobile dev guide
- `docs/pwa-setup.md` - PWA configuration
- `docs/touch-controls.md` - Touch input system
- `docs/responsive-ui.md` - UI scaling guide

### 6.2 User Docs

**Content:**
- How to install PWA
- Touch controls tutorial
- Mobile performance tips
- Troubleshooting guide

---

## 7. Implementation Timeline

### Week 1-2: PWA Foundation
- [x] Create PWA manifest
- [x] Set up service worker
- [ ] Generate app icons
- [ ] Test installation flow
- [ ] Add install prompts

### Week 3-4: Touch Controls
- [ ] Design touch UI mockups
- [ ] Implement virtual joystick
- [ ] Create action buttons
- [ ] Test multi-touch handling
- [ ] Add visual feedback

### Week 5-6: Responsive UI
- [ ] Implement UI scaling system
- [ ] Update all menu screens
- [ ] Test on multiple devices
- [ ] Optimize layouts
- [ ] Add orientation support

### Week 7-8: Optimization & Testing
- [ ] Profile performance
- [ ] Optimize assets for mobile
- [ ] Test on real devices
- [ ] Fix bugs and issues
- [ ] Document everything

---

## 8. Success Criteria

Phase 1 is complete when:

- ✅ PWA installs on iOS and Android
- ✅ Game works offline after first load
- ✅ Touch controls are responsive and intuitive
- ✅ UI scales correctly on 320px to 4K screens
- ✅ Maintains 60 FPS on mid-range devices (2020+)
- ✅ Loads in under 5 seconds on 4G connection
- ✅ All core gameplay features work on mobile
- ✅ Documentation is complete
- ✅ User testing yields positive feedback

---

## Next Steps After Phase 1

Once foundation is complete, we'll move to:
- **Phase 2:** Web3 integration (smart contracts, wallets)
- **Phase 3:** Native mobile apps (iOS/Android)
- **Phase 4:** Monetization (battle pass, store)

---

**Last Updated:** 2025-11-10
**Owner:** 8bit Games Development Team
