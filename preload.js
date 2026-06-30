// placeholder for Electron preload APIs
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electron', { })
