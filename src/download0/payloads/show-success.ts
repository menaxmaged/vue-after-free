import { show_success } from 'download0/loader'

(function () {
  log('=== Show Success ===')
  // Check if exploit is complete before showing success
  const centerX = 960
  const logoWidth = 600
  const logoHeight = 338

  const logo = new Image({
    url: 'file:///../download0/img/logo.png',
    x: centerX - logoWidth / 2,
    y: 50,
    width: logoWidth,
    height: logoHeight
  })
  jsmaf.root.children.push(logo)
})()
