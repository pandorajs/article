define(function(require, exports, module) {

  'use strict';

  var $ = require('$'),
    Widget = require('widget'),
    Tips = require('tips');

  var Article = Widget.extend({

    defaults: {
      container: null,
      delegates: {
        'click [data-role=set-fontsize] > a': function(e) {
          this.setFontSize(e.currentTarget);
        },
        'click [data-role=add-bookmark]': function(e) {
          e.preventDefault();
          if (window.external && window.external.addFavorite) {
            window.external.addFavorite(window.location.href, window.title);
          }else{
            this.showTips('请按Ctrl+D将本页添加到收藏夹');
          }
        }
      },
      element: '.article'
    },

    setup: function() {
      this.render();

      this.initPagination();
    },

    setFontSize: function(item) {
      var fontSize = item.title;

      if ($(item).hasClass('current')) {
        return;
      }

      if (!this.fontSizeTarget) {
        this.fontSizeTarget = this.element;
      }

      $(item).addClass('current')
          .siblings('.current').removeClass('current');

      this.fontSizeTarget.css({
        'font-size': fontSize + 'px'/*,
        'line-height': Math.ceil(fontSize * 1.8) + 'px'*/
      });
    },

    initPagination: function() {
      this.pageSwitcher = this.$('.mod-page-switcher');
      this.pageSwitcher.before('<div class="mod-page-switcher-tip">(支持键盘 &larr; 和 &rarr; 分页)</div>');

      // 添加面包屑
      this.pageSwitcher.find('a[href]').each(function() {
        this.href += '#breadcrumb';
      });

      this.initDelegates({
        'keyup': function(e) {
          var href;
          switch (e.keyCode) {
            case 37:
              href = this.$('.page-current').prev().prop('href');
              if (typeof href !== 'undefined') {
                window.location = href;
              } else {
                this.showTips('当前已经是第一页');
              }
              break;
            case 39:
              href = this.$('.page-current').next().prop('href');
              if (typeof href !== 'undefined') {
                window.location = href;
              } else {
                this.showTips('当前已经是最后一页');
              }
              break;
          }
        }
      }, this.document);
    },

    showTips: function(info) {
      new Tips({
        content: info,
        importStyle: true
      });
    }

  });

  module.exports = Article;

});
