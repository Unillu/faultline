/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Button = (($) => {


  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                = 'button'
  const VERSION             = '4.0.0-beta'
  const DATA_KEY            = 'bs.button'
  const EVENT_KEY           = `.${DATA_KEY}`
  const DATA_API_KEY        = '.data-api'
  const JQUERY_NO_CONFLICT  = $.fn[NAME]

  const ClassName = {
    ACTIVE : 'active',
    BUTTON : 'btn',
    FOCUS  : 'focus'
  }

  const Selector = {
    DATA_TOGGLE_CARROT : '[data-toggle^="button"]',
    DATA_TOGGLE        : '[data-toggle="buttons"]',
    INPUT              : 'input',
    ACTIVE             : '.active',
    BUTTON             : '.btn'
  }

  const Event = {
    CLICK_DATA_API      : `click${EVENT_KEY}${DATA_API_KEY}`,
    FOCUS_BLUR_DATA_API : `focus${EVENT_KEY}${DATA_API_KEY} `
                        + `blur${EVENT_KEY}${DATA_API_KEY}`
  }


  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Button {

    constructor(element) {
      this._element = element
    }


    // getters

    static get VERSION() {
      return VERSION
    }


    // public

    toggle() {
      let triggerChangeEvent = true
      let addAriaPressed = true
      const rootElement      = $(this._element).closest(
        Selector.DATA_TOGGLE
      )[0]

      if (rootElement) {
        const input = $(this._element).find(Selector.INPUT)[0]

        if (input) {
          if (input.type === 'radio') {
            if (input.checked &&
              $(this._element).hasClass(ClassName.ACTIVE)) {
              triggerChangeEvent = false

            } else {
              const activeElement = $(rootElement).find(Selector.ACTIVE)[0]

              if (activeElement) {
                $(activeElement).removeClass(ClassName.ACTIVE)
              }
            }
          }

          if (triggerChangeEvent) {
            if (input.hasAttribute('disabled') ||
              rootElement.hasAttribute('disabled') ||
              input.classList.contains('disabled') ||
              rootElement.classList.contains('disabled')) {
              return
            }
            input.checked = !$(this._element).hasClass(ClassName.ACTIVE)
            $(input).trigger('change')
          }

          input.focus()
          addAriaPressed = false
        }

      }

      if (addAriaPressed) {
        this._element.setAttribute('aria-pressed',
          !$(this._element).hasClass(ClassName.ACTIVE))
      }

      if (triggerChangeEvent) {
        $(this._element).toggleClass(ClassName.ACTIVE)
      }
    }

    dispose() {
      $.removeData(this._element, DATA_KEY)
      this._element = null
    }


    // static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data = $(this).data(DATA_KEY)

        if (!data) {
          data = new Button(this)
          $(this).data(DATA_KEY, data)
        }

        if (config === 'toggle') {
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

  $(document)
    .on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE_CARROT, (event) => {
      event.preventDefault()

      let button = event.target

      if (!$(button).hasClass(ClassName.BUTTON)) {
        button = $(button).closest(Selector.BUTTON)
      }

      Button._jQueryInterface.call($(button), 'toggle')
    })
    .on(Event.FOCUS_BLUR_DATA_API, Selector.DATA_TOGGLE_CARROT, (event) => {
      const button = $(event.target).closest(Selector.BUTTON)[0]
      $(button).toggleClass(ClassName.FOCUS, /^focus(in)?$/.test(event.type))
    })


  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME]             = Button._jQueryInterface
  $.fn[NAME].Constructor = Button
  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Button._jQueryInterface
  }

  return Button

})(jQuery)

export default Button

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJidXR0b24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQm9vdHN0cmFwICh2NC4wLjAtYmV0YSk6IGJ1dHRvbi5qc1xuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuY29uc3QgQnV0dG9uID0gKCgkKSA9PiB7XG5cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENvbnN0YW50c1xuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgY29uc3QgTkFNRSAgICAgICAgICAgICAgICA9ICdidXR0b24nXG4gIGNvbnN0IFZFUlNJT04gICAgICAgICAgICAgPSAnNC4wLjAtYmV0YSdcbiAgY29uc3QgREFUQV9LRVkgICAgICAgICAgICA9ICdicy5idXR0b24nXG4gIGNvbnN0IEVWRU5UX0tFWSAgICAgICAgICAgPSBgLiR7REFUQV9LRVl9YFxuICBjb25zdCBEQVRBX0FQSV9LRVkgICAgICAgID0gJy5kYXRhLWFwaSdcbiAgY29uc3QgSlFVRVJZX05PX0NPTkZMSUNUICA9ICQuZm5bTkFNRV1cblxuICBjb25zdCBDbGFzc05hbWUgPSB7XG4gICAgQUNUSVZFIDogJ2FjdGl2ZScsXG4gICAgQlVUVE9OIDogJ2J0bicsXG4gICAgRk9DVVMgIDogJ2ZvY3VzJ1xuICB9XG5cbiAgY29uc3QgU2VsZWN0b3IgPSB7XG4gICAgREFUQV9UT0dHTEVfQ0FSUk9UIDogJ1tkYXRhLXRvZ2dsZV49XCJidXR0b25cIl0nLFxuICAgIERBVEFfVE9HR0xFICAgICAgICA6ICdbZGF0YS10b2dnbGU9XCJidXR0b25zXCJdJyxcbiAgICBJTlBVVCAgICAgICAgICAgICAgOiAnaW5wdXQnLFxuICAgIEFDVElWRSAgICAgICAgICAgICA6ICcuYWN0aXZlJyxcbiAgICBCVVRUT04gICAgICAgICAgICAgOiAnLmJ0bidcbiAgfVxuXG4gIGNvbnN0IEV2ZW50ID0ge1xuICAgIENMSUNLX0RBVEFfQVBJICAgICAgOiBgY2xpY2ske0VWRU5UX0tFWX0ke0RBVEFfQVBJX0tFWX1gLFxuICAgIEZPQ1VTX0JMVVJfREFUQV9BUEkgOiBgZm9jdXMke0VWRU5UX0tFWX0ke0RBVEFfQVBJX0tFWX0gYFxuICAgICAgICAgICAgICAgICAgICAgICAgKyBgYmx1ciR7RVZFTlRfS0VZfSR7REFUQV9BUElfS0VZfWBcbiAgfVxuXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDbGFzcyBEZWZpbml0aW9uXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKi9cblxuICBjbGFzcyBCdXR0b24ge1xuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCkge1xuICAgICAgdGhpcy5fZWxlbWVudCA9IGVsZW1lbnRcbiAgICB9XG5cblxuICAgIC8vIGdldHRlcnNcblxuICAgIHN0YXRpYyBnZXQgVkVSU0lPTigpIHtcbiAgICAgIHJldHVybiBWRVJTSU9OXG4gICAgfVxuXG5cbiAgICAvLyBwdWJsaWNcblxuICAgIHRvZ2dsZSgpIHtcbiAgICAgIGxldCB0cmlnZ2VyQ2hhbmdlRXZlbnQgPSB0cnVlXG4gICAgICBsZXQgYWRkQXJpYVByZXNzZWQgPSB0cnVlXG4gICAgICBjb25zdCByb290RWxlbWVudCAgICAgID0gJCh0aGlzLl9lbGVtZW50KS5jbG9zZXN0KFxuICAgICAgICBTZWxlY3Rvci5EQVRBX1RPR0dMRVxuICAgICAgKVswXVxuXG4gICAgICBpZiAocm9vdEVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSAkKHRoaXMuX2VsZW1lbnQpLmZpbmQoU2VsZWN0b3IuSU5QVVQpWzBdXG5cbiAgICAgICAgaWYgKGlucHV0KSB7XG4gICAgICAgICAgaWYgKGlucHV0LnR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgICAgICAgIGlmIChpbnB1dC5jaGVja2VkICYmXG4gICAgICAgICAgICAgICQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoQ2xhc3NOYW1lLkFDVElWRSkpIHtcbiAgICAgICAgICAgICAgdHJpZ2dlckNoYW5nZUV2ZW50ID0gZmFsc2VcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc3QgYWN0aXZlRWxlbWVudCA9ICQocm9vdEVsZW1lbnQpLmZpbmQoU2VsZWN0b3IuQUNUSVZFKVswXVxuXG4gICAgICAgICAgICAgIGlmIChhY3RpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgJChhY3RpdmVFbGVtZW50KS5yZW1vdmVDbGFzcyhDbGFzc05hbWUuQUNUSVZFKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRyaWdnZXJDaGFuZ2VFdmVudCkge1xuICAgICAgICAgICAgaWYgKGlucHV0Lmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSB8fFxuICAgICAgICAgICAgICByb290RWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykgfHxcbiAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXNhYmxlZCcpIHx8XG4gICAgICAgICAgICAgIHJvb3RFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlucHV0LmNoZWNrZWQgPSAhJCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhDbGFzc05hbWUuQUNUSVZFKVxuICAgICAgICAgICAgJChpbnB1dCkudHJpZ2dlcignY2hhbmdlJylcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpbnB1dC5mb2N1cygpXG4gICAgICAgICAgYWRkQXJpYVByZXNzZWQgPSBmYWxzZVxuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgICAgaWYgKGFkZEFyaWFQcmVzc2VkKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLXByZXNzZWQnLFxuICAgICAgICAgICEkKHRoaXMuX2VsZW1lbnQpLmhhc0NsYXNzKENsYXNzTmFtZS5BQ1RJVkUpKVxuICAgICAgfVxuXG4gICAgICBpZiAodHJpZ2dlckNoYW5nZUV2ZW50KSB7XG4gICAgICAgICQodGhpcy5fZWxlbWVudCkudG9nZ2xlQ2xhc3MoQ2xhc3NOYW1lLkFDVElWRSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkaXNwb3NlKCkge1xuICAgICAgJC5yZW1vdmVEYXRhKHRoaXMuX2VsZW1lbnQsIERBVEFfS0VZKVxuICAgICAgdGhpcy5fZWxlbWVudCA9IG51bGxcbiAgICB9XG5cblxuICAgIC8vIHN0YXRpY1xuXG4gICAgc3RhdGljIF9qUXVlcnlJbnRlcmZhY2UoY29uZmlnKSB7XG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IGRhdGEgPSAkKHRoaXMpLmRhdGEoREFUQV9LRVkpXG5cbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgZGF0YSA9IG5ldyBCdXR0b24odGhpcylcbiAgICAgICAgICAkKHRoaXMpLmRhdGEoREFUQV9LRVksIGRhdGEpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnID09PSAndG9nZ2xlJykge1xuICAgICAgICAgIGRhdGFbY29uZmlnXSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gIH1cblxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogRGF0YSBBcGkgaW1wbGVtZW50YXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gICQoZG9jdW1lbnQpXG4gICAgLm9uKEV2ZW50LkNMSUNLX0RBVEFfQVBJLCBTZWxlY3Rvci5EQVRBX1RPR0dMRV9DQVJST1QsIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gICAgICBsZXQgYnV0dG9uID0gZXZlbnQudGFyZ2V0XG5cbiAgICAgIGlmICghJChidXR0b24pLmhhc0NsYXNzKENsYXNzTmFtZS5CVVRUT04pKSB7XG4gICAgICAgIGJ1dHRvbiA9ICQoYnV0dG9uKS5jbG9zZXN0KFNlbGVjdG9yLkJVVFRPTilcbiAgICAgIH1cblxuICAgICAgQnV0dG9uLl9qUXVlcnlJbnRlcmZhY2UuY2FsbCgkKGJ1dHRvbiksICd0b2dnbGUnKVxuICAgIH0pXG4gICAgLm9uKEV2ZW50LkZPQ1VTX0JMVVJfREFUQV9BUEksIFNlbGVjdG9yLkRBVEFfVE9HR0xFX0NBUlJPVCwgKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBidXR0b24gPSAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdChTZWxlY3Rvci5CVVRUT04pWzBdXG4gICAgICAkKGJ1dHRvbikudG9nZ2xlQ2xhc3MoQ2xhc3NOYW1lLkZPQ1VTLCAvXmZvY3VzKGluKT8kLy50ZXN0KGV2ZW50LnR5cGUpKVxuICAgIH0pXG5cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIGpRdWVyeVxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICovXG5cbiAgJC5mbltOQU1FXSAgICAgICAgICAgICA9IEJ1dHRvbi5falF1ZXJ5SW50ZXJmYWNlXG4gICQuZm5bTkFNRV0uQ29uc3RydWN0b3IgPSBCdXR0b25cbiAgJC5mbltOQU1FXS5ub0NvbmZsaWN0ICA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuW05BTUVdID0gSlFVRVJZX05PX0NPTkZMSUNUXG4gICAgcmV0dXJuIEJ1dHRvbi5falF1ZXJ5SW50ZXJmYWNlXG4gIH1cblxuICByZXR1cm4gQnV0dG9uXG5cbn0pKGpRdWVyeSlcblxuZXhwb3J0IGRlZmF1bHQgQnV0dG9uXG4iXSwiZmlsZSI6ImJ1dHRvbi5qcyJ9
