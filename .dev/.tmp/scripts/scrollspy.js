import Util from './util'


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): scrollspy.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const ScrollSpy = (($) => {


  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME               = 'scrollspy'
  const VERSION            = '4.0.0-beta'
  const DATA_KEY           = 'bs.scrollspy'
  const EVENT_KEY          = `.${DATA_KEY}`
  const DATA_API_KEY       = '.data-api'
  const JQUERY_NO_CONFLICT = $.fn[NAME]

  const Default = {
    offset : 10,
    method : 'auto',
    target : ''
  }

  const DefaultType = {
    offset : 'number',
    method : 'string',
    target : '(string|element)'
  }

  const Event = {
    ACTIVATE      : `activate${EVENT_KEY}`,
    SCROLL        : `scroll${EVENT_KEY}`,
    LOAD_DATA_API : `load${EVENT_KEY}${DATA_API_KEY}`
  }

  const ClassName = {
    DROPDOWN_ITEM : 'dropdown-item',
    DROPDOWN_MENU : 'dropdown-menu',
    ACTIVE        : 'active'
  }

  const Selector = {
    DATA_SPY        : '[data-spy="scroll"]',
    ACTIVE          : '.active',
    NAV_LIST_GROUP  : '.nav, .list-group',
    NAV_LINKS       : '.nav-link',
    LIST_ITEMS      : '.list-group-item',
    DROPDOWN        : '.dropdown',
    DROPDOWN_ITEMS  : '.dropdown-item',
    DROPDOWN_TOGGLE : '.dropdown-toggle'
  }

  const OffsetMethod = {
    OFFSET   : 'offset',
    POSITION : 'position'
  }


  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class ScrollSpy {

    constructor(element, config) {
      this._element       = element
      this._scrollElement = element.tagName === 'BODY' ? window : element
      this._config        = this._getConfig(config)
      this._selector      = `${this._config.target} ${Selector.NAV_LINKS},`
                          + `${this._config.target} ${Selector.LIST_ITEMS},`
                          + `${this._config.target} ${Selector.DROPDOWN_ITEMS}`
      this._offsets       = []
      this._targets       = []
      this._activeTarget  = null
      this._scrollHeight  = 0

      $(this._scrollElement).on(Event.SCROLL, (event) => this._process(event))

      this.refresh()
      this._process()
    }


    // getters

    static get VERSION() {
      return VERSION
    }

    static get Default() {
      return Default
    }


    // public

    refresh() {
      const autoMethod = this._scrollElement !== this._scrollElement.window ?
        OffsetMethod.POSITION : OffsetMethod.OFFSET

      const offsetMethod = this._config.method === 'auto' ?
        autoMethod : this._config.method

      const offsetBase = offsetMethod === OffsetMethod.POSITION ?
        this._getScrollTop() : 0

      this._offsets = []
      this._targets = []

      this._scrollHeight = this._getScrollHeight()

      const targets = $.makeArray($(this._selector))

      targets
        .map((element) => {
          let target
          const targetSelector = Util.getSelectorFromElement(element)

          if (targetSelector) {
            target = $(targetSelector)[0]
          }

          if (target) {
            const targetBCR = target.getBoundingClientRect()
            if (targetBCR.width || targetBCR.height) {
              // todo (fat): remove sketch reliance on jQuery position/offset
              return [
                $(target)[offsetMethod]().top + offsetBase,
                targetSelector
              ]
            }
          }
          return null
        })
        .filter((item)  => item)
        .sort((a, b)    => a[0] - b[0])
        .forEach((item) => {
          this._offsets.push(item[0])
          this._targets.push(item[1])
        })
    }

    dispose() {
      $.removeData(this._element, DATA_KEY)
      $(this._scrollElement).off(EVENT_KEY)

      this._element       = null
      this._scrollElement = null
      this._config        = null
      this._selector      = null
      this._offsets       = null
      this._targets       = null
      this._activeTarget  = null
      this._scrollHeight  = null
    }


    // private

    _getConfig(config) {
      config = $.extend({}, Default, config)

      if (typeof config.target !== 'string') {
        let id = $(config.target).attr('id')
        if (!id) {
          id = Util.getUID(NAME)
          $(config.target).attr('id', id)
        }
        config.target = `#${id}`
      }

      Util.typeCheckConfig(NAME, config, DefaultType)

      return config
    }

    _getScrollTop() {
      return this._scrollElement === window ?
          this._scrollElement.pageYOffset : this._scrollElement.scrollTop
    }

    _getScrollHeight() {
      return this._scrollElement.scrollHeight || Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      )
    }

    _getOffsetHeight() {
      return this._scrollElement === window ?
          window.innerHeight : this._scrollElement.getBoundingClientRect().height
    }

    _process() {
      const scrollTop    = this._getScrollTop() + this._config.offset
      const scrollHeight = this._getScrollHeight()
      const maxScroll    = this._config.offset
        + scrollHeight
        - this._getOffsetHeight()

      if (this._scrollHeight !== scrollHeight) {
        this.refresh()
      }

      if (scrollTop >= maxScroll) {
        const target = this._targets[this._targets.length - 1]

        if (this._activeTarget !== target) {
          this._activate(target)
        }
        return
      }

      if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
        this._activeTarget = null
        this._clear()
        return
      }

      for (let i = this._offsets.length; i--;) {
        const isActiveTarget = this._activeTarget !== this._targets[i]
            && scrollTop >= this._offsets[i]
            && (this._offsets[i + 1] === undefined ||
                scrollTop < this._offsets[i + 1])

        if (isActiveTarget) {
          this._activate(this._targets[i])
        }
      }
    }

    _activate(target) {
      this._activeTarget = target

      this._clear()

      let queries = this._selector.split(',')
      queries     = queries.map((selector) => {
        return `${selector}[data-target="${target}"],` +
               `${selector}[href="${target}"]`
      })

      const $link = $(queries.join(','))

      if ($link.hasClass(ClassName.DROPDOWN_ITEM)) {
        $link.closest(Selector.DROPDOWN).find(Selector.DROPDOWN_TOGGLE).addClass(ClassName.ACTIVE)
        $link.addClass(ClassName.ACTIVE)
      } else {
        // Set triggered link as active
        $link.addClass(ClassName.ACTIVE)
        // Set triggered links parents as active
        // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
        $link.parents(Selector.NAV_LIST_GROUP).prev(`${Selector.NAV_LINKS}, ${Selector.LIST_ITEMS}`).addClass(ClassName.ACTIVE)
      }

      $(this._scrollElement).trigger(Event.ACTIVATE, {
        relatedTarget: target
      })
    }

    _clear() {
      $(this._selector).filter(Selector.ACTIVE).removeClass(ClassName.ACTIVE)
    }


    // static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data      = $(this).data(DATA_KEY)
        const _config = typeof config === 'object' && config

        if (!data) {
          data = new ScrollSpy(this, _config)
          $(this).data(DATA_KEY, data)
        }

        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error(`No method named "${config}"`)
          }
          data[config]()
        }
      })
    }


  }


  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(window).on(Event.LOAD_DATA_API, () => {
    const scrollSpys = $.makeArray($(Selector.DATA_SPY))

    for (let i = scrollSpys.length; i--;) {
      const $spy = $(scrollSpys[i])
      ScrollSpy._jQueryInterface.call($spy, $spy.data())
    }
  })


  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME]             = ScrollSpy._jQueryInterface
  $.fn[NAME].Constructor = ScrollSpy
  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return ScrollSpy._jQueryInterface
  }

  return ScrollSpy

})(jQuery)

export default ScrollSpy

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzY3JvbGxzcHkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFV0aWwgZnJvbSAnLi91dGlsJ1xuXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEJvb3RzdHJhcCAodjQuMC4wLWJldGEpOiBzY3JvbGxzcHkuanNcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmNvbnN0IFNjcm9sbFNweSA9ICgoJCkgPT4ge1xuXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgICAgICAgICAgICAgICA9ICdzY3JvbGxzcHknXG4gIGNvbnN0IFZFUlNJT04gICAgICAgICAgICA9ICc0LjAuMC1iZXRhJ1xuICBjb25zdCBEQVRBX0tFWSAgICAgICAgICAgPSAnYnMuc2Nyb2xsc3B5J1xuICBjb25zdCBFVkVOVF9LRVkgICAgICAgICAgPSBgLiR7REFUQV9LRVl9YFxuICBjb25zdCBEQVRBX0FQSV9LRVkgICAgICAgPSAnLmRhdGEtYXBpJ1xuICBjb25zdCBKUVVFUllfTk9fQ09ORkxJQ1QgPSAkLmZuW05BTUVdXG5cbiAgY29uc3QgRGVmYXVsdCA9IHtcbiAgICBvZmZzZXQgOiAxMCxcbiAgICBtZXRob2QgOiAnYXV0bycsXG4gICAgdGFyZ2V0IDogJydcbiAgfVxuXG4gIGNvbnN0IERlZmF1bHRUeXBlID0ge1xuICAgIG9mZnNldCA6ICdudW1iZXInLFxuICAgIG1ldGhvZCA6ICdzdHJpbmcnLFxuICAgIHRhcmdldCA6ICcoc3RyaW5nfGVsZW1lbnQpJ1xuICB9XG5cbiAgY29uc3QgRXZlbnQgPSB7XG4gICAgQUNUSVZBVEUgICAgICA6IGBhY3RpdmF0ZSR7RVZFTlRfS0VZfWAsXG4gICAgU0NST0xMICAgICAgICA6IGBzY3JvbGwke0VWRU5UX0tFWX1gLFxuICAgIExPQURfREFUQV9BUEkgOiBgbG9hZCR7RVZFTlRfS0VZfSR7REFUQV9BUElfS0VZfWBcbiAgfVxuXG4gIGNvbnN0IENsYXNzTmFtZSA9IHtcbiAgICBEUk9QRE9XTl9JVEVNIDogJ2Ryb3Bkb3duLWl0ZW0nLFxuICAgIERST1BET1dOX01FTlUgOiAnZHJvcGRvd24tbWVudScsXG4gICAgQUNUSVZFICAgICAgICA6ICdhY3RpdmUnXG4gIH1cblxuICBjb25zdCBTZWxlY3RvciA9IHtcbiAgICBEQVRBX1NQWSAgICAgICAgOiAnW2RhdGEtc3B5PVwic2Nyb2xsXCJdJyxcbiAgICBBQ1RJVkUgICAgICAgICAgOiAnLmFjdGl2ZScsXG4gICAgTkFWX0xJU1RfR1JPVVAgIDogJy5uYXYsIC5saXN0LWdyb3VwJyxcbiAgICBOQVZfTElOS1MgICAgICAgOiAnLm5hdi1saW5rJyxcbiAgICBMSVNUX0lURU1TICAgICAgOiAnLmxpc3QtZ3JvdXAtaXRlbScsXG4gICAgRFJPUERPV04gICAgICAgIDogJy5kcm9wZG93bicsXG4gICAgRFJPUERPV05fSVRFTVMgIDogJy5kcm9wZG93bi1pdGVtJyxcbiAgICBEUk9QRE9XTl9UT0dHTEUgOiAnLmRyb3Bkb3duLXRvZ2dsZSdcbiAgfVxuXG4gIGNvbnN0IE9mZnNldE1ldGhvZCA9IHtcbiAgICBPRkZTRVQgICA6ICdvZmZzZXQnLFxuICAgIFBPU0lUSU9OIDogJ3Bvc2l0aW9uJ1xuICB9XG5cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIFNjcm9sbFNweSB7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBjb25maWcpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnQgICAgICAgPSBlbGVtZW50XG4gICAgICB0aGlzLl9zY3JvbGxFbGVtZW50ID0gZWxlbWVudC50YWdOYW1lID09PSAnQk9EWScgPyB3aW5kb3cgOiBlbGVtZW50XG4gICAgICB0aGlzLl9jb25maWcgICAgICAgID0gdGhpcy5fZ2V0Q29uZmlnKGNvbmZpZylcbiAgICAgIHRoaXMuX3NlbGVjdG9yICAgICAgPSBgJHt0aGlzLl9jb25maWcudGFyZ2V0fSAke1NlbGVjdG9yLk5BVl9MSU5LU30sYFxuICAgICAgICAgICAgICAgICAgICAgICAgICArIGAke3RoaXMuX2NvbmZpZy50YXJnZXR9ICR7U2VsZWN0b3IuTElTVF9JVEVNU30sYFxuICAgICAgICAgICAgICAgICAgICAgICAgICArIGAke3RoaXMuX2NvbmZpZy50YXJnZXR9ICR7U2VsZWN0b3IuRFJPUERPV05fSVRFTVN9YFxuICAgICAgdGhpcy5fb2Zmc2V0cyAgICAgICA9IFtdXG4gICAgICB0aGlzLl90YXJnZXRzICAgICAgID0gW11cbiAgICAgIHRoaXMuX2FjdGl2ZVRhcmdldCAgPSBudWxsXG4gICAgICB0aGlzLl9zY3JvbGxIZWlnaHQgID0gMFxuXG4gICAgICAkKHRoaXMuX3Njcm9sbEVsZW1lbnQpLm9uKEV2ZW50LlNDUk9MTCwgKGV2ZW50KSA9PiB0aGlzLl9wcm9jZXNzKGV2ZW50KSlcblxuICAgICAgdGhpcy5yZWZyZXNoKClcbiAgICAgIHRoaXMuX3Byb2Nlc3MoKVxuICAgIH1cblxuXG4gICAgLy8gZ2V0dGVyc1xuXG4gICAgc3RhdGljIGdldCBWRVJTSU9OKCkge1xuICAgICAgcmV0dXJuIFZFUlNJT05cbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IERlZmF1bHQoKSB7XG4gICAgICByZXR1cm4gRGVmYXVsdFxuICAgIH1cblxuXG4gICAgLy8gcHVibGljXG5cbiAgICByZWZyZXNoKCkge1xuICAgICAgY29uc3QgYXV0b01ldGhvZCA9IHRoaXMuX3Njcm9sbEVsZW1lbnQgIT09IHRoaXMuX3Njcm9sbEVsZW1lbnQud2luZG93ID9cbiAgICAgICAgT2Zmc2V0TWV0aG9kLlBPU0lUSU9OIDogT2Zmc2V0TWV0aG9kLk9GRlNFVFxuXG4gICAgICBjb25zdCBvZmZzZXRNZXRob2QgPSB0aGlzLl9jb25maWcubWV0aG9kID09PSAnYXV0bycgP1xuICAgICAgICBhdXRvTWV0aG9kIDogdGhpcy5fY29uZmlnLm1ldGhvZFxuXG4gICAgICBjb25zdCBvZmZzZXRCYXNlID0gb2Zmc2V0TWV0aG9kID09PSBPZmZzZXRNZXRob2QuUE9TSVRJT04gP1xuICAgICAgICB0aGlzLl9nZXRTY3JvbGxUb3AoKSA6IDBcblxuICAgICAgdGhpcy5fb2Zmc2V0cyA9IFtdXG4gICAgICB0aGlzLl90YXJnZXRzID0gW11cblxuICAgICAgdGhpcy5fc2Nyb2xsSGVpZ2h0ID0gdGhpcy5fZ2V0U2Nyb2xsSGVpZ2h0KClcblxuICAgICAgY29uc3QgdGFyZ2V0cyA9ICQubWFrZUFycmF5KCQodGhpcy5fc2VsZWN0b3IpKVxuXG4gICAgICB0YXJnZXRzXG4gICAgICAgIC5tYXAoKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICBsZXQgdGFyZ2V0XG4gICAgICAgICAgY29uc3QgdGFyZ2V0U2VsZWN0b3IgPSBVdGlsLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZWxlbWVudClcblxuICAgICAgICAgIGlmICh0YXJnZXRTZWxlY3Rvcikge1xuICAgICAgICAgICAgdGFyZ2V0ID0gJCh0YXJnZXRTZWxlY3RvcilbMF1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRCQ1IgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgICAgIGlmICh0YXJnZXRCQ1Iud2lkdGggfHwgdGFyZ2V0QkNSLmhlaWdodCkge1xuICAgICAgICAgICAgICAvLyB0b2RvIChmYXQpOiByZW1vdmUgc2tldGNoIHJlbGlhbmNlIG9uIGpRdWVyeSBwb3NpdGlvbi9vZmZzZXRcbiAgICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICAkKHRhcmdldClbb2Zmc2V0TWV0aG9kXSgpLnRvcCArIG9mZnNldEJhc2UsXG4gICAgICAgICAgICAgICAgdGFyZ2V0U2VsZWN0b3JcbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9KVxuICAgICAgICAuZmlsdGVyKChpdGVtKSAgPT4gaXRlbSlcbiAgICAgICAgLnNvcnQoKGEsIGIpICAgID0+IGFbMF0gLSBiWzBdKVxuICAgICAgICAuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgIHRoaXMuX29mZnNldHMucHVzaChpdGVtWzBdKVxuICAgICAgICAgIHRoaXMuX3RhcmdldHMucHVzaChpdGVtWzFdKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGRpc3Bvc2UoKSB7XG4gICAgICAkLnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCwgREFUQV9LRVkpXG4gICAgICAkKHRoaXMuX3Njcm9sbEVsZW1lbnQpLm9mZihFVkVOVF9LRVkpXG5cbiAgICAgIHRoaXMuX2VsZW1lbnQgICAgICAgPSBudWxsXG4gICAgICB0aGlzLl9zY3JvbGxFbGVtZW50ID0gbnVsbFxuICAgICAgdGhpcy5fY29uZmlnICAgICAgICA9IG51bGxcbiAgICAgIHRoaXMuX3NlbGVjdG9yICAgICAgPSBudWxsXG4gICAgICB0aGlzLl9vZmZzZXRzICAgICAgID0gbnVsbFxuICAgICAgdGhpcy5fdGFyZ2V0cyAgICAgICA9IG51bGxcbiAgICAgIHRoaXMuX2FjdGl2ZVRhcmdldCAgPSBudWxsXG4gICAgICB0aGlzLl9zY3JvbGxIZWlnaHQgID0gbnVsbFxuICAgIH1cblxuXG4gICAgLy8gcHJpdmF0ZVxuXG4gICAgX2dldENvbmZpZyhjb25maWcpIHtcbiAgICAgIGNvbmZpZyA9ICQuZXh0ZW5kKHt9LCBEZWZhdWx0LCBjb25maWcpXG5cbiAgICAgIGlmICh0eXBlb2YgY29uZmlnLnRhcmdldCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgbGV0IGlkID0gJChjb25maWcudGFyZ2V0KS5hdHRyKCdpZCcpXG4gICAgICAgIGlmICghaWQpIHtcbiAgICAgICAgICBpZCA9IFV0aWwuZ2V0VUlEKE5BTUUpXG4gICAgICAgICAgJChjb25maWcudGFyZ2V0KS5hdHRyKCdpZCcsIGlkKVxuICAgICAgICB9XG4gICAgICAgIGNvbmZpZy50YXJnZXQgPSBgIyR7aWR9YFxuICAgICAgfVxuXG4gICAgICBVdGlsLnR5cGVDaGVja0NvbmZpZyhOQU1FLCBjb25maWcsIERlZmF1bHRUeXBlKVxuXG4gICAgICByZXR1cm4gY29uZmlnXG4gICAgfVxuXG4gICAgX2dldFNjcm9sbFRvcCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxFbGVtZW50ID09PSB3aW5kb3cgP1xuICAgICAgICAgIHRoaXMuX3Njcm9sbEVsZW1lbnQucGFnZVlPZmZzZXQgOiB0aGlzLl9zY3JvbGxFbGVtZW50LnNjcm9sbFRvcFxuICAgIH1cblxuICAgIF9nZXRTY3JvbGxIZWlnaHQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsRWxlbWVudC5zY3JvbGxIZWlnaHQgfHwgTWF0aC5tYXgoXG4gICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsSGVpZ2h0LFxuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsSGVpZ2h0XG4gICAgICApXG4gICAgfVxuXG4gICAgX2dldE9mZnNldEhlaWdodCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxFbGVtZW50ID09PSB3aW5kb3cgP1xuICAgICAgICAgIHdpbmRvdy5pbm5lckhlaWdodCA6IHRoaXMuX3Njcm9sbEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0XG4gICAgfVxuXG4gICAgX3Byb2Nlc3MoKSB7XG4gICAgICBjb25zdCBzY3JvbGxUb3AgICAgPSB0aGlzLl9nZXRTY3JvbGxUb3AoKSArIHRoaXMuX2NvbmZpZy5vZmZzZXRcbiAgICAgIGNvbnN0IHNjcm9sbEhlaWdodCA9IHRoaXMuX2dldFNjcm9sbEhlaWdodCgpXG4gICAgICBjb25zdCBtYXhTY3JvbGwgICAgPSB0aGlzLl9jb25maWcub2Zmc2V0XG4gICAgICAgICsgc2Nyb2xsSGVpZ2h0XG4gICAgICAgIC0gdGhpcy5fZ2V0T2Zmc2V0SGVpZ2h0KClcblxuICAgICAgaWYgKHRoaXMuX3Njcm9sbEhlaWdodCAhPT0gc2Nyb2xsSGVpZ2h0KSB7XG4gICAgICAgIHRoaXMucmVmcmVzaCgpXG4gICAgICB9XG5cbiAgICAgIGlmIChzY3JvbGxUb3AgPj0gbWF4U2Nyb2xsKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuX3RhcmdldHNbdGhpcy5fdGFyZ2V0cy5sZW5ndGggLSAxXVxuXG4gICAgICAgIGlmICh0aGlzLl9hY3RpdmVUYXJnZXQgIT09IHRhcmdldCkge1xuICAgICAgICAgIHRoaXMuX2FjdGl2YXRlKHRhcmdldClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2FjdGl2ZVRhcmdldCAmJiBzY3JvbGxUb3AgPCB0aGlzLl9vZmZzZXRzWzBdICYmIHRoaXMuX29mZnNldHNbMF0gPiAwKSB7XG4gICAgICAgIHRoaXMuX2FjdGl2ZVRhcmdldCA9IG51bGxcbiAgICAgICAgdGhpcy5fY2xlYXIoKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX29mZnNldHMubGVuZ3RoOyBpLS07KSB7XG4gICAgICAgIGNvbnN0IGlzQWN0aXZlVGFyZ2V0ID0gdGhpcy5fYWN0aXZlVGFyZ2V0ICE9PSB0aGlzLl90YXJnZXRzW2ldXG4gICAgICAgICAgICAmJiBzY3JvbGxUb3AgPj0gdGhpcy5fb2Zmc2V0c1tpXVxuICAgICAgICAgICAgJiYgKHRoaXMuX29mZnNldHNbaSArIDFdID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3AgPCB0aGlzLl9vZmZzZXRzW2kgKyAxXSlcblxuICAgICAgICBpZiAoaXNBY3RpdmVUYXJnZXQpIHtcbiAgICAgICAgICB0aGlzLl9hY3RpdmF0ZSh0aGlzLl90YXJnZXRzW2ldKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2FjdGl2YXRlKHRhcmdldCkge1xuICAgICAgdGhpcy5fYWN0aXZlVGFyZ2V0ID0gdGFyZ2V0XG5cbiAgICAgIHRoaXMuX2NsZWFyKClcblxuICAgICAgbGV0IHF1ZXJpZXMgPSB0aGlzLl9zZWxlY3Rvci5zcGxpdCgnLCcpXG4gICAgICBxdWVyaWVzICAgICA9IHF1ZXJpZXMubWFwKChzZWxlY3RvcikgPT4ge1xuICAgICAgICByZXR1cm4gYCR7c2VsZWN0b3J9W2RhdGEtdGFyZ2V0PVwiJHt0YXJnZXR9XCJdLGAgK1xuICAgICAgICAgICAgICAgYCR7c2VsZWN0b3J9W2hyZWY9XCIke3RhcmdldH1cIl1gXG4gICAgICB9KVxuXG4gICAgICBjb25zdCAkbGluayA9ICQocXVlcmllcy5qb2luKCcsJykpXG5cbiAgICAgIGlmICgkbGluay5oYXNDbGFzcyhDbGFzc05hbWUuRFJPUERPV05fSVRFTSkpIHtcbiAgICAgICAgJGxpbmsuY2xvc2VzdChTZWxlY3Rvci5EUk9QRE9XTikuZmluZChTZWxlY3Rvci5EUk9QRE9XTl9UT0dHTEUpLmFkZENsYXNzKENsYXNzTmFtZS5BQ1RJVkUpXG4gICAgICAgICRsaW5rLmFkZENsYXNzKENsYXNzTmFtZS5BQ1RJVkUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBTZXQgdHJpZ2dlcmVkIGxpbmsgYXMgYWN0aXZlXG4gICAgICAgICRsaW5rLmFkZENsYXNzKENsYXNzTmFtZS5BQ1RJVkUpXG4gICAgICAgIC8vIFNldCB0cmlnZ2VyZWQgbGlua3MgcGFyZW50cyBhcyBhY3RpdmVcbiAgICAgICAgLy8gV2l0aCBib3RoIDx1bD4gYW5kIDxuYXY+IG1hcmt1cCBhIHBhcmVudCBpcyB0aGUgcHJldmlvdXMgc2libGluZyBvZiBhbnkgbmF2IGFuY2VzdG9yXG4gICAgICAgICRsaW5rLnBhcmVudHMoU2VsZWN0b3IuTkFWX0xJU1RfR1JPVVApLnByZXYoYCR7U2VsZWN0b3IuTkFWX0xJTktTfSwgJHtTZWxlY3Rvci5MSVNUX0lURU1TfWApLmFkZENsYXNzKENsYXNzTmFtZS5BQ1RJVkUpXG4gICAgICB9XG5cbiAgICAgICQodGhpcy5fc2Nyb2xsRWxlbWVudCkudHJpZ2dlcihFdmVudC5BQ1RJVkFURSwge1xuICAgICAgICByZWxhdGVkVGFyZ2V0OiB0YXJnZXRcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX2NsZWFyKCkge1xuICAgICAgJCh0aGlzLl9zZWxlY3RvcikuZmlsdGVyKFNlbGVjdG9yLkFDVElWRSkucmVtb3ZlQ2xhc3MoQ2xhc3NOYW1lLkFDVElWRSlcbiAgICB9XG5cblxuICAgIC8vIHN0YXRpY1xuXG4gICAgc3RhdGljIF9qUXVlcnlJbnRlcmZhY2UoY29uZmlnKSB7XG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IGRhdGEgICAgICA9ICQodGhpcykuZGF0YShEQVRBX0tFWSlcbiAgICAgICAgY29uc3QgX2NvbmZpZyA9IHR5cGVvZiBjb25maWcgPT09ICdvYmplY3QnICYmIGNvbmZpZ1xuXG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgIGRhdGEgPSBuZXcgU2Nyb2xsU3B5KHRoaXMsIF9jb25maWcpXG4gICAgICAgICAgJCh0aGlzKS5kYXRhKERBVEFfS0VZLCBkYXRhKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgaWYgKGRhdGFbY29uZmlnXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIG1ldGhvZCBuYW1lZCBcIiR7Y29uZmlnfVwiYClcbiAgICAgICAgICB9XG4gICAgICAgICAgZGF0YVtjb25maWddKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cblxuICB9XG5cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIERhdGEgQXBpIGltcGxlbWVudGF0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICAkKHdpbmRvdykub24oRXZlbnQuTE9BRF9EQVRBX0FQSSwgKCkgPT4ge1xuICAgIGNvbnN0IHNjcm9sbFNweXMgPSAkLm1ha2VBcnJheSgkKFNlbGVjdG9yLkRBVEFfU1BZKSlcblxuICAgIGZvciAobGV0IGkgPSBzY3JvbGxTcHlzLmxlbmd0aDsgaS0tOykge1xuICAgICAgY29uc3QgJHNweSA9ICQoc2Nyb2xsU3B5c1tpXSlcbiAgICAgIFNjcm9sbFNweS5falF1ZXJ5SW50ZXJmYWNlLmNhbGwoJHNweSwgJHNweS5kYXRhKCkpXG4gICAgfVxuICB9KVxuXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBqUXVlcnlcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gICQuZm5bTkFNRV0gICAgICAgICAgICAgPSBTY3JvbGxTcHkuX2pRdWVyeUludGVyZmFjZVxuICAkLmZuW05BTUVdLkNvbnN0cnVjdG9yID0gU2Nyb2xsU3B5XG4gICQuZm5bTkFNRV0ubm9Db25mbGljdCAgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbltOQU1FXSA9IEpRVUVSWV9OT19DT05GTElDVFxuICAgIHJldHVybiBTY3JvbGxTcHkuX2pRdWVyeUludGVyZmFjZVxuICB9XG5cbiAgcmV0dXJuIFNjcm9sbFNweVxuXG59KShqUXVlcnkpXG5cbmV4cG9ydCBkZWZhdWx0IFNjcm9sbFNweVxuIl0sImZpbGUiOiJzY3JvbGxzcHkuanMifQ==
