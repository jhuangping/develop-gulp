# jquery.tool.js

### Variables
```
let $window = $(window)
let $header = $('header')
let $body = $('body')
let rwd = 992
let isMobile = $('.hd-toggle').is(':visible')
```
### LockScroll
使用方式
`lockScroll()`
`unlockScroll()`
`bodyLock()`

### jhuangPing

`jhuangPing.browserIE()` // 判斷是否為IE瀏覽器

`jhuangPing.reloadPage()` // 自動重新載入頁面

Click 相關設定
```
jhuangPing.click({
  <!-- 置頂 -->
  gotop: {
    enable: true, // 是否啟用
    bk: '.back-to-top', // 滾動按鈕區域
    btn: '.js-gotop',  // 按鈕本身
  },
  <!-- 返回上一頁 -->
  back: {
    enable: true, // 是否啟用
    ele: '.js-back', // 返回按鈕的選擇器
  },
});
```

```
jhuangPing.edit({
  element: '.l-edit',
  tableWrapper: '<div class="u-scroll-x"></div>',
  youtubeWrapper: '<div class="u-yt"></div>',

  <!-- 需配合AOS.js plugin -->
  isAnimation: false,
  animationAttribute: 'data-aos',
  animationValue: 'fade-up'
});
```

`jhuangPing.menu()`