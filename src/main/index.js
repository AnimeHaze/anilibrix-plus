import {app, BrowserWindow, ipcMain} from 'electron'
import proxy from 'node-global-proxy';
let proxyServer

if (app.commandLine.hasSwitch('proxy-server')) {
  proxyServer = app.commandLine.getSwitchValue('proxy-server')

  if (proxyServer) {
    proxy.setConfig({
      http: proxyServer,
      https: proxyServer
    })

    proxy.start();
  }
}

// Main process
import path from 'path'

import { meta, version } from '@package'
import sentry from './utils/sentry'
// Store
import { getStore, setUserId } from '@store'

// Windows
import { Main, Torrent } from './utils/windows'

// Download handlers
// import {startingDownload, cancelingDownload, openingDownload} from "@main/handlers/download/downloadHandlers";
import { autoUpdater } from 'electron-updater'

// App Handlers
import {
  catchAppAboutEvent,
  catchAppDevtoolsMainEvent,
  catchAppDevtoolsTorrentEvent,
  catchAppDockNumberEvent,
  catchDisableSystemSleepBlockerEvent,
  catchEnableSystemSleepBlockerEvent,
  handleRand,
  handleRichPresense,
  handleSafeStorageEncrypt,
  handleShowConfig,
  handleTorrentParse
} from '@main/handlers/app/appHandlers'

// Torrent Handlers
import { broadcastTorrentEvents } from '@main/handlers/torrents/torrentsHandler'

// Import tray and menu
import Tray from './utils/tray'
import Menu from './utils/menu'
import { openWindowInterceptor } from '@main/utils/windows/openWindowInterceptor'
import {showAppError} from "@main/handlers/notifications/notificationsHandler";

const { discordActivity } = require('./utils/discord')
const {
  setActivity,
  destroy: destroyRichPresence
} = discordActivity()

// Remote
require('@electron/remote/main').initialize()

// Create tray and menu controller
const trayController = new Tray()
const menuController = new Menu()

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

// Add command lines arguments
app.commandLine.appendSwitch('disable-site-isolation-trials')
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')

process.on('uncaughtException', error => {
  console.log('Unhandled Error', error)
})

process.on('unhandledRejection', error => {
  console.log('Unhandled Promise Rejection', error);
})

// Close app on all windows closed (relevant for mac users)
app.on('window-all-closed', () => {
  destroyRichPresence()
  app.quit()
})

app.on('web-contents-created', (event, webContents) => {
  webContents.on('did-finish-load', async () => {
    if (webContents.getURL().startsWith('https://id.vk.com/')) {
      webContents.on('will-redirect', async (event, url) => {
        if (!url.startsWith('https://www.anilibria.tv/')) {
          return true
        }

        const cookies = await webContents.session.cookies.get({ url: 'https://www.anilibria.tv' })

        const { value: sessionId } = cookies.find(cookie => cookie.name === 'PHPSESSID') || {}

        if (sessionId) {
          Main.getWindow().webContents.send('VK_CODE', sessionId)
        }

        BrowserWindow.fromWebContents(webContents).hide()

        webContents.on('did-finish-load', async () => {
          await webContents.session.clearStorageData()
          webContents.destroy()
        })

        return true
      });
    }
  })

  webContents.setWindowOpenHandler(openWindowInterceptor)
  webContents.setUserAgent(`${meta.name}/${version}`)
  webContents.on('will-attach-webview', (event, webPreferences, params) => {
    // Strip away preload scripts if unused or verify their location is legitimate
    delete webPreferences.preload

    // Disable Node.js integration
    webPreferences.nodeIntegration = false

    // Enable sandbox
    webPreferences.contextIsolation = true
  })
})

// App ready handler
app.on('ready', async () => {
  // Set user id
  await setUserId()

  // Initialize sentry.io
  sentry({
    store: getStore(),
    source: 'main'
  })

  // Create windows
  Main.createWindow({ title: meta.name }).loadUrl()
  Torrent.createWindow({ title: `${meta.name} Torrent` }).loadUrl()

  const mainWindow = Main.getWindow()
  const torrentWindow = Torrent.getWindow()

  if (proxyServer) {
    mainWindow.webContents.session
      .setProxy({ proxyRules: proxyServer })

    torrentWindow.webContents.session
      .setProxy({ proxyRules: proxyServer })
  }

  if (process.env.NODE_ENV === 'development') mainWindow.webContents.openDevTools()

  require('@electron/remote/main').enable(mainWindow.webContents)
  require('@electron/remote/main').enable(torrentWindow.webContents)

  mainWindow
    .once('ready-to-show', () => {
      mainWindow.show()
      //autoUpdater.checkForUpdatesAndNotify() // Auto update
    })
    .on('close', () => {
      destroyRichPresence()
      app.quit()
    }) // Main window close event

  // Create menu
  // Create tray icon
  menuController.setWindows(mainWindow, torrentWindow).init()
  trayController.createTrayIcon({
    iconPath: path.join(__dirname, '../../build/icons/tray/icon.png')
  }).setTooltip(meta.name)

  appHandlers() // App handlers
  torrentHandlers() // Torrent handler
  // downloadHandlers(); // Download handlers
})

/**
 * App handlers
 * Show about handlers
 *
 * @return {void}
 */
const appHandlers = () => {
  catchAppAboutEvent() // About dialog
  catchAppDockNumberEvent() // App dock number event
  catchAppDevtoolsMainEvent() // Devtools main
  catchAppDevtoolsTorrentEvent() // Devtools torrent
  catchEnableSystemSleepBlockerEvent() // Disable system sleep
  catchDisableSystemSleepBlockerEvent() // Enable system sleep
  handleSafeStorageEncrypt()
  handleRichPresense(setActivity)
  handleRand()
  handleShowConfig()
  handleTorrentParse()
}

/**
 * Torrents handlers
 *
 * @return {void}
 */
const torrentHandlers = () => {
  broadcastTorrentEvents() // broadcast all torrent events
}

/**
 * Download handlers
 * Start download, cancel and open file
 *
 * @return {void}
 */
const downloadHandlers = () => {
  // // Create storage
  // const storage = {};
  // // Handlers
  // startingDownload(storage, Main); // Start download
  // cancelingDownload(storage); // Cancel download
  // openingDownload(storage); // Open downloaded file
}
