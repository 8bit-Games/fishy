# Fishy

[![Build Status](https://img.shields.io/github/actions/workflow/status/8bit-games/fishy/ci.yml?logo=github&labelColor=1e1c24&color=8bcfcf)](https://github.com/8bit-games/fishy/actions) [![Documentation](https://img.shields.io/badge/documentation-8bitgames.io-green.svg?labelColor=1e1c24&color=f3ee7a)](https://8bitgames.io/fishy) [![License](https://img.shields.io/badge/License-MIT%20or%20Apache%202-green.svg?label=license&labelColor=1e1c24&color=34925e)](./LICENSE) [![Discord](https://img.shields.io/badge/chat-on%20discord-green.svg?logo=discord&logoColor=fff&labelColor=1e1c24&color=8d5b3f)](https://discord.gg/fishy)

![Fishy - Dive into 8-bit Chaos](https://user-images.githubusercontent.com/24392180/151969075-399e9fea-e2de-4340-96a4-0a0e5b79c281.gif)

**Dive into 8-bit Chaos!**

## Introduction

**Fishy** is a tactical 2D shooter, played by up to 4 players online or on a shared screen. Aim either left or right; the rest is up to clever movement and positioning in this fish-on-fish brawler!

Built with modern Rust and Bevy, Fishy combines classic 8-bit aesthetics with cutting-edge technology including Web3 integration, cross-platform multiplayer, and full mobile support.

## Play Now

### Web Demo (Play Instantly!)

Fishy runs in your browser! Try the [web demo](https://8bitgames.io/fishy/play) to play immediately without installing anything.

We recommend Chrome or other Chromium-based browsers for best performance.

### Download & Install

**Desktop:**
- **Steam**: [Coming Soon](https://store.steampowered.com)
- **Direct Download**: [Latest Release](https://github.com/8bit-games/fishy/releases)

**Mobile:**
- **iOS**: [App Store - Coming Soon](https://apps.apple.com)
- **Android**: [Google Play - Coming Soon](https://play.google.com)

**Web3:**
- Connect your wallet to unlock NFT cosmetics and earn $FISHY tokens!

## Key Features

### Gameplay
- **2-4 Player Multiplayer** - Local split-screen or online play
- **Cross-Platform** - Play on desktop, mobile, or web with crossplay
- **Easy to Learn, Hard to Master** - Emphasizes strategy over twitch reactions
- **Tactical Combat** - Smart positioning and movement are key to victory

### Customization
- **NFT Cosmetics** - Collect and trade unique hats, skins, and emotes
- **$FISHY Rewards** - Earn tokens through gameplay
- **Battle Pass** - Seasonal progression with exclusive rewards
- **Profile NFTs** - Your account as a tradeable asset

### Content
- **14+ Maps** - Diverse underwater environments
- **20+ Weapons** - From muskets to machine guns
- **User-Generated Content** - Create custom maps, weapons, and mods
- **Lua Scripting** - Full modding support

### Community
- **Tournaments** - Compete for $FISHY prizes
- **Leaderboards** - Global and friend rankings
- **Creator Economy** - Earn from your creations
- **Discord Integration** - Active community

## Technology

**Built With:**
- **Rust** - Memory-safe, high-performance
- **Bevy Engine** - Modern ECS game engine
- **Bones Framework** - Custom networking & asset system
- **Rapier2D** - Deterministic physics for rollback netcode
- **Web3** - Polygon blockchain for NFTs and tokens

**Platforms:**
- Desktop: Windows, macOS, Linux
- Mobile: iOS, Android (native apps)
- Web: WASM/WebGL (PWA support)

## Web3 Features

### NFT Cosmetics
Collect rare and legendary cosmetics as NFTs:
- Hats, skins, emotes, weapon skins
- Trade on OpenSea and in-game marketplace
- Proven ownership and scarcity
- Community creations with royalties

### $FISHY Token
Earn and spend the official Fishy token:
- Earn through matches, quests, and tournaments
- Spend on cosmetics and tournament entries
- Stake for additional rewards
- Decentralized prize pools

### Blockchain Benefits
- True ownership of in-game items
- Cross-game asset portability
- Player-driven economy
- Transparent tournament results

**Web3 is Optional!** You can enjoy Fishy completely free without crypto.

## Getting Started

### Playing

1. **Web**: Visit [8bitgames.io/fishy/play](https://8bitgames.io/fishy/play)
2. **Desktop**: Download from [releases](https://github.com/8bit-games/fishy/releases) and run the executable
3. **Mobile**: Download from App Store or Google Play

### Building from Source

1. Install Rust: [rustup.rs](https://rustup.rs/)
2. Clone: `git clone https://github.com/8bit-games/fishy.git`
3. Build: `cd fishy && cargo run`

For detailed build instructions, see [BUILDING.md](./docs/BUILDING.md)

### Development

```bash
# Run with optimizations for better performance
cargo run --profile dev-optimized

# Build for web
just build-web

# Run web locally
just run-web

# Run tests
cargo test

# Format code
cargo fmt

# Lint
cargo clippy -- -W clippy::correctness -D warnings
```

## Community

### Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

All contributors must follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

### Get Involved

- **Discord**: [Join our server](https://discord.gg/fishy)
- **Twitter**: [@FishyGame](https://twitter.com/fishygame)
- **GitHub**: [Open issues](https://github.com/8bit-games/fishy/issues)
- **Wiki**: [Community wiki](https://github.com/8bit-games/fishy/wiki)

### Content Creation

Create and share your content:
- **Maps**: Use the in-game editor
- **Mods**: Lua scripting support
- **Art**: Contribute pixel art
- **Guides**: Help new players

Earn $FISHY tokens for featured community content!

## Roadmap

### Current: Season 1 (Launch)
- ✅ Core gameplay
- ✅ 14 maps, 20+ weapons
- ✅ Cross-platform multiplayer
- ✅ Web3 integration
- 🚧 Mobile apps (iOS/Android)
- 🚧 Battle Pass system

### Season 2 (Q2 2026)
- New fish characters
- Additional maps and weapons
- Tournament system v2
- Enhanced modding tools

### Season 3+ (2026)
- Campaign mode
- Clan system
- Esports features
- Platform expansions

See [MODERNIZATION_PLAN.md](./MODERNIZATION_PLAN.md) for full details.

## Monetization

Fishy is **free-to-play** with optional purchases:

- **Battle Pass**: $9.99/season (3 months)
- **Cosmetics**: $1.99-$9.99
- **NFTs**: Variable (marketplace)
- **Tournament Entry**: $5-$50 (prize pools)

All gameplay content is free. Purchases are cosmetic only.

## Credits

### 8bit Games Team
- [Team roster to be added]

### Original Project
Based on Fish Folk: Jumpy by the Fish Fight Game & Spicy Lobster Developers.
See [CREDITS.md](./CREDITS.md) for full attribution.

### Assets
- Input Icons: [Kadith's Icons](https://kadith.itch.io/kadiths-free-icons) by Kadith
- Music & Sound: Original compositions
- Art: Community contributors

## License

Dual-licensed under MIT OR Apache-2.0. See [LICENSE](./LICENSE) for details.

Smart contracts and Web3 components may have additional licenses.

## Support

- **Bug Reports**: [GitHub Issues](https://github.com/8bit-games/fishy/issues)
- **Feature Requests**: [Discussions](https://github.com/8bit-games/fishy/discussions)
- **Email**: support@8bitgames.io
- **Discord**: Technical support channel

---

**Made with 🐟 by 8bit Games**

[Website](https://8bitgames.io/fishy) | [Play Now](https://8bitgames.io/fishy/play) | [Discord](https://discord.gg/fishy) | [Twitter](https://twitter.com/fishygame)
