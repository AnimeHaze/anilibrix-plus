import Window from './appWindow'

class MainWindow extends Window {


  /**
   * Get window configuration
   *
   * @return Object
   */
  getWindowConfiguration() {

    const width = 1000;
    const height = 720;
    const minWidth = width;
    const minHeight = height;

    return {
      height,
      width,
      minWidth,
      minHeight,
      show: true,
      frame: false,
      darkTheme: true,
      titleBarStyle: 'hiddenInset',
      useContentSize: true,
      webPreferences: {
        webgl: true,
        webSecurity: false,
        nodeIntegration: true,
        experimentalFeatures: true,
        allowRunningInsecureContent: true,
        enableBlinkFeatures: 'SameSiteDefaultChecksMethodRigorously',
        disableBlinkFeatures: 'CookiesWithoutSameSiteMustBeSecure'
      },
      backgroundColor: '#121212',
    }
  }


  /**
   * Get window url
   *
   * @return {string}
   */
  getWindowUrl() {
    return process.env.NODE_ENV === 'development'
      ? 'http://localhost:9080'
      : `file://${__dirname}/index.html`;
  }

}


export default new MainWindow();
