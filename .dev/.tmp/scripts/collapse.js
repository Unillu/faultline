import Util from './util'


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): collapse.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Collapse = (($) => {


  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                = 'collapse'
  const VERSION             = '4.0.0-beta'
  const DATA_KEY            = 'bs.collapse'
  const EVENT_KEY           = `.${DATA_KEY}`
  const DATA_API_KEY        = '.data-api'
  const JQUERY_NO_CONFLICT  = $.fn[NAME]
  const TRANSITION_DURATION = 600

  const Default = {
    toggle : true,
    parent : ''
  }

  const DefaultType = {
    toggle : 'boolean',
    parent : 'string'
  }

  const Event = {
    SHOW           : `show${EVENT_KEY}`,
    SHOWN          : `shown${EVENT_KEY}`,
    HIDE           : `hide${EVENT_KEY}`,
    HIDDEN         : `hidden${EVENT_KEY}`,
    CLICK_DATA_API : `click${EVENT_KEY}${DATA_API_KEY}`
  }

  const ClassName = {
    SHOW       : 'show',
    COLLAPSE   : 'collapse',
    COLLAPSING : 'collapsing',
    COLLAPSED  : 'collapsed'
  }

  const Dimension = {
    WIDTH  : 'width',
    HEIGHT : 'height'
  }

  const Selector = {
    ACTIVES     : '.show, .collapsing',
    DATA_TOGGLE : '[data-toggle="collapse"]'
  }


  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Collapse {

    constructor(element, config) {
      this._isTransitioning = false
      this._element         = element
      this._config          = this._getConfig(config)
      this._triggerArray    = $.makeArray($(
        `[data-toggle="collapse"][href="#${element.id}"],` +
        `[data-toggle="collapse"][data-target="#${element.id}"]`
      ))
      const tabToggles = $(Selector.DATA_TOGGLE)
      for (let i = 0; i < tabToggles.length; i++) {
        const elem = tabToggles[i]
        const selector = Util.getSelectorFromElement(elem)
        if (selector !== null && $(selector).filter(element).length > 0) {
          this._triggerArray.push(elem)
        }
      }

      this._parent = this._config.parent ? this._getParent() : null

      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._element, this._triggerArray)
      }

      if (this._config.toggle) {
        this.toggle()
      }
    }


    // getters

    static get VERSION() {
      return VERSION
    }

    static get Default() {
      return Default
    }


    // public

    toggle() {
      if ($(this._element).hasClass(ClassName.SHOW)) {
        this.hide()
      } else {
        this.show()
      }
    }

    show() {
      if (this._isTransitioning ||
        $(this._element).hasClass(ClassName.SHOW)) {
        return
      }

      let actives
      let activesData

      if (this._parent) {
        actives = $.makeArray($(this._parent).children().children(Selector.ACTIVES))
        if (!actives.length) {
          actives = null
        }
      }

      if (actives) {
        activesData = $(actives).data(DATA_KEY)
        if (activesData && activesData._isTransitioning) {
          return
        }
      }

      const startEvent = $.Event(Event.SHOW)
      $(this._element).trigger(startEvent)
      if (startEvent.isDefaultPrevented()) {
        return
      }

      if (actives) {
        Collapse._jQueryInterface.call($(actives), 'hide')
        if (!activesData) {
          $(actives).data(DATA_KEY, null)
        }
      }

      const dimension = this._getDimension()

      $(this._element)
        .removeClass(ClassName.COLLAPSE)
        .addClass(ClassName.COLLAPSING)

      this._element.style[dimension] = 0

      if (this._triggerArray.length) {
        $(this._triggerArray)
          .removeClass(ClassName.COLLAPSED)
          .attr('aria-expanded', true)
      }

      this.setTransitioning(true)

      const complete = () => {
        $(this._element)
          .removeClass(ClassName.COLLAPSING)
          .addClass(ClassName.COLLAPSE)
          .addClass(ClassName.SHOW)

        this._element.style[dimension] = ''

        this.setTransitioning(false)

        $(this._element).trigger(Event.SHOWN)
      }

      if (!Util.supportsTransitionEnd()) {
        complete()
        return
      }

      const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1)
      const scrollSize           = `scroll${capitalizedDimension}`

      $(this._element)
        .one(Util.TRANSITION_END, complete)
        .emulateTransitionEnd(TRANSITION_DURATION)

      this._element.style[dimension] = `${this._element[scrollSize]}px`
    }

    hide() {
      if (this._isTransitioning ||
        !$(this._element).hasClass(ClassName.SHOW)) {
        return
      }

      const startEvent = $.Event(Event.HIDE)
      $(this._element).trigger(startEvent)
      if (startEvent.isDefaultPrevented()) {
        return
      }

      const dimension       = this._getDimension()

      this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`

      Util.reflow(this._element)

      $(this._element)
        .addClass(ClassName.COLLAPSING)
        .removeClass(ClassName.COLLAPSE)
        .removeClass(ClassName.SHOW)

      if (this._triggerArray.length) {
        for (let i = 0; i < this._triggerArray.length; i++) {
          const trigger = this._triggerArray[i]
          const selector = Util.getSelectorFromElement(trigger)
          if (selector !== null) {
            const $elem = $(selector)
            if (!$elem.hasClass(ClassName.SHOW)) {
              $(trigger).addClass(ClassName.COLLAPSED)
                   .attr('aria-expanded', false)
            }
          }
        }
      }

      this.setTransitioning(true)

      const complete = () => {
        this.setTransitioning(false)
        $(this._element)
          .removeClass(ClassName.COLLAPSING)
          .addClass(ClassName.COLLAPSE)
          .trigger(Event.HIDDEN)
      }

      this._element.style[dimension] = ''

      if (!Util.supportsTransitionEnd()) {
        complete()
        return
      }

      $(this._element)
        .one(Util.TRANSITION_END, complete)
        .emulateTransitionEnd(TRANSITION_DURATION)
    }

    setTransitioning(isTransitioning) {
      this._isTransitioning = isTransitioning
    }

    dispose() {
      $.removeData(this._element, DATA_KEY)

      this._config          = null
      this._parent          = null
      this._element         = null
      this._triggerArray    = null
      this._isTransitioning = null
    }


    // private

    _getConfig(config) {
      config = $.extend({}, Default, config)
      config.toggle = Boolean(config.toggle) // coerce string values
      Util.typeCheckConfig(NAME, config, DefaultType)
      return config
    }

    _getDimension() {
      const hasWidth = $(this._element).hasClass(Dimension.WIDTH)
      return hasWidth ? Dimension.WIDTH : Dimension.HEIGHT
    }

    _getParent() {
      const parent   = $(this._config.parent)[0]
      const selector =
        `[data-toggle="collapse"][data-parent="${this._config.parent}"]`

      $(parent).find(selector).each((i, element) => {
        this._addAriaAndCollapsedClass(
          Collapse._getTargetFromElement(element),
          [element]
        )
      })

      return parent
    }

    _addAriaAndCollapsedClass(element, triggerArray) {
      if (element) {
        const isOpen = $(element).hasClass(ClassName.SHOW)

        if (triggerArray.length) {
          $(triggerArray)
            .toggleClass(ClassName.COLLAPSED, !isOpen)
            .attr('aria-expanded', isOpen)
        }
      }
    }


    // static

    static _getTargetFromElement(element) {
      const selector = Util.getSelectorFromElement(element)
      return selector ? $(selector)[0] : null
    }

    static _jQueryInterface(config) {
      return this.each(function () {
        const $this   = $(this)
        let data      = $this.data(DATA_KEY)
        const _config = $.extend(
          {},
          Default,
          $this.data(),
          typeof config === 'object' && config
        )

        if (!data && _config.toggle && /show|hide/.test(config)) {
          _config.toggle = false
        }

        if (!data) {
          data = new Collapse(this, _config)
          $this.data(DATA_KEY, data)
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

  $(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
    if (!/input|textarea/i.test(event.target.tagName)) {
      event.preventDefault()
    }

    const $trigger = $(this)
    const selector = Util.getSelectorFromElement(this)
    $(selector).each(function () {
      const $target = $(this)
      const data    = $target.data(DATA_KEY)
      const config  = data ? 'toggle' : $trigger.data()
      Collapse._jQueryInterface.call($target, config)
    })
  })


  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME]             = Collapse._jQueryInterface
  $.fn[NAME].Constructor = Collapse
  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Collapse._jQueryInterface
  }

  return Collapse

})(jQuery)

export default Collapse

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb2xsYXBzZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVXRpbCBmcm9tICcuL3V0aWwnXG5cblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQm9vdHN0cmFwICh2NC4wLjAtYmV0YSk6IGNvbGxhcHNlLmpzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5jb25zdCBDb2xsYXBzZSA9ICgoJCkgPT4ge1xuXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgICAgICAgICAgICAgICAgPSAnY29sbGFwc2UnXG4gIGNvbnN0IFZFUlNJT04gICAgICAgICAgICAgPSAnNC4wLjAtYmV0YSdcbiAgY29uc3QgREFUQV9LRVkgICAgICAgICAgICA9ICdicy5jb2xsYXBzZSdcbiAgY29uc3QgRVZFTlRfS0VZICAgICAgICAgICA9IGAuJHtEQVRBX0tFWX1gXG4gIGNvbnN0IERBVEFfQVBJX0tFWSAgICAgICAgPSAnLmRhdGEtYXBpJ1xuICBjb25zdCBKUVVFUllfTk9fQ09ORkxJQ1QgID0gJC5mbltOQU1FXVxuICBjb25zdCBUUkFOU0lUSU9OX0RVUkFUSU9OID0gNjAwXG5cbiAgY29uc3QgRGVmYXVsdCA9IHtcbiAgICB0b2dnbGUgOiB0cnVlLFxuICAgIHBhcmVudCA6ICcnXG4gIH1cblxuICBjb25zdCBEZWZhdWx0VHlwZSA9IHtcbiAgICB0b2dnbGUgOiAnYm9vbGVhbicsXG4gICAgcGFyZW50IDogJ3N0cmluZydcbiAgfVxuXG4gIGNvbnN0IEV2ZW50ID0ge1xuICAgIFNIT1cgICAgICAgICAgIDogYHNob3cke0VWRU5UX0tFWX1gLFxuICAgIFNIT1dOICAgICAgICAgIDogYHNob3duJHtFVkVOVF9LRVl9YCxcbiAgICBISURFICAgICAgICAgICA6IGBoaWRlJHtFVkVOVF9LRVl9YCxcbiAgICBISURERU4gICAgICAgICA6IGBoaWRkZW4ke0VWRU5UX0tFWX1gLFxuICAgIENMSUNLX0RBVEFfQVBJIDogYGNsaWNrJHtFVkVOVF9LRVl9JHtEQVRBX0FQSV9LRVl9YFxuICB9XG5cbiAgY29uc3QgQ2xhc3NOYW1lID0ge1xuICAgIFNIT1cgICAgICAgOiAnc2hvdycsXG4gICAgQ09MTEFQU0UgICA6ICdjb2xsYXBzZScsXG4gICAgQ09MTEFQU0lORyA6ICdjb2xsYXBzaW5nJyxcbiAgICBDT0xMQVBTRUQgIDogJ2NvbGxhcHNlZCdcbiAgfVxuXG4gIGNvbnN0IERpbWVuc2lvbiA9IHtcbiAgICBXSURUSCAgOiAnd2lkdGgnLFxuICAgIEhFSUdIVCA6ICdoZWlnaHQnXG4gIH1cblxuICBjb25zdCBTZWxlY3RvciA9IHtcbiAgICBBQ1RJVkVTICAgICA6ICcuc2hvdywgLmNvbGxhcHNpbmcnLFxuICAgIERBVEFfVE9HR0xFIDogJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdJ1xuICB9XG5cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIENvbGxhcHNlIHtcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGNvbmZpZykge1xuICAgICAgdGhpcy5faXNUcmFuc2l0aW9uaW5nID0gZmFsc2VcbiAgICAgIHRoaXMuX2VsZW1lbnQgICAgICAgICA9IGVsZW1lbnRcbiAgICAgIHRoaXMuX2NvbmZpZyAgICAgICAgICA9IHRoaXMuX2dldENvbmZpZyhjb25maWcpXG4gICAgICB0aGlzLl90cmlnZ2VyQXJyYXkgICAgPSAkLm1ha2VBcnJheSgkKFxuICAgICAgICBgW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1baHJlZj1cIiMke2VsZW1lbnQuaWR9XCJdLGAgK1xuICAgICAgICBgW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1bZGF0YS10YXJnZXQ9XCIjJHtlbGVtZW50LmlkfVwiXWBcbiAgICAgICkpXG4gICAgICBjb25zdCB0YWJUb2dnbGVzID0gJChTZWxlY3Rvci5EQVRBX1RPR0dMRSlcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFiVG9nZ2xlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBlbGVtID0gdGFiVG9nZ2xlc1tpXVxuICAgICAgICBjb25zdCBzZWxlY3RvciA9IFV0aWwuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlbGVtKVxuICAgICAgICBpZiAoc2VsZWN0b3IgIT09IG51bGwgJiYgJChzZWxlY3RvcikuZmlsdGVyKGVsZW1lbnQpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLl90cmlnZ2VyQXJyYXkucHVzaChlbGVtKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3BhcmVudCA9IHRoaXMuX2NvbmZpZy5wYXJlbnQgPyB0aGlzLl9nZXRQYXJlbnQoKSA6IG51bGxcblxuICAgICAgaWYgKCF0aGlzLl9jb25maWcucGFyZW50KSB7XG4gICAgICAgIHRoaXMuX2FkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyh0aGlzLl9lbGVtZW50LCB0aGlzLl90cmlnZ2VyQXJyYXkpXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9jb25maWcudG9nZ2xlKSB7XG4gICAgICAgIHRoaXMudG9nZ2xlKClcbiAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vIGdldHRlcnNcblxuICAgIHN0YXRpYyBnZXQgVkVSU0lPTigpIHtcbiAgICAgIHJldHVybiBWRVJTSU9OXG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBEZWZhdWx0KCkge1xuICAgICAgcmV0dXJuIERlZmF1bHRcbiAgICB9XG5cblxuICAgIC8vIHB1YmxpY1xuXG4gICAgdG9nZ2xlKCkge1xuICAgICAgaWYgKCQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoQ2xhc3NOYW1lLlNIT1cpKSB7XG4gICAgICAgIHRoaXMuaGlkZSgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNob3coKVxuICAgICAgfVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICBpZiAodGhpcy5faXNUcmFuc2l0aW9uaW5nIHx8XG4gICAgICAgICQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoQ2xhc3NOYW1lLlNIT1cpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBsZXQgYWN0aXZlc1xuICAgICAgbGV0IGFjdGl2ZXNEYXRhXG5cbiAgICAgIGlmICh0aGlzLl9wYXJlbnQpIHtcbiAgICAgICAgYWN0aXZlcyA9ICQubWFrZUFycmF5KCQodGhpcy5fcGFyZW50KS5jaGlsZHJlbigpLmNoaWxkcmVuKFNlbGVjdG9yLkFDVElWRVMpKVxuICAgICAgICBpZiAoIWFjdGl2ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgYWN0aXZlcyA9IG51bGxcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoYWN0aXZlcykge1xuICAgICAgICBhY3RpdmVzRGF0YSA9ICQoYWN0aXZlcykuZGF0YShEQVRBX0tFWSlcbiAgICAgICAgaWYgKGFjdGl2ZXNEYXRhICYmIGFjdGl2ZXNEYXRhLl9pc1RyYW5zaXRpb25pbmcpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBzdGFydEV2ZW50ID0gJC5FdmVudChFdmVudC5TSE9XKVxuICAgICAgJCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKHN0YXJ0RXZlbnQpXG4gICAgICBpZiAoc3RhcnRFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKGFjdGl2ZXMpIHtcbiAgICAgICAgQ29sbGFwc2UuX2pRdWVyeUludGVyZmFjZS5jYWxsKCQoYWN0aXZlcyksICdoaWRlJylcbiAgICAgICAgaWYgKCFhY3RpdmVzRGF0YSkge1xuICAgICAgICAgICQoYWN0aXZlcykuZGF0YShEQVRBX0tFWSwgbnVsbClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBkaW1lbnNpb24gPSB0aGlzLl9nZXREaW1lbnNpb24oKVxuXG4gICAgICAkKHRoaXMuX2VsZW1lbnQpXG4gICAgICAgIC5yZW1vdmVDbGFzcyhDbGFzc05hbWUuQ09MTEFQU0UpXG4gICAgICAgIC5hZGRDbGFzcyhDbGFzc05hbWUuQ09MTEFQU0lORylcblxuICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZVtkaW1lbnNpb25dID0gMFxuXG4gICAgICBpZiAodGhpcy5fdHJpZ2dlckFycmF5Lmxlbmd0aCkge1xuICAgICAgICAkKHRoaXMuX3RyaWdnZXJBcnJheSlcbiAgICAgICAgICAucmVtb3ZlQ2xhc3MoQ2xhc3NOYW1lLkNPTExBUFNFRClcbiAgICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0VHJhbnNpdGlvbmluZyh0cnVlKVxuXG4gICAgICBjb25zdCBjb21wbGV0ZSA9ICgpID0+IHtcbiAgICAgICAgJCh0aGlzLl9lbGVtZW50KVxuICAgICAgICAgIC5yZW1vdmVDbGFzcyhDbGFzc05hbWUuQ09MTEFQU0lORylcbiAgICAgICAgICAuYWRkQ2xhc3MoQ2xhc3NOYW1lLkNPTExBUFNFKVxuICAgICAgICAgIC5hZGRDbGFzcyhDbGFzc05hbWUuU0hPVylcblxuICAgICAgICB0aGlzLl9lbGVtZW50LnN0eWxlW2RpbWVuc2lvbl0gPSAnJ1xuXG4gICAgICAgIHRoaXMuc2V0VHJhbnNpdGlvbmluZyhmYWxzZSlcblxuICAgICAgICAkKHRoaXMuX2VsZW1lbnQpLnRyaWdnZXIoRXZlbnQuU0hPV04pXG4gICAgICB9XG5cbiAgICAgIGlmICghVXRpbC5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSkge1xuICAgICAgICBjb21wbGV0ZSgpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBjYXBpdGFsaXplZERpbWVuc2lvbiA9IGRpbWVuc2lvblswXS50b1VwcGVyQ2FzZSgpICsgZGltZW5zaW9uLnNsaWNlKDEpXG4gICAgICBjb25zdCBzY3JvbGxTaXplICAgICAgICAgICA9IGBzY3JvbGwke2NhcGl0YWxpemVkRGltZW5zaW9ufWBcblxuICAgICAgJCh0aGlzLl9lbGVtZW50KVxuICAgICAgICAub25lKFV0aWwuVFJBTlNJVElPTl9FTkQsIGNvbXBsZXRlKVxuICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoVFJBTlNJVElPTl9EVVJBVElPTilcblxuICAgICAgdGhpcy5fZWxlbWVudC5zdHlsZVtkaW1lbnNpb25dID0gYCR7dGhpcy5fZWxlbWVudFtzY3JvbGxTaXplXX1weGBcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgaWYgKHRoaXMuX2lzVHJhbnNpdGlvbmluZyB8fFxuICAgICAgICAhJCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhDbGFzc05hbWUuU0hPVykpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHN0YXJ0RXZlbnQgPSAkLkV2ZW50KEV2ZW50LkhJREUpXG4gICAgICAkKHRoaXMuX2VsZW1lbnQpLnRyaWdnZXIoc3RhcnRFdmVudClcbiAgICAgIGlmIChzdGFydEV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBkaW1lbnNpb24gICAgICAgPSB0aGlzLl9nZXREaW1lbnNpb24oKVxuXG4gICAgICB0aGlzLl9lbGVtZW50LnN0eWxlW2RpbWVuc2lvbl0gPSBgJHt0aGlzLl9lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpW2RpbWVuc2lvbl19cHhgXG5cbiAgICAgIFV0aWwucmVmbG93KHRoaXMuX2VsZW1lbnQpXG5cbiAgICAgICQodGhpcy5fZWxlbWVudClcbiAgICAgICAgLmFkZENsYXNzKENsYXNzTmFtZS5DT0xMQVBTSU5HKVxuICAgICAgICAucmVtb3ZlQ2xhc3MoQ2xhc3NOYW1lLkNPTExBUFNFKVxuICAgICAgICAucmVtb3ZlQ2xhc3MoQ2xhc3NOYW1lLlNIT1cpXG5cbiAgICAgIGlmICh0aGlzLl90cmlnZ2VyQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdHJpZ2dlckFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgdHJpZ2dlciA9IHRoaXMuX3RyaWdnZXJBcnJheVtpXVxuICAgICAgICAgIGNvbnN0IHNlbGVjdG9yID0gVXRpbC5nZXRTZWxlY3RvckZyb21FbGVtZW50KHRyaWdnZXIpXG4gICAgICAgICAgaWYgKHNlbGVjdG9yICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCAkZWxlbSA9ICQoc2VsZWN0b3IpXG4gICAgICAgICAgICBpZiAoISRlbGVtLmhhc0NsYXNzKENsYXNzTmFtZS5TSE9XKSkge1xuICAgICAgICAgICAgICAkKHRyaWdnZXIpLmFkZENsYXNzKENsYXNzTmFtZS5DT0xMQVBTRUQpXG4gICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRUcmFuc2l0aW9uaW5nKHRydWUpXG5cbiAgICAgIGNvbnN0IGNvbXBsZXRlID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNldFRyYW5zaXRpb25pbmcoZmFsc2UpXG4gICAgICAgICQodGhpcy5fZWxlbWVudClcbiAgICAgICAgICAucmVtb3ZlQ2xhc3MoQ2xhc3NOYW1lLkNPTExBUFNJTkcpXG4gICAgICAgICAgLmFkZENsYXNzKENsYXNzTmFtZS5DT0xMQVBTRSlcbiAgICAgICAgICAudHJpZ2dlcihFdmVudC5ISURERU4pXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2VsZW1lbnQuc3R5bGVbZGltZW5zaW9uXSA9ICcnXG5cbiAgICAgIGlmICghVXRpbC5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSkge1xuICAgICAgICBjb21wbGV0ZSgpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAkKHRoaXMuX2VsZW1lbnQpXG4gICAgICAgIC5vbmUoVXRpbC5UUkFOU0lUSU9OX0VORCwgY29tcGxldGUpXG4gICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChUUkFOU0lUSU9OX0RVUkFUSU9OKVxuICAgIH1cblxuICAgIHNldFRyYW5zaXRpb25pbmcoaXNUcmFuc2l0aW9uaW5nKSB7XG4gICAgICB0aGlzLl9pc1RyYW5zaXRpb25pbmcgPSBpc1RyYW5zaXRpb25pbmdcbiAgICB9XG5cbiAgICBkaXNwb3NlKCkge1xuICAgICAgJC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQsIERBVEFfS0VZKVxuXG4gICAgICB0aGlzLl9jb25maWcgICAgICAgICAgPSBudWxsXG4gICAgICB0aGlzLl9wYXJlbnQgICAgICAgICAgPSBudWxsXG4gICAgICB0aGlzLl9lbGVtZW50ICAgICAgICAgPSBudWxsXG4gICAgICB0aGlzLl90cmlnZ2VyQXJyYXkgICAgPSBudWxsXG4gICAgICB0aGlzLl9pc1RyYW5zaXRpb25pbmcgPSBudWxsXG4gICAgfVxuXG5cbiAgICAvLyBwcml2YXRlXG5cbiAgICBfZ2V0Q29uZmlnKGNvbmZpZykge1xuICAgICAgY29uZmlnID0gJC5leHRlbmQoe30sIERlZmF1bHQsIGNvbmZpZylcbiAgICAgIGNvbmZpZy50b2dnbGUgPSBCb29sZWFuKGNvbmZpZy50b2dnbGUpIC8vIGNvZXJjZSBzdHJpbmcgdmFsdWVzXG4gICAgICBVdGlsLnR5cGVDaGVja0NvbmZpZyhOQU1FLCBjb25maWcsIERlZmF1bHRUeXBlKVxuICAgICAgcmV0dXJuIGNvbmZpZ1xuICAgIH1cblxuICAgIF9nZXREaW1lbnNpb24oKSB7XG4gICAgICBjb25zdCBoYXNXaWR0aCA9ICQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoRGltZW5zaW9uLldJRFRIKVxuICAgICAgcmV0dXJuIGhhc1dpZHRoID8gRGltZW5zaW9uLldJRFRIIDogRGltZW5zaW9uLkhFSUdIVFxuICAgIH1cblxuICAgIF9nZXRQYXJlbnQoKSB7XG4gICAgICBjb25zdCBwYXJlbnQgICA9ICQodGhpcy5fY29uZmlnLnBhcmVudClbMF1cbiAgICAgIGNvbnN0IHNlbGVjdG9yID1cbiAgICAgICAgYFtkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2RhdGEtcGFyZW50PVwiJHt0aGlzLl9jb25maWcucGFyZW50fVwiXWBcblxuICAgICAgJChwYXJlbnQpLmZpbmQoc2VsZWN0b3IpLmVhY2goKGksIGVsZW1lbnQpID0+IHtcbiAgICAgICAgdGhpcy5fYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKFxuICAgICAgICAgIENvbGxhcHNlLl9nZXRUYXJnZXRGcm9tRWxlbWVudChlbGVtZW50KSxcbiAgICAgICAgICBbZWxlbWVudF1cbiAgICAgICAgKVxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIHBhcmVudFxuICAgIH1cblxuICAgIF9hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MoZWxlbWVudCwgdHJpZ2dlckFycmF5KSB7XG4gICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICBjb25zdCBpc09wZW4gPSAkKGVsZW1lbnQpLmhhc0NsYXNzKENsYXNzTmFtZS5TSE9XKVxuXG4gICAgICAgIGlmICh0cmlnZ2VyQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgJCh0cmlnZ2VyQXJyYXkpXG4gICAgICAgICAgICAudG9nZ2xlQ2xhc3MoQ2xhc3NOYW1lLkNPTExBUFNFRCwgIWlzT3BlbilcbiAgICAgICAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgaXNPcGVuKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG5cbiAgICAvLyBzdGF0aWNcblxuICAgIHN0YXRpYyBfZ2V0VGFyZ2V0RnJvbUVsZW1lbnQoZWxlbWVudCkge1xuICAgICAgY29uc3Qgc2VsZWN0b3IgPSBVdGlsLmdldFNlbGVjdG9yRnJvbUVsZW1lbnQoZWxlbWVudClcbiAgICAgIHJldHVybiBzZWxlY3RvciA/ICQoc2VsZWN0b3IpWzBdIDogbnVsbFxuICAgIH1cblxuICAgIHN0YXRpYyBfalF1ZXJ5SW50ZXJmYWNlKGNvbmZpZykge1xuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0ICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICAgIGxldCBkYXRhICAgICAgPSAkdGhpcy5kYXRhKERBVEFfS0VZKVxuICAgICAgICBjb25zdCBfY29uZmlnID0gJC5leHRlbmQoXG4gICAgICAgICAge30sXG4gICAgICAgICAgRGVmYXVsdCxcbiAgICAgICAgICAkdGhpcy5kYXRhKCksXG4gICAgICAgICAgdHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcgJiYgY29uZmlnXG4gICAgICAgIClcblxuICAgICAgICBpZiAoIWRhdGEgJiYgX2NvbmZpZy50b2dnbGUgJiYgL3Nob3d8aGlkZS8udGVzdChjb25maWcpKSB7XG4gICAgICAgICAgX2NvbmZpZy50b2dnbGUgPSBmYWxzZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgZGF0YSA9IG5ldyBDb2xsYXBzZSh0aGlzLCBfY29uZmlnKVxuICAgICAgICAgICR0aGlzLmRhdGEoREFUQV9LRVksIGRhdGEpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBpZiAoZGF0YVtjb25maWddID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gbWV0aG9kIG5hbWVkIFwiJHtjb25maWd9XCJgKVxuICAgICAgICAgIH1cbiAgICAgICAgICBkYXRhW2NvbmZpZ10oKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICB9XG5cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIERhdGEgQXBpIGltcGxlbWVudGF0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICAkKGRvY3VtZW50KS5vbihFdmVudC5DTElDS19EQVRBX0FQSSwgU2VsZWN0b3IuREFUQV9UT0dHTEUsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlmICghL2lucHV0fHRleHRhcmVhL2kudGVzdChldmVudC50YXJnZXQudGFnTmFtZSkpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICB9XG5cbiAgICBjb25zdCAkdHJpZ2dlciA9ICQodGhpcylcbiAgICBjb25zdCBzZWxlY3RvciA9IFV0aWwuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudCh0aGlzKVxuICAgICQoc2VsZWN0b3IpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgJHRhcmdldCA9ICQodGhpcylcbiAgICAgIGNvbnN0IGRhdGEgICAgPSAkdGFyZ2V0LmRhdGEoREFUQV9LRVkpXG4gICAgICBjb25zdCBjb25maWcgID0gZGF0YSA/ICd0b2dnbGUnIDogJHRyaWdnZXIuZGF0YSgpXG4gICAgICBDb2xsYXBzZS5falF1ZXJ5SW50ZXJmYWNlLmNhbGwoJHRhcmdldCwgY29uZmlnKVxuICAgIH0pXG4gIH0pXG5cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIGpRdWVyeVxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgJC5mbltOQU1FXSAgICAgICAgICAgICA9IENvbGxhcHNlLl9qUXVlcnlJbnRlcmZhY2VcbiAgJC5mbltOQU1FXS5Db25zdHJ1Y3RvciA9IENvbGxhcHNlXG4gICQuZm5bTkFNRV0ubm9Db25mbGljdCAgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbltOQU1FXSA9IEpRVUVSWV9OT19DT05GTElDVFxuICAgIHJldHVybiBDb2xsYXBzZS5falF1ZXJ5SW50ZXJmYWNlXG4gIH1cblxuICByZXR1cm4gQ29sbGFwc2VcblxufSkoalF1ZXJ5KVxuXG5leHBvcnQgZGVmYXVsdCBDb2xsYXBzZVxuIl0sImZpbGUiOiJjb2xsYXBzZS5qcyJ9
