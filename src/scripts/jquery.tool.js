// Variables ==================================================================
// Variables ==================================================================
let $window = $(window);
let $header = $('header');
let $body = $('body');
let rwd = 992;
let isMobile = $('.hd-toggle').is(':visible');

// Data Storage
let store = localStorage;

// LockScroll
function lockScroll() {
  $body.addClass('u-scroll:no fancybox-active compensate-for-scrollbar');
};
function unlockScroll() {
  $body.removeClass('u-scroll:no fancybox-active compensate-for-scrollbar');
};
function bodyLock() {
  $('body').toggleClass('u-scroll:no');
};

let jhuangPing = {
  // store
  buildStore: function (options, db) {
    // set store
    let defaults = {
      key: "jhuangPingStore", // 預設儲存的 key
    };

    let defaultsDB = {};

    // 合併預設值與傳入參數
    let settings = { ...defaults, ...options };
    let dbSettings = { ...defaultsDB, ...db };

    if (store.getItem(settings.key) === null) {
      store.setItem(settings.key, JSON.stringify(dbSettings));
    }
  },
  setStore: function (key, value) {
    if (!key) {
      console.error("必須提供儲存的鍵名");
      return;
    }

    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      console.log(`已成功儲存資料到 localStorage，鍵名：${key}`);
    } catch (error) {
      console.error("儲存資料時發生錯誤：", error);
    }
  },
  getStore: function (key) {
    if (!key) {
      console.error("必須提供要取得的鍵名");
      return null;
    }

    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        console.warn(`找不到鍵名為 "${key}" 的資料`);
        return null;
      }
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error("讀取資料時發生錯誤：", error);
      return null;
    }
  },

  // Fetch Lightbox
  lightbox: function (options) {
    let defaults = {
      init: {}
    }
    // 合併預設值與傳入參數
    let settings = { ...defaults, ...options };

    let lbxSwitch = $('.js-fetch-open')

    lbxSwitch.on('click', function () {
      let thisPage = $(this).attr('data-page');
      let thisType = $(this).attr('data-type');
      let thisClass = $(this).attr('data-class');
      let thisVideoId = $(this).attr('data-videoId');
      lbx(thisPage, thisType, thisClass, thisVideoId);
    });

    function lbx(lbxPage, lbxType = 'base', lbxClass = 'default', videoId) {
      fetch(lbxPage)
        .then(res => {
          if (!res.ok) {
            throw new Error(`Network response was not ok (${res.statusText})`);
          }
          return res.text(); // 獲取 HTML 資料
        })
        .then(data => {
          $('body').append(`<article class="c-lbx ${lbxClass}" data-type="${lbxType}"></article>`).addClass('is-lbx-open');

          lockScroll();

          let injectTarget = `.c-lbx.${lbxClass}`;
          $(injectTarget).html(data);
          lbxFunction(lbxType, lbxClass, videoId);
          /*給燈箱一個 open 讓動畫作動*/
          if ($(injectTarget).length > 0) {
            setTimeout(function () {
              $(injectTarget).addClass('is-open');

            }, 500);
          }
        })
        .catch(err => console.log(`Fetch Lightbox Error : ${err}`))
    }

    function lbxFunction(type, lbxClass, videoId) {
      switch (type) {
        case 'video':
          $('.c-lbx-video iframe').attr({
            'src': `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`
          })
          lbxClose(lbxClass, 800);
          break;

        default:
          // reflash function
          settings.init();

          lbxClose(lbxClass, 800);
          break;
      }
    }

    function lbxClose(lbxClass, time) {
      let closeBtn = `.c-lbx.${lbxClass}`;
      let fetchCloseBtn = $(closeBtn).find('.js-fetch-close');

      fetchCloseBtn.on('click', function () {
        let _this = $(this);
        let targetPage = _this.closest('.c-lbx');
        targetPage.removeClass('is-open').addClass('is-close');
        $('body').removeClass('is-lbx-open');
        unlockScroll();

        setTimeout(function () {
          targetPage.remove();
        }, time);
      });
    }
  },

  tabs: function () {
    let _showTab = 0;
    let $defaultLi = $('ul.c-tab__list li').eq(_showTab).addClass('active');
    $($defaultLi.find('a').attr('href')).siblings().hide();

    // 當 li 頁籤被點擊時...
    // 若要改成滑鼠移到 li 頁籤就切換時, 把 click 改成 mouseover
    $('ul.c-tab__list li').click(function () {
      // 找出 li 中的超連結 href(#id)
      let $this = $(this),
        _clickTab = $this.find('a').attr('href');
      // 把目前點擊到的 li 頁籤加上 .active
      // 並把兄弟元素中有 .active 的都移除 class
      $this.addClass('active').siblings('.active').removeClass('active');
      // 淡入相對應的內容並隱藏兄弟元素
      $(_clickTab).stop(false, true).fadeIn().siblings().hide();

      return false;
    }).find('a').focus(function () {
      this.blur();
    });
  },

  device: function (threshold = 1200) {
    const state = {
      isMobile: /android|blackberry|iphone|ipad|ipod|opera mini|iemobile/i.test(
        navigator.userAgent.toLowerCase()
      ),
      isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      windowSize: {
        width: window.innerWidth,
        height: window.innerHeight,
        isSmall: window.innerWidth <= threshold,
      },
    };

    const updateWindowSize = () => {
      state.windowSize = {
        width: window.innerWidth,
        height: window.innerHeight,
        isSmall: window.innerWidth <= threshold,
      };
    };

    window.addEventListener('resize', updateWindowSize);

    // 清理監聽器的函數
    const cleanup = () => {
      window.removeEventListener('resize', updateWindowSize);
    }

    return { state, cleanup };
  },

  browserIE: function () {
    let browser = navigator.userAgent;
    let browserVerify = browser.toLowerCase().match(/rv:([\d.]+)\) like gecko/);
    let bie = browserVerify;
    // console.log('ans: ' + bie);

    if (bie != null) {
      $('body').addClass('is-ie11');
    }

    return bie;
  },

  reloadPage: function () {
    //因架構變化，resize trigger reload
    let wW = $(window).width();
    let trigger_size = [575, 768, 992, 1024, 1200, 1366, 1440, 1680]
    $(window).resize(function () {
      trigger_size.forEach(function (ele) {
        if (wW > ele) {
          $(window).width() <= ele ? location.reload() : ""
        } else {
          $(window).width() > ele ? location.reload() : ""
        }
      });
    });
  },

  click: function (options) {
    const { gotop, back } = options;

    // 返回頂部功能
    if (gotop && gotop.enable) {
      const { bk, btn } = gotop;
      $(window).scroll(function () {
        let threshold = $(document).height() - $(window).height() - $('footer').height();

        if ($(window).scrollTop() > 0) {
          $(bk).addClass('is-show');

          if ($(window).scrollTop() >= threshold) {
            $(bk).removeClass('is-move');
          } else {
            $(bk).addClass('is-move');
          }
        } else {
          $(bk).removeClass('is-show');
        }
      });

      $(bk).find(btn).click(function () {
        $('html, body').animate({
          scrollTop: 0
        }, 500, 'swing');
      });
    }

    // 返回上一頁功能
    if (back && back.enable) {
      const { ele } = back;
      $(ele).click(function () {
        history.back();
      });
    }
  },

  edit: function (options) {
    let defaults = {
      element: null,
      tableWrapper: '<div class="u-scroll-x"></div>',
      youtubeWrapper: '<div class="u-yt"></div>',
      isAnimation: false,
      animationAttribute: 'data-aos',
      animationValue: 'fade-up',
      animationEasing: 'ease',
    };

    // 合併預設值與傳入參數
    let settings = { ...defaults, ...options };

    if (!settings.element) {
      console.error('必須指定元素')
      return;
    };

    let el = $(settings.element);

    // 包裹表格
    el.find('table').wrap(settings.tableWrapper);
    // 包裹 YouTube 影片
    el.find('iframe[src*="youtube"]').wrap(settings.youtubeWrapper);

    // 增加動畫屬性
    if (settings.isAnimation) {
      el.find('> *').attr(settings.animationAttribute, settings.animationValue).attr('data-aos-easing', settings.animationEasing);
    }
  },

  menu: function () {
    let hd = $('.hd'),
      menuBtn = $('.hd-toggle'),
      menuCtr = $('.menu-block'),
      menuBuildMask = $('<div class="is-mask"></div>'),
      dropdownItem = $('.menu__item'),
      dropdownList = $('.dropdown'),
      dropdownBuildBtn = $('<div class="dropdown-toggle"></div>');

    let menu = {
      // 漢堡菜單點擊功能
      click: function () {
        let btn = menuBtn,
          ctr = menuCtr,
          mask = menuBuildMask;

        mask.appendTo(hd);

        function hamburgerToggle() {
          ctr.toggleClass('is-show');
          btn.toggleClass('is-active');
          $('.hd').toggleClass('is-menuOpen');
          bodyLock();

          // 關閉其他元素
          $('.mobile-lang-list').removeClass('is-open');
          $('.menu-search').removeClass('is-open');
        }

        btn.click(function () {
          hamburgerToggle();
        });
        hd.find('.is-mask').click(function () {
          hamburgerToggle();
        });
        $('.js-menu-close').click(function () {
          hamburgerToggle();
        });
        $('.menu_link').click(function () {
          ctr.removeClass('is-show');
          btn.removeClass('is-active');
          $('.hd').removeClass('is-menuOpen');
          $('body').removeClass('u-scroll:no');
        });
      },

      // 滾動行為控制
      move: function () {
        let init = $(window).scrollTop();

        if (init != 0) {
          $('.hd, .hd-bg').removeClass('is-top').addClass('is-move');
          $('.job-side').removeClass('is-top').addClass('is-move');
        } else {
          $('.hd, .hd-bg').addClass('is-top');
          $('.job-side').addClass('is-top');
        }

        let lastScrollTop = 0;
        $(window).scroll(function () {
          if ($(window).scrollTop() > 0) {
            $('.hd, .hd-bg').removeClass('is-top').addClass('is-move');
            $('.job-side').removeClass('is-top').addClass('is-move');
          } else {
            $('.hd, .hd-bg').addClass('is-top').removeClass('is-move');
            $('.job-side').addClass('is-top').removeClass('is-move');
          }

          let sticky = $('.hd');
          let scroll = $(window).scrollTop();

          if (scroll >= 10 && scroll < lastScrollTop) {
            sticky.addClass('is-fadein');
          } else {
            sticky.removeClass('is-fadein');
          }

          lastScrollTop = scroll;
        });
      },

      // 下拉菜單
      dropdown: function () {
        let item = dropdownItem,
          list = dropdownList,
          btn = dropdownBuildBtn;

        // 添加下拉菜單樣式
        list.parent(item).addClass('is-dropdown');

        // 建立切換按鈕
        list.before(btn);

        $('.dropdown-toggle').click(function () {
          $(this).next('.dropdown').stop().slideToggle(800);
          $(this).toggleClass('is-active');
        });
      },

      // 其他功能
      other: function () {
        // 語言切換
        (function langChange() {
          if (isMobile) {
            let langList = $('.language-list').clone();
            langList.appendTo('.hd-nav__main');
            $('.hd-nav__main .language-list').addClass('mobile-lang-list');

            $('.js-mobile-lange').click(function () {
              $('.mobile-lang-list').toggleClass('is-open');
            });
          }
        })();

        // 搜索欄位移動
        (function menuSearchMove() {
          if (isMobile) {
            $('.menu-search').appendTo('.hd');

            $('.js-search-open').click(function () {
              $('.menu-search').toggleClass('is-open');
            });

            $('.menu-search').click(function () {
              $(this).removeClass('is-open');
            });
          }
        })();
      },

      // 初始化設置
      setting: function () {
        this.click();
        this.move();
        this.dropdown();
        this.other();
      }
    };

    menu.setting();

    // 搜索功能
    function search() {
      let btn = $('.hd-search_toggle'),
        bk = $('.hd-search'),
        inpt = bk.find('.hd-search_input'),
        _send = $('.hd-search_btn');

      btn.click(function () {
        bk.toggleClass('is-show');
        $('.hd').toggleClass('is-search-open');
      });
      if ($('.hd-toggle').is(':visible')) {
        inpt.attr('placeholder', '');
      }
      inpt.change(function () {
        let ctr = $(this).val();
        console.log(ctr);
        if (ctr !== '') {
          _send.addClass('is-show');
        }
      });
    }

    // 語言切換
    (function language() {
      $('.language-toggle').click(function () {
        $(this).next('.language-list').stop().slideToggle(500).end().toggleClass('is-active');
      });
    })();
  }
};
