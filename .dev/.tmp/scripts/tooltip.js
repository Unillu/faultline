/* global Popper */

import Util from './util'


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): tooltip.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Tooltip = (($) => {

  /**
   * Check for Popper dependency
   * Popper - https://popper.js.org
   */
  if (typeof Popper === 'undefined') {
    throw new Error('Bootstrap tooltips require Popper.js (https://popper.js.org)')
  }


  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                = 'tooltip'
  const VERSION             = '4.0.0-beta'
  const DATA_KEY            = 'bs.tooltip'
  const EVENT_KEY           = `.${DATA_KEY}`
  const JQUERY_NO_CONFLICT  = $.fn[NAME]
  const TRANSITION_DURATION = 150
  const CLASS_PREFIX        = 'bs-tooltip'
  const BSCLS_PREFIX_REGEX = new RegExp(`(^|\\s)${CLASS_PREFIX}\\S+`, 'g')

  const DefaultType = {
    animation           : 'boolean',
    template            : 'string',
    title               : '(string|element|function)',
    trigger             : 'string',
    delay               : '(number|object)',
    html                : 'boolean',
    selector            : '(string|boolean)',
    placement           : '(string|function)',
    offset              : '(number|string)',
    container           : '(string|element|boolean)',
    fallbackPlacement   : '(string|array)'
  }

  const AttachmentMap = {
    AUTO   : 'auto',
    TOP    : 'top',
    RIGHT  : 'right',
    BOTTOM : 'bottom',
    LEFT   : 'left'
  }

  const Default = {
    animation           : true,
    template            : '<div class="tooltip" role="tooltip">'
                        + '<div class="arrow"></div>'
                        + '<div class="tooltip-inner"></div></div>',
    trigger             : 'hover focus',
    title               : '',
    delay               : 0,
    html                : false,
    selector            : false,
    placement           : 'top',
    offset              : 0,
    container           : false,
    fallbackPlacement   : 'flip'
  }

  const HoverState = {
    SHOW : 'show',
    OUT  : 'out'
  }

  const Event = {
    HIDE       : `hide${EVENT_KEY}`,
    HIDDEN     : `hidden${EVENT_KEY}`,
    SHOW       : `show${EVENT_KEY}`,
    SHOWN      : `shown${EVENT_KEY}`,
    INSERTED   : `inserted${EVENT_KEY}`,
    CLICK      : `click${EVENT_KEY}`,
    FOCUSIN    : `focusin${EVENT_KEY}`,
    FOCUSOUT   : `focusout${EVENT_KEY}`,
    MOUSEENTER : `mouseenter${EVENT_KEY}`,
    MOUSELEAVE : `mouseleave${EVENT_KEY}`
  }

  const ClassName = {
    FADE : 'fade',
    SHOW : 'show'
  }

  const Selector = {
    TOOLTIP       : '.tooltip',
    TOOLTIP_INNER : '.tooltip-inner',
    ARROW         : '.arrow'
  }

  const Trigger = {
    HOVER  : 'hover',
    FOCUS  : 'focus',
    CLICK  : 'click',
    MANUAL : 'manual'
  }


  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Tooltip {

    constructor(element, config) {

      // private
      this._isEnabled     = true
      this._timeout       = 0
      this._hoverState    = ''
      this._activeTrigger = {}
      this._popper        = null

      // protected
      this.element = element
      this.config  = this._getConfig(config)
      this.tip     = null

      this._setListeners()

    }


    // getters

    static get VERSION() {
      return VERSION
    }

    static get Default() {
      return Default
    }

    static get NAME() {
      return NAME
    }

    static get DATA_KEY() {
      return DATA_KEY
    }

    static get Event() {
      return Event
    }

    static get EVENT_KEY() {
      return EVENT_KEY
    }

    static get DefaultType() {
      return DefaultType
    }


    // public

    enable() {
      this._isEnabled = true
    }

    disable() {
      this._isEnabled = false
    }

    toggleEnabled() {
      this._isEnabled = !this._isEnabled
    }

    toggle(event) {
      if (event) {
        const dataKey = this.constructor.DATA_KEY
        let context = $(event.currentTarget).data(dataKey)

        if (!context) {
          context = new this.constructor(
            event.currentTarget,
            this._getDelegateConfig()
          )
          $(event.currentTarget).data(dataKey, context)
        }

        context._activeTrigger.click = !context._activeTrigger.click

        if (context._isWithActiveTrigger()) {
          context._enter(null, context)
        } else {
          context._leave(null, context)
        }

      } else {

        if ($(this.getTipElement()).hasClass(ClassName.SHOW)) {
          this._leave(null, this)
          return
        }

        this._enter(null, this)
      }
    }

    dispose() {
      clearTimeout(this._timeout)

      $.removeData(this.element, this.constructor.DATA_KEY)

      $(this.element).off(this.constructor.EVENT_KEY)
      $(this.element).closest('.modal').off('hide.bs.modal')

      if (this.tip) {
        $(this.tip).remove()
      }

      this._isEnabled     = null
      this._timeout       = null
      this._hoverState    = null
      this._activeTrigger = null
      if (this._popper !== null) {
        this._popper.destroy()
      }
      this._popper        = null

      this.element = null
      this.config  = null
      this.tip     = null
    }

    show() {
      if ($(this.element).css('display') === 'none') {
        throw new Error('Please use show on visible elements')
      }

      const showEvent = $.Event(this.constructor.Event.SHOW)
      if (this.isWithContent() && this._isEnabled) {
        $(this.element).trigger(showEvent)

        const isInTheDom = $.contains(
          this.element.ownerDocument.documentElement,
          this.element
        )

        if (showEvent.isDefaultPrevented() || !isInTheDom) {
          return
        }

        const tip   = this.getTipElement()
        const tipId = Util.getUID(this.constructor.NAME)

        tip.setAttribute('id', tipId)
        this.element.setAttribute('aria-describedby', tipId)

        this.setContent()

        if (this.config.animation) {
          $(tip).addClass(ClassName.FADE)
        }

        const placement  = typeof this.config.placement === 'function' ?
          this.config.placement.call(this, tip, this.element) :
          this.config.placement

        const attachment = this._getAttachment(placement)
        this.addAttachmentClass(attachment)

        const container = this.config.container === false ? document.body : $(this.config.container)

        $(tip).data(this.constructor.DATA_KEY, this)

        if (!$.contains(this.element.ownerDocument.documentElement, this.tip)) {
          $(tip).appendTo(container)
        }

        $(this.element).trigger(this.constructor.Event.INSERTED)

        this._popper = new Popper(this.element, tip, {
          placement: attachment,
          modifiers: {
            offset: {
              offset: this.config.offset
            },
            flip: {
              behavior: this.config.fallbackPlacement
            },
            arrow: {
              element: Selector.ARROW
            }
          },
          onCreate: (data) => {
            if (data.originalPlacement !== data.placement) {
              this._handlePopperPlacementChange(data)
            }
          },
          onUpdate : (data) => {
            this._handlePopperPlacementChange(data)
          }
        })

        $(tip).addClass(ClassName.SHOW)

        // if this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
        if ('ontouchstart' in document.documentElement) {
          $('body').children().on('mouseover', null, $.noop)
        }

        const complete = () => {
          if (this.config.animation) {
            this._fixTransition()
          }
          const prevHoverState = this._hoverState
          this._hoverState     = null

          $(this.element).trigger(this.constructor.Event.SHOWN)

          if (prevHoverState === HoverState.OUT) {
            this._leave(null, this)
          }
        }

        if (Util.supportsTransitionEnd() && $(this.tip).hasClass(ClassName.FADE)) {
          $(this.tip)
            .one(Util.TRANSITION_END, complete)
            .emulateTransitionEnd(Tooltip._TRANSITION_DURATION)
        } else {
          complete()
        }
      }
    }

    hide(callback) {
      const tip       = this.getTipElement()
      const hideEvent = $.Event(this.constructor.Event.HIDE)
      const complete  = () => {
        if (this._hoverState !== HoverState.SHOW && tip.parentNode) {
          tip.parentNode.removeChild(tip)
        }

        this._cleanTipClass()
        this.element.removeAttribute('aria-describedby')
        $(this.element).trigger(this.constructor.Event.HIDDEN)
        if (this._popper !== null) {
          this._popper.destroy()
        }

        if (callback) {
          callback()
        }
      }

      $(this.element).trigger(hideEvent)

      if (hideEvent.isDefaultPrevented()) {
        return
      }

      $(tip).removeClass(ClassName.SHOW)

      // if this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support
      if ('ontouchstart' in document.documentElement) {
        $('body').children().off('mouseover', null, $.noop)
      }

      this._activeTrigger[Trigger.CLICK] = false
      this._activeTrigger[Trigger.FOCUS] = false
      this._activeTrigger[Trigger.HOVER] = false

      if (Util.supportsTransitionEnd() &&
          $(this.tip).hasClass(ClassName.FADE)) {

        $(tip)
          .one(Util.TRANSITION_END, complete)
          .emulateTransitionEnd(TRANSITION_DURATION)

      } else {
        complete()
      }

      this._hoverState = ''

    }

    update() {
      if (this._popper !== null) {
        this._popper.scheduleUpdate()
      }
    }

    // protected

    isWithContent() {
      return Boolean(this.getTitle())
    }

    addAttachmentClass(attachment) {
      $(this.getTipElement()).addClass(`${CLASS_PREFIX}-${attachment}`)
    }

    getTipElement() {
      return this.tip = this.tip || $(this.config.template)[0]
    }

    setContent() {
      const $tip = $(this.getTipElement())
      this.setElementContent($tip.find(Selector.TOOLTIP_INNER), this.getTitle())
      $tip.removeClass(`${ClassName.FADE} ${ClassName.SHOW}`)
    }

    setElementContent($element, content) {
      const html = this.config.html
      if (typeof content === 'object' && (content.nodeType || content.jquery)) {
        // content is a DOM node or a jQuery
        if (html) {
          if (!$(content).parent().is($element)) {
            $element.empty().append(content)
          }
        } else {
          $element.text($(content).text())
        }
      } else {
        $element[html ? 'html' : 'text'](content)
      }
    }

    getTitle() {
      let title = this.element.getAttribute('data-original-title')

      if (!title) {
        title = typeof this.config.title === 'function' ?
          this.config.title.call(this.element) :
          this.config.title
      }

      return title
    }


    // private

    _getAttachment(placement) {
      return AttachmentMap[placement.toUpperCase()]
    }

    _setListeners() {
      const triggers = this.config.trigger.split(' ')

      triggers.forEach((trigger) => {
        if (trigger === 'click') {
          $(this.element).on(
            this.constructor.Event.CLICK,
            this.config.selector,
            (event) => this.toggle(event)
          )

        } else if (trigger !== Trigger.MANUAL) {
          const eventIn  = trigger === Trigger.HOVER ?
            this.constructor.Event.MOUSEENTER :
            this.constructor.Event.FOCUSIN
          const eventOut = trigger === Trigger.HOVER ?
            this.constructor.Event.MOUSELEAVE :
            this.constructor.Event.FOCUSOUT

          $(this.element)
            .on(
              eventIn,
              this.config.selector,
              (event) => this._enter(event)
            )
            .on(
              eventOut,
              this.config.selector,
              (event) => this._leave(event)
            )
        }

        $(this.element).closest('.modal').on(
          'hide.bs.modal',
          () => this.hide()
        )
      })

      if (this.config.selector) {
        this.config = $.extend({}, this.config, {
          trigger  : 'manual',
          selector : ''
        })
      } else {
        this._fixTitle()
      }
    }

    _fixTitle() {
      const titleType = typeof this.element.getAttribute('data-original-title')
      if (this.element.getAttribute('title') ||
         titleType !== 'string') {
        this.element.setAttribute(
          'data-original-title',
          this.element.getAttribute('title') || ''
        )
        this.element.setAttribute('title', '')
      }
    }

    _enter(event, context) {
      const dataKey = this.constructor.DATA_KEY

      context = context || $(event.currentTarget).data(dataKey)

      if (!context) {
        context = new this.constructor(
          event.currentTarget,
          this._getDelegateConfig()
        )
        $(event.currentTarget).data(dataKey, context)
      }

      if (event) {
        context._activeTrigger[
          event.type === 'focusin' ? Trigger.FOCUS : Trigger.HOVER
        ] = true
      }

      if ($(context.getTipElement()).hasClass(ClassName.SHOW) ||
         context._hoverState === HoverState.SHOW) {
        context._hoverState = HoverState.SHOW
        return
      }

      clearTimeout(context._timeout)

      context._hoverState = HoverState.SHOW

      if (!context.config.delay || !context.config.delay.show) {
        context.show()
        return
      }

      context._timeout = setTimeout(() => {
        if (context._hoverState === HoverState.SHOW) {
          context.show()
        }
      }, context.config.delay.show)
    }

    _leave(event, context) {
      const dataKey = this.constructor.DATA_KEY

      context = context || $(event.currentTarget).data(dataKey)

      if (!context) {
        context = new this.constructor(
          event.currentTarget,
          this._getDelegateConfig()
        )
        $(event.currentTarget).data(dataKey, context)
      }

      if (event) {
        context._activeTrigger[
          event.type === 'focusout' ? Trigger.FOCUS : Trigger.HOVER
        ] = false
      }

      if (context._isWithActiveTrigger()) {
        return
      }

      clearTimeout(context._timeout)

      context._hoverState = HoverState.OUT

      if (!context.config.delay || !context.config.delay.hide) {
        context.hide()
        return
      }

      context._timeout = setTimeout(() => {
        if (context._hoverState === HoverState.OUT) {
          context.hide()
        }
      }, context.config.delay.hide)
    }

    _isWithActiveTrigger() {
      for (const trigger in this._activeTrigger) {
        if (this._activeTrigger[trigger]) {
          return true
        }
      }

      return false
    }

    _getConfig(config) {
      config = $.extend(
        {},
        this.constructor.Default,
        $(this.element).data(),
        config
      )

      if (config.delay && typeof config.delay === 'number') {
        config.delay = {
          show : config.delay,
          hide : config.delay
        }
      }

      if (config.title && typeof config.title === 'number') {
        config.title = config.title.toString()
      }

      if (config.content && typeof config.content === 'number') {
        config.content = config.content.toString()
      }

      Util.typeCheckConfig(
        NAME,
        config,
        this.constructor.DefaultType
      )

      return config
    }

    _getDelegateConfig() {
      const config = {}

      if (this.config) {
        for (const key in this.config) {
          if (this.constructor.Default[key] !== this.config[key]) {
            config[key] = this.config[key]
          }
        }
      }

      return config
    }

    _cleanTipClass() {
      const $tip = $(this.getTipElement())
      const tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX)
      if (tabClass !== null && tabClass.length > 0) {
        $tip.removeClass(tabClass.join(''))
      }
    }

    _handlePopperPlacementChange(data) {
      this._cleanTipClass()
      this.addAttachmentClass(this._getAttachment(data.placement))
    }

    _fixTransition() {
      const tip                 = this.getTipElement()
      const initConfigAnimation = this.config.animation
      if (tip.getAttribute('x-placement') !== null) {
        return
      }
      $(tip).removeClass(ClassName.FADE)
      this.config.animation = false
      this.hide()
      this.show()
      this.config.animation = initConfigAnimation
    }

    // static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data      = $(this).data(DATA_KEY)
        const _config = typeof config === 'object' && config

        if (!data && /dispose|hide/.test(config)) {
          return
        }

        if (!data) {
          data = new Tooltip(this, _config)
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
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME]             = Tooltip._jQueryInterface
  $.fn[NAME].Constructor = Tooltip
  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Tooltip._jQueryInterface
  }

  return Tooltip

})(jQuery)

export default Tooltip

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ0b29sdGlwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCBQb3BwZXIgKi9cblxuaW1wb3J0IFV0aWwgZnJvbSAnLi91dGlsJ1xuXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEJvb3RzdHJhcCAodjQuMC4wLWJldGEpOiB0b29sdGlwLmpzXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5jb25zdCBUb29sdGlwID0gKCgkKSA9PiB7XG5cbiAgLyoqXG4gICAqIENoZWNrIGZvciBQb3BwZXIgZGVwZW5kZW5jeVxuICAgKiBQb3BwZXIgLSBodHRwczovL3BvcHBlci5qcy5vcmdcbiAgICovXG4gIGlmICh0eXBlb2YgUG9wcGVyID09PSAndW5kZWZpbmVkJykge1xuICAgIHRocm93IG5ldyBFcnJvcignQm9vdHN0cmFwIHRvb2x0aXBzIHJlcXVpcmUgUG9wcGVyLmpzIChodHRwczovL3BvcHBlci5qcy5vcmcpJylcbiAgfVxuXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgICAgICAgICAgICAgICAgPSAndG9vbHRpcCdcbiAgY29uc3QgVkVSU0lPTiAgICAgICAgICAgICA9ICc0LjAuMC1iZXRhJ1xuICBjb25zdCBEQVRBX0tFWSAgICAgICAgICAgID0gJ2JzLnRvb2x0aXAnXG4gIGNvbnN0IEVWRU5UX0tFWSAgICAgICAgICAgPSBgLiR7REFUQV9LRVl9YFxuICBjb25zdCBKUVVFUllfTk9fQ09ORkxJQ1QgID0gJC5mbltOQU1FXVxuICBjb25zdCBUUkFOU0lUSU9OX0RVUkFUSU9OID0gMTUwXG4gIGNvbnN0IENMQVNTX1BSRUZJWCAgICAgICAgPSAnYnMtdG9vbHRpcCdcbiAgY29uc3QgQlNDTFNfUFJFRklYX1JFR0VYID0gbmV3IFJlZ0V4cChgKF58XFxcXHMpJHtDTEFTU19QUkVGSVh9XFxcXFMrYCwgJ2cnKVxuXG4gIGNvbnN0IERlZmF1bHRUeXBlID0ge1xuICAgIGFuaW1hdGlvbiAgICAgICAgICAgOiAnYm9vbGVhbicsXG4gICAgdGVtcGxhdGUgICAgICAgICAgICA6ICdzdHJpbmcnLFxuICAgIHRpdGxlICAgICAgICAgICAgICAgOiAnKHN0cmluZ3xlbGVtZW50fGZ1bmN0aW9uKScsXG4gICAgdHJpZ2dlciAgICAgICAgICAgICA6ICdzdHJpbmcnLFxuICAgIGRlbGF5ICAgICAgICAgICAgICAgOiAnKG51bWJlcnxvYmplY3QpJyxcbiAgICBodG1sICAgICAgICAgICAgICAgIDogJ2Jvb2xlYW4nLFxuICAgIHNlbGVjdG9yICAgICAgICAgICAgOiAnKHN0cmluZ3xib29sZWFuKScsXG4gICAgcGxhY2VtZW50ICAgICAgICAgICA6ICcoc3RyaW5nfGZ1bmN0aW9uKScsXG4gICAgb2Zmc2V0ICAgICAgICAgICAgICA6ICcobnVtYmVyfHN0cmluZyknLFxuICAgIGNvbnRhaW5lciAgICAgICAgICAgOiAnKHN0cmluZ3xlbGVtZW50fGJvb2xlYW4pJyxcbiAgICBmYWxsYmFja1BsYWNlbWVudCAgIDogJyhzdHJpbmd8YXJyYXkpJ1xuICB9XG5cbiAgY29uc3QgQXR0YWNobWVudE1hcCA9IHtcbiAgICBBVVRPICAgOiAnYXV0bycsXG4gICAgVE9QICAgIDogJ3RvcCcsXG4gICAgUklHSFQgIDogJ3JpZ2h0JyxcbiAgICBCT1RUT00gOiAnYm90dG9tJyxcbiAgICBMRUZUICAgOiAnbGVmdCdcbiAgfVxuXG4gIGNvbnN0IERlZmF1bHQgPSB7XG4gICAgYW5pbWF0aW9uICAgICAgICAgICA6IHRydWUsXG4gICAgdGVtcGxhdGUgICAgICAgICAgICA6ICc8ZGl2IGNsYXNzPVwidG9vbHRpcFwiIHJvbGU9XCJ0b29sdGlwXCI+J1xuICAgICAgICAgICAgICAgICAgICAgICAgKyAnPGRpdiBjbGFzcz1cImFycm93XCI+PC9kaXY+J1xuICAgICAgICAgICAgICAgICAgICAgICAgKyAnPGRpdiBjbGFzcz1cInRvb2x0aXAtaW5uZXJcIj48L2Rpdj48L2Rpdj4nLFxuICAgIHRyaWdnZXIgICAgICAgICAgICAgOiAnaG92ZXIgZm9jdXMnLFxuICAgIHRpdGxlICAgICAgICAgICAgICAgOiAnJyxcbiAgICBkZWxheSAgICAgICAgICAgICAgIDogMCxcbiAgICBodG1sICAgICAgICAgICAgICAgIDogZmFsc2UsXG4gICAgc2VsZWN0b3IgICAgICAgICAgICA6IGZhbHNlLFxuICAgIHBsYWNlbWVudCAgICAgICAgICAgOiAndG9wJyxcbiAgICBvZmZzZXQgICAgICAgICAgICAgIDogMCxcbiAgICBjb250YWluZXIgICAgICAgICAgIDogZmFsc2UsXG4gICAgZmFsbGJhY2tQbGFjZW1lbnQgICA6ICdmbGlwJ1xuICB9XG5cbiAgY29uc3QgSG92ZXJTdGF0ZSA9IHtcbiAgICBTSE9XIDogJ3Nob3cnLFxuICAgIE9VVCAgOiAnb3V0J1xuICB9XG5cbiAgY29uc3QgRXZlbnQgPSB7XG4gICAgSElERSAgICAgICA6IGBoaWRlJHtFVkVOVF9LRVl9YCxcbiAgICBISURERU4gICAgIDogYGhpZGRlbiR7RVZFTlRfS0VZfWAsXG4gICAgU0hPVyAgICAgICA6IGBzaG93JHtFVkVOVF9LRVl9YCxcbiAgICBTSE9XTiAgICAgIDogYHNob3duJHtFVkVOVF9LRVl9YCxcbiAgICBJTlNFUlRFRCAgIDogYGluc2VydGVkJHtFVkVOVF9LRVl9YCxcbiAgICBDTElDSyAgICAgIDogYGNsaWNrJHtFVkVOVF9LRVl9YCxcbiAgICBGT0NVU0lOICAgIDogYGZvY3VzaW4ke0VWRU5UX0tFWX1gLFxuICAgIEZPQ1VTT1VUICAgOiBgZm9jdXNvdXQke0VWRU5UX0tFWX1gLFxuICAgIE1PVVNFRU5URVIgOiBgbW91c2VlbnRlciR7RVZFTlRfS0VZfWAsXG4gICAgTU9VU0VMRUFWRSA6IGBtb3VzZWxlYXZlJHtFVkVOVF9LRVl9YFxuICB9XG5cbiAgY29uc3QgQ2xhc3NOYW1lID0ge1xuICAgIEZBREUgOiAnZmFkZScsXG4gICAgU0hPVyA6ICdzaG93J1xuICB9XG5cbiAgY29uc3QgU2VsZWN0b3IgPSB7XG4gICAgVE9PTFRJUCAgICAgICA6ICcudG9vbHRpcCcsXG4gICAgVE9PTFRJUF9JTk5FUiA6ICcudG9vbHRpcC1pbm5lcicsXG4gICAgQVJST1cgICAgICAgICA6ICcuYXJyb3cnXG4gIH1cblxuICBjb25zdCBUcmlnZ2VyID0ge1xuICAgIEhPVkVSICA6ICdob3ZlcicsXG4gICAgRk9DVVMgIDogJ2ZvY3VzJyxcbiAgICBDTElDSyAgOiAnY2xpY2snLFxuICAgIE1BTlVBTCA6ICdtYW51YWwnXG4gIH1cblxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgVG9vbHRpcCB7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBjb25maWcpIHtcblxuICAgICAgLy8gcHJpdmF0ZVxuICAgICAgdGhpcy5faXNFbmFibGVkICAgICA9IHRydWVcbiAgICAgIHRoaXMuX3RpbWVvdXQgICAgICAgPSAwXG4gICAgICB0aGlzLl9ob3ZlclN0YXRlICAgID0gJydcbiAgICAgIHRoaXMuX2FjdGl2ZVRyaWdnZXIgPSB7fVxuICAgICAgdGhpcy5fcG9wcGVyICAgICAgICA9IG51bGxcblxuICAgICAgLy8gcHJvdGVjdGVkXG4gICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50XG4gICAgICB0aGlzLmNvbmZpZyAgPSB0aGlzLl9nZXRDb25maWcoY29uZmlnKVxuICAgICAgdGhpcy50aXAgICAgID0gbnVsbFxuXG4gICAgICB0aGlzLl9zZXRMaXN0ZW5lcnMoKVxuXG4gICAgfVxuXG5cbiAgICAvLyBnZXR0ZXJzXG5cbiAgICBzdGF0aWMgZ2V0IFZFUlNJT04oKSB7XG4gICAgICByZXR1cm4gVkVSU0lPTlxuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgRGVmYXVsdCgpIHtcbiAgICAgIHJldHVybiBEZWZhdWx0XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBOQU1FKCkge1xuICAgICAgcmV0dXJuIE5BTUVcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IERBVEFfS0VZKCkge1xuICAgICAgcmV0dXJuIERBVEFfS0VZXG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBFdmVudCgpIHtcbiAgICAgIHJldHVybiBFdmVudFxuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgRVZFTlRfS0VZKCkge1xuICAgICAgcmV0dXJuIEVWRU5UX0tFWVxuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgRGVmYXVsdFR5cGUoKSB7XG4gICAgICByZXR1cm4gRGVmYXVsdFR5cGVcbiAgICB9XG5cblxuICAgIC8vIHB1YmxpY1xuXG4gICAgZW5hYmxlKCkge1xuICAgICAgdGhpcy5faXNFbmFibGVkID0gdHJ1ZVxuICAgIH1cblxuICAgIGRpc2FibGUoKSB7XG4gICAgICB0aGlzLl9pc0VuYWJsZWQgPSBmYWxzZVxuICAgIH1cblxuICAgIHRvZ2dsZUVuYWJsZWQoKSB7XG4gICAgICB0aGlzLl9pc0VuYWJsZWQgPSAhdGhpcy5faXNFbmFibGVkXG4gICAgfVxuXG4gICAgdG9nZ2xlKGV2ZW50KSB7XG4gICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgY29uc3QgZGF0YUtleSA9IHRoaXMuY29uc3RydWN0b3IuREFUQV9LRVlcbiAgICAgICAgbGV0IGNvbnRleHQgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmRhdGEoZGF0YUtleSlcblxuICAgICAgICBpZiAoIWNvbnRleHQpIHtcbiAgICAgICAgICBjb250ZXh0ID0gbmV3IHRoaXMuY29uc3RydWN0b3IoXG4gICAgICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0LFxuICAgICAgICAgICAgdGhpcy5fZ2V0RGVsZWdhdGVDb25maWcoKVxuICAgICAgICAgIClcbiAgICAgICAgICAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmRhdGEoZGF0YUtleSwgY29udGV4dClcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQuX2FjdGl2ZVRyaWdnZXIuY2xpY2sgPSAhY29udGV4dC5fYWN0aXZlVHJpZ2dlci5jbGlja1xuXG4gICAgICAgIGlmIChjb250ZXh0Ll9pc1dpdGhBY3RpdmVUcmlnZ2VyKCkpIHtcbiAgICAgICAgICBjb250ZXh0Ll9lbnRlcihudWxsLCBjb250ZXh0KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnRleHQuX2xlYXZlKG51bGwsIGNvbnRleHQpXG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICBpZiAoJCh0aGlzLmdldFRpcEVsZW1lbnQoKSkuaGFzQ2xhc3MoQ2xhc3NOYW1lLlNIT1cpKSB7XG4gICAgICAgICAgdGhpcy5fbGVhdmUobnVsbCwgdGhpcylcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2VudGVyKG51bGwsIHRoaXMpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZGlzcG9zZSgpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lb3V0KVxuXG4gICAgICAkLnJlbW92ZURhdGEodGhpcy5lbGVtZW50LCB0aGlzLmNvbnN0cnVjdG9yLkRBVEFfS0VZKVxuXG4gICAgICAkKHRoaXMuZWxlbWVudCkub2ZmKHRoaXMuY29uc3RydWN0b3IuRVZFTlRfS0VZKVxuICAgICAgJCh0aGlzLmVsZW1lbnQpLmNsb3Nlc3QoJy5tb2RhbCcpLm9mZignaGlkZS5icy5tb2RhbCcpXG5cbiAgICAgIGlmICh0aGlzLnRpcCkge1xuICAgICAgICAkKHRoaXMudGlwKS5yZW1vdmUoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9pc0VuYWJsZWQgICAgID0gbnVsbFxuICAgICAgdGhpcy5fdGltZW91dCAgICAgICA9IG51bGxcbiAgICAgIHRoaXMuX2hvdmVyU3RhdGUgICAgPSBudWxsXG4gICAgICB0aGlzLl9hY3RpdmVUcmlnZ2VyID0gbnVsbFxuICAgICAgaWYgKHRoaXMuX3BvcHBlciAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9wb3BwZXIuZGVzdHJveSgpXG4gICAgICB9XG4gICAgICB0aGlzLl9wb3BwZXIgICAgICAgID0gbnVsbFxuXG4gICAgICB0aGlzLmVsZW1lbnQgPSBudWxsXG4gICAgICB0aGlzLmNvbmZpZyAgPSBudWxsXG4gICAgICB0aGlzLnRpcCAgICAgPSBudWxsXG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgIGlmICgkKHRoaXMuZWxlbWVudCkuY3NzKCdkaXNwbGF5JykgPT09ICdub25lJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSB1c2Ugc2hvdyBvbiB2aXNpYmxlIGVsZW1lbnRzJylcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2hvd0V2ZW50ID0gJC5FdmVudCh0aGlzLmNvbnN0cnVjdG9yLkV2ZW50LlNIT1cpXG4gICAgICBpZiAodGhpcy5pc1dpdGhDb250ZW50KCkgJiYgdGhpcy5faXNFbmFibGVkKSB7XG4gICAgICAgICQodGhpcy5lbGVtZW50KS50cmlnZ2VyKHNob3dFdmVudClcblxuICAgICAgICBjb25zdCBpc0luVGhlRG9tID0gJC5jb250YWlucyhcbiAgICAgICAgICB0aGlzLmVsZW1lbnQub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG4gICAgICAgICAgdGhpcy5lbGVtZW50XG4gICAgICAgIClcblxuICAgICAgICBpZiAoc2hvd0V2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpIHx8ICFpc0luVGhlRG9tKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0aXAgICA9IHRoaXMuZ2V0VGlwRWxlbWVudCgpXG4gICAgICAgIGNvbnN0IHRpcElkID0gVXRpbC5nZXRVSUQodGhpcy5jb25zdHJ1Y3Rvci5OQU1FKVxuXG4gICAgICAgIHRpcC5zZXRBdHRyaWJ1dGUoJ2lkJywgdGlwSWQpXG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCB0aXBJZClcblxuICAgICAgICB0aGlzLnNldENvbnRlbnQoKVxuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5hbmltYXRpb24pIHtcbiAgICAgICAgICAkKHRpcCkuYWRkQ2xhc3MoQ2xhc3NOYW1lLkZBREUpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwbGFjZW1lbnQgID0gdHlwZW9mIHRoaXMuY29uZmlnLnBsYWNlbWVudCA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgICAgICAgdGhpcy5jb25maWcucGxhY2VtZW50LmNhbGwodGhpcywgdGlwLCB0aGlzLmVsZW1lbnQpIDpcbiAgICAgICAgICB0aGlzLmNvbmZpZy5wbGFjZW1lbnRcblxuICAgICAgICBjb25zdCBhdHRhY2htZW50ID0gdGhpcy5fZ2V0QXR0YWNobWVudChwbGFjZW1lbnQpXG4gICAgICAgIHRoaXMuYWRkQXR0YWNobWVudENsYXNzKGF0dGFjaG1lbnQpXG5cbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5jb25maWcuY29udGFpbmVyID09PSBmYWxzZSA/IGRvY3VtZW50LmJvZHkgOiAkKHRoaXMuY29uZmlnLmNvbnRhaW5lcilcblxuICAgICAgICAkKHRpcCkuZGF0YSh0aGlzLmNvbnN0cnVjdG9yLkRBVEFfS0VZLCB0aGlzKVxuXG4gICAgICAgIGlmICghJC5jb250YWlucyh0aGlzLmVsZW1lbnQub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHRoaXMudGlwKSkge1xuICAgICAgICAgICQodGlwKS5hcHBlbmRUbyhjb250YWluZXIpXG4gICAgICAgIH1cblxuICAgICAgICAkKHRoaXMuZWxlbWVudCkudHJpZ2dlcih0aGlzLmNvbnN0cnVjdG9yLkV2ZW50LklOU0VSVEVEKVxuXG4gICAgICAgIHRoaXMuX3BvcHBlciA9IG5ldyBQb3BwZXIodGhpcy5lbGVtZW50LCB0aXAsIHtcbiAgICAgICAgICBwbGFjZW1lbnQ6IGF0dGFjaG1lbnQsXG4gICAgICAgICAgbW9kaWZpZXJzOiB7XG4gICAgICAgICAgICBvZmZzZXQ6IHtcbiAgICAgICAgICAgICAgb2Zmc2V0OiB0aGlzLmNvbmZpZy5vZmZzZXRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmbGlwOiB7XG4gICAgICAgICAgICAgIGJlaGF2aW9yOiB0aGlzLmNvbmZpZy5mYWxsYmFja1BsYWNlbWVudFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFycm93OiB7XG4gICAgICAgICAgICAgIGVsZW1lbnQ6IFNlbGVjdG9yLkFSUk9XXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBvbkNyZWF0ZTogKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChkYXRhLm9yaWdpbmFsUGxhY2VtZW50ICE9PSBkYXRhLnBsYWNlbWVudCkge1xuICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVQb3BwZXJQbGFjZW1lbnRDaGFuZ2UoZGF0YSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIG9uVXBkYXRlIDogKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZVBvcHBlclBsYWNlbWVudENoYW5nZShkYXRhKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICAkKHRpcCkuYWRkQ2xhc3MoQ2xhc3NOYW1lLlNIT1cpXG5cbiAgICAgICAgLy8gaWYgdGhpcyBpcyBhIHRvdWNoLWVuYWJsZWQgZGV2aWNlIHdlIGFkZCBleHRyYVxuICAgICAgICAvLyBlbXB0eSBtb3VzZW92ZXIgbGlzdGVuZXJzIHRvIHRoZSBib2R5J3MgaW1tZWRpYXRlIGNoaWxkcmVuO1xuICAgICAgICAvLyBvbmx5IG5lZWRlZCBiZWNhdXNlIG9mIGJyb2tlbiBldmVudCBkZWxlZ2F0aW9uIG9uIGlPU1xuICAgICAgICAvLyBodHRwczovL3d3dy5xdWlya3Ntb2RlLm9yZy9ibG9nL2FyY2hpdmVzLzIwMTQvMDIvbW91c2VfZXZlbnRfYnViLmh0bWxcbiAgICAgICAgaWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xuICAgICAgICAgICQoJ2JvZHknKS5jaGlsZHJlbigpLm9uKCdtb3VzZW92ZXInLCBudWxsLCAkLm5vb3ApXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb21wbGV0ZSA9ICgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5jb25maWcuYW5pbWF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9maXhUcmFuc2l0aW9uKClcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgcHJldkhvdmVyU3RhdGUgPSB0aGlzLl9ob3ZlclN0YXRlXG4gICAgICAgICAgdGhpcy5faG92ZXJTdGF0ZSAgICAgPSBudWxsXG5cbiAgICAgICAgICAkKHRoaXMuZWxlbWVudCkudHJpZ2dlcih0aGlzLmNvbnN0cnVjdG9yLkV2ZW50LlNIT1dOKVxuXG4gICAgICAgICAgaWYgKHByZXZIb3ZlclN0YXRlID09PSBIb3ZlclN0YXRlLk9VVCkge1xuICAgICAgICAgICAgdGhpcy5fbGVhdmUobnVsbCwgdGhpcylcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoVXRpbC5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSAmJiAkKHRoaXMudGlwKS5oYXNDbGFzcyhDbGFzc05hbWUuRkFERSkpIHtcbiAgICAgICAgICAkKHRoaXMudGlwKVxuICAgICAgICAgICAgLm9uZShVdGlsLlRSQU5TSVRJT05fRU5ELCBjb21wbGV0ZSlcbiAgICAgICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChUb29sdGlwLl9UUkFOU0lUSU9OX0RVUkFUSU9OKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbXBsZXRlKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGhpZGUoY2FsbGJhY2spIHtcbiAgICAgIGNvbnN0IHRpcCAgICAgICA9IHRoaXMuZ2V0VGlwRWxlbWVudCgpXG4gICAgICBjb25zdCBoaWRlRXZlbnQgPSAkLkV2ZW50KHRoaXMuY29uc3RydWN0b3IuRXZlbnQuSElERSlcbiAgICAgIGNvbnN0IGNvbXBsZXRlICA9ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX2hvdmVyU3RhdGUgIT09IEhvdmVyU3RhdGUuU0hPVyAmJiB0aXAucGFyZW50Tm9kZSkge1xuICAgICAgICAgIHRpcC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRpcClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2NsZWFuVGlwQ2xhc3MoKVxuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JylcbiAgICAgICAgJCh0aGlzLmVsZW1lbnQpLnRyaWdnZXIodGhpcy5jb25zdHJ1Y3Rvci5FdmVudC5ISURERU4pXG4gICAgICAgIGlmICh0aGlzLl9wb3BwZXIgIT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLl9wb3BwZXIuZGVzdHJveSgpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgJCh0aGlzLmVsZW1lbnQpLnRyaWdnZXIoaGlkZUV2ZW50KVxuXG4gICAgICBpZiAoaGlkZUV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICAkKHRpcCkucmVtb3ZlQ2xhc3MoQ2xhc3NOYW1lLlNIT1cpXG5cbiAgICAgIC8vIGlmIHRoaXMgaXMgYSB0b3VjaC1lbmFibGVkIGRldmljZSB3ZSByZW1vdmUgdGhlIGV4dHJhXG4gICAgICAvLyBlbXB0eSBtb3VzZW92ZXIgbGlzdGVuZXJzIHdlIGFkZGVkIGZvciBpT1Mgc3VwcG9ydFxuICAgICAgaWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xuICAgICAgICAkKCdib2R5JykuY2hpbGRyZW4oKS5vZmYoJ21vdXNlb3ZlcicsIG51bGwsICQubm9vcClcbiAgICAgIH1cblxuICAgICAgdGhpcy5fYWN0aXZlVHJpZ2dlcltUcmlnZ2VyLkNMSUNLXSA9IGZhbHNlXG4gICAgICB0aGlzLl9hY3RpdmVUcmlnZ2VyW1RyaWdnZXIuRk9DVVNdID0gZmFsc2VcbiAgICAgIHRoaXMuX2FjdGl2ZVRyaWdnZXJbVHJpZ2dlci5IT1ZFUl0gPSBmYWxzZVxuXG4gICAgICBpZiAoVXRpbC5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKSAmJlxuICAgICAgICAgICQodGhpcy50aXApLmhhc0NsYXNzKENsYXNzTmFtZS5GQURFKSkge1xuXG4gICAgICAgICQodGlwKVxuICAgICAgICAgIC5vbmUoVXRpbC5UUkFOU0lUSU9OX0VORCwgY29tcGxldGUpXG4gICAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKFRSQU5TSVRJT05fRFVSQVRJT04pXG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbXBsZXRlKClcbiAgICAgIH1cblxuICAgICAgdGhpcy5faG92ZXJTdGF0ZSA9ICcnXG5cbiAgICB9XG5cbiAgICB1cGRhdGUoKSB7XG4gICAgICBpZiAodGhpcy5fcG9wcGVyICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3BvcHBlci5zY2hlZHVsZVVwZGF0ZSgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gcHJvdGVjdGVkXG5cbiAgICBpc1dpdGhDb250ZW50KCkge1xuICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy5nZXRUaXRsZSgpKVxuICAgIH1cblxuICAgIGFkZEF0dGFjaG1lbnRDbGFzcyhhdHRhY2htZW50KSB7XG4gICAgICAkKHRoaXMuZ2V0VGlwRWxlbWVudCgpKS5hZGRDbGFzcyhgJHtDTEFTU19QUkVGSVh9LSR7YXR0YWNobWVudH1gKVxuICAgIH1cblxuICAgIGdldFRpcEVsZW1lbnQoKSB7XG4gICAgICByZXR1cm4gdGhpcy50aXAgPSB0aGlzLnRpcCB8fCAkKHRoaXMuY29uZmlnLnRlbXBsYXRlKVswXVxuICAgIH1cblxuICAgIHNldENvbnRlbnQoKSB7XG4gICAgICBjb25zdCAkdGlwID0gJCh0aGlzLmdldFRpcEVsZW1lbnQoKSlcbiAgICAgIHRoaXMuc2V0RWxlbWVudENvbnRlbnQoJHRpcC5maW5kKFNlbGVjdG9yLlRPT0xUSVBfSU5ORVIpLCB0aGlzLmdldFRpdGxlKCkpXG4gICAgICAkdGlwLnJlbW92ZUNsYXNzKGAke0NsYXNzTmFtZS5GQURFfSAke0NsYXNzTmFtZS5TSE9XfWApXG4gICAgfVxuXG4gICAgc2V0RWxlbWVudENvbnRlbnQoJGVsZW1lbnQsIGNvbnRlbnQpIHtcbiAgICAgIGNvbnN0IGh0bWwgPSB0aGlzLmNvbmZpZy5odG1sXG4gICAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdvYmplY3QnICYmIChjb250ZW50Lm5vZGVUeXBlIHx8IGNvbnRlbnQuanF1ZXJ5KSkge1xuICAgICAgICAvLyBjb250ZW50IGlzIGEgRE9NIG5vZGUgb3IgYSBqUXVlcnlcbiAgICAgICAgaWYgKGh0bWwpIHtcbiAgICAgICAgICBpZiAoISQoY29udGVudCkucGFyZW50KCkuaXMoJGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAkZWxlbWVudC5lbXB0eSgpLmFwcGVuZChjb250ZW50KVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkZWxlbWVudC50ZXh0KCQoY29udGVudCkudGV4dCgpKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkZWxlbWVudFtodG1sID8gJ2h0bWwnIDogJ3RleHQnXShjb250ZW50KVxuICAgICAgfVxuICAgIH1cblxuICAgIGdldFRpdGxlKCkge1xuICAgICAgbGV0IHRpdGxlID0gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcmlnaW5hbC10aXRsZScpXG5cbiAgICAgIGlmICghdGl0bGUpIHtcbiAgICAgICAgdGl0bGUgPSB0eXBlb2YgdGhpcy5jb25maWcudGl0bGUgPT09ICdmdW5jdGlvbicgP1xuICAgICAgICAgIHRoaXMuY29uZmlnLnRpdGxlLmNhbGwodGhpcy5lbGVtZW50KSA6XG4gICAgICAgICAgdGhpcy5jb25maWcudGl0bGVcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRpdGxlXG4gICAgfVxuXG5cbiAgICAvLyBwcml2YXRlXG5cbiAgICBfZ2V0QXR0YWNobWVudChwbGFjZW1lbnQpIHtcbiAgICAgIHJldHVybiBBdHRhY2htZW50TWFwW3BsYWNlbWVudC50b1VwcGVyQ2FzZSgpXVxuICAgIH1cblxuICAgIF9zZXRMaXN0ZW5lcnMoKSB7XG4gICAgICBjb25zdCB0cmlnZ2VycyA9IHRoaXMuY29uZmlnLnRyaWdnZXIuc3BsaXQoJyAnKVxuXG4gICAgICB0cmlnZ2Vycy5mb3JFYWNoKCh0cmlnZ2VyKSA9PiB7XG4gICAgICAgIGlmICh0cmlnZ2VyID09PSAnY2xpY2snKSB7XG4gICAgICAgICAgJCh0aGlzLmVsZW1lbnQpLm9uKFxuICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5FdmVudC5DTElDSyxcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnNlbGVjdG9yLFxuICAgICAgICAgICAgKGV2ZW50KSA9PiB0aGlzLnRvZ2dsZShldmVudClcbiAgICAgICAgICApXG5cbiAgICAgICAgfSBlbHNlIGlmICh0cmlnZ2VyICE9PSBUcmlnZ2VyLk1BTlVBTCkge1xuICAgICAgICAgIGNvbnN0IGV2ZW50SW4gID0gdHJpZ2dlciA9PT0gVHJpZ2dlci5IT1ZFUiA/XG4gICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLkV2ZW50Lk1PVVNFRU5URVIgOlxuICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5FdmVudC5GT0NVU0lOXG4gICAgICAgICAgY29uc3QgZXZlbnRPdXQgPSB0cmlnZ2VyID09PSBUcmlnZ2VyLkhPVkVSID9cbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IuRXZlbnQuTU9VU0VMRUFWRSA6XG4gICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLkV2ZW50LkZPQ1VTT1VUXG5cbiAgICAgICAgICAkKHRoaXMuZWxlbWVudClcbiAgICAgICAgICAgIC5vbihcbiAgICAgICAgICAgICAgZXZlbnRJbixcbiAgICAgICAgICAgICAgdGhpcy5jb25maWcuc2VsZWN0b3IsXG4gICAgICAgICAgICAgIChldmVudCkgPT4gdGhpcy5fZW50ZXIoZXZlbnQpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAub24oXG4gICAgICAgICAgICAgIGV2ZW50T3V0LFxuICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5zZWxlY3RvcixcbiAgICAgICAgICAgICAgKGV2ZW50KSA9PiB0aGlzLl9sZWF2ZShldmVudClcbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuXG4gICAgICAgICQodGhpcy5lbGVtZW50KS5jbG9zZXN0KCcubW9kYWwnKS5vbihcbiAgICAgICAgICAnaGlkZS5icy5tb2RhbCcsXG4gICAgICAgICAgKCkgPT4gdGhpcy5oaWRlKClcbiAgICAgICAgKVxuICAgICAgfSlcblxuICAgICAgaWYgKHRoaXMuY29uZmlnLnNlbGVjdG9yKSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gJC5leHRlbmQoe30sIHRoaXMuY29uZmlnLCB7XG4gICAgICAgICAgdHJpZ2dlciAgOiAnbWFudWFsJyxcbiAgICAgICAgICBzZWxlY3RvciA6ICcnXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9maXhUaXRsZSgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgX2ZpeFRpdGxlKCkge1xuICAgICAgY29uc3QgdGl0bGVUeXBlID0gdHlwZW9mIHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3JpZ2luYWwtdGl0bGUnKVxuICAgICAgaWYgKHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RpdGxlJykgfHxcbiAgICAgICAgIHRpdGxlVHlwZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcbiAgICAgICAgICAnZGF0YS1vcmlnaW5hbC10aXRsZScsXG4gICAgICAgICAgdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgndGl0bGUnKSB8fCAnJ1xuICAgICAgICApXG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgJycpXG4gICAgICB9XG4gICAgfVxuXG4gICAgX2VudGVyKGV2ZW50LCBjb250ZXh0KSB7XG4gICAgICBjb25zdCBkYXRhS2V5ID0gdGhpcy5jb25zdHJ1Y3Rvci5EQVRBX0tFWVxuXG4gICAgICBjb250ZXh0ID0gY29udGV4dCB8fCAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmRhdGEoZGF0YUtleSlcblxuICAgICAgaWYgKCFjb250ZXh0KSB7XG4gICAgICAgIGNvbnRleHQgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihcbiAgICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0LFxuICAgICAgICAgIHRoaXMuX2dldERlbGVnYXRlQ29uZmlnKClcbiAgICAgICAgKVxuICAgICAgICAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmRhdGEoZGF0YUtleSwgY29udGV4dClcbiAgICAgIH1cblxuICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgIGNvbnRleHQuX2FjdGl2ZVRyaWdnZXJbXG4gICAgICAgICAgZXZlbnQudHlwZSA9PT0gJ2ZvY3VzaW4nID8gVHJpZ2dlci5GT0NVUyA6IFRyaWdnZXIuSE9WRVJcbiAgICAgICAgXSA9IHRydWVcbiAgICAgIH1cblxuICAgICAgaWYgKCQoY29udGV4dC5nZXRUaXBFbGVtZW50KCkpLmhhc0NsYXNzKENsYXNzTmFtZS5TSE9XKSB8fFxuICAgICAgICAgY29udGV4dC5faG92ZXJTdGF0ZSA9PT0gSG92ZXJTdGF0ZS5TSE9XKSB7XG4gICAgICAgIGNvbnRleHQuX2hvdmVyU3RhdGUgPSBIb3ZlclN0YXRlLlNIT1dcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNsZWFyVGltZW91dChjb250ZXh0Ll90aW1lb3V0KVxuXG4gICAgICBjb250ZXh0Ll9ob3ZlclN0YXRlID0gSG92ZXJTdGF0ZS5TSE9XXG5cbiAgICAgIGlmICghY29udGV4dC5jb25maWcuZGVsYXkgfHwgIWNvbnRleHQuY29uZmlnLmRlbGF5LnNob3cpIHtcbiAgICAgICAgY29udGV4dC5zaG93KClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQuX3RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKGNvbnRleHQuX2hvdmVyU3RhdGUgPT09IEhvdmVyU3RhdGUuU0hPVykge1xuICAgICAgICAgIGNvbnRleHQuc2hvdygpXG4gICAgICAgIH1cbiAgICAgIH0sIGNvbnRleHQuY29uZmlnLmRlbGF5LnNob3cpXG4gICAgfVxuXG4gICAgX2xlYXZlKGV2ZW50LCBjb250ZXh0KSB7XG4gICAgICBjb25zdCBkYXRhS2V5ID0gdGhpcy5jb25zdHJ1Y3Rvci5EQVRBX0tFWVxuXG4gICAgICBjb250ZXh0ID0gY29udGV4dCB8fCAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmRhdGEoZGF0YUtleSlcblxuICAgICAgaWYgKCFjb250ZXh0KSB7XG4gICAgICAgIGNvbnRleHQgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihcbiAgICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0LFxuICAgICAgICAgIHRoaXMuX2dldERlbGVnYXRlQ29uZmlnKClcbiAgICAgICAgKVxuICAgICAgICAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLmRhdGEoZGF0YUtleSwgY29udGV4dClcbiAgICAgIH1cblxuICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgIGNvbnRleHQuX2FjdGl2ZVRyaWdnZXJbXG4gICAgICAgICAgZXZlbnQudHlwZSA9PT0gJ2ZvY3Vzb3V0JyA/IFRyaWdnZXIuRk9DVVMgOiBUcmlnZ2VyLkhPVkVSXG4gICAgICAgIF0gPSBmYWxzZVxuICAgICAgfVxuXG4gICAgICBpZiAoY29udGV4dC5faXNXaXRoQWN0aXZlVHJpZ2dlcigpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjbGVhclRpbWVvdXQoY29udGV4dC5fdGltZW91dClcblxuICAgICAgY29udGV4dC5faG92ZXJTdGF0ZSA9IEhvdmVyU3RhdGUuT1VUXG5cbiAgICAgIGlmICghY29udGV4dC5jb25maWcuZGVsYXkgfHwgIWNvbnRleHQuY29uZmlnLmRlbGF5LmhpZGUpIHtcbiAgICAgICAgY29udGV4dC5oaWRlKClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQuX3RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKGNvbnRleHQuX2hvdmVyU3RhdGUgPT09IEhvdmVyU3RhdGUuT1VUKSB7XG4gICAgICAgICAgY29udGV4dC5oaWRlKClcbiAgICAgICAgfVxuICAgICAgfSwgY29udGV4dC5jb25maWcuZGVsYXkuaGlkZSlcbiAgICB9XG5cbiAgICBfaXNXaXRoQWN0aXZlVHJpZ2dlcigpIHtcbiAgICAgIGZvciAoY29uc3QgdHJpZ2dlciBpbiB0aGlzLl9hY3RpdmVUcmlnZ2VyKSB7XG4gICAgICAgIGlmICh0aGlzLl9hY3RpdmVUcmlnZ2VyW3RyaWdnZXJdKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBfZ2V0Q29uZmlnKGNvbmZpZykge1xuICAgICAgY29uZmlnID0gJC5leHRlbmQoXG4gICAgICAgIHt9LFxuICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLkRlZmF1bHQsXG4gICAgICAgICQodGhpcy5lbGVtZW50KS5kYXRhKCksXG4gICAgICAgIGNvbmZpZ1xuICAgICAgKVxuXG4gICAgICBpZiAoY29uZmlnLmRlbGF5ICYmIHR5cGVvZiBjb25maWcuZGVsYXkgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGNvbmZpZy5kZWxheSA9IHtcbiAgICAgICAgICBzaG93IDogY29uZmlnLmRlbGF5LFxuICAgICAgICAgIGhpZGUgOiBjb25maWcuZGVsYXlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLnRpdGxlICYmIHR5cGVvZiBjb25maWcudGl0bGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGNvbmZpZy50aXRsZSA9IGNvbmZpZy50aXRsZS50b1N0cmluZygpXG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcuY29udGVudCAmJiB0eXBlb2YgY29uZmlnLmNvbnRlbnQgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGNvbmZpZy5jb250ZW50ID0gY29uZmlnLmNvbnRlbnQudG9TdHJpbmcoKVxuICAgICAgfVxuXG4gICAgICBVdGlsLnR5cGVDaGVja0NvbmZpZyhcbiAgICAgICAgTkFNRSxcbiAgICAgICAgY29uZmlnLFxuICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLkRlZmF1bHRUeXBlXG4gICAgICApXG5cbiAgICAgIHJldHVybiBjb25maWdcbiAgICB9XG5cbiAgICBfZ2V0RGVsZWdhdGVDb25maWcoKSB7XG4gICAgICBjb25zdCBjb25maWcgPSB7fVxuXG4gICAgICBpZiAodGhpcy5jb25maWcpIHtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5jb25maWcpIHtcbiAgICAgICAgICBpZiAodGhpcy5jb25zdHJ1Y3Rvci5EZWZhdWx0W2tleV0gIT09IHRoaXMuY29uZmlnW2tleV0pIHtcbiAgICAgICAgICAgIGNvbmZpZ1trZXldID0gdGhpcy5jb25maWdba2V5XVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29uZmlnXG4gICAgfVxuXG4gICAgX2NsZWFuVGlwQ2xhc3MoKSB7XG4gICAgICBjb25zdCAkdGlwID0gJCh0aGlzLmdldFRpcEVsZW1lbnQoKSlcbiAgICAgIGNvbnN0IHRhYkNsYXNzID0gJHRpcC5hdHRyKCdjbGFzcycpLm1hdGNoKEJTQ0xTX1BSRUZJWF9SRUdFWClcbiAgICAgIGlmICh0YWJDbGFzcyAhPT0gbnVsbCAmJiB0YWJDbGFzcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICR0aXAucmVtb3ZlQ2xhc3ModGFiQ2xhc3Muam9pbignJykpXG4gICAgICB9XG4gICAgfVxuXG4gICAgX2hhbmRsZVBvcHBlclBsYWNlbWVudENoYW5nZShkYXRhKSB7XG4gICAgICB0aGlzLl9jbGVhblRpcENsYXNzKClcbiAgICAgIHRoaXMuYWRkQXR0YWNobWVudENsYXNzKHRoaXMuX2dldEF0dGFjaG1lbnQoZGF0YS5wbGFjZW1lbnQpKVxuICAgIH1cblxuICAgIF9maXhUcmFuc2l0aW9uKCkge1xuICAgICAgY29uc3QgdGlwICAgICAgICAgICAgICAgICA9IHRoaXMuZ2V0VGlwRWxlbWVudCgpXG4gICAgICBjb25zdCBpbml0Q29uZmlnQW5pbWF0aW9uID0gdGhpcy5jb25maWcuYW5pbWF0aW9uXG4gICAgICBpZiAodGlwLmdldEF0dHJpYnV0ZSgneC1wbGFjZW1lbnQnKSAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgICQodGlwKS5yZW1vdmVDbGFzcyhDbGFzc05hbWUuRkFERSlcbiAgICAgIHRoaXMuY29uZmlnLmFuaW1hdGlvbiA9IGZhbHNlXG4gICAgICB0aGlzLmhpZGUoKVxuICAgICAgdGhpcy5zaG93KClcbiAgICAgIHRoaXMuY29uZmlnLmFuaW1hdGlvbiA9IGluaXRDb25maWdBbmltYXRpb25cbiAgICB9XG5cbiAgICAvLyBzdGF0aWNcblxuICAgIHN0YXRpYyBfalF1ZXJ5SW50ZXJmYWNlKGNvbmZpZykge1xuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBkYXRhICAgICAgPSAkKHRoaXMpLmRhdGEoREFUQV9LRVkpXG4gICAgICAgIGNvbnN0IF9jb25maWcgPSB0eXBlb2YgY29uZmlnID09PSAnb2JqZWN0JyAmJiBjb25maWdcblxuICAgICAgICBpZiAoIWRhdGEgJiYgL2Rpc3Bvc2V8aGlkZS8udGVzdChjb25maWcpKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICBkYXRhID0gbmV3IFRvb2x0aXAodGhpcywgX2NvbmZpZylcbiAgICAgICAgICAkKHRoaXMpLmRhdGEoREFUQV9LRVksIGRhdGEpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBpZiAoZGF0YVtjb25maWddID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gbWV0aG9kIG5hbWVkIFwiJHtjb25maWd9XCJgKVxuICAgICAgICAgIH1cbiAgICAgICAgICBkYXRhW2NvbmZpZ10oKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICB9XG5cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIGpRdWVyeVxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgJC5mbltOQU1FXSAgICAgICAgICAgICA9IFRvb2x0aXAuX2pRdWVyeUludGVyZmFjZVxuICAkLmZuW05BTUVdLkNvbnN0cnVjdG9yID0gVG9vbHRpcFxuICAkLmZuW05BTUVdLm5vQ29uZmxpY3QgID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm5bTkFNRV0gPSBKUVVFUllfTk9fQ09ORkxJQ1RcbiAgICByZXR1cm4gVG9vbHRpcC5falF1ZXJ5SW50ZXJmYWNlXG4gIH1cblxuICByZXR1cm4gVG9vbHRpcFxuXG59KShqUXVlcnkpXG5cbmV4cG9ydCBkZWZhdWx0IFRvb2x0aXBcbiJdLCJmaWxlIjoidG9vbHRpcC5qcyJ9
