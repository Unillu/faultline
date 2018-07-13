import Util from './util'


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): carousel.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Carousel = (($) => {


  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                   = 'carousel'
  const VERSION                = '4.0.0-beta'
  const DATA_KEY               = 'bs.carousel'
  const EVENT_KEY              = `.${DATA_KEY}`
  const DATA_API_KEY           = '.data-api'
  const JQUERY_NO_CONFLICT     = $.fn[NAME]
  const TRANSITION_DURATION    = 600
  const ARROW_LEFT_KEYCODE     = 37 // KeyboardEvent.which value for left arrow key
  const ARROW_RIGHT_KEYCODE    = 39 // KeyboardEvent.which value for right arrow key
  const TOUCHEVENT_COMPAT_WAIT = 500 // Time for mouse compat events to fire after touch

  const Default = {
    interval : 5000,
    keyboard : true,
    slide    : false,
    pause    : 'hover',
    wrap     : true
  }

  const DefaultType = {
    interval : '(number|boolean)',
    keyboard : 'boolean',
    slide    : '(boolean|string)',
    pause    : '(string|boolean)',
    wrap     : 'boolean'
  }

  const Direction = {
    NEXT     : 'next',
    PREV     : 'prev',
    LEFT     : 'left',
    RIGHT    : 'right'
  }

  const Event = {
    SLIDE          : `slide${EVENT_KEY}`,
    SLID           : `slid${EVENT_KEY}`,
    KEYDOWN        : `keydown${EVENT_KEY}`,
    MOUSEENTER     : `mouseenter${EVENT_KEY}`,
    MOUSELEAVE     : `mouseleave${EVENT_KEY}`,
    TOUCHEND       : `touchend${EVENT_KEY}`,
    LOAD_DATA_API  : `load${EVENT_KEY}${DATA_API_KEY}`,
    CLICK_DATA_API : `click${EVENT_KEY}${DATA_API_KEY}`
  }

  const ClassName = {
    CAROUSEL : 'carousel',
    ACTIVE   : 'active',
    SLIDE    : 'slide',
    RIGHT    : 'carousel-item-right',
    LEFT     : 'carousel-item-left',
    NEXT     : 'carousel-item-next',
    PREV     : 'carousel-item-prev',
    ITEM     : 'carousel-item'
  }

  const Selector = {
    ACTIVE      : '.active',
    ACTIVE_ITEM : '.active.carousel-item',
    ITEM        : '.carousel-item',
    NEXT_PREV   : '.carousel-item-next, .carousel-item-prev',
    INDICATORS  : '.carousel-indicators',
    DATA_SLIDE  : '[data-slide], [data-slide-to]',
    DATA_RIDE   : '[data-ride="carousel"]'
  }


  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Carousel {

    constructor(element, config) {
      this._items             = null
      this._interval          = null
      this._activeElement     = null

      this._isPaused          = false
      this._isSliding         = false

      this.touchTimeout       = null

      this._config            = this._getConfig(config)
      this._element           = $(element)[0]
      this._indicatorsElement = $(this._element).find(Selector.INDICATORS)[0]

      this._addEventListeners()
    }


    // getters

    static get VERSION() {
      return VERSION
    }

    static get Default() {
      return Default
    }


    // public

    next() {
      if (!this._isSliding) {
        this._slide(Direction.NEXT)
      }
    }

    nextWhenVisible() {
      // Don't call next when the page isn't visible
      if (!document.hidden) {
        this.next()
      }
    }

    prev() {
      if (!this._isSliding) {
        this._slide(Direction.PREV)
      }
    }

    pause(event) {
      if (!event) {
        this._isPaused = true
      }

      if ($(this._element).find(Selector.NEXT_PREV)[0] &&
        Util.supportsTransitionEnd()) {
        Util.triggerTransitionEnd(this._element)
        this.cycle(true)
      }

      clearInterval(this._interval)
      this._interval = null
    }

    cycle(event) {
      if (!event) {
        this._isPaused = false
      }

      if (this._interval) {
        clearInterval(this._interval)
        this._interval = null
      }

      if (this._config.interval && !this._isPaused) {
        this._interval = setInterval(
          (document.visibilityState ? this.nextWhenVisible : this.next).bind(this),
          this._config.interval
        )
      }
    }

    to(index) {
      this._activeElement = $(this._element).find(Selector.ACTIVE_ITEM)[0]

      const activeIndex = this._getItemIndex(this._activeElement)

      if (index > this._items.length - 1 || index < 0) {
        return
      }

      if (this._isSliding) {
        $(this._element).one(Event.SLID, () => this.to(index))
        return
      }

      if (activeIndex === index) {
        this.pause()
        this.cycle()
        return
      }

      const direction = index > activeIndex ?
        Direction.NEXT :
        Direction.PREV

      this._slide(direction, this._items[index])
    }

    dispose() {
      $(this._element).off(EVENT_KEY)
      $.removeData(this._element, DATA_KEY)

      this._items             = null
      this._config            = null
      this._element           = null
      this._interval          = null
      this._isPaused          = null
      this._isSliding         = null
      this._activeElement     = null
      this._indicatorsElement = null
    }


    // private

    _getConfig(config) {
      config = $.extend({}, Default, config)
      Util.typeCheckConfig(NAME, config, DefaultType)
      return config
    }

    _addEventListeners() {
      if (this._config.keyboard) {
        $(this._element)
          .on(Event.KEYDOWN, (event) => this._keydown(event))
      }

      if (this._config.pause === 'hover') {
        $(this._element)
          .on(Event.MOUSEENTER, (event) => this.pause(event))
          .on(Event.MOUSELEAVE, (event) => this.cycle(event))
        if ('ontouchstart' in document.documentElement) {
          // if it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling
          $(this._element).on(Event.TOUCHEND, () => {
            this.pause()
            if (this.touchTimeout) {
              clearTimeout(this.touchTimeout)
            }
            this.touchTimeout = setTimeout((event) => this.cycle(event), TOUCHEVENT_COMPAT_WAIT + this._config.interval)
          })
        }
      }
    }

    _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return
      }

      switch (event.which) {
        case ARROW_LEFT_KEYCODE:
          event.preventDefault()
          this.prev()
          break
        case ARROW_RIGHT_KEYCODE:
          event.preventDefault()
          this.next()
          break
        default:
          return
      }
    }

    _getItemIndex(element) {
      this._items = $.makeArray($(element).parent().find(Selector.ITEM))
      return this._items.indexOf(element)
    }

    _getItemByDirection(direction, activeElement) {
      const isNextDirection = direction === Direction.NEXT
      const isPrevDirection = direction === Direction.PREV
      const activeIndex     = this._getItemIndex(activeElement)
      const lastItemIndex   = this._items.length - 1
      const isGoingToWrap   = isPrevDirection && activeIndex === 0 ||
                              isNextDirection && activeIndex === lastItemIndex

      if (isGoingToWrap && !this._config.wrap) {
        return activeElement
      }

      const delta     = direction === Direction.PREV ? -1 : 1
      const itemIndex = (activeIndex + delta) % this._items.length

      return itemIndex === -1 ?
        this._items[this._items.length - 1] : this._items[itemIndex]
    }


    _triggerSlideEvent(relatedTarget, eventDirectionName) {
      const targetIndex = this._getItemIndex(relatedTarget)
      const fromIndex = this._getItemIndex($(this._element).find(Selector.ACTIVE_ITEM)[0])
      const slideEvent = $.Event(Event.SLIDE, {
        relatedTarget,
        direction: eventDirectionName,
        from: fromIndex,
        to: targetIndex
      })

      $(this._element).trigger(slideEvent)

      return slideEvent
    }

    _setActiveIndicatorElement(element) {
      if (this._indicatorsElement) {
        $(this._indicatorsElement)
          .find(Selector.ACTIVE)
          .removeClass(ClassName.ACTIVE)

        const nextIndicator = this._indicatorsElement.children[
          this._getItemIndex(element)
        ]

        if (nextIndicator) {
          $(nextIndicator).addClass(ClassName.ACTIVE)
        }
      }
    }

    _slide(direction, element) {
      const activeElement = $(this._element).find(Selector.ACTIVE_ITEM)[0]
      const activeElementIndex = this._getItemIndex(activeElement)
      const nextElement   = element || activeElement &&
        this._getItemByDirection(direction, activeElement)
      const nextElementIndex = this._getItemIndex(nextElement)
      const isCycling = Boolean(this._interval)

      let directionalClassName
      let orderClassName
      let eventDirectionName

      if (direction === Direction.NEXT) {
        directionalClassName = ClassName.LEFT
        orderClassName = ClassName.NEXT
        eventDirectionName = Direction.LEFT
      } else {
        directionalClassName = ClassName.RIGHT
        orderClassName = ClassName.PREV
        eventDirectionName = Direction.RIGHT
      }

      if (nextElement && $(nextElement).hasClass(ClassName.ACTIVE)) {
        this._isSliding = false
        return
      }

      const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName)
      if (slideEvent.isDefaultPrevented()) {
        return
      }

      if (!activeElement || !nextElement) {
        // some weirdness is happening, so we bail
        return
      }

      this._isSliding = true

      if (isCycling) {
        this.pause()
      }

      this._setActiveIndicatorElement(nextElement)

      const slidEvent = $.Event(Event.SLID, {
        relatedTarget: nextElement,
        direction: eventDirectionName,
        from: activeElementIndex,
        to: nextElementIndex
      })

      if (Util.supportsTransitionEnd() &&
        $(this._element).hasClass(ClassName.SLIDE)) {

        $(nextElement).addClass(orderClassName)

        Util.reflow(nextElement)

        $(activeElement).addClass(directionalClassName)
        $(nextElement).addClass(directionalClassName)

        $(activeElement)
          .one(Util.TRANSITION_END, () => {
            $(nextElement)
              .removeClass(`${directionalClassName} ${orderClassName}`)
              .addClass(ClassName.ACTIVE)

            $(activeElement).removeClass(`${ClassName.ACTIVE} ${orderClassName} ${directionalClassName}`)

            this._isSliding = false

            setTimeout(() => $(this._element).trigger(slidEvent), 0)

          })
          .emulateTransitionEnd(TRANSITION_DURATION)

      } else {
        $(activeElement).removeClass(ClassName.ACTIVE)
        $(nextElement).addClass(ClassName.ACTIVE)

        this._isSliding = false
        $(this._element).trigger(slidEvent)
      }

      if (isCycling) {
        this.cycle()
      }
    }


    // static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data      = $(this).data(DATA_KEY)
        const _config = $.extend({}, Default, $(this).data())

        if (typeof config === 'object') {
          $.extend(_config, config)
        }

        const action = typeof config === 'string' ? config : _config.slide

        if (!data) {
          data = new Carousel(this, _config)
          $(this).data(DATA_KEY, data)
        }

        if (typeof config === 'number') {
          data.to(config)
        } else if (typeof action === 'string') {
          if (data[action] === undefined) {
            throw new Error(`No method named "${action}"`)
          }
          data[action]()
        } else if (_config.interval) {
          data.pause()
          data.cycle()
        }
      })
    }

    static _dataApiClickHandler(event) {
      const selector = Util.getSelectorFromElement(this)

      if (!selector) {
        return
      }

      const target = $(selector)[0]

      if (!target || !$(target).hasClass(ClassName.CAROUSEL)) {
        return
      }

      const config     = $.extend({}, $(target).data(), $(this).data())
      const slideIndex = this.getAttribute('data-slide-to')

      if (slideIndex) {
        config.interval = false
      }

      Carousel._jQueryInterface.call($(target), config)

      if (slideIndex) {
        $(target).data(DATA_KEY).to(slideIndex)
      }

      event.preventDefault()
    }

  }


  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document)
    .on(Event.CLICK_DATA_API, Selector.DATA_SLIDE, Carousel._dataApiClickHandler)

  $(window).on(Event.LOAD_DATA_API, () => {
    $(Selector.DATA_RIDE).each(function () {
      const $carousel = $(this)
      Carousel._jQueryInterface.call($carousel, $carousel.data())
    })
  })


  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME]             = Carousel._jQueryInterface
  $.fn[NAME].Constructor = Carousel
  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Carousel._jQueryInterface
  }

  return Carousel

})(jQuery)

export default Carousel

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjYXJvdXNlbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVXRpbCBmcm9tICcuL3V0aWwnXG5cblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQm9vdHN0cmFwICh2NC4wLjAtYmV0YSk6IGNhcm91c2VsLmpzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5jb25zdCBDYXJvdXNlbCA9ICgoJCkgPT4ge1xuXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgICAgICAgICAgICAgICAgICAgPSAnY2Fyb3VzZWwnXG4gIGNvbnN0IFZFUlNJT04gICAgICAgICAgICAgICAgPSAnNC4wLjAtYmV0YSdcbiAgY29uc3QgREFUQV9LRVkgICAgICAgICAgICAgICA9ICdicy5jYXJvdXNlbCdcbiAgY29uc3QgRVZFTlRfS0VZICAgICAgICAgICAgICA9IGAuJHtEQVRBX0tFWX1gXG4gIGNvbnN0IERBVEFfQVBJX0tFWSAgICAgICAgICAgPSAnLmRhdGEtYXBpJ1xuICBjb25zdCBKUVVFUllfTk9fQ09ORkxJQ1QgICAgID0gJC5mbltOQU1FXVxuICBjb25zdCBUUkFOU0lUSU9OX0RVUkFUSU9OICAgID0gNjAwXG4gIGNvbnN0IEFSUk9XX0xFRlRfS0VZQ09ERSAgICAgPSAzNyAvLyBLZXlib2FyZEV2ZW50LndoaWNoIHZhbHVlIGZvciBsZWZ0IGFycm93IGtleVxuICBjb25zdCBBUlJPV19SSUdIVF9LRVlDT0RFICAgID0gMzkgLy8gS2V5Ym9hcmRFdmVudC53aGljaCB2YWx1ZSBmb3IgcmlnaHQgYXJyb3cga2V5XG4gIGNvbnN0IFRPVUNIRVZFTlRfQ09NUEFUX1dBSVQgPSA1MDAgLy8gVGltZSBmb3IgbW91c2UgY29tcGF0IGV2ZW50cyB0byBmaXJlIGFmdGVyIHRvdWNoXG5cbiAgY29uc3QgRGVmYXVsdCA9IHtcbiAgICBpbnRlcnZhbCA6IDUwMDAsXG4gICAga2V5Ym9hcmQgOiB0cnVlLFxuICAgIHNsaWRlICAgIDogZmFsc2UsXG4gICAgcGF1c2UgICAgOiAnaG92ZXInLFxuICAgIHdyYXAgICAgIDogdHJ1ZVxuICB9XG5cbiAgY29uc3QgRGVmYXVsdFR5cGUgPSB7XG4gICAgaW50ZXJ2YWwgOiAnKG51bWJlcnxib29sZWFuKScsXG4gICAga2V5Ym9hcmQgOiAnYm9vbGVhbicsXG4gICAgc2xpZGUgICAgOiAnKGJvb2xlYW58c3RyaW5nKScsXG4gICAgcGF1c2UgICAgOiAnKHN0cmluZ3xib29sZWFuKScsXG4gICAgd3JhcCAgICAgOiAnYm9vbGVhbidcbiAgfVxuXG4gIGNvbnN0IERpcmVjdGlvbiA9IHtcbiAgICBORVhUICAgICA6ICduZXh0JyxcbiAgICBQUkVWICAgICA6ICdwcmV2JyxcbiAgICBMRUZUICAgICA6ICdsZWZ0JyxcbiAgICBSSUdIVCAgICA6ICdyaWdodCdcbiAgfVxuXG4gIGNvbnN0IEV2ZW50ID0ge1xuICAgIFNMSURFICAgICAgICAgIDogYHNsaWRlJHtFVkVOVF9LRVl9YCxcbiAgICBTTElEICAgICAgICAgICA6IGBzbGlkJHtFVkVOVF9LRVl9YCxcbiAgICBLRVlET1dOICAgICAgICA6IGBrZXlkb3duJHtFVkVOVF9LRVl9YCxcbiAgICBNT1VTRUVOVEVSICAgICA6IGBtb3VzZWVudGVyJHtFVkVOVF9LRVl9YCxcbiAgICBNT1VTRUxFQVZFICAgICA6IGBtb3VzZWxlYXZlJHtFVkVOVF9LRVl9YCxcbiAgICBUT1VDSEVORCAgICAgICA6IGB0b3VjaGVuZCR7RVZFTlRfS0VZfWAsXG4gICAgTE9BRF9EQVRBX0FQSSAgOiBgbG9hZCR7RVZFTlRfS0VZfSR7REFUQV9BUElfS0VZfWAsXG4gICAgQ0xJQ0tfREFUQV9BUEkgOiBgY2xpY2ske0VWRU5UX0tFWX0ke0RBVEFfQVBJX0tFWX1gXG4gIH1cblxuICBjb25zdCBDbGFzc05hbWUgPSB7XG4gICAgQ0FST1VTRUwgOiAnY2Fyb3VzZWwnLFxuICAgIEFDVElWRSAgIDogJ2FjdGl2ZScsXG4gICAgU0xJREUgICAgOiAnc2xpZGUnLFxuICAgIFJJR0hUICAgIDogJ2Nhcm91c2VsLWl0ZW0tcmlnaHQnLFxuICAgIExFRlQgICAgIDogJ2Nhcm91c2VsLWl0ZW0tbGVmdCcsXG4gICAgTkVYVCAgICAgOiAnY2Fyb3VzZWwtaXRlbS1uZXh0JyxcbiAgICBQUkVWICAgICA6ICdjYXJvdXNlbC1pdGVtLXByZXYnLFxuICAgIElURU0gICAgIDogJ2Nhcm91c2VsLWl0ZW0nXG4gIH1cblxuICBjb25zdCBTZWxlY3RvciA9IHtcbiAgICBBQ1RJVkUgICAgICA6ICcuYWN0aXZlJyxcbiAgICBBQ1RJVkVfSVRFTSA6ICcuYWN0aXZlLmNhcm91c2VsLWl0ZW0nLFxuICAgIElURU0gICAgICAgIDogJy5jYXJvdXNlbC1pdGVtJyxcbiAgICBORVhUX1BSRVYgICA6ICcuY2Fyb3VzZWwtaXRlbS1uZXh0LCAuY2Fyb3VzZWwtaXRlbS1wcmV2JyxcbiAgICBJTkRJQ0FUT1JTICA6ICcuY2Fyb3VzZWwtaW5kaWNhdG9ycycsXG4gICAgREFUQV9TTElERSAgOiAnW2RhdGEtc2xpZGVdLCBbZGF0YS1zbGlkZS10b10nLFxuICAgIERBVEFfUklERSAgIDogJ1tkYXRhLXJpZGU9XCJjYXJvdXNlbFwiXSdcbiAgfVxuXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBDYXJvdXNlbCB7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBjb25maWcpIHtcbiAgICAgIHRoaXMuX2l0ZW1zICAgICAgICAgICAgID0gbnVsbFxuICAgICAgdGhpcy5faW50ZXJ2YWwgICAgICAgICAgPSBudWxsXG4gICAgICB0aGlzLl9hY3RpdmVFbGVtZW50ICAgICA9IG51bGxcblxuICAgICAgdGhpcy5faXNQYXVzZWQgICAgICAgICAgPSBmYWxzZVxuICAgICAgdGhpcy5faXNTbGlkaW5nICAgICAgICAgPSBmYWxzZVxuXG4gICAgICB0aGlzLnRvdWNoVGltZW91dCAgICAgICA9IG51bGxcblxuICAgICAgdGhpcy5fY29uZmlnICAgICAgICAgICAgPSB0aGlzLl9nZXRDb25maWcoY29uZmlnKVxuICAgICAgdGhpcy5fZWxlbWVudCAgICAgICAgICAgPSAkKGVsZW1lbnQpWzBdXG4gICAgICB0aGlzLl9pbmRpY2F0b3JzRWxlbWVudCA9ICQodGhpcy5fZWxlbWVudCkuZmluZChTZWxlY3Rvci5JTkRJQ0FUT1JTKVswXVxuXG4gICAgICB0aGlzLl9hZGRFdmVudExpc3RlbmVycygpXG4gICAgfVxuXG5cbiAgICAvLyBnZXR0ZXJzXG5cbiAgICBzdGF0aWMgZ2V0IFZFUlNJT04oKSB7XG4gICAgICByZXR1cm4gVkVSU0lPTlxuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgRGVmYXVsdCgpIHtcbiAgICAgIHJldHVybiBEZWZhdWx0XG4gICAgfVxuXG5cbiAgICAvLyBwdWJsaWNcblxuICAgIG5leHQoKSB7XG4gICAgICBpZiAoIXRoaXMuX2lzU2xpZGluZykge1xuICAgICAgICB0aGlzLl9zbGlkZShEaXJlY3Rpb24uTkVYVClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBuZXh0V2hlblZpc2libGUoKSB7XG4gICAgICAvLyBEb24ndCBjYWxsIG5leHQgd2hlbiB0aGUgcGFnZSBpc24ndCB2aXNpYmxlXG4gICAgICBpZiAoIWRvY3VtZW50LmhpZGRlbikge1xuICAgICAgICB0aGlzLm5leHQoKVxuICAgICAgfVxuICAgIH1cblxuICAgIHByZXYoKSB7XG4gICAgICBpZiAoIXRoaXMuX2lzU2xpZGluZykge1xuICAgICAgICB0aGlzLl9zbGlkZShEaXJlY3Rpb24uUFJFVilcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYXVzZShldmVudCkge1xuICAgICAgaWYgKCFldmVudCkge1xuICAgICAgICB0aGlzLl9pc1BhdXNlZCA9IHRydWVcbiAgICAgIH1cblxuICAgICAgaWYgKCQodGhpcy5fZWxlbWVudCkuZmluZChTZWxlY3Rvci5ORVhUX1BSRVYpWzBdICYmXG4gICAgICAgIFV0aWwuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkpIHtcbiAgICAgICAgVXRpbC50cmlnZ2VyVHJhbnNpdGlvbkVuZCh0aGlzLl9lbGVtZW50KVxuICAgICAgICB0aGlzLmN5Y2xlKHRydWUpXG4gICAgICB9XG5cbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5faW50ZXJ2YWwpXG4gICAgICB0aGlzLl9pbnRlcnZhbCA9IG51bGxcbiAgICB9XG5cbiAgICBjeWNsZShldmVudCkge1xuICAgICAgaWYgKCFldmVudCkge1xuICAgICAgICB0aGlzLl9pc1BhdXNlZCA9IGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9pbnRlcnZhbCkge1xuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuX2ludGVydmFsKVxuICAgICAgICB0aGlzLl9pbnRlcnZhbCA9IG51bGxcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2NvbmZpZy5pbnRlcnZhbCAmJiAhdGhpcy5faXNQYXVzZWQpIHtcbiAgICAgICAgdGhpcy5faW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChcbiAgICAgICAgICAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID8gdGhpcy5uZXh0V2hlblZpc2libGUgOiB0aGlzLm5leHQpLmJpbmQodGhpcyksXG4gICAgICAgICAgdGhpcy5fY29uZmlnLmludGVydmFsXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0byhpbmRleCkge1xuICAgICAgdGhpcy5fYWN0aXZlRWxlbWVudCA9ICQodGhpcy5fZWxlbWVudCkuZmluZChTZWxlY3Rvci5BQ1RJVkVfSVRFTSlbMF1cblxuICAgICAgY29uc3QgYWN0aXZlSW5kZXggPSB0aGlzLl9nZXRJdGVtSW5kZXgodGhpcy5fYWN0aXZlRWxlbWVudClcblxuICAgICAgaWYgKGluZGV4ID4gdGhpcy5faXRlbXMubGVuZ3RoIC0gMSB8fCBpbmRleCA8IDApIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9pc1NsaWRpbmcpIHtcbiAgICAgICAgJCh0aGlzLl9lbGVtZW50KS5vbmUoRXZlbnQuU0xJRCwgKCkgPT4gdGhpcy50byhpbmRleCkpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAoYWN0aXZlSW5kZXggPT09IGluZGV4KSB7XG4gICAgICAgIHRoaXMucGF1c2UoKVxuICAgICAgICB0aGlzLmN5Y2xlKClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IGluZGV4ID4gYWN0aXZlSW5kZXggP1xuICAgICAgICBEaXJlY3Rpb24uTkVYVCA6XG4gICAgICAgIERpcmVjdGlvbi5QUkVWXG5cbiAgICAgIHRoaXMuX3NsaWRlKGRpcmVjdGlvbiwgdGhpcy5faXRlbXNbaW5kZXhdKVxuICAgIH1cblxuICAgIGRpc3Bvc2UoKSB7XG4gICAgICAkKHRoaXMuX2VsZW1lbnQpLm9mZihFVkVOVF9LRVkpXG4gICAgICAkLnJlbW92ZURhdGEodGhpcy5fZWxlbWVudCwgREFUQV9LRVkpXG5cbiAgICAgIHRoaXMuX2l0ZW1zICAgICAgICAgICAgID0gbnVsbFxuICAgICAgdGhpcy5fY29uZmlnICAgICAgICAgICAgPSBudWxsXG4gICAgICB0aGlzLl9lbGVtZW50ICAgICAgICAgICA9IG51bGxcbiAgICAgIHRoaXMuX2ludGVydmFsICAgICAgICAgID0gbnVsbFxuICAgICAgdGhpcy5faXNQYXVzZWQgICAgICAgICAgPSBudWxsXG4gICAgICB0aGlzLl9pc1NsaWRpbmcgICAgICAgICA9IG51bGxcbiAgICAgIHRoaXMuX2FjdGl2ZUVsZW1lbnQgICAgID0gbnVsbFxuICAgICAgdGhpcy5faW5kaWNhdG9yc0VsZW1lbnQgPSBudWxsXG4gICAgfVxuXG5cbiAgICAvLyBwcml2YXRlXG5cbiAgICBfZ2V0Q29uZmlnKGNvbmZpZykge1xuICAgICAgY29uZmlnID0gJC5leHRlbmQoe30sIERlZmF1bHQsIGNvbmZpZylcbiAgICAgIFV0aWwudHlwZUNoZWNrQ29uZmlnKE5BTUUsIGNvbmZpZywgRGVmYXVsdFR5cGUpXG4gICAgICByZXR1cm4gY29uZmlnXG4gICAgfVxuXG4gICAgX2FkZEV2ZW50TGlzdGVuZXJzKCkge1xuICAgICAgaWYgKHRoaXMuX2NvbmZpZy5rZXlib2FyZCkge1xuICAgICAgICAkKHRoaXMuX2VsZW1lbnQpXG4gICAgICAgICAgLm9uKEV2ZW50LktFWURPV04sIChldmVudCkgPT4gdGhpcy5fa2V5ZG93bihldmVudCkpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9jb25maWcucGF1c2UgPT09ICdob3ZlcicpIHtcbiAgICAgICAgJCh0aGlzLl9lbGVtZW50KVxuICAgICAgICAgIC5vbihFdmVudC5NT1VTRUVOVEVSLCAoZXZlbnQpID0+IHRoaXMucGF1c2UoZXZlbnQpKVxuICAgICAgICAgIC5vbihFdmVudC5NT1VTRUxFQVZFLCAoZXZlbnQpID0+IHRoaXMuY3ljbGUoZXZlbnQpKVxuICAgICAgICBpZiAoJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgICAgICAgLy8gaWYgaXQncyBhIHRvdWNoLWVuYWJsZWQgZGV2aWNlLCBtb3VzZWVudGVyL2xlYXZlIGFyZSBmaXJlZCBhc1xuICAgICAgICAgIC8vIHBhcnQgb2YgdGhlIG1vdXNlIGNvbXBhdGliaWxpdHkgZXZlbnRzIG9uIGZpcnN0IHRhcCAtIHRoZSBjYXJvdXNlbFxuICAgICAgICAgIC8vIHdvdWxkIHN0b3AgY3ljbGluZyB1bnRpbCB1c2VyIHRhcHBlZCBvdXQgb2YgaXQ7XG4gICAgICAgICAgLy8gaGVyZSwgd2UgbGlzdGVuIGZvciB0b3VjaGVuZCwgZXhwbGljaXRseSBwYXVzZSB0aGUgY2Fyb3VzZWxcbiAgICAgICAgICAvLyAoYXMgaWYgaXQncyB0aGUgc2Vjb25kIHRpbWUgd2UgdGFwIG9uIGl0LCBtb3VzZWVudGVyIGNvbXBhdCBldmVudFxuICAgICAgICAgIC8vIGlzIE5PVCBmaXJlZCkgYW5kIGFmdGVyIGEgdGltZW91dCAodG8gYWxsb3cgZm9yIG1vdXNlIGNvbXBhdGliaWxpdHlcbiAgICAgICAgICAvLyBldmVudHMgdG8gZmlyZSkgd2UgZXhwbGljaXRseSByZXN0YXJ0IGN5Y2xpbmdcbiAgICAgICAgICAkKHRoaXMuX2VsZW1lbnQpLm9uKEV2ZW50LlRPVUNIRU5ELCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBhdXNlKClcbiAgICAgICAgICAgIGlmICh0aGlzLnRvdWNoVGltZW91dCkge1xuICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50b3VjaFRpbWVvdXQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnRvdWNoVGltZW91dCA9IHNldFRpbWVvdXQoKGV2ZW50KSA9PiB0aGlzLmN5Y2xlKGV2ZW50KSwgVE9VQ0hFVkVOVF9DT01QQVRfV0FJVCArIHRoaXMuX2NvbmZpZy5pbnRlcnZhbClcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2tleWRvd24oZXZlbnQpIHtcbiAgICAgIGlmICgvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGV2ZW50LnRhcmdldC50YWdOYW1lKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgc3dpdGNoIChldmVudC53aGljaCkge1xuICAgICAgICBjYXNlIEFSUk9XX0xFRlRfS0VZQ09ERTpcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgdGhpcy5wcmV2KClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIEFSUk9XX1JJR0hUX0tFWUNPREU6XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgIHRoaXMubmV4dCgpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfZ2V0SXRlbUluZGV4KGVsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2l0ZW1zID0gJC5tYWtlQXJyYXkoJChlbGVtZW50KS5wYXJlbnQoKS5maW5kKFNlbGVjdG9yLklURU0pKVxuICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1zLmluZGV4T2YoZWxlbWVudClcbiAgICB9XG5cbiAgICBfZ2V0SXRlbUJ5RGlyZWN0aW9uKGRpcmVjdGlvbiwgYWN0aXZlRWxlbWVudCkge1xuICAgICAgY29uc3QgaXNOZXh0RGlyZWN0aW9uID0gZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uTkVYVFxuICAgICAgY29uc3QgaXNQcmV2RGlyZWN0aW9uID0gZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uUFJFVlxuICAgICAgY29uc3QgYWN0aXZlSW5kZXggICAgID0gdGhpcy5fZ2V0SXRlbUluZGV4KGFjdGl2ZUVsZW1lbnQpXG4gICAgICBjb25zdCBsYXN0SXRlbUluZGV4ICAgPSB0aGlzLl9pdGVtcy5sZW5ndGggLSAxXG4gICAgICBjb25zdCBpc0dvaW5nVG9XcmFwICAgPSBpc1ByZXZEaXJlY3Rpb24gJiYgYWN0aXZlSW5kZXggPT09IDAgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzTmV4dERpcmVjdGlvbiAmJiBhY3RpdmVJbmRleCA9PT0gbGFzdEl0ZW1JbmRleFxuXG4gICAgICBpZiAoaXNHb2luZ1RvV3JhcCAmJiAhdGhpcy5fY29uZmlnLndyYXApIHtcbiAgICAgICAgcmV0dXJuIGFjdGl2ZUVsZW1lbnRcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGVsdGEgICAgID0gZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uUFJFViA/IC0xIDogMVxuICAgICAgY29uc3QgaXRlbUluZGV4ID0gKGFjdGl2ZUluZGV4ICsgZGVsdGEpICUgdGhpcy5faXRlbXMubGVuZ3RoXG5cbiAgICAgIHJldHVybiBpdGVtSW5kZXggPT09IC0xID9cbiAgICAgICAgdGhpcy5faXRlbXNbdGhpcy5faXRlbXMubGVuZ3RoIC0gMV0gOiB0aGlzLl9pdGVtc1tpdGVtSW5kZXhdXG4gICAgfVxuXG5cbiAgICBfdHJpZ2dlclNsaWRlRXZlbnQocmVsYXRlZFRhcmdldCwgZXZlbnREaXJlY3Rpb25OYW1lKSB7XG4gICAgICBjb25zdCB0YXJnZXRJbmRleCA9IHRoaXMuX2dldEl0ZW1JbmRleChyZWxhdGVkVGFyZ2V0KVxuICAgICAgY29uc3QgZnJvbUluZGV4ID0gdGhpcy5fZ2V0SXRlbUluZGV4KCQodGhpcy5fZWxlbWVudCkuZmluZChTZWxlY3Rvci5BQ1RJVkVfSVRFTSlbMF0pXG4gICAgICBjb25zdCBzbGlkZUV2ZW50ID0gJC5FdmVudChFdmVudC5TTElERSwge1xuICAgICAgICByZWxhdGVkVGFyZ2V0LFxuICAgICAgICBkaXJlY3Rpb246IGV2ZW50RGlyZWN0aW9uTmFtZSxcbiAgICAgICAgZnJvbTogZnJvbUluZGV4LFxuICAgICAgICB0bzogdGFyZ2V0SW5kZXhcbiAgICAgIH0pXG5cbiAgICAgICQodGhpcy5fZWxlbWVudCkudHJpZ2dlcihzbGlkZUV2ZW50KVxuXG4gICAgICByZXR1cm4gc2xpZGVFdmVudFxuICAgIH1cblxuICAgIF9zZXRBY3RpdmVJbmRpY2F0b3JFbGVtZW50KGVsZW1lbnQpIHtcbiAgICAgIGlmICh0aGlzLl9pbmRpY2F0b3JzRWxlbWVudCkge1xuICAgICAgICAkKHRoaXMuX2luZGljYXRvcnNFbGVtZW50KVxuICAgICAgICAgIC5maW5kKFNlbGVjdG9yLkFDVElWRSlcbiAgICAgICAgICAucmVtb3ZlQ2xhc3MoQ2xhc3NOYW1lLkFDVElWRSlcblxuICAgICAgICBjb25zdCBuZXh0SW5kaWNhdG9yID0gdGhpcy5faW5kaWNhdG9yc0VsZW1lbnQuY2hpbGRyZW5bXG4gICAgICAgICAgdGhpcy5fZ2V0SXRlbUluZGV4KGVsZW1lbnQpXG4gICAgICAgIF1cblxuICAgICAgICBpZiAobmV4dEluZGljYXRvcikge1xuICAgICAgICAgICQobmV4dEluZGljYXRvcikuYWRkQ2xhc3MoQ2xhc3NOYW1lLkFDVElWRSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIF9zbGlkZShkaXJlY3Rpb24sIGVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IGFjdGl2ZUVsZW1lbnQgPSAkKHRoaXMuX2VsZW1lbnQpLmZpbmQoU2VsZWN0b3IuQUNUSVZFX0lURU0pWzBdXG4gICAgICBjb25zdCBhY3RpdmVFbGVtZW50SW5kZXggPSB0aGlzLl9nZXRJdGVtSW5kZXgoYWN0aXZlRWxlbWVudClcbiAgICAgIGNvbnN0IG5leHRFbGVtZW50ICAgPSBlbGVtZW50IHx8IGFjdGl2ZUVsZW1lbnQgJiZcbiAgICAgICAgdGhpcy5fZ2V0SXRlbUJ5RGlyZWN0aW9uKGRpcmVjdGlvbiwgYWN0aXZlRWxlbWVudClcbiAgICAgIGNvbnN0IG5leHRFbGVtZW50SW5kZXggPSB0aGlzLl9nZXRJdGVtSW5kZXgobmV4dEVsZW1lbnQpXG4gICAgICBjb25zdCBpc0N5Y2xpbmcgPSBCb29sZWFuKHRoaXMuX2ludGVydmFsKVxuXG4gICAgICBsZXQgZGlyZWN0aW9uYWxDbGFzc05hbWVcbiAgICAgIGxldCBvcmRlckNsYXNzTmFtZVxuICAgICAgbGV0IGV2ZW50RGlyZWN0aW9uTmFtZVxuXG4gICAgICBpZiAoZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uTkVYVCkge1xuICAgICAgICBkaXJlY3Rpb25hbENsYXNzTmFtZSA9IENsYXNzTmFtZS5MRUZUXG4gICAgICAgIG9yZGVyQ2xhc3NOYW1lID0gQ2xhc3NOYW1lLk5FWFRcbiAgICAgICAgZXZlbnREaXJlY3Rpb25OYW1lID0gRGlyZWN0aW9uLkxFRlRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRpcmVjdGlvbmFsQ2xhc3NOYW1lID0gQ2xhc3NOYW1lLlJJR0hUXG4gICAgICAgIG9yZGVyQ2xhc3NOYW1lID0gQ2xhc3NOYW1lLlBSRVZcbiAgICAgICAgZXZlbnREaXJlY3Rpb25OYW1lID0gRGlyZWN0aW9uLlJJR0hUXG4gICAgICB9XG5cbiAgICAgIGlmIChuZXh0RWxlbWVudCAmJiAkKG5leHRFbGVtZW50KS5oYXNDbGFzcyhDbGFzc05hbWUuQUNUSVZFKSkge1xuICAgICAgICB0aGlzLl9pc1NsaWRpbmcgPSBmYWxzZVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2xpZGVFdmVudCA9IHRoaXMuX3RyaWdnZXJTbGlkZUV2ZW50KG5leHRFbGVtZW50LCBldmVudERpcmVjdGlvbk5hbWUpXG4gICAgICBpZiAoc2xpZGVFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKCFhY3RpdmVFbGVtZW50IHx8ICFuZXh0RWxlbWVudCkge1xuICAgICAgICAvLyBzb21lIHdlaXJkbmVzcyBpcyBoYXBwZW5pbmcsIHNvIHdlIGJhaWxcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2lzU2xpZGluZyA9IHRydWVcblxuICAgICAgaWYgKGlzQ3ljbGluZykge1xuICAgICAgICB0aGlzLnBhdXNlKClcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc2V0QWN0aXZlSW5kaWNhdG9yRWxlbWVudChuZXh0RWxlbWVudClcblxuICAgICAgY29uc3Qgc2xpZEV2ZW50ID0gJC5FdmVudChFdmVudC5TTElELCB7XG4gICAgICAgIHJlbGF0ZWRUYXJnZXQ6IG5leHRFbGVtZW50LFxuICAgICAgICBkaXJlY3Rpb246IGV2ZW50RGlyZWN0aW9uTmFtZSxcbiAgICAgICAgZnJvbTogYWN0aXZlRWxlbWVudEluZGV4LFxuICAgICAgICB0bzogbmV4dEVsZW1lbnRJbmRleFxuICAgICAgfSlcblxuICAgICAgaWYgKFV0aWwuc3VwcG9ydHNUcmFuc2l0aW9uRW5kKCkgJiZcbiAgICAgICAgJCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhDbGFzc05hbWUuU0xJREUpKSB7XG5cbiAgICAgICAgJChuZXh0RWxlbWVudCkuYWRkQ2xhc3Mob3JkZXJDbGFzc05hbWUpXG5cbiAgICAgICAgVXRpbC5yZWZsb3cobmV4dEVsZW1lbnQpXG5cbiAgICAgICAgJChhY3RpdmVFbGVtZW50KS5hZGRDbGFzcyhkaXJlY3Rpb25hbENsYXNzTmFtZSlcbiAgICAgICAgJChuZXh0RWxlbWVudCkuYWRkQ2xhc3MoZGlyZWN0aW9uYWxDbGFzc05hbWUpXG5cbiAgICAgICAgJChhY3RpdmVFbGVtZW50KVxuICAgICAgICAgIC5vbmUoVXRpbC5UUkFOU0lUSU9OX0VORCwgKCkgPT4ge1xuICAgICAgICAgICAgJChuZXh0RWxlbWVudClcbiAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKGAke2RpcmVjdGlvbmFsQ2xhc3NOYW1lfSAke29yZGVyQ2xhc3NOYW1lfWApXG4gICAgICAgICAgICAgIC5hZGRDbGFzcyhDbGFzc05hbWUuQUNUSVZFKVxuXG4gICAgICAgICAgICAkKGFjdGl2ZUVsZW1lbnQpLnJlbW92ZUNsYXNzKGAke0NsYXNzTmFtZS5BQ1RJVkV9ICR7b3JkZXJDbGFzc05hbWV9ICR7ZGlyZWN0aW9uYWxDbGFzc05hbWV9YClcblxuICAgICAgICAgICAgdGhpcy5faXNTbGlkaW5nID0gZmFsc2VcblxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiAkKHRoaXMuX2VsZW1lbnQpLnRyaWdnZXIoc2xpZEV2ZW50KSwgMClcblxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKFRSQU5TSVRJT05fRFVSQVRJT04pXG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQoYWN0aXZlRWxlbWVudCkucmVtb3ZlQ2xhc3MoQ2xhc3NOYW1lLkFDVElWRSlcbiAgICAgICAgJChuZXh0RWxlbWVudCkuYWRkQ2xhc3MoQ2xhc3NOYW1lLkFDVElWRSlcblxuICAgICAgICB0aGlzLl9pc1NsaWRpbmcgPSBmYWxzZVxuICAgICAgICAkKHRoaXMuX2VsZW1lbnQpLnRyaWdnZXIoc2xpZEV2ZW50KVxuICAgICAgfVxuXG4gICAgICBpZiAoaXNDeWNsaW5nKSB7XG4gICAgICAgIHRoaXMuY3ljbGUoKVxuICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gc3RhdGljXG5cbiAgICBzdGF0aWMgX2pRdWVyeUludGVyZmFjZShjb25maWcpIHtcbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgZGF0YSAgICAgID0gJCh0aGlzKS5kYXRhKERBVEFfS0VZKVxuICAgICAgICBjb25zdCBfY29uZmlnID0gJC5leHRlbmQoe30sIERlZmF1bHQsICQodGhpcykuZGF0YSgpKVxuXG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICQuZXh0ZW5kKF9jb25maWcsIGNvbmZpZylcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnID8gY29uZmlnIDogX2NvbmZpZy5zbGlkZVxuXG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgIGRhdGEgPSBuZXcgQ2Fyb3VzZWwodGhpcywgX2NvbmZpZylcbiAgICAgICAgICAkKHRoaXMpLmRhdGEoREFUQV9LRVksIGRhdGEpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICBkYXRhLnRvKGNvbmZpZylcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYWN0aW9uID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGlmIChkYXRhW2FjdGlvbl0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBtZXRob2QgbmFtZWQgXCIke2FjdGlvbn1cImApXG4gICAgICAgICAgfVxuICAgICAgICAgIGRhdGFbYWN0aW9uXSgpXG4gICAgICAgIH0gZWxzZSBpZiAoX2NvbmZpZy5pbnRlcnZhbCkge1xuICAgICAgICAgIGRhdGEucGF1c2UoKVxuICAgICAgICAgIGRhdGEuY3ljbGUoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIHN0YXRpYyBfZGF0YUFwaUNsaWNrSGFuZGxlcihldmVudCkge1xuICAgICAgY29uc3Qgc2VsZWN0b3IgPSBVdGlsLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQodGhpcylcblxuICAgICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgdGFyZ2V0ID0gJChzZWxlY3RvcilbMF1cblxuICAgICAgaWYgKCF0YXJnZXQgfHwgISQodGFyZ2V0KS5oYXNDbGFzcyhDbGFzc05hbWUuQ0FST1VTRUwpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBjb25maWcgICAgID0gJC5leHRlbmQoe30sICQodGFyZ2V0KS5kYXRhKCksICQodGhpcykuZGF0YSgpKVxuICAgICAgY29uc3Qgc2xpZGVJbmRleCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLXNsaWRlLXRvJylcblxuICAgICAgaWYgKHNsaWRlSW5kZXgpIHtcbiAgICAgICAgY29uZmlnLmludGVydmFsID0gZmFsc2VcbiAgICAgIH1cblxuICAgICAgQ2Fyb3VzZWwuX2pRdWVyeUludGVyZmFjZS5jYWxsKCQodGFyZ2V0KSwgY29uZmlnKVxuXG4gICAgICBpZiAoc2xpZGVJbmRleCkge1xuICAgICAgICAkKHRhcmdldCkuZGF0YShEQVRBX0tFWSkudG8oc2xpZGVJbmRleClcbiAgICAgIH1cblxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIH1cblxuICB9XG5cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIERhdGEgQXBpIGltcGxlbWVudGF0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICAkKGRvY3VtZW50KVxuICAgIC5vbihFdmVudC5DTElDS19EQVRBX0FQSSwgU2VsZWN0b3IuREFUQV9TTElERSwgQ2Fyb3VzZWwuX2RhdGFBcGlDbGlja0hhbmRsZXIpXG5cbiAgJCh3aW5kb3cpLm9uKEV2ZW50LkxPQURfREFUQV9BUEksICgpID0+IHtcbiAgICAkKFNlbGVjdG9yLkRBVEFfUklERSkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCAkY2Fyb3VzZWwgPSAkKHRoaXMpXG4gICAgICBDYXJvdXNlbC5falF1ZXJ5SW50ZXJmYWNlLmNhbGwoJGNhcm91c2VsLCAkY2Fyb3VzZWwuZGF0YSgpKVxuICAgIH0pXG4gIH0pXG5cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIGpRdWVyeVxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgJC5mbltOQU1FXSAgICAgICAgICAgICA9IENhcm91c2VsLl9qUXVlcnlJbnRlcmZhY2VcbiAgJC5mbltOQU1FXS5Db25zdHJ1Y3RvciA9IENhcm91c2VsXG4gICQuZm5bTkFNRV0ubm9Db25mbGljdCAgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbltOQU1FXSA9IEpRVUVSWV9OT19DT05GTElDVFxuICAgIHJldHVybiBDYXJvdXNlbC5falF1ZXJ5SW50ZXJmYWNlXG4gIH1cblxuICByZXR1cm4gQ2Fyb3VzZWxcblxufSkoalF1ZXJ5KVxuXG5leHBvcnQgZGVmYXVsdCBDYXJvdXNlbFxuIl0sImZpbGUiOiJjYXJvdXNlbC5qcyJ9
