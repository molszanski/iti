/**
 * From
 * https://github.com/ai/nanoevents
 *
 * Sadly, can't install it via np. Some build issue
 */

export let createNanoEvents = () => ({
  events: {},
  emit(event, ...args) {
    ;(this.events[event] || []).forEach((i) => i(...args))
  },
  on(event, cb) {
    ;(this.events[event] = this.events[event] || []).push(cb)
    return () =>
      (this.events[event] = (this.events[event] || []).filter((i) => i !== cb))
  },
})
