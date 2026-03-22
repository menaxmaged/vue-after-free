// CodeX Technologies - Professional System Updater
// Developer: Mena Maged (CodeX Founder)
// Version: 2.0.0 (Status 0 Protected)

import { utils } from 'download0/types'

(function () {
  // 1. التعديل الذكي للـ URL (هنجرب HTTP أولاً للهرب من SSL Fail)
  var BASE_URL = 'http://psvue.menaxmaged.me/download0/'
  var MANIFEST_URL = BASE_URL + 'manifest.txt'
  
  var ALLOWED_EXT = ['.js', '.aes', '.json', '.png', '.jpg'] // ضفنا الصور عشان اللوجو يتحدث
  var EXCLUDE = ['config.js']

  var FILES: string[] = []
  var updated = 0, failed = 0, index = 0

  // UI Colors (CodeX Theme: Deep Blue & Emerald Green)
  var COLOR_PRIMARY = 'rgb(50, 200, 150)' // الأخضر الـ CodeX
  var COLOR_BG = 'rgb(15, 15, 35)'        // الكحلي الغامق

  // UI Elements
  var progressFg: jsmaf.Rectangle 
  var statusText: jsmaf.Text
  var countText: jsmaf.Text
  
  var barW = 1000, barH = 15, barX = 960 - 500, barY = 600

  function initUI () {
    jsmaf.root.children.length = 0

    // Styles
    new Style({ name: 'codex_title', color: 'white', size: 45, weight: 'bold' })
    new Style({ name: 'codex_sub', color: COLOR_PRIMARY, size: 22 })
    new Style({ name: 'codex_status', color: 'rgb(200, 200, 200)', size: 20 })

    // Background Rectangle (أضمن من الصورة في حالة الشاشة السوداء)
    new Style({ name: 'bg_style', color: COLOR_BG })
    var bg = new jsmaf.Rectangle({ x: 0, y: 0, width: 1920, height: 1080, style: 'bg_style' })
    jsmaf.root.children.push(bg)

    // CodeX Logo (Absolute Path)
    var logo = new Image({
      url: 'file:///user/download/CUSA00960/img/logo.png',
      x: 960 - 200, y: 150, width: 400, height: 225
    })
    jsmaf.root.children.push(logo)

    var title = new jsmaf.Text()
    title.text = 'CODEX SYSTEM UPDATE'
    title.x = 960 - 230; title.y = 450; title.style = 'codex_title'
    jsmaf.root.children.push(title)

    var sub = new jsmaf.Text()
    sub.text = 'Reinventing the Console Experience'
    sub.x = 960 - 180; sub.y = 500; sub.style = 'codex_sub'
    jsmaf.root.children.push(sub)

    // Progress Bar Background
    new Style({ name: 'bar_bg', color: 'rgb(40, 40, 60)' })
    var pBg = new jsmaf.Rectangle({ x: barX, y: barY, width: barW, height: barH, style: 'bar_bg' })
    jsmaf.root.children.push(pBg)

    // Progress Bar Foreground (Rectangle أسرع وأخف من الـ Image)
    new Style({ name: 'bar_fg', color: COLOR_PRIMARY })
    progressFg = new jsmaf.Rectangle({ x: barX, y: barY, width: 0, height: barH, style: 'bar_fg' })
    jsmaf.root.children.push(progressFg)

    statusText = new jsmaf.Text()
    statusText.text = 'Initializing secure connection...'
    statusText.x = barX; statusText.y = barY + 50; statusText.style = 'codex_status'
    jsmaf.root.children.push(statusText)

    countText = new jsmaf.Text()
    countText.text = 'Waiting for manifest...'; 
    countText.x = barX + barW - 200; countText.y = barY - 20; countText.style = 'codex_status'
    jsmaf.root.children.push(countText)
  }

  function fetchManifest () {
    var xhr = new jsmaf.XMLHttpRequest()
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if ((xhr.status === 200 || xhr.status === 0) && xhr.responseText) {
          var lines = xhr.responseText.split('\n')
          for (var i = 0; i < lines.length; i++) {
            var line = lines[i]!.trim()
            if (line) FILES.push(line)
          }
          statusText.text = 'Manifest received. Syncing ' + FILES.length + ' modules...';
          jsmaf.setTimeout(processNext, 500)
        } else {
          // حل الـ Status 0 الذكي: لو فشل بـ HTTPS جرب HTTP أوتوماتيك
          if (xhr.status === 0 && MANIFEST_URL.indexOf('https') === 0) {
            statusText.text = 'SSL Handshake Failed. Retrying over HTTP...';
            MANIFEST_URL = MANIFEST_URL.replace('https', 'http');
            jsmaf.setTimeout(fetchManifest, 1000);
          } else {
            statusText.text = 'ERROR: Source unreachable (Status: ' + xhr.status + ')';
            log('Update Failed | URL: ' + MANIFEST_URL);
          }
        }
      }
    }
    xhr.open('GET', MANIFEST_URL, true)
    xhr.send()
  }

  function processNext () {
    if (index >= FILES.length) {
      finishUpdate();
      return;
    }

    var filename = FILES[index]!
    statusText.text = 'Downloading: ' + filename;
    
    // Update Progress
    var pct = index / FILES.length;
    progressFg.width = Math.floor(barW * pct);
    countText.text = (index + 1) + ' / ' + FILES.length;

    var xhr = new jsmaf.XMLHttpRequest()
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if ((xhr.status === 200 || xhr.status === 0) && xhr.responseText) {
          saveFile(filename, xhr.responseText);
        } else {
          failed++;
          index++;
          jsmaf.setTimeout(processNext, 10);
        }
      }
    }
    xhr.open('GET', BASE_URL + filename, true)
    xhr.send()
  }

  function saveFile (name: string, data: string) {
    var xhr = new jsmaf.XMLHttpRequest()
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 0) updated++;
        else failed++;
        index++;
        jsmaf.setTimeout(processNext, 10);
      }
    }
    xhr.open('POST', 'file://../download0/' + name, true)
    xhr.send(data)
  }

  function finishUpdate () {
    progressFg.width = barW;
    statusText.text = 'System Updated Successfully. ' + updated + ' modules synched.';
    countText.text = 'DONE';
    utils.notify('CodeX Update Complete! \xF0\x9F\x9A\x80');

    var btn = jsmaf.circleIsAdvanceButton ? 'O' : 'X';
    var restartMsg = new jsmaf.Text();
    restartMsg.text = 'Press ' + btn + ' to Reboot CodeX Environment';
    restartMsg.x = 960 - 200; restartMsg.y = barY + 120; restartMsg.style = 'codex_sub';
    jsmaf.root.children.push(restartMsg);

    jsmaf.onKeyDown = function (code) {
      var confirm = jsmaf.circleIsAdvanceButton ? 13 : 14;
      if (code === confirm) debugging.restart();
    }
  }

  initUI()
  fetchManifest()
})()