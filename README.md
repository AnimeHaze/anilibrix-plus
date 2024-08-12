# AniLibrix Unofficial

Versions up to and including ext13 are affected by an API issue as of 07/14/24.

Temporary solution - [https://t.me/anilibrix_plus/308](https://t.me/anilibrix_plus/308)

### Desktop anime cinema from Anilibria for any of your computers.

[![Download from Snap Store](https://snapcraft.io/static/images/badges/en/snap-store-black.svg)](https://snapcraft.io/anilibrix-plus)

![Anilibrix](https://raw.githubusercontent.com/pavloniym/anilibrix/master/.github/assets/anilibrix.png)

### Features of the unofficial version (this one):
* Login via VKontakte
* Auto-skip of the opening theme
* Ability to back up viewing data and restore it on another device if needed—no setup required, everything is tied to your account
* Random release button
* Volume adjustment increased from 10 to 20 levels
* If the config file is corrupted, the app now launches and resets to the default config (previously, it would fail to launch)
* Fix for PC screen sleep/shutdown while watching anime (my screen would turn off and lock)
* When switching to the next episode, the video in Picture-in-Picture mode also switches, so you don't need to reopen this mode
* Fewer logouts since reauthorization attempts are made to refresh the session identifier before deauthorization
* Discord Rich Presence (broadcasting anime viewing activity to Discord)
  - Shows the app icon when the app is running, as well as the poster and information about the release being viewed:
    - Current episode number
    - Total number of episodes
    - Title
    - Link to the release
    - Link to the Anilibria site
    - Time remaining until the end of the episode
* Saving window state (fullscreen, minimized, screen coordinates)
* Setting a custom API endpoint (Anilibria API server address) and custom static server (for fetching images and posters). You can select one from the list or enter your own. This may be convenient if a server is unavailable or blocked by your provider.
* A new button in the settings allows you to open the config file in the directory, which may be useful if you need to transfer viewing data and statistics or make a backup for transfer to a new system
* Added a function to move the system bar buttons to the right side (default is automatic placement)
* Display of related releases
* Display of release dates in the episode list
* Support for Rutube releases in the app's player
* Sorting by popularity in favorites
* Filter by "all statuses" in favorites and everything except "in progress"
* Added a user count in favorites (like a rating)
* Display of release status in the release card in favorites
* Display of people who worked on the release
* Notification filtering by favorites
* Persistent display of progress in favorites with different colors (depending on progress)
* Fixed a bug with incorrect progress display when episodes don't start from 1
* Fixed a bug with the disappearance of announcement releases from favorites
* Display of torrent lists with the ability to open them in an external torrent client
* Removed the round poster in favor of the full one
* Proxy support (more details: [https://github.com/AnimeHaze/anilibrix-plus/releases/tag/v1.4.3-ext.11](https://github.com/AnimeHaze/anilibrix-plus/releases/tag/v1.4.3-ext.11))

#### Anilibria — this is how anime sounds!

### Player hotkeys

| Key     | Action                                |
|---------|---------------------------------------|
| F       | Toggle fullscreen mode                |
| ←       | Backward                              |
| →       | Forward                               |
| ↑       | Increase volume (or use mouse wheel)  |
| ↓       | Decrease volume (or use mouse wheel)  |
| space   | Play / Pause                          |

Plus, custom keys of your choice can be set in the settings for:
- Turning the auto-skip of the opening on/off without leaving the player
- Skipping the opening

### Build and Run

> Required Node.JS version - **14.18.0**  
> Other versions (especially newer ones) may cause issues with building native modules.
>
> Damn legacy code, easier to rewrite from scratch...

Before launching, don't forget to copy and edit the sample `.env` file:

```bash
cp .env.example .env
```

```bash
# Install and build dependencies
yarn install

# Start with hot-reload at localhost:9080
yarn run serve

# Build production version
yarn run build

# Run ESLint --fix for JS/Vue files and components in `src/`
yarn run lint:fix

# Build for all platforms
yarn run release

# Build for MacOS
yarn run release:mac

# Build for Windows
yarn run release:win

# Build for Linux
yarn run release:lin
```

---

#### English translation by: [TomerGamerTV](https://github.com/TomerGamerTV) 😉
