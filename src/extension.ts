import * as vscode from 'vscode'

let timer: NodeJS.Timeout | undefined

export function activate(context: vscode.ExtensionContext) {
  // 读取配置并启动定时器
  const config = vscode.workspace.getConfiguration('activityReminder')
  const interval = config.get<number>('interval', 45)
  startTimer(interval)

  // 监听配置变化
  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('activityReminder.interval')) {
      const newConfig = vscode.workspace.getConfiguration('activityReminder')
      const newInterval = newConfig.get<number>('interval', 45)
      startTimer(newInterval)
    }
  })

  // 注册命令
  let disposable = vscode.commands.registerCommand(
    'extension.startTimer',
    () => {
      const config = vscode.workspace.getConfiguration('activityReminder')
      const interval = config.get<number>('interval', 45)
      startTimer(interval)
    },
  )

  context.subscriptions.push(disposable)
}

export function deactivate() {
  if (timer) {
    clearTimeout(timer)
  }
}

function startTimer(interval: number = 45) {
  if (timer) {
    clearTimeout(timer)
  }

  timer = setTimeout(() => {
    vscode.window.showInformationMessage(
      '为了您的腰间盘， 请站起来活动一下哦~~~',
    )
    startTimer(interval) // 重新启动定时器
  }, interval * 60 * 1000) // 转换为毫秒
}
