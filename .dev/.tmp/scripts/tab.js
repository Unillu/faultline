import Util from './util'


/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta): tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Tab = (($) => {


  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                = 'tab'
  const VERSION             = '4.0.0-beta'
  const DATA_KEY            = 'bs.tab'
  const EVENT_KEY           = `.${DATA_KEY}`
  const DATA_API_KEY        = '.data-api'
  const JQUERY_NO_CONFLICT  = $.fn[NAME]
  const TRANSITION_DURATION = 150

  const Event = {
    HIDE           : `hide${EVENT_KEY}`,
    HIDDEN         : `hidden${EVENT_KEY}`,
    SHOW           : `show${EVENT_KEY}`,
    SHOWN          : `shown${EVENT_KEY}`,
    CLICK_DATA_API : `click${EVENT_KEY}${DATA_API_KEY}`
  }

  const ClassName = {
    DROPDOWN_MENU : 'dropdown-menu',
    ACTIVE        : 'active',
    DISABLED      : 'disabled',
    FADE          : 'fade',
    SHOW          : 'show'
  }

  const Selector = {
    DROPDOWN              : '.dropdown',
    NAV_LIST_GROUP        : '.nav, .list-group',
    ACTIVE                : '.active',
    DATA_TOGGLE           : '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',
    DROPDOWN_TOGGLE       : '.dropdown-toggle',
    DROPDOWN_ACTIVE_CHILD : '> .dropdown-menu .active'
  }


  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Tab {

    constructor(element) {
      this._element = element
    }


    // getters

    static get VERSION() {
      return VERSION
    }


    // public

    show() {
      if (this._element.parentNode &&
          this._element.parentNode.nodeType === Node.ELEMENT_NODE &&
          $(this._element).hasClass(ClassName.ACTIVE) ||
          $(this._element).hasClass(ClassName.DISABLED)) {
        return
      }

      let target
      let previous
      const listElement = $(this._element).closest(Selector.NAV_LIST_GROUP)[0]
      const selector    = Util.getSelectorFromElement(this._element)

      if (listElement) {
        previous = $.makeArray($(listElement).find(Selector.ACTIVE))
        previous = previous[previous.length - 1]
      }

      const hideEvent = $.Event(Event.HIDE, {
        relatedTarget: this._element
      })

      const showEvent = $.Event(Event.SHOW, {
        relatedTarget: previous
      })

      if (previous) {
        $(previous).trigger(hideEvent)
      }

      $(this._element).trigger(showEvent)

      if (showEvent.isDefaultPrevented() ||
         hideEvent.isDefaultPrevented()) {
        return
      }

      if (selector) {
        target = $(selector)[0]
      }

      this._activate(
        this._element,
        listElement
      )

      const complete = () => {
        const hiddenEvent = $.Event(Event.HIDDEN, {
          relatedTarget: this._element
        })

        const shownEvent = $.Event(Event.SHOWN, {
          relatedTarget: previous
        })

        $(previous).trigger(hiddenEvent)
        $(this._element).trigger(shownEvent)
      }

      if (target) {
        this._activate(target, target.parentNode, complete)
      } else {
        complete()
      }
    }

    dispose() {
      $.removeData(this._element, DATA_KEY)
      this._element = null
    }


    // private

    _activate(element, container, callback) {
      const active          = $(container).find(Selector.ACTIVE)[0]
      const isTransitioning = callback
        && Util.supportsTransitionEnd()
        && (active && $(active).hasClass(ClassName.FADE))

      const complete = () => this._transitionComplete(
        element,
        active,
        isTransitioning,
        callback
      )

      if (active && isTransitioning) {
        $(active)
          .one(Util.TRANSITION_END, complete)
          .emulateTransitionEnd(TRANSITION_DURATION)

      } else {
        complete()
      }

      if (active) {
        $(active).removeClass(ClassName.SHOW)
      }
    }

    _transitionComplete(element, active, isTransitioning, callback) {
      if (active) {
        $(active).removeClass(ClassName.ACTIVE)

        const dropdownChild = $(active.parentNode).find(
          Selector.DROPDOWN_ACTIVE_CHILD
        )[0]

        if (dropdownChild) {
          $(dropdownChild).removeClass(ClassName.ACTIVE)
        }

        active.setAttribute('aria-expanded', false)
      }

      $(element).addClass(ClassName.ACTIVE)
      element.setAttribute('aria-expanded', true)

      if (isTransitioning) {
        Util.reflow(element)
        $(element).addClass(ClassName.SHOW)
      } else {
        $(element).removeClass(ClassName.FADE)
      }

      if (element.parentNode &&
          $(element.parentNode).hasClass(ClassName.DROPDOWN_MENU)) {

        const dropdownElement = $(element).closest(Selector.DROPDOWN)[0]
        if (dropdownElement) {
          $(dropdownElement).find(Selector.DROPDOWN_TOGGLE).addClass(ClassName.ACTIVE)
        }

        element.setAttribute('aria-expanded', true)
      }

      if (callback) {
        callback()
      }
    }


    // static

    static _jQueryInterface(config) {
      return this.each(function () {
        const $this = $(this)
        let data    = $this.data(DATA_KEY)

        if (!data) {
          data = new Tab(this)
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

  $(document)
    .on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
      event.preventDefault()
      Tab._jQueryInterface.call($(this), 'show')
    })


  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME]             = Tab._jQueryInterface
  $.fn[NAME].Constructor = Tab
  $.fn[NAME].noConflict  = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Tab._jQueryInterface
  }

  return Tab

})(jQuery)

export default Tab

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ0YWIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFV0aWwgZnJvbSAnLi91dGlsJ1xuXG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEJvb3RzdHJhcCAodjQuMC4wLWJldGEpOiB0YWIuanNcbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmNvbnN0IFRhYiA9ICgoJCkgPT4ge1xuXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBDb25zdGFudHNcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNvbnN0IE5BTUUgICAgICAgICAgICAgICAgPSAndGFiJ1xuICBjb25zdCBWRVJTSU9OICAgICAgICAgICAgID0gJzQuMC4wLWJldGEnXG4gIGNvbnN0IERBVEFfS0VZICAgICAgICAgICAgPSAnYnMudGFiJ1xuICBjb25zdCBFVkVOVF9LRVkgICAgICAgICAgID0gYC4ke0RBVEFfS0VZfWBcbiAgY29uc3QgREFUQV9BUElfS0VZICAgICAgICA9ICcuZGF0YS1hcGknXG4gIGNvbnN0IEpRVUVSWV9OT19DT05GTElDVCAgPSAkLmZuW05BTUVdXG4gIGNvbnN0IFRSQU5TSVRJT05fRFVSQVRJT04gPSAxNTBcblxuICBjb25zdCBFdmVudCA9IHtcbiAgICBISURFICAgICAgICAgICA6IGBoaWRlJHtFVkVOVF9LRVl9YCxcbiAgICBISURERU4gICAgICAgICA6IGBoaWRkZW4ke0VWRU5UX0tFWX1gLFxuICAgIFNIT1cgICAgICAgICAgIDogYHNob3cke0VWRU5UX0tFWX1gLFxuICAgIFNIT1dOICAgICAgICAgIDogYHNob3duJHtFVkVOVF9LRVl9YCxcbiAgICBDTElDS19EQVRBX0FQSSA6IGBjbGljayR7RVZFTlRfS0VZfSR7REFUQV9BUElfS0VZfWBcbiAgfVxuXG4gIGNvbnN0IENsYXNzTmFtZSA9IHtcbiAgICBEUk9QRE9XTl9NRU5VIDogJ2Ryb3Bkb3duLW1lbnUnLFxuICAgIEFDVElWRSAgICAgICAgOiAnYWN0aXZlJyxcbiAgICBESVNBQkxFRCAgICAgIDogJ2Rpc2FibGVkJyxcbiAgICBGQURFICAgICAgICAgIDogJ2ZhZGUnLFxuICAgIFNIT1cgICAgICAgICAgOiAnc2hvdydcbiAgfVxuXG4gIGNvbnN0IFNlbGVjdG9yID0ge1xuICAgIERST1BET1dOICAgICAgICAgICAgICA6ICcuZHJvcGRvd24nLFxuICAgIE5BVl9MSVNUX0dST1VQICAgICAgICA6ICcubmF2LCAubGlzdC1ncm91cCcsXG4gICAgQUNUSVZFICAgICAgICAgICAgICAgIDogJy5hY3RpdmUnLFxuICAgIERBVEFfVE9HR0xFICAgICAgICAgICA6ICdbZGF0YS10b2dnbGU9XCJ0YWJcIl0sIFtkYXRhLXRvZ2dsZT1cInBpbGxcIl0sIFtkYXRhLXRvZ2dsZT1cImxpc3RcIl0nLFxuICAgIERST1BET1dOX1RPR0dMRSAgICAgICA6ICcuZHJvcGRvd24tdG9nZ2xlJyxcbiAgICBEUk9QRE9XTl9BQ1RJVkVfQ0hJTEQgOiAnPiAuZHJvcGRvd24tbWVudSAuYWN0aXZlJ1xuICB9XG5cblxuICAvKipcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqIENsYXNzIERlZmluaXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gIGNsYXNzIFRhYiB7XG5cbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50KSB7XG4gICAgICB0aGlzLl9lbGVtZW50ID0gZWxlbWVudFxuICAgIH1cblxuXG4gICAgLy8gZ2V0dGVyc1xuXG4gICAgc3RhdGljIGdldCBWRVJTSU9OKCkge1xuICAgICAgcmV0dXJuIFZFUlNJT05cbiAgICB9XG5cblxuICAgIC8vIHB1YmxpY1xuXG4gICAgc2hvdygpIHtcbiAgICAgIGlmICh0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUgJiZcbiAgICAgICAgICB0aGlzLl9lbGVtZW50LnBhcmVudE5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFICYmXG4gICAgICAgICAgJCh0aGlzLl9lbGVtZW50KS5oYXNDbGFzcyhDbGFzc05hbWUuQUNUSVZFKSB8fFxuICAgICAgICAgICQodGhpcy5fZWxlbWVudCkuaGFzQ2xhc3MoQ2xhc3NOYW1lLkRJU0FCTEVEKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgbGV0IHRhcmdldFxuICAgICAgbGV0IHByZXZpb3VzXG4gICAgICBjb25zdCBsaXN0RWxlbWVudCA9ICQodGhpcy5fZWxlbWVudCkuY2xvc2VzdChTZWxlY3Rvci5OQVZfTElTVF9HUk9VUClbMF1cbiAgICAgIGNvbnN0IHNlbGVjdG9yICAgID0gVXRpbC5nZXRTZWxlY3RvckZyb21FbGVtZW50KHRoaXMuX2VsZW1lbnQpXG5cbiAgICAgIGlmIChsaXN0RWxlbWVudCkge1xuICAgICAgICBwcmV2aW91cyA9ICQubWFrZUFycmF5KCQobGlzdEVsZW1lbnQpLmZpbmQoU2VsZWN0b3IuQUNUSVZFKSlcbiAgICAgICAgcHJldmlvdXMgPSBwcmV2aW91c1twcmV2aW91cy5sZW5ndGggLSAxXVxuICAgICAgfVxuXG4gICAgICBjb25zdCBoaWRlRXZlbnQgPSAkLkV2ZW50KEV2ZW50LkhJREUsIHtcbiAgICAgICAgcmVsYXRlZFRhcmdldDogdGhpcy5fZWxlbWVudFxuICAgICAgfSlcblxuICAgICAgY29uc3Qgc2hvd0V2ZW50ID0gJC5FdmVudChFdmVudC5TSE9XLCB7XG4gICAgICAgIHJlbGF0ZWRUYXJnZXQ6IHByZXZpb3VzXG4gICAgICB9KVxuXG4gICAgICBpZiAocHJldmlvdXMpIHtcbiAgICAgICAgJChwcmV2aW91cykudHJpZ2dlcihoaWRlRXZlbnQpXG4gICAgICB9XG5cbiAgICAgICQodGhpcy5fZWxlbWVudCkudHJpZ2dlcihzaG93RXZlbnQpXG5cbiAgICAgIGlmIChzaG93RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkgfHxcbiAgICAgICAgIGhpZGVFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICAgIHRhcmdldCA9ICQoc2VsZWN0b3IpWzBdXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2FjdGl2YXRlKFxuICAgICAgICB0aGlzLl9lbGVtZW50LFxuICAgICAgICBsaXN0RWxlbWVudFxuICAgICAgKVxuXG4gICAgICBjb25zdCBjb21wbGV0ZSA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgaGlkZGVuRXZlbnQgPSAkLkV2ZW50KEV2ZW50LkhJRERFTiwge1xuICAgICAgICAgIHJlbGF0ZWRUYXJnZXQ6IHRoaXMuX2VsZW1lbnRcbiAgICAgICAgfSlcblxuICAgICAgICBjb25zdCBzaG93bkV2ZW50ID0gJC5FdmVudChFdmVudC5TSE9XTiwge1xuICAgICAgICAgIHJlbGF0ZWRUYXJnZXQ6IHByZXZpb3VzXG4gICAgICAgIH0pXG5cbiAgICAgICAgJChwcmV2aW91cykudHJpZ2dlcihoaWRkZW5FdmVudClcbiAgICAgICAgJCh0aGlzLl9lbGVtZW50KS50cmlnZ2VyKHNob3duRXZlbnQpXG4gICAgICB9XG5cbiAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgdGhpcy5fYWN0aXZhdGUodGFyZ2V0LCB0YXJnZXQucGFyZW50Tm9kZSwgY29tcGxldGUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb21wbGV0ZSgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZGlzcG9zZSgpIHtcbiAgICAgICQucmVtb3ZlRGF0YSh0aGlzLl9lbGVtZW50LCBEQVRBX0tFWSlcbiAgICAgIHRoaXMuX2VsZW1lbnQgPSBudWxsXG4gICAgfVxuXG5cbiAgICAvLyBwcml2YXRlXG5cbiAgICBfYWN0aXZhdGUoZWxlbWVudCwgY29udGFpbmVyLCBjYWxsYmFjaykge1xuICAgICAgY29uc3QgYWN0aXZlICAgICAgICAgID0gJChjb250YWluZXIpLmZpbmQoU2VsZWN0b3IuQUNUSVZFKVswXVxuICAgICAgY29uc3QgaXNUcmFuc2l0aW9uaW5nID0gY2FsbGJhY2tcbiAgICAgICAgJiYgVXRpbC5zdXBwb3J0c1RyYW5zaXRpb25FbmQoKVxuICAgICAgICAmJiAoYWN0aXZlICYmICQoYWN0aXZlKS5oYXNDbGFzcyhDbGFzc05hbWUuRkFERSkpXG5cbiAgICAgIGNvbnN0IGNvbXBsZXRlID0gKCkgPT4gdGhpcy5fdHJhbnNpdGlvbkNvbXBsZXRlKFxuICAgICAgICBlbGVtZW50LFxuICAgICAgICBhY3RpdmUsXG4gICAgICAgIGlzVHJhbnNpdGlvbmluZyxcbiAgICAgICAgY2FsbGJhY2tcbiAgICAgIClcblxuICAgICAgaWYgKGFjdGl2ZSAmJiBpc1RyYW5zaXRpb25pbmcpIHtcbiAgICAgICAgJChhY3RpdmUpXG4gICAgICAgICAgLm9uZShVdGlsLlRSQU5TSVRJT05fRU5ELCBjb21wbGV0ZSlcbiAgICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoVFJBTlNJVElPTl9EVVJBVElPTilcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29tcGxldGUoKVxuICAgICAgfVxuXG4gICAgICBpZiAoYWN0aXZlKSB7XG4gICAgICAgICQoYWN0aXZlKS5yZW1vdmVDbGFzcyhDbGFzc05hbWUuU0hPVylcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfdHJhbnNpdGlvbkNvbXBsZXRlKGVsZW1lbnQsIGFjdGl2ZSwgaXNUcmFuc2l0aW9uaW5nLCBjYWxsYmFjaykge1xuICAgICAgaWYgKGFjdGl2ZSkge1xuICAgICAgICAkKGFjdGl2ZSkucmVtb3ZlQ2xhc3MoQ2xhc3NOYW1lLkFDVElWRSlcblxuICAgICAgICBjb25zdCBkcm9wZG93bkNoaWxkID0gJChhY3RpdmUucGFyZW50Tm9kZSkuZmluZChcbiAgICAgICAgICBTZWxlY3Rvci5EUk9QRE9XTl9BQ1RJVkVfQ0hJTERcbiAgICAgICAgKVswXVxuXG4gICAgICAgIGlmIChkcm9wZG93bkNoaWxkKSB7XG4gICAgICAgICAgJChkcm9wZG93bkNoaWxkKS5yZW1vdmVDbGFzcyhDbGFzc05hbWUuQUNUSVZFKVxuICAgICAgICB9XG5cbiAgICAgICAgYWN0aXZlLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKVxuICAgICAgfVxuXG4gICAgICAkKGVsZW1lbnQpLmFkZENsYXNzKENsYXNzTmFtZS5BQ1RJVkUpXG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIHRydWUpXG5cbiAgICAgIGlmIChpc1RyYW5zaXRpb25pbmcpIHtcbiAgICAgICAgVXRpbC5yZWZsb3coZWxlbWVudClcbiAgICAgICAgJChlbGVtZW50KS5hZGRDbGFzcyhDbGFzc05hbWUuU0hPVylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQoZWxlbWVudCkucmVtb3ZlQ2xhc3MoQ2xhc3NOYW1lLkZBREUpXG4gICAgICB9XG5cbiAgICAgIGlmIChlbGVtZW50LnBhcmVudE5vZGUgJiZcbiAgICAgICAgICAkKGVsZW1lbnQucGFyZW50Tm9kZSkuaGFzQ2xhc3MoQ2xhc3NOYW1lLkRST1BET1dOX01FTlUpKSB7XG5cbiAgICAgICAgY29uc3QgZHJvcGRvd25FbGVtZW50ID0gJChlbGVtZW50KS5jbG9zZXN0KFNlbGVjdG9yLkRST1BET1dOKVswXVxuICAgICAgICBpZiAoZHJvcGRvd25FbGVtZW50KSB7XG4gICAgICAgICAgJChkcm9wZG93bkVsZW1lbnQpLmZpbmQoU2VsZWN0b3IuRFJPUERPV05fVE9HR0xFKS5hZGRDbGFzcyhDbGFzc05hbWUuQUNUSVZFKVxuICAgICAgICB9XG5cbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxuICAgICAgfVxuXG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2soKVxuICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gc3RhdGljXG5cbiAgICBzdGF0aWMgX2pRdWVyeUludGVyZmFjZShjb25maWcpIHtcbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcylcbiAgICAgICAgbGV0IGRhdGEgICAgPSAkdGhpcy5kYXRhKERBVEFfS0VZKVxuXG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgIGRhdGEgPSBuZXcgVGFiKHRoaXMpXG4gICAgICAgICAgJHRoaXMuZGF0YShEQVRBX0tFWSwgZGF0YSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGlmIChkYXRhW2NvbmZpZ10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBtZXRob2QgbmFtZWQgXCIke2NvbmZpZ31cImApXG4gICAgICAgICAgfVxuICAgICAgICAgIGRhdGFbY29uZmlnXSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gIH1cblxuXG4gIC8qKlxuICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogRGF0YSBBcGkgaW1wbGVtZW50YXRpb25cbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gICQoZG9jdW1lbnQpXG4gICAgLm9uKEV2ZW50LkNMSUNLX0RBVEFfQVBJLCBTZWxlY3Rvci5EQVRBX1RPR0dMRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBUYWIuX2pRdWVyeUludGVyZmFjZS5jYWxsKCQodGhpcyksICdzaG93JylcbiAgICB9KVxuXG5cbiAgLyoqXG4gICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgKiBqUXVlcnlcbiAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAqL1xuXG4gICQuZm5bTkFNRV0gICAgICAgICAgICAgPSBUYWIuX2pRdWVyeUludGVyZmFjZVxuICAkLmZuW05BTUVdLkNvbnN0cnVjdG9yID0gVGFiXG4gICQuZm5bTkFNRV0ubm9Db25mbGljdCAgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbltOQU1FXSA9IEpRVUVSWV9OT19DT05GTElDVFxuICAgIHJldHVybiBUYWIuX2pRdWVyeUludGVyZmFjZVxuICB9XG5cbiAgcmV0dXJuIFRhYlxuXG59KShqUXVlcnkpXG5cbmV4cG9ydCBkZWZhdWx0IFRhYlxuIl0sImZpbGUiOiJ0YWIuanMifQ==
