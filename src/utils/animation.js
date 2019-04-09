
export class Rotate {
  constructor(fn) {
    this.fn = fn
    this.duration = 1000
    this.animation = mpvue.createAnimation({ duration: this.duration })
    this.n = 0
  }
  _init() {
    this.n++
    this.fn(this.animation.rotate(this.n * 10).step())
  }
  play() {
    this._init()
    this.interval = setInterval(() => {
      this._init()
    }, this.duration)
  }
  stop() {
    this.n = 0
    clearInterval(this.interval)
    this.fn(this.animation.rotate(0).step({ duration: 0 }))
  }
}
