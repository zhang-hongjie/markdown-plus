const electron = require('electron')
const { app, BrowserWindow, Menu, Tray } = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is garbage collected.
let mainWindow
let appIcon = null;

// const app = electron.app;
const image = electron.nativeImage.createFromPath(
  path.join(__dirname, '../dist/icon.png')
);
app.dock.setIcon(image);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit()
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow(
    { width: 800, height: 600, webPreferences: { nodeIntegration: true } })

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  // and load the index.html of the app.
  // mainWindow.loadURL('file://' + __dirname + '/index.html');
}
const createTrayMenu = () => {
  const iconPath = path.join(__dirname, '../dist/tray_icon.png');
  appIcon = new Tray(iconPath);
  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Item1',
      type: 'radio',
      icon: iconPath
    },
    {
      label: 'Item2',
      submenu: [
        { label: 'submenu1' },
        { label: 'submenu2' }
      ]
    },
    {
      label: 'Item3',
      type: 'radio',
      checked: true
    },
    {
      label: 'Toggle DevTools',
      accelerator: 'Alt+Command+I',
      click: function() {
        mainWindow.show();
        mainWindow.toggleDevTools();
      }
    },
    { label: 'Quit',
      accelerator: 'Command+Q',
      selector: 'terminate:',
    }
  ]);
  appIcon.setToolTip('This is my application.');
  appIcon.setContextMenu(contextMenu);
}
const createApplicationMenu = () => {
  var application_menu = [
    {
      label: 'menu1',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            electron.dialog.showOpenDialog(
              { properties: ['openFile', 'openDirectory', 'multiSelections'] })
          }
        },
        {
          label: 'submenu1',
          submenu: [
            {
              label: 'item1',
              accelerator: 'CmdOrCtrl+A',
              click: () => {
                mainWindow.openDevTools()
              }
            },
            {
              label: 'item2',
              accelerator: 'CmdOrCtrl+B',
              click: () => {
                mainWindow.closeDevTools()
              }
            }
          ]
        }
      ]
    }
  ]
  if (process.platform == 'darwin') {
    const name = app.getName()
    application_menu.unshift({
      label: name,
      submenu: [
        {
          label: 'About ' + name,
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide ' + name,
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          role: 'hideothers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit()
          }
        },
      ]
    })
  }

  menu = Menu.buildFromTemplate(application_menu)
  Menu.setApplicationMenu(menu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  createWindow();
  createTrayMenu();
  createApplicationMenu();
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
