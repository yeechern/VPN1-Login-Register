const { contextBridge, ipcRenderer, clpboard} = require ('electron');

contextBridge.exposeInMainWorld("electronAPI", {
    // Xray-related operations
    startXray: async () => await ipcRenderer.invoke('start-xray'),
    stopXray: () => ipcRenderer.invoke('stop-xray'),
    
    // Clipboard operations
    readClipboard: async () => await ipcRenderer.invoke('clipboard:read'),

    // Configuration processing
    processConfig: (config) => ipcRenderer.invoke('process-configuration', config),
    
    // Link decoding (Reality, Vmess, Trojan, Shadowsocks)
    decodeVmess: (link) => ipcRenderer.invoke('decode-vmess', link),
    decodeTroless: (link) => ipcRenderer.invoke('decode-vless-trojan', link),
    decodeShadowSocks: (link) => ipcRenderer.invoke('decode-shadowsocks', link),

    // Outbound checks and proxy management
    checkOutbounds: (removeOutbound) => ipcRenderer.invoke('check-outbounds', removeOutbound),
    startProxy: () => ipcRenderer.invoke('start-proxy'),
    stopProxy: () => ipcRenderer.invoke('stop-proxy')
});

contextBridge.exposeInMainWorld("electronCallbackFunctions", {
    onXrayOutput: (callback) => ipcRenderer.on('xray-output', (_, data) => callback(data)),
    onXrayOutputError: (callback) => ipcRenderer.on('xray-output-error', (_, error) => callback(error)),
    onXrayError: (callback) => ipcRenderer.on('xray-error', (_, error) => callback(error)),
    onXrayExit: (callback) => ipcRenderer.on('xray-exit', (_, code) => callback(code)),
    onXrayNotFound: (callback) => ipcRenderer.on('xray-not-found', (_, err) => callback(err)),
    onUnsupportedLink: (callback) => ipcRenderer.on('unsupported-link', (_, err) => callback(err)),
})