# Mobile Touch Controls Design

**Version:** 1.0
**Status:** Design Phase
**Last Updated:** 2025-11-10

---

## Overview

This document outlines the design and implementation of mobile touch controls for Fishy, enabling intuitive touch-based gameplay on mobile devices.

## Goals

1. **Intuitive**: Easy to learn for mobile players
2. **Responsive**: Low latency, feels native
3. **Customizable**: Adjustable size, position, opacity
4. **Platform-Agnostic**: Works on iOS, Android, and web
5. **Optional**: Can be toggled off for keyboard/gamepad users

## Architecture

### Module Structure

```
src/input/
├── mod.rs              (existing - update)
├── touch/
│   ├── mod.rs          (new - module exports)
│   ├── controls.rs     (new - touch control components)
│   ├── joystick.rs     (new - virtual joystick)
│   ├── buttons.rs      (new - action buttons)
│   ├── detection.rs    (new - touch event handling)
│   └── config.rs       (new - touch settings)
```

### Data Structures

#### TouchControls (Main Component)

```rust
#[derive(HasSchema, Clone, Debug, Default)]
pub struct TouchControls {
    pub enabled: bool,
    pub joystick: VirtualJoystick,
    pub buttons: ActionButtons,
    pub config: TouchConfig,
}
```

#### VirtualJoystick

```rust
#[derive(HasSchema, Clone, Debug)]
pub struct VirtualJoystick {
    // Type: Dynamic or Fixed
    pub joystick_type: JoystickType,

    // Position on screen (percentage)
    pub base_position: Vec2,  // 0.0-1.0 range
    pub current_position: Vec2,

    // Size and behavior
    pub outer_radius: f32,    // Dead zone boundary
    pub inner_radius: f32,    // Visual knob size
    pub dead_zone: f32,       // Input threshold

    // State
    pub is_active: bool,
    pub touch_id: Option<u64>,
    pub direction: Vec2,      // Normalized direction
    pub magnitude: f32,       // 0.0-1.0
}

#[derive(HasSchema, Clone, Copy, Debug)]
pub enum JoystickType {
    Dynamic,   // Appears where user touches
    Fixed,     // Always at base_position
}
```

#### ActionButtons

```rust
#[derive(HasSchema, Clone, Debug)]
pub struct ActionButtons {
    pub jump: TouchButton,
    pub shoot: TouchButton,
    pub grab: TouchButton,
    pub slide: TouchButton,

    // Layout configuration
    pub layout: ButtonLayout,
}

#[derive(HasSchema, Clone, Debug)]
pub struct TouchButton {
    // Position on screen (percentage)
    pub position: Vec2,  // 0.0-1.0 range

    // Size
    pub radius: f32,

    // State
    pub is_pressed: bool,
    pub touch_id: Option<u64>,

    // Visual
    pub opacity: f32,
    pub press_opacity: f32,
}

#[derive(HasSchema, Clone, Copy, Debug)]
pub enum ButtonLayout {
    RightHanded,   // Buttons on right, joystick on left
    LeftHanded,    // Buttons on left, joystick on right
    Custom,        // User-defined positions
}
```

#### TouchConfig

```rust
#[derive(HasSchema, Clone, Debug)]
pub struct TouchConfig {
    // Visual settings
    pub opacity: f32,           // 0.0-1.0
    pub size_scale: f32,        // 0.5-2.0
    pub haptic_feedback: bool,

    // Behavior
    pub auto_hide: bool,        // Hide when no touch
    pub show_on_mobile: bool,   // Auto-detect mobile

    // Customization
    pub button_layout: ButtonLayout,
    pub joystick_type: JoystickType,
}
```

## Default Layout

### Landscape Orientation (Primary)

```
┌──────────────────────────────────────────────┐
│                                              │
│                                              │
│                                        (Jump)│
│  ╱╲                                          │
│ ╱  ╲  (Joystick)          (Grab)      (Shoot)│
│ ╲  ╱                                          │
│  ╲╱                                    (Slide)│
│                                              │
│                                              │
└──────────────────────────────────────────────┘

Joystick:
- Position: 15% from left, 70% from top
- Size: 80px outer, 40px inner

Buttons:
- Shoot: 85% from left, 65% from top
- Jump: 85% from left, 35% from top
- Grab: 75% from left, 65% from top
- Slide: 85% from left, 85% from top
- Size: 64px radius each
```

### Portrait Orientation (Future)

```
┌────────────────────┐
│                    │
│                    │
│                    │
│      (Gameplay)    │
│                    │
│                    │
├────────────────────┤
│   ╱╲        (Jump) │
│  ╱  ╲       (Shoot)│
│  ╲  ╱       (Grab) │
│   ╲╱        (Slide)│
└────────────────────┘

Controls at bottom 30% of screen
```

## Input Translation

### Joystick to Movement

```rust
fn joystick_to_movement(joystick: &VirtualJoystick) -> PlayerInput {
    if !joystick.is_active || joystick.magnitude < joystick.dead_zone {
        return PlayerInput::default();
    }

    let dir = joystick.direction;

    PlayerInput {
        up: dir.y > 0.5,
        down: dir.y < -0.5,
        left: dir.x < -0.5,
        right: dir.x > 0.5,
        ..Default::default()
    }
}
```

### Buttons to Actions

```rust
fn buttons_to_actions(buttons: &ActionButtons) -> PlayerInput {
    PlayerInput {
        jump: buttons.jump.is_pressed,
        shoot: buttons.shoot.is_pressed,
        grab: buttons.grab.is_pressed,
        slide: buttons.slide.is_pressed,
        ..Default::default()
    }
}
```

## Rendering

### Using egui for Overlay

Touch controls will be rendered using egui in a dedicated layer above the game canvas.

```rust
fn render_touch_controls(
    ui: &mut egui::Ui,
    controls: &TouchControls,
    screen_size: Vec2,
) {
    if !controls.enabled {
        return;
    }

    // Render joystick
    render_joystick(ui, &controls.joystick, screen_size);

    // Render buttons
    render_buttons(ui, &controls.buttons, screen_size);
}

fn render_joystick(
    ui: &mut egui::Ui,
    joystick: &VirtualJoystick,
    screen_size: Vec2,
) {
    if !joystick.is_active && joystick.joystick_type == JoystickType::Dynamic {
        return;  // Don't show dynamic joystick when inactive
    }

    let center = joystick.base_position * screen_size;

    // Outer circle (boundary)
    ui.painter().circle_stroke(
        center.into(),
        joystick.outer_radius,
        egui::Stroke::new(2.0, egui::Color32::from_rgba_premultiplied(255, 255, 255, 80)),
    );

    // Inner circle (knob)
    let knob_pos = if joystick.is_active {
        center + joystick.direction * joystick.magnitude * joystick.outer_radius
    } else {
        center
    };

    ui.painter().circle_filled(
        knob_pos.into(),
        joystick.inner_radius,
        egui::Color32::from_rgba_premultiplied(255, 255, 255, 150),
    );
}

fn render_button(
    ui: &mut egui::Ui,
    button: &TouchButton,
    label: &str,
    screen_size: Vec2,
) {
    let pos = button.position * screen_size;
    let opacity = if button.is_pressed {
        button.press_opacity
    } else {
        button.opacity
    };

    // Button circle
    let color = if button.is_pressed {
        egui::Color32::from_rgba_premultiplied(200, 200, 255, (opacity * 255.0) as u8)
    } else {
        egui::Color32::from_rgba_premultiplied(255, 255, 255, (opacity * 255.0) as u8)
    };

    ui.painter().circle_filled(pos.into(), button.radius, color);

    // Button label
    ui.painter().text(
        pos.into(),
        egui::Align2::CENTER_CENTER,
        label,
        egui::FontId::proportional(18.0),
        egui::Color32::BLACK,
    );
}
```

## Touch Event Handling

### WASM Touch Events

```rust
#[cfg(target_arch = "wasm32")]
pub fn setup_touch_listeners() {
    use wasm_bindgen::prelude::*;
    use wasm_bindgen::JsCast;

    let window = web_sys::window().expect("no window");
    let document = window.document().expect("no document");

    // Touch start
    let touch_start = Closure::wrap(Box::new(move |event: web_sys::TouchEvent| {
        event.prevent_default();
        handle_touch_start(&event);
    }) as Box<dyn FnMut(_)>);

    document
        .add_event_listener_with_callback("touchstart", touch_start.as_ref().unchecked_ref())
        .unwrap();
    touch_start.forget();

    // Touch move
    let touch_move = Closure::wrap(Box::new(move |event: web_sys::TouchEvent| {
        event.prevent_default();
        handle_touch_move(&event);
    }) as Box<dyn FnMut(_)>);

    document
        .add_event_listener_with_callback("touchmove", touch_move.as_ref().unchecked_ref())
        .unwrap();
    touch_move.forget();

    // Touch end
    let touch_end = Closure::wrap(Box::new(move |event: web_sys::TouchEvent| {
        event.prevent_default();
        handle_touch_end(&event);
    }) as Box<dyn FnMut(_)>);

    document
        .add_event_listener_with_callback("touchend", touch_end.as_ref().unchecked_ref())
        .unwrap();
    touch_end.forget();
}
```

### Touch State Management

```rust
pub struct TouchState {
    pub active_touches: HashMap<u64, Touch>,
}

pub struct Touch {
    pub id: u64,
    pub start_pos: Vec2,
    pub current_pos: Vec2,
    pub claimed_by: Option<TouchTarget>,
}

pub enum TouchTarget {
    Joystick,
    Button(ActionButton),
    UI,
    None,
}
```

## Mobile Detection

```rust
#[cfg(target_arch = "wasm32")]
pub fn is_mobile_device() -> bool {
    use wasm_bindgen::JsCast;

    let window = web_sys::window().expect("no window");
    let navigator = window.navigator();
    let user_agent = navigator.user_agent().unwrap_or_default().to_lowercase();

    // Check user agent
    let is_mobile_ua = user_agent.contains("mobile") ||
                       user_agent.contains("android") ||
                       user_agent.contains("iphone") ||
                       user_agent.contains("ipad");

    // Check touch support
    let has_touch = window.navigator().max_touch_points() > 0;

    // Check screen size
    let screen_width = window.inner_width().unwrap().as_f64().unwrap_or(1920.0);
    let is_small_screen = screen_width < 768.0;

    is_mobile_ua || (has_touch && is_small_screen)
}

#[cfg(not(target_arch = "wasm32"))]
pub fn is_mobile_device() -> bool {
    false  // Desktop builds don't support touch
}
```

## Integration Points

### 1. Game Initialization

```rust
// In src/main.rs or src/input/mod.rs
pub fn initialize_touch_controls(game: &mut Game) {
    let is_mobile = is_mobile_device();

    let touch_controls = TouchControls {
        enabled: is_mobile,  // Auto-enable on mobile
        config: TouchConfig {
            show_on_mobile: true,
            opacity: 0.6,
            ..Default::default()
        },
        ..Default::default()
    };

    game.insert_resource(touch_controls);
}
```

### 2. Input System

```rust
// Update the input collection system
pub fn collect_touch_input(
    touch_controls: Res<TouchControls>,
    touch_state: Res<TouchState>,
) -> PlayerInput {
    if !touch_controls.enabled {
        return PlayerInput::default();
    }

    let movement = joystick_to_movement(&touch_controls.joystick);
    let actions = buttons_to_actions(&touch_controls.buttons);

    // Merge inputs
    movement.merge(actions)
}
```

### 3. Settings Menu

```rust
// Add touch control settings
pub fn touch_settings_ui(ui: &mut egui::Ui, touch_controls: &mut TouchControls) {
    ui.heading("Touch Controls");

    ui.checkbox(&mut touch_controls.enabled, "Enable Touch Controls");

    ui.add(egui::Slider::new(&mut touch_controls.config.opacity, 0.0..=1.0)
        .text("Opacity"));

    ui.add(egui::Slider::new(&mut touch_controls.config.size_scale, 0.5..=2.0)
        .text("Size"));

    ui.checkbox(&mut touch_controls.config.haptic_feedback, "Haptic Feedback");

    egui::ComboBox::from_label("Layout")
        .selected_text(format!("{:?}", touch_controls.config.button_layout))
        .show_ui(ui, |ui| {
            ui.selectable_value(&mut touch_controls.config.button_layout, ButtonLayout::RightHanded, "Right-Handed");
            ui.selectable_value(&mut touch_controls.config.button_layout, ButtonLayout::LeftHanded, "Left-Handed");
        });
}
```

## Testing Plan

### Unit Tests

- Joystick direction calculation
- Dead zone behavior
- Button hit detection
- Touch event routing

### Integration Tests

- Touch input to player movement
- Multi-touch handling
- Settings persistence
- Layout switching

### Device Testing

- iOS Safari
- Android Chrome
- Various screen sizes
- Portrait/landscape orientation

## Performance Considerations

- **Render Frequency**: Only render visible controls
- **Touch Polling**: Limit to 60 FPS max
- **Memory**: Minimal allocation during gameplay
- **Battery**: Avoid unnecessary redraws

## Accessibility

- **Size Options**: 50%-200% scaling
- **Opacity**: 0%-100% for visual preference
- **Haptics**: Optional vibration feedback
- **Alternative**: Full keyboard/gamepad support

## Future Enhancements

1. **Gesture Support**
   - Swipe to switch weapons
   - Pinch to zoom camera
   - Double-tap for quick actions

2. **Advanced Customization**
   - Drag-to-reposition controls
   - Custom button mapping
   - Save/load layouts

3. **Tutorials**
   - First-time touch control tutorial
   - Visual hints for new players

4. **Analytics**
   - Track control usage
   - Optimize default positions
   - A/B test layouts

---

**Next Steps:**
1. Implement basic touch event system
2. Create virtual joystick component
3. Add action buttons
4. Integrate with existing input system
5. Test on mobile devices
