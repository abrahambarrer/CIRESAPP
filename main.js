const { app, BrowserWindow, screen, Menu } = require('electron/main')
const { ipcMain } = require('electron');


const createWindow = () => {
  // Obtener el tamaño de la pantalla principal
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  
  const win = new BrowserWindow({
    width: width,
    height: height,
    center: true,
    
    autoHideMenuBar: true, // Ocultar la barra de menú
    
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  Menu.setApplicationMenu(null); // Establecer menú a null para quitar la barra de menú completamente

  // Maximizar la ventana al iniciar
  win.maximize()

  win.loadFile('intro.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

ipcMain.on('cerrar-ventana', (event) => {
  const ventana = BrowserWindow.fromWebContents(event.sender);
  ventana.close();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})