// Janela do programa de computador. Abre a mesma página do aplicativo, guardada dentro do programa.
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  let win;
  app.on('second-instance', () => {
    if (win) { if (win.isMinimized()) win.restore(); win.focus(); }
  });
  app.whenReady().then(() => {
    win = new BrowserWindow({
      width: 1200,
      height: 820,
      minWidth: 380,
      minHeight: 560,
      backgroundColor: '#000000',
      autoHideMenuBar: true,
      title: 'Orçamentos A Fernandes',
      icon: path.join(__dirname, '..', 'build', 'icon.png'),
      webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true }
    });
    win.setMenuBarVisibility(false);
    win.loadFile(path.join(__dirname, '..', 'www', 'index.html'));
    win.webContents.setWindowOpenHandler(({ url }) => {
      if (/^https?:/i.test(url)) shell.openExternal(url);
      return { action: 'deny' };
    });
  });
  app.on('window-all-closed', () => app.quit());
}
