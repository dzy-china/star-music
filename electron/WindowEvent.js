/* 最大、最小、关闭 */
const { ipcMain } =require('electron')

class WindowEvent{
    constructor(win) {
        // 最小化
        ipcMain.on('min', () => win.minimize());
        // 最大化
        ipcMain.on('max', () => win.isMaximized()?win.restore():win.maximize());
        // 关闭
        ipcMain.on('close', () => win.close());
        // 置顶
        ipcMain.on('top', () => win.isAlwaysOnTop()?win.setAlwaysOnTop(false):win.setAlwaysOnTop(true));
    }
}
module.exports = WindowEvent