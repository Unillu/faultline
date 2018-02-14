/* global Popper */

import Util from './util'


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Dropdown = (($) => {

  /**
   * Check for Popper dependency
   * Popper - https://popper.js.org
   */
  if (typeof Popper === 'undefined') {
    throw new Error('Bootstrap dropdown require Popper.js (https://popper.js.org)')
  }

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                     = 'dropdown'
  const VERSION                  = '4.0.0-beta'
  const DATA_KEY                 = 'bs.dropdown'
  const EVENT_KEY                = `.${DATA_KEY}`
  const DATA_API_KEY             = '.data-api'
  const JQUERY_NO_CONFLICT       = $.fn[NAME]
  const ESCAPE_KEYCODE           = 27 // KeyboardEvent.which value for Escape (Esc) key
  const SPACE_KEYCODE            = 32 // KeyboardEvent.which value for space key
  const TAB_KEYCODE              = 9 // KeyboardEvent.which value for tab key
  const ARROW_UP_KEYCODE         = 38 // KeyboardEvent.which value for up arrow key
  const ARROW_DOWN_KEYCODE       = 40 // KeyboardEvent.which value for down arrow key
  const RIGHT_MOUSE_BUTTON_WHICH = 3 // MouseEvent.which value for the right button (assuming a right-handed mouse)
  const REGEXP_KEYDOWN           = new RegExp(`${ARROW_UP_KEYCODE}|${ARROW_DOWN_KEYCODE}|${ESCAPE_KEYCODE}`)

  const Event = {
    HIDE             : `hide${EVENT_KEY}`,
    HIDDEN           : `hidden${EVENT_KEY}`,
    SHOW             : `show${EVENT_KEY}`,
    SHOWN            : `shown${EVENT_KEY}`,
    CLICK            : `click${EVENT_KEY}`,
    CLICK_DATA_API   : `click${EVENT_KEY}${DATA_API_KEY}`,
    KEYDOWN_DATA_API : `keydown${EVENT_KEY}${DATA_API_KEY}`,
    KEYUP_DATA_API   : `keyup${EVENT_KEY}${DATA_API_KEY}`
  }

  const ClassName = {
    DISABLED  : 'disabled',
    SHOW      : 'show',
    DROPUP    : 'dropup',
    MENURIGHT : 'dropdown-menu-right',
    MENULEFT  : 'dropdown-menu-left'
  }

  const Selector = {
    DATA_TOGGLE   : '[data-toggle="dropdown"]',
    FORM_CHILD    : '.dropdown form',
    MENU          : '.dropdown-menu',
    NAVBAR_NAV    : '.navbar-nav',
    VISIBLE_ITEMS : '.dropdown-menu .dropdown-item:not(.disabled)'
  }

  const AttachmentMap = {
    TOP       : 'top-start',
    TOPEND    : 'top-end',
    BOTTOM    : 'bottom-start',
    BOTTOMEND : 'bottom-end'
  }

  const Default = {
    placement   : AttachmentMap.BOTTOM,
    offset      : 0,
    flip        : true
  }

  const DefaultType = {
    placement   : 'string',
    offset      : '(number|string)',
    flip        : 'boolean'
  }


  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Dropdown {

    constructor(element, config) {
      this._element  = element
      this._popper   = null
      this._config   = this._getConfig(config)
      this._menu     = this._getMenuElement()
      this._inNavbar = this._detectNavbar()

      this._addEventListeners()
    }


    // getters

    static get VERSION() {
      return VERSION
    }

    static get Default() {
      return Default
    }

    static get DefaultType() {
      return DefaultType
    }

    // public

    toggle() {
      if (this._element.disabled || $(this._element).hasClass(ClassName.DISABLED)) {
        return
      }

      const parent   = Dropdown._getParentFromElement(this._element)
      const isActive = $(this._menu).hasClass(ClassName.SHOW)

      Dropdown._clearMenus()

      if (isActive) {
        return
      }

      const relatedTarget = {
        relatedTarget : this._element
      }
      const showEvent = $.Event(Event.SHOW, relatedTarget)

      $(parent).trigger(showEvent)

      if (showEvent.isDefaultPrevented()) {
        return
      }

      let element = this._element
      // for dropup with alignment we use the parent as popper container
      if ($(parent).hasClass(ClassName.DROPUP)) {
        if ($(this._menu).hasClass(ClassName.MENULEFT) || $(this._menu).hasClass(ClassName.MENURIGHT)) {
          element = parent
        }
      }
      this._popper = new Popper(element, this._menu, this._getPopperConfig())

      // if this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
      if ('ontouchstart' in document.documentElement &&
         !$(parent).closest(Selector.NAVBAR_NAV).length) {
        $('body').children().on('mouseover', null, $.noop)
      }

      this._element.focus()
      this._element.setAttribute('aria-expanded', true)

      $(this._menu).toggleClass(ClassName.SHOW)
      $(parent)
        .toggleClass(ClassName.SHOW)
        .trigger($.Event(Event.SHOWN, relatedTarget))
    }

    dispose() {
      $.removeData(this._element, DATA_KEY)
      $(this._element).off(EVENT_KEY)
      this._element = null
      this._menu = null
      if (this._popper !== null) {
        this._popper.destroy()
      }
      this._popper = null
    }

    update() {
      this._inNavbar = this._detectNavbar()
      if (this._popper !== null) {
        this._popper.scheduleUpdate()
      }
    }

    // private

    _addEventListeners() {
      $(this._element).on(Event.CLICK, (event) => {
        event.preventDefault()
        event.stopPropagation()
        this.toggle()
      })
    }

    _getConfig(config) {
      const elementData = $(this._element).data()
      if (elementData.placement !== undefined) {
        elementData.placement = AttachmentMap[elementData.placement.toUpperCase()]
      }

      config = $.extend(
        {},
        this.constructor.Default,
        $(this._element).data(),
        config
      )

      Util.typeCheckConfig(
        NAME,
        config,
        this.constructor.DefaultType
      )

      return config
    }

    _getMenuElement() {
      if (!this._menu) {
        const parent = Dropdown._getParentFromElement(this._element)
        this._menu = $(parent).find(Selector.MENU)[0]
      }
      return this._menu
    }

    _getPlacement() {
      const $parentDropdown = $(this._element).parent()
      let placement = this._config.placement

      // Handle dropup
      if ($parentDropdown.hasClass(ClassName.DROPUP) || this._config.placement === AttachmentMap.TOP) {
        placement = AttachmentMap.TOP
        if ($(this._menu).hasClass(ClassName.MENURIGHT)) {
          placement = AttachmentMap.TOPEND
        }
      } else if ($(this._menu).hasClass(ClassName.MENURIGHT)) {
        placement = AttachmentMap.BOTTOMEND
      }
      return placement
    }

    _detectNavbar() {
      return $(this._element).closest('.navbar').length > 0
    }

    _getPopperConfig() {
      const popperConfig = {
        placement : this._getPlacement(),
        modifiers : {
          offset : {
            offset : this._config.offset
          },
          flip : {
            enabled : this._config.flip
          }
        }
      }

      // Disable Popper.js for Dropdown in Navbar
      if (this._inNavbar) {
        popperConfig.modifiers.applyStyle = {
          enabled: !this._inNavbar
        }
      }
      return popperConfig
    }

    // static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data = $(this).data(DATA_KEY)
        const _config = typeof config === 'object' ? config : null

        if (!data) {
          data = new Dropdown(this, _config)
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

    static _clearMenus(event) {
      if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH ||
        event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
        return
      }

      const toggles = $.makeArray($(Selector.DATA_TOGGLE))
      for (let i = 0; i < toggles.length; i++) {
        const parent        = Dropdown._getParentFromElement(toggles[i])
        const context       = $(toggles[i]).data(DATA_KEY)
        const relatedTarget = {
          relatedTarget : toggles[i]
        }

        if (!context) {
          continue
        }

        const dropdownMenu = context._menu
        if (!$(parent).hasClass(ClassName.SHOW)) {
          continue
        }

        if (event && (event.type === 'click' &&
            /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE)
            && $.contains(parent, event.target)) {
          continue
        }

        const hideEvent = $.Event(Event.HIDE, relatedTarget)
        $(parent).trigger(hideEvent)
        if (hideEvent.isDefaultPrevented()) {
          continue
        }

        // if this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support
        if ('ontouchstart' in document.documentElement) {
          $('body').children().off('mouseover', null, $.noop)
        }

        toggles[i].setAttribute('aria-expanded', 'false')

        $(dropdownMenu).removeClass(ClassName.SHOW)
        $(parent)
          .removeClass(ClassName.SHOW)
          .trigger($.Event(Event.HIDDEN, relatedTarget))
      }
    }

    static _getParentFromElement(element) {
      let parent
      const selector = Util.getSelectorFromElement(element)

      if (selector) {
        parent = $(selector)[0]
      }

      return parent || element.parentNode
    }

    static _dataApiKeydownHandler(event) {
      if (!REGEXP_KEYDOWN.test(event.which) || /button/i.test(event.target.tagName) && event.which === SPACE_KEYCODE ||
         /input|textarea/i.test(event.target.tagName)) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      if (this.disabled || $(this).hasClass(ClassName.DISABLED)) {
        return
      }

      const parent   = Dropdown._getParentFromElement(this)
      const isActive = $(parent).hasClass(ClassName.SHOW)

      if (!isActive && (event.which !== ESCAPE_KEYCODE || event.which !== SPACE_KEYCODE) ||
           isActive && (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {

        if (event.which === ESCAPE_KEYCODE) {
          const toggle = $(parent).find(Selector.DATA_TOGGLE)[0]
          $(toggle).trigger('focus')
        }

        $(this).trigger('click')
        return
      }

      const items = $(parent).find(Selector.VISIBLE_ITEMS).get()

      if (!items.length) {
        return
      }

      let index = items.indexOf(event.target)

      if (event.which === ARROW_UP_KEYCODE && index > 0) { // up
        index--
      }

      if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) { // down
        index++
      }

      if (index < 0) {
        index = 0
      }

      items[index].focus()
    }

  }


  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document)
    .on(Event.KEYDOWN_DATA_API, Selector.DATA_TOGGLE,  Dropdown._dataApiKeydownHandler)
    .on(Event.KEYDOWN_DATA_API, Selector.MENU, Dropdown._dataApiKeydownHandler)
    .on(`${Event.CLICK_DATA_API} ${Event.KEYUP_DATA_API}`, Dropdown._clearMenus)
    .on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
      event.preventDefault()
      event.stopPropagation()
      Dropdown._jQueryInterface.call($(this), 'toggle')
    })
    .on(Event.CLICK_DATA_API, Selector.FORM_CHILD, (e) => {
      e.stopPropagation()
    })


  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME]             = Dropdown._jQueryInterface
  $.fn[NAME].Constructor = Dropdown
  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Dropdown._jQueryInterface
  }

  return Dropdown

})(jQuery)

export default Dropdown

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkcm9wZG93bi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgUG9wcGVyICovXG5cbmltcG9ydCBVdGlsIGZyb20gJy4vdXRpbCdcblxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBCb290c3RyYXAgKHY0LjAuMC1iZXRhKTogZHJvcGRvd24uanNcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmNvbnN0IERyb3Bkb3duID0gKCgkKSA9PiB7XG5cbiAgLyoqXG4gICAqIENoZWNrIGZvciBQb3BwZXIgZGVwZW5kZW5jeVxuICAgKiBQb3BwZXIgLSBodHRwczovL3BvcHBlci5qcy5vcmdcbiAgICovXG4gIGlmICh0eXBlb2YgUG9wcGVyID09PSAndW5kZWZpbmVkJykge1xuICAgIHRocm93IG5ldyBFcnJvcignQm9vdHN0cmFwIGRyb3Bkb3duIHJlcXVpcmUgUG9wcGVyLmpzIChodHRwczovL3BvcHBlci5qcy5vcmcpJylcbiAgfVxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ29uc3RhbnRzXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjb25zdCBOQU1FICAgICAgICAgICAgICAgICAgICAgPSAnZHJvcGRvd24nXG4gIGNvbnN0IFZFUlNJT04gICAgICAgICAgICAgICAgICA9ICc0LjAuMC1iZXRhJ1xuICBjb25zdCBEQVRBX0tFWSAgICAgICAgICAgICAgICAgPSAnYnMuZHJvcGRvd24nXG4gIGNvbnN0IEVWRU5UX0tFWSAgICAgICAgICAgICAgICA9IGAuJHtEQVRBX0tFWX1gXG4gIGNvbnN0IERBVEFfQVBJX0tFWSAgICAgICAgICAgICA9ICcuZGF0YS1hcGknXG4gIGNvbnN0IEpRVUVSWV9OT19DT05GTElDVCAgICAgICA9ICQuZm5bTkFNRV1cbiAgY29uc3QgRVNDQVBFX0tFWUNPREUgICAgICAgICAgID0gMjcgLy8gS2V5Ym9hcmRFdmVudC53aGljaCB2YWx1ZSBmb3IgRXNjYXBlIChFc2MpIGtleVxuICBjb25zdCBTUEFDRV9LRVlDT0RFICAgICAgICAgICAgPSAzMiAvLyBLZXlib2FyZEV2ZW50LndoaWNoIHZhbHVlIGZvciBzcGFjZSBrZXlcbiAgY29uc3QgVEFCX0tFWUNPREUgICAgICAgICAgICAgID0gOSAvLyBLZXlib2FyZEV2ZW50LndoaWNoIHZhbHVlIGZvciB0YWIga2V5XG4gIGNvbnN0IEFSUk9XX1VQX0tFWUNPREUgICAgICAgICA9IDM4IC8vIEtleWJvYXJkRXZlbnQud2hpY2ggdmFsdWUgZm9yIHVwIGFycm93IGtleVxuICBjb25zdCBBUlJPV19ET1dOX0tFWUNPREUgICAgICAgPSA0MCAvLyBLZXlib2FyZEV2ZW50LndoaWNoIHZhbHVlIGZvciBkb3duIGFycm93IGtleVxuICBjb25zdCBSSUdIVF9NT1VTRV9CVVRUT05fV0hJQ0ggPSAzIC8vIE1vdXNlRXZlbnQud2hpY2ggdmFsdWUgZm9yIHRoZSByaWdodCBidXR0b24gKGFzc3VtaW5nIGEgcmlnaHQtaGFuZGVkIG1vdXNlKVxuICBjb25zdCBSRUdFWFBfS0VZRE9XTiAgICAgICAgICAgPSBuZXcgUmVnRXhwKGAke0FSUk9XX1VQX0tFWUNPREV9fCR7QVJST1dfRE9XTl9LRVlDT0RFfXwke0VTQ0FQRV9LRVlDT0RFfWApXG5cbiAgY29uc3QgRXZlbnQgPSB7XG4gICAgSElERSAgICAgICAgICAgICA6IGBoaWRlJHtFVkVOVF9LRVl9YCxcbiAgICBISURERU4gICAgICAgICAgIDogYGhpZGRlbiR7RVZFTlRfS0VZfWAsXG4gICAgU0hPVyAgICAgICAgICAgICA6IGBzaG93JHtFVkVOVF9LRVl9YCxcbiAgICBTSE9XTiAgICAgICAgICAgIDogYHNob3duJHtFVkVOVF9LRVl9YCxcbiAgICBDTElDSyAgICAgICAgICAgIDogYGNsaWNrJHtFVkVOVF9LRVl9YCxcbiAgICBDTElDS19EQVRBX0FQSSAgIDogYGNsaWNrJHtFVkVOVF9LRVl9JHtEQVRBX0FQSV9LRVl9YCxcbiAgICBLRVlET1dOX0RBVEFfQVBJIDogYGtleWRvd24ke0VWRU5UX0tFWX0ke0RBVEFfQVBJX0tFWX1gLFxuICAgIEtFWVVQX0RBVEFfQVBJICAgOiBga2V5dXAke0VWRU5UX0tFWX0ke0RBVEFfQVBJX0tFWX1gXG4gIH1cblxuICBjb25zdCBDbGFzc05hbWUgPSB7XG4gICAgRElTQUJMRUQgIDogJ2Rpc2FibGVkJyxcbiAgICBTSE9XICAgICAgOiAnc2hvdycsXG4gICAgRFJPUFVQICAgIDogJ2Ryb3B1cCcsXG4gICAgTUVOVVJJR0hUIDogJ2Ryb3Bkb3duLW1lbnUtcmlnaHQnLFxuICAgIE1FTlVMRUZUICA6ICdkcm9wZG93bi1tZW51LWxlZnQnXG4gIH1cblxuICBjb25zdCBTZWxlY3RvciA9IHtcbiAgICBEQVRBX1RPR0dMRSAgIDogJ1tkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJdJyxcbiAgICBGT1JNX0NISUxEICAgIDogJy5kcm9wZG93biBmb3JtJyxcbiAgICBNRU5VICAgICAgICAgIDogJy5kcm9wZG93bi1tZW51JyxcbiAgICBOQVZCQVJfTkFWICAgIDogJy5uYXZiYXItbmF2JyxcbiAgICBWSVNJQkxFX0lURU1TIDogJy5kcm9wZG93bi1tZW51IC5kcm9wZG93bi1pdGVtOm5vdCguZGlzYWJsZWQpJ1xuICB9XG5cbiAgY29uc3QgQXR0YWNobWVudE1hcCA9IHtcbiAgICBUT1AgICAgICAgOiAndG9wLXN0YXJ0JyxcbiAgICBUT1BFTkQgICAgOiAndG9wLWVuZCcsXG4gICAgQk9UVE9NICAgIDogJ2JvdHRvbS1zdGFydCcsXG4gICAgQk9UVE9NRU5EIDogJ2JvdHRvbS1lbmQnXG4gIH1cblxuICBjb25zdCBEZWZhdWx0ID0ge1xuICAgIHBsYWNlbWVudCAgIDogQXR0YWNobWVudE1hcC5CT1RUT00sXG4gICAgb2Zmc2V0ICAgICAgOiAwLFxuICAgIGZsaXAgICAgICAgIDogdHJ1ZVxuICB9XG5cbiAgY29uc3QgRGVmYXVsdFR5cGUgPSB7XG4gICAgcGxhY2VtZW50ICAgOiAnc3RyaW5nJyxcbiAgICBvZmZzZXQgICAgICA6ICcobnVtYmVyfHN0cmluZyknLFxuICAgIGZsaXAgICAgICAgIDogJ2Jvb2xlYW4nXG4gIH1cblxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogQ2xhc3MgRGVmaW5pdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY2xhc3MgRHJvcGRvd24ge1xuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgY29uZmlnKSB7XG4gICAgICB0aGlzLl9lbGVtZW50ICA9IGVsZW1lbnRcbiAgICAgIHRoaXMuX3BvcHBlciAgID0gbnVsbFxuICAgICAgdGhpcy5fY29uZmlnICAgPSB0aGlzLl9nZXRDb25maWcoY29uZmlnKVxuICAgICAgdGhpcy5fbWVudSAgICAgPSB0aGlzLl9nZXRNZW51RWxlbWVudCgpXG4gICAgICB0aGlzLl9pbk5hdmJhciA9IHRoaXMuX2RldGVjdE5hdmJhcigpXG5cbiAgICAgIHRoaXMuX2FkZEV2ZW50TGlzdGVuZXJzKClcbiAgICB9XG5cblxuICAgIC8vIGdldHRlcnNcblxuICAgIHN0YXRpYyBnZXQgVkVSU0lPTigpIHtcbiAgICAgIHJldHVybiBWRVJTSU9OXG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBEZWZhdWx0KCkge1xuICAgICAgcmV0dXJuIERlZmF1bHRcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IERlZmF1bHRUeXBlKCkge1xuICAgICAgcmV0dXJuIERlZmF1bHRUeXBlXG4gICAgfVxuXG4gICAgLy8gcHVibGljXG5cbiAgICB0b2dnbGUoKSB7XG4gICAgICBpZiAodGhpcy5fZWxlbWVudC5kaXNhYmxlZCB8fCAkKHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKENsYXNzTmFtZS5ESVNBQkxFRCkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHBhcmVudCAgID0gRHJvcGRvd24uX2dldFBhcmVudEZyb21FbGVtZW50KHRoaXMuX2VsZW1lbnQpXG4gICAgICBjb25zdCBpc0FjdGl2ZSA9ICQodGhpcy5fbWVudSkuaGFzQ2xhc3MoQ2xhc3NOYW1lLlNIT1cpXG5cbiAgICAgIERyb3Bkb3duLl9jbGVhck1lbnVzKClcblxuICAgICAgaWYgKGlzQWN0aXZlKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCByZWxhdGVkVGFyZ2V0ID0ge1xuICAgICAgICByZWxhdGVkVGFyZ2V0IDogdGhpcy5fZWxlbWVudFxuICAgICAgfVxuICAgICAgY29uc3Qgc2hvd0V2ZW50ID0gJC5FdmVudChFdmVudC5TSE9XLCByZWxhdGVkVGFyZ2V0KVxuXG4gICAgICAkKHBhcmVudCkudHJpZ2dlcihzaG93RXZlbnQpXG5cbiAgICAgIGlmIChzaG93RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFxuICAgICAgLy8gZm9yIGRyb3B1cCB3aXRoIGFsaWdubWVudCB3ZSB1c2UgdGhlIHBhcmVudCBhcyBwb3BwZXIgY29udGFpbmVyXG4gICAgICBpZiAoJChwYXJlbnQpLmhhc0NsYXNzKENsYXNzTmFtZS5EUk9QVVApKSB7XG4gICAgICAgIGlmICgkKHRoaXMuX21lbnUpLmhhc0NsYXNzKENsYXNzTmFtZS5NRU5VTEVGVCkgfHwgJCh0aGlzLl9tZW51KS5oYXNDbGFzcyhDbGFzc05hbWUuTUVOVVJJR0hUKSkge1xuICAgICAgICAgIGVsZW1lbnQgPSBwYXJlbnRcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5fcG9wcGVyID0gbmV3IFBvcHBlcihlbGVtZW50LCB0aGlzLl9tZW51LCB0aGlzLl9nZXRQb3BwZXJDb25maWcoKSlcblxuICAgICAgLy8gaWYgdGhpcyBpcyBhIHRvdWNoLWVuYWJsZWQgZGV2aWNlIHdlIGFkZCBleHRyYVxuICAgICAgLy8gZW1wdHkgbW91c2VvdmVyIGxpc3RlbmVycyB0byB0aGUgYm9keSdzIGltbWVkaWF0ZSBjaGlsZHJlbjtcbiAgICAgIC8vIG9ubHkgbmVlZGVkIGJlY2F1c2Ugb2YgYnJva2VuIGV2ZW50IGRlbGVnYXRpb24gb24gaU9TXG4gICAgICAvLyBodHRwczovL3d3dy5xdWlya3Ntb2RlLm9yZy9ibG9nL2FyY2hpdmVzLzIwMTQvMDIvbW91c2VfZXZlbnRfYnViLmh0bWxcbiAgICAgIGlmICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiZcbiAgICAgICAgICEkKHBhcmVudCkuY2xvc2VzdChTZWxlY3Rvci5OQVZCQVJfTkFWKS5sZW5ndGgpIHtcbiAgICAgICAgJCgnYm9keScpLmNoaWxkcmVuKCkub24oJ21vdXNlb3ZlcicsIG51bGwsICQubm9vcClcbiAgICAgIH1cblxuICAgICAgdGhpcy5fZWxlbWVudC5mb2N1cygpXG4gICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRydWUpXG5cbiAgICAgICQodGhpcy5fbWVudSkudG9nZ2xlQ2xhc3MoQ2xhc3NOYW1lLlNIT1cpXG4gICAgICAkKHBhcmVudClcbiAgICAgICAgLnRvZ2dsZUNsYXNzKENsYXNzTmFtZS5TSE9XKVxuICAgICAgICAudHJpZ2dlcigkLkV2ZW50KEV2ZW50LlNIT1dOLCByZWxhdGVkVGFyZ2V0KSlcbiAgICB9XG5cbiAgICBkaXNwb3NlKCkge1xuICAgICAgJC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQsIERBVEFfS0VZKVxuICAgICAgJCh0aGlzLl9lbGVtZW50KS5vZmYoRVZFTlRfS0VZKVxuICAgICAgdGhpcy5fZWxlbWVudCA9IG51bGxcbiAgICAgIHRoaXMuX21lbnUgPSBudWxsXG4gICAgICBpZiAodGhpcy5fcG9wcGVyICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3BvcHBlci5kZXN0cm95KClcbiAgICAgIH1cbiAgICAgIHRoaXMuX3BvcHBlciA9IG51bGxcbiAgICB9XG5cbiAgICB1cGRhdGUoKSB7XG4gICAgICB0aGlzLl9pbk5hdmJhciA9IHRoaXMuX2RldGVjdE5hdmJhcigpXG4gICAgICBpZiAodGhpcy5fcG9wcGVyICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3BvcHBlci5zY2hlZHVsZVVwZGF0ZSgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gcHJpdmF0ZVxuXG4gICAgX2FkZEV2ZW50TGlzdGVuZXJzKCkge1xuICAgICAgJCh0aGlzLl9lbGVtZW50KS5vbihFdmVudC5DTElDSywgKGV2ZW50KSA9PiB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgdGhpcy50b2dnbGUoKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfZ2V0Q29uZmlnKGNvbmZpZykge1xuICAgICAgY29uc3QgZWxlbWVudERhdGEgPSAkKHRoaXMuX2VsZW1lbnQpLmRhdGEoKVxuICAgICAgaWYgKGVsZW1lbnREYXRhLnBsYWNlbWVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGVsZW1lbnREYXRhLnBsYWNlbWVudCA9IEF0dGFjaG1lbnRNYXBbZWxlbWVudERhdGEucGxhY2VtZW50LnRvVXBwZXJDYXNlKCldXG4gICAgICB9XG5cbiAgICAgIGNvbmZpZyA9ICQuZXh0ZW5kKFxuICAgICAgICB7fSxcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5EZWZhdWx0LFxuICAgICAgICAkKHRoaXMuX2VsZW1lbnQpLmRhdGEoKSxcbiAgICAgICAgY29uZmlnXG4gICAgICApXG5cbiAgICAgIFV0aWwudHlwZUNoZWNrQ29uZmlnKFxuICAgICAgICBOQU1FLFxuICAgICAgICBjb25maWcsXG4gICAgICAgIHRoaXMuY29uc3RydWN0b3IuRGVmYXVsdFR5cGVcbiAgICAgIClcblxuICAgICAgcmV0dXJuIGNvbmZpZ1xuICAgIH1cblxuICAgIF9nZXRNZW51RWxlbWVudCgpIHtcbiAgICAgIGlmICghdGhpcy5fbWVudSkge1xuICAgICAgICBjb25zdCBwYXJlbnQgPSBEcm9wZG93bi5fZ2V0UGFyZW50RnJvbUVsZW1lbnQodGhpcy5fZWxlbWVudClcbiAgICAgICAgdGhpcy5fbWVudSA9ICQocGFyZW50KS5maW5kKFNlbGVjdG9yLk1FTlUpWzBdXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fbWVudVxuICAgIH1cblxuICAgIF9nZXRQbGFjZW1lbnQoKSB7XG4gICAgICBjb25zdCAkcGFyZW50RHJvcGRvd24gPSAkKHRoaXMuX2VsZW1lbnQpLnBhcmVudCgpXG4gICAgICBsZXQgcGxhY2VtZW50ID0gdGhpcy5fY29uZmlnLnBsYWNlbWVudFxuXG4gICAgICAvLyBIYW5kbGUgZHJvcHVwXG4gICAgICBpZiAoJHBhcmVudERyb3Bkb3duLmhhc0NsYXNzKENsYXNzTmFtZS5EUk9QVVApIHx8IHRoaXMuX2NvbmZpZy5wbGFjZW1lbnQgPT09IEF0dGFjaG1lbnRNYXAuVE9QKSB7XG4gICAgICAgIHBsYWNlbWVudCA9IEF0dGFjaG1lbnRNYXAuVE9QXG4gICAgICAgIGlmICgkKHRoaXMuX21lbnUpLmhhc0NsYXNzKENsYXNzTmFtZS5NRU5VUklHSFQpKSB7XG4gICAgICAgICAgcGxhY2VtZW50ID0gQXR0YWNobWVudE1hcC5UT1BFTkRcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICgkKHRoaXMuX21lbnUpLmhhc0NsYXNzKENsYXNzTmFtZS5NRU5VUklHSFQpKSB7XG4gICAgICAgIHBsYWNlbWVudCA9IEF0dGFjaG1lbnRNYXAuQk9UVE9NRU5EXG4gICAgICB9XG4gICAgICByZXR1cm4gcGxhY2VtZW50XG4gICAgfVxuXG4gICAgX2RldGVjdE5hdmJhcigpIHtcbiAgICAgIHJldHVybiAkKHRoaXMuX2VsZW1lbnQpLmNsb3Nlc3QoJy5uYXZiYXInKS5sZW5ndGggPiAwXG4gICAgfVxuXG4gICAgX2dldFBvcHBlckNvbmZpZygpIHtcbiAgICAgIGNvbnN0IHBvcHBlckNvbmZpZyA9IHtcbiAgICAgICAgcGxhY2VtZW50IDogdGhpcy5fZ2V0UGxhY2VtZW50KCksXG4gICAgICAgIG1vZGlmaWVycyA6IHtcbiAgICAgICAgICBvZmZzZXQgOiB7XG4gICAgICAgICAgICBvZmZzZXQgOiB0aGlzLl9jb25maWcub2Zmc2V0XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmbGlwIDoge1xuICAgICAgICAgICAgZW5hYmxlZCA6IHRoaXMuX2NvbmZpZy5mbGlwXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIERpc2FibGUgUG9wcGVyLmpzIGZvciBEcm9wZG93biBpbiBOYXZiYXJcbiAgICAgIGlmICh0aGlzLl9pbk5hdmJhcikge1xuICAgICAgICBwb3BwZXJDb25maWcubW9kaWZpZXJzLmFwcGx5U3R5bGUgPSB7XG4gICAgICAgICAgZW5hYmxlZDogIXRoaXMuX2luTmF2YmFyXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBwb3BwZXJDb25maWdcbiAgICB9XG5cbiAgICAvLyBzdGF0aWNcblxuICAgIHN0YXRpYyBfalF1ZXJ5SW50ZXJmYWNlKGNvbmZpZykge1xuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBkYXRhID0gJCh0aGlzKS5kYXRhKERBVEFfS0VZKVxuICAgICAgICBjb25zdCBfY29uZmlnID0gdHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcgPyBjb25maWcgOiBudWxsXG5cbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgZGF0YSA9IG5ldyBEcm9wZG93bih0aGlzLCBfY29uZmlnKVxuICAgICAgICAgICQodGhpcykuZGF0YShEQVRBX0tFWSwgZGF0YSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGlmIChkYXRhW2NvbmZpZ10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBtZXRob2QgbmFtZWQgXCIke2NvbmZpZ31cImApXG4gICAgICAgICAgfVxuICAgICAgICAgIGRhdGFbY29uZmlnXSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgc3RhdGljIF9jbGVhck1lbnVzKGV2ZW50KSB7XG4gICAgICBpZiAoZXZlbnQgJiYgKGV2ZW50LndoaWNoID09PSBSSUdIVF9NT1VTRV9CVVRUT05fV0hJQ0ggfHxcbiAgICAgICAgZXZlbnQudHlwZSA9PT0gJ2tleXVwJyAmJiBldmVudC53aGljaCAhPT0gVEFCX0tFWUNPREUpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCB0b2dnbGVzID0gJC5tYWtlQXJyYXkoJChTZWxlY3Rvci5EQVRBX1RPR0dMRSkpXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvZ2dsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgcGFyZW50ICAgICAgICA9IERyb3Bkb3duLl9nZXRQYXJlbnRGcm9tRWxlbWVudCh0b2dnbGVzW2ldKVxuICAgICAgICBjb25zdCBjb250ZXh0ICAgICAgID0gJCh0b2dnbGVzW2ldKS5kYXRhKERBVEFfS0VZKVxuICAgICAgICBjb25zdCByZWxhdGVkVGFyZ2V0ID0ge1xuICAgICAgICAgIHJlbGF0ZWRUYXJnZXQgOiB0b2dnbGVzW2ldXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNvbnRleHQpIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZHJvcGRvd25NZW51ID0gY29udGV4dC5fbWVudVxuICAgICAgICBpZiAoISQocGFyZW50KS5oYXNDbGFzcyhDbGFzc05hbWUuU0hPVykpIHtcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV2ZW50ICYmIChldmVudC50eXBlID09PSAnY2xpY2snICYmXG4gICAgICAgICAgICAvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGV2ZW50LnRhcmdldC50YWdOYW1lKSB8fCBldmVudC50eXBlID09PSAna2V5dXAnICYmIGV2ZW50LndoaWNoID09PSBUQUJfS0VZQ09ERSlcbiAgICAgICAgICAgICYmICQuY29udGFpbnMocGFyZW50LCBldmVudC50YXJnZXQpKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGhpZGVFdmVudCA9ICQuRXZlbnQoRXZlbnQuSElERSwgcmVsYXRlZFRhcmdldClcbiAgICAgICAgJChwYXJlbnQpLnRyaWdnZXIoaGlkZUV2ZW50KVxuICAgICAgICBpZiAoaGlkZUV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHRoaXMgaXMgYSB0b3VjaC1lbmFibGVkIGRldmljZSB3ZSByZW1vdmUgdGhlIGV4dHJhXG4gICAgICAgIC8vIGVtcHR5IG1vdXNlb3ZlciBsaXN0ZW5lcnMgd2UgYWRkZWQgZm9yIGlPUyBzdXBwb3J0XG4gICAgICAgIGlmICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcbiAgICAgICAgICAkKCdib2R5JykuY2hpbGRyZW4oKS5vZmYoJ21vdXNlb3ZlcicsIG51bGwsICQubm9vcClcbiAgICAgICAgfVxuXG4gICAgICAgIHRvZ2dsZXNbaV0uc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJylcblxuICAgICAgICAkKGRyb3Bkb3duTWVudSkucmVtb3ZlQ2xhc3MoQ2xhc3NOYW1lLlNIT1cpXG4gICAgICAgICQocGFyZW50KVxuICAgICAgICAgIC5yZW1vdmVDbGFzcyhDbGFzc05hbWUuU0hPVylcbiAgICAgICAgICAudHJpZ2dlcigkLkV2ZW50KEV2ZW50LkhJRERFTiwgcmVsYXRlZFRhcmdldCkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIF9nZXRQYXJlbnRGcm9tRWxlbWVudChlbGVtZW50KSB7XG4gICAgICBsZXQgcGFyZW50XG4gICAgICBjb25zdCBzZWxlY3RvciA9IFV0aWwuZ2V0U2VsZWN0b3JGcm9tRWxlbWVudChlbGVtZW50KVxuXG4gICAgICBpZiAoc2VsZWN0b3IpIHtcbiAgICAgICAgcGFyZW50ID0gJChzZWxlY3RvcilbMF1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhcmVudCB8fCBlbGVtZW50LnBhcmVudE5vZGVcbiAgICB9XG5cbiAgICBzdGF0aWMgX2RhdGFBcGlLZXlkb3duSGFuZGxlcihldmVudCkge1xuICAgICAgaWYgKCFSRUdFWFBfS0VZRE9XTi50ZXN0KGV2ZW50LndoaWNoKSB8fCAvYnV0dG9uL2kudGVzdChldmVudC50YXJnZXQudGFnTmFtZSkgJiYgZXZlbnQud2hpY2ggPT09IFNQQUNFX0tFWUNPREUgfHxcbiAgICAgICAgIC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoZXZlbnQudGFyZ2V0LnRhZ05hbWUpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCAkKHRoaXMpLmhhc0NsYXNzKENsYXNzTmFtZS5ESVNBQkxFRCkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHBhcmVudCAgID0gRHJvcGRvd24uX2dldFBhcmVudEZyb21FbGVtZW50KHRoaXMpXG4gICAgICBjb25zdCBpc0FjdGl2ZSA9ICQocGFyZW50KS5oYXNDbGFzcyhDbGFzc05hbWUuU0hPVylcblxuICAgICAgaWYgKCFpc0FjdGl2ZSAmJiAoZXZlbnQud2hpY2ggIT09IEVTQ0FQRV9LRVlDT0RFIHx8IGV2ZW50LndoaWNoICE9PSBTUEFDRV9LRVlDT0RFKSB8fFxuICAgICAgICAgICBpc0FjdGl2ZSAmJiAoZXZlbnQud2hpY2ggPT09IEVTQ0FQRV9LRVlDT0RFIHx8IGV2ZW50LndoaWNoID09PSBTUEFDRV9LRVlDT0RFKSkge1xuXG4gICAgICAgIGlmIChldmVudC53aGljaCA9PT0gRVNDQVBFX0tFWUNPREUpIHtcbiAgICAgICAgICBjb25zdCB0b2dnbGUgPSAkKHBhcmVudCkuZmluZChTZWxlY3Rvci5EQVRBX1RPR0dMRSlbMF1cbiAgICAgICAgICAkKHRvZ2dsZSkudHJpZ2dlcignZm9jdXMnKVxuICAgICAgICB9XG5cbiAgICAgICAgJCh0aGlzKS50cmlnZ2VyKCdjbGljaycpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBjb25zdCBpdGVtcyA9ICQocGFyZW50KS5maW5kKFNlbGVjdG9yLlZJU0lCTEVfSVRFTVMpLmdldCgpXG5cbiAgICAgIGlmICghaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBsZXQgaW5kZXggPSBpdGVtcy5pbmRleE9mKGV2ZW50LnRhcmdldClcblxuICAgICAgaWYgKGV2ZW50LndoaWNoID09PSBBUlJPV19VUF9LRVlDT0RFICYmIGluZGV4ID4gMCkgeyAvLyB1cFxuICAgICAgICBpbmRleC0tXG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudC53aGljaCA9PT0gQVJST1dfRE9XTl9LRVlDT0RFICYmIGluZGV4IDwgaXRlbXMubGVuZ3RoIC0gMSkgeyAvLyBkb3duXG4gICAgICAgIGluZGV4KytcbiAgICAgIH1cblxuICAgICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICBpbmRleCA9IDBcbiAgICAgIH1cblxuICAgICAgaXRlbXNbaW5kZXhdLmZvY3VzKClcbiAgICB9XG5cbiAgfVxuXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBEYXRhIEFwaSBpbXBsZW1lbnRhdGlvblxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgJChkb2N1bWVudClcbiAgICAub24oRXZlbnQuS0VZRE9XTl9EQVRBX0FQSSwgU2VsZWN0b3IuREFUQV9UT0dHTEUsICBEcm9wZG93bi5fZGF0YUFwaUtleWRvd25IYW5kbGVyKVxuICAgIC5vbihFdmVudC5LRVlET1dOX0RBVEFfQVBJLCBTZWxlY3Rvci5NRU5VLCBEcm9wZG93bi5fZGF0YUFwaUtleWRvd25IYW5kbGVyKVxuICAgIC5vbihgJHtFdmVudC5DTElDS19EQVRBX0FQSX0gJHtFdmVudC5LRVlVUF9EQVRBX0FQSX1gLCBEcm9wZG93bi5fY2xlYXJNZW51cylcbiAgICAub24oRXZlbnQuQ0xJQ0tfREFUQV9BUEksIFNlbGVjdG9yLkRBVEFfVE9HR0xFLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICBEcm9wZG93bi5falF1ZXJ5SW50ZXJmYWNlLmNhbGwoJCh0aGlzKSwgJ3RvZ2dsZScpXG4gICAgfSlcbiAgICAub24oRXZlbnQuQ0xJQ0tfREFUQV9BUEksIFNlbGVjdG9yLkZPUk1fQ0hJTEQsIChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgfSlcblxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogalF1ZXJ5XG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICAkLmZuW05BTUVdICAgICAgICAgICAgID0gRHJvcGRvd24uX2pRdWVyeUludGVyZmFjZVxuICAkLmZuW05BTUVdLkNvbnN0cnVjdG9yID0gRHJvcGRvd25cbiAgJC5mbltOQU1FXS5ub0NvbmZsaWN0ICA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuW05BTUVdID0gSlFVRVJZX05PX0NPTkZMSUNUXG4gICAgcmV0dXJuIERyb3Bkb3duLl9qUXVlcnlJbnRlcmZhY2VcbiAgfVxuXG4gIHJldHVybiBEcm9wZG93blxuXG59KShqUXVlcnkpXG5cbmV4cG9ydCBkZWZhdWx0IERyb3Bkb3duXG4iXSwiZmlsZSI6ImRyb3Bkb3duLmpzIn0=
