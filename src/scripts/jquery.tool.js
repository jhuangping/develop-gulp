// Variables ==================================================================
let $window = $(window)
let $header = $('header')
let $body = $('body')
let rwd = 992
let isMobile = $('.hd-toggle').is(':visible')

// LockScroll
function lockScroll() {
  $body.addClass('u-scroll:no fancybox-active compensate-for-scrollbar');
};
function unlockScroll() {
  $body.removeClass('u-scroll:no fancybox-active compensate-for-scrollbar');
}
function bodyLock() {
  $('body').toggleClass('u-scroll:no');
}

let jhuangPing = {

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
    let trigger_size = [575, 768, 992, 1024, 1200, 1366, 1440, 1680];
    $(window).resize(function () {
      trigger_size.forEach(function (ele) {
        if (wW > ele) {
          $(window).width() <= ele ? location.reload() : "";
        } else {
          $(window).width() > ele ? location.reload() : "";
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
      animationValue: 'fade-up'
    };

    // 合併預設值與傳入參數
    let settings = { ...defaults, ...options };

    if (!settings.element) {
      console.error('必須指定元素');
      return;
    }

    let el = $(settings.element);

    // 包裹表格
    el.find('table').wrap(settings.tableWrapper);
    // 包裹 YouTube 影片
    el.find('iframe[src*="youtube"]').wrap(settings.youtubeWrapper);

    // 增加動畫屬性
    if (settings.isAnimation) {
      el.find('> *').attr(settings.animationAttribute, settings.animationValue);
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
