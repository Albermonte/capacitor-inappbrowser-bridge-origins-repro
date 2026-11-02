import { InAppBrowser } from '@capgo/capacitor-inappbrowser'

const log = (message) => {
  document.getElementById('log').textContent += `${message}\n`
  console.log(message)
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

document.getElementById('android').textContent = navigator.userAgent.match(/Android ([\d.]+)/)?.[1] ?? 'unknown'

let received = false
InAppBrowser.addListener('messageFromWebview', () => {
  received = true
})

async function run(url) {
  received = false
  log(`Opening ${url}`)
  const loaded = new Promise((resolve) => {
    InAppBrowser.addListener('browserPageLoaded', resolve)
  })
  try {
    await InAppBrowser.openWebView({
      url,
      javascriptBridgeOrigins: ['https://example.com'],
    })
    await loaded
    await InAppBrowser.executeScript({
      code: 'window.mobileApp.postMessage({ detail: { from: location.href } })',
    })
    await sleep(2000)
    await InAppBrowser.close()
    log(received ? 'PASS: messageFromWebview received' : 'FAIL: messageFromWebview never fired')
  }
  catch (error) {
    log(`ERROR: ${error.message}`)
  }
}

document.getElementById('plain').onclick = () => run('https://example.com/?a=1')
document.getElementById('pipe').onclick = () => run('https://example.com/?a=1|2')
