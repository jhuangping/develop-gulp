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

##### scroll
```
jhuangPing.scroll('.js-scroll') // 預定 class
jhuangPing.scroll(<className>) // 自訂
```

##### Click 相關設定
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

##### Fetch Lightbox
`jhuangPing.lightbox()`
###### setting
```
# pug setting
<className>.js-fetch-open(
  data-page="<FileSrc>" 
  data-type="<Type>" 
  data-class="<CustomClassName>" 
  data-youtubeId="<YoutubeCode>"
)

# description
.js-fetch-open // 開啟 Fetch Lightbox 用 class
.js-fetch-close // 關閉 Fetch Lightbox 用 class
data-page // 文件檔案來源
data-type // lightbox type [base, youtube]
data-class // 自訂 class name , 預設名稱 default
data-youtubeId // Youtube Code, `https://www.youtube.com/embed/${youtubeId}?rel=0&autoplay=1`
```
###### layout
```
# default , javascript 生成
`<article class="c-lbx ${lbxClass}" data-type="${lbxType}"></article>`

# default element
.c-lbx__ctr
.c-lbx__video
.c-lbx__mask

# default c-lbx status
.is-open // c-lbx 開啟
.is-close // c-lbx 關閉

# fetch light function
jhuangPing.lightbox({
  inti: function() {
    ...
  }
})
-------------------------------------------------
# pug layout
# pug html
<className>.js-fetch-open(
  data-page="<FileSrc>" 
  data-type="<Type>" 
  data-class="<CustomClassName>" 
  data-youtubeId="<YoutubeCode>"
)

# pug lightbox
.c-lbx__ctr.lbx
  .c-lbx__youtube
    iframe(src="<demo youtube>")
  .lbx__<className>
  ...
.c-lbx__mask.js-fetch-close
```