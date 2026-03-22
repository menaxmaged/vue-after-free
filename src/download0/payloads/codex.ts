import { libc_addr } from 'download0/userland'
import { utils, BigInt, mem } from 'download0/types'

(function () {
  log('=== CodeX Intro Loader ===')

  // التأكد من تحميل الـ common libraries
  if (typeof libc_addr === 'undefined') {
    include('userland.js')
  }

  // ===== CONFIGURATION =====
  const IMAGE_URL = 'file:///../download0/img/logo.png' // المسار الفيزيائي للصورة
  const BG_COLOR = 'rgb(10, 10, 30)' // لون الخلفية (نفس لون تصميمك)
  const TEXT_COLOR = 'white'
  const TEXT_SIZE = 32
  const BAR_COLOR = 'rgb(50, 200, 150)' // لون الـ Progress Bar الأخضر
  // =========================

  // 1. تنظيف الشاشة (Clear Stage)
  jsmaf.root.children.length = 0

  // 2. إنشاء الخلفية (Background)
  new Style({
    name: 'bg_style',
    color: BG_COLOR
  });

  const bg = new jsmaf.Rectangle({
    x: 0,
    y: 0,
    width: 1920,
    height: 1080,
    style: 'bg_style',
    visible: true
  });
  jsmaf.root.children.push(bg)

  // 3. عرض لوجو CodeX
  const logoWidth = 600;
  const logoHeight = 338; // مساحة اللوجو بتاعك (16:9)

  const logo = new Image({
    url: IMAGE_URL,
    x: 960 - logoWidth / 2, // في النص أفقياً
    y: 300,                  // المسافة من فوق
    width: logoWidth,
    height: logoHeight,
    visible: true
  });
  jsmaf.root.children.push(logo)

  // 4. إضافة النص (CodeX Technologies)
  new Style({
    name: 'text_style',
    color: TEXT_COLOR,
    size: TEXT_SIZE
  });

  const titleText = new jsmaf.Text();
  titleText.text = 'CodeX Technologies';
  titleText.x = 960 - 150; // في النص تقريباً
  titleText.y = 700;
  titleText.style = 'text_style';
  jsmaf.root.children.push(titleText);

  const subText = new jsmaf.Text();
  subText.text = 'We\'re not offline. We\'re reinventing.';
  subText.x = 960 - 250; 
  subText.y = 750;
  subText.style = 'text_style';
  subText.size = 24; // أصغر شوية
  jsmaf.root.children.push(subText);

  // 5. إنشاء الـ Progress Bar (تحميل وهمي للشياكة)
  const barWidth = 800;
  const barHeight = 20;

  // الخلفية الرمادية للـ Bar
  new Style({ name: 'bar_bg_style', color: 'rgb(50, 50, 50)' });
  const barBg = new jsmaf.Rectangle({
    x: 960 - barWidth / 2,
    y: 850,
    width: barWidth,
    height: barHeight,
    style: 'bar_bg_style',
    visible: true
  });
  jsmaf.root.children.push(barBg)

  // الـ Bar الأخضر الفعلي
  new Style({ name: 'bar_fg_style', color: BAR_COLOR });
  const barFg = new jsmaf.Rectangle({
    x: 960 - barWidth / 2,
    y: 850,
    width: 0, // هيبدأ من صفر
    height: barHeight,
    style: 'bar_fg_style',
    visible: true
  });
  jsmaf.root.children.push(barFg)

  // 6. منطق الـ Animation (تحريك الـ Bar)
  let progress = 0;
  const start_time = Date.now();
  const duration = 2000; // مدة التحميل (2 ثانية)

  jsmaf.onEnterFrame = function () {
    const elapsed = Date.now() - start_time;
    progress = Math.min(elapsed / duration, 1.0); // نسبة مئوية من 0 لـ 1

    // تحديث عرض الـ Bar
    barFg.width = Math.floor(barWidth * progress);

    // لما يخلص تحميل
    if (progress === 1.0) {
      log('Intro finished. Launching menu...');
      jsmaf.onEnterFrame = null; // وقف الـ animation

      // الرجوع للمنيو الأساسية (أو تشغيل الـ Exploit الحقيقي هنا)
      jsmaf.setTimeout(function () {
        const theme = (typeof CONFIG !== 'undefined' && CONFIG.theme) ? CONFIG.theme : 'default';
        include('themes/' + theme + '/main.js');
      }, 500); // تأخير بسيط للشياكة
    }
  }

  log('Intro ready and running.');
})()