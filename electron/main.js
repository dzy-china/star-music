const path = require("path");
const WindowEvent = require("./WindowEvent");
//一、引入electron模块，并导入app和BrowserWindow对象
const {
    app,
    BrowserWindow
} = require("electron");

const VITE_PORT = process.env.VITE_PORT  //新增

//二、创建主窗口
let mainWindow = null;
function createWindow() {
    mainWindow = new BrowserWindow({
        frame: false, // 隐藏默认的标题栏
        width: 950,
        height: 650,
        autoHideMenuBar: true, // 隐藏默认菜单栏
        icon: path.resolve(app.isPackaged?"resources/":"public/", "images/logo.ico"),
        //开启渲染进程访问node模块
        webPreferences: {
            nodeIntegration: true, // 开启在渲染进程中融入node
            contextIsolation:false, // 关闭上下文隔离
            enableRemoteModule:true,  // 开启可在渲染进程中直接引入node模块
        }
    });

    /*根据不同开发环境加载不同index.html*/
    if(app.isPackaged){ // 判断是否是已打包环境
        mainWindow.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`)
    }else{
        mainWindow.loadURL(`http://localhost:${VITE_PORT}`)

    }

    // 打开 DevTools
    mainWindow.webContents.openDevTools({mode:'undocked'});
    // 消除electron控制台警告
    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

    //关闭因为css: -webkit-app-region: drag;   引起的默认鼠标右键菜单
    // 可拖拽区域右键菜单被触发时事件
    mainWindow.hookWindowMessage(278,function(e){
        mainWindow.setEnabled(false);//窗口禁用
        setTimeout(()=>{
            mainWindow.setEnabled(true);//窗口启用
        },100); //延时太快会立刻启动，太慢会妨碍窗口其他操作，可自行测试最佳时间
        return true;
    })

    /* 加载 window常用事件 */
    new WindowEvent(mainWindow)
}


// 三、app事件监听
// electron准备就绪事件
app.on('ready', createWindow);

//软件复活事件：兼容 macOS
//当 Linux 和 Windows 应用在没有窗口打开时退出了，macOS 应用通常即使在没有打开任何窗口的情况下也继续运行，并且在没有窗口可用的情况下激活应用时会打开新的窗口。
// 为了实现这一特性，监听 app 模块的 activate 事件
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// linux or windows
// 在Windows和Linux上，关闭所有窗口通常会完全退出一个应用程序。
app.on('window-all-closed',function(){
    //不是在 macOS
    if (process.platform !== 'darwin') app.quit()
});