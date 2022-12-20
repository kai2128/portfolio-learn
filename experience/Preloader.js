import { EventEmitter } from 'events'
import GSAP from 'gsap'
import { Experience } from './Experience'
import { convertDivsToSpans } from './utils/convertDivsToSpans'

export class Preloader extends EventEmitter {
  constructor() {
    super()
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.sizes = this.experience.sizes
    this.resources = this.experience.resources
    this.time = this.experience.time
    this.camera = this.experience.camera
    this.world = this.experience.world
    this.device = this.sizes?.device
    this.sizes.on('switchdevice', (device) => {
      this.device = device
    })

    this.world?.on('worldready', () => {
      this.setAssets()
      this.playIntro()
    })
  }

  setAssets() {
    convertDivsToSpans(document.querySelector('.intro-text'))
    convertDivsToSpans(document.querySelector('.hero-main-title'))
    convertDivsToSpans(document.querySelector('.hero-main-description'))
    convertDivsToSpans(document.querySelector('.hero-second-subheading'))
    convertDivsToSpans(document.querySelector('.second-sub'))
    this.room = this.experience.world?.room.actualRoom
    this.roomChildren = this.experience.world?.room.roomChildren
  }

  onTouch(e) {
    this.initialY = e.touches[0].clientY
  }

  move() {
    if (this.device === 'desktop')
      this.room.position.set(-1, 0, 0)

    else
      this.room.position.set(0, 0, -1)
  }

  update() {
    if (this.moveFlag)
      this.move()

    if (this.scaleFlag)
      this.scale()
  }

  onTouchMove(e) {
    const currentY = e.touches[0].clientY
    const difference = this.initialY - currentY

    // swipped up
    if (difference > 0) {
      this.removeEventListeners()
      this.playSecondIntro()
    }

    this.initialY = null
  }

  removeEventListeners() {
    window.removeEventListener('wheel', this.scrollOnceEvent)
    window.removeEventListener('touchStart', this.touchStart)
    window.removeEventListener('touchMove', this.touchMove)
  }

  async playIntro() {
    await this.firstIntro()
    this.moveFlag = true
    this.scrollOnceEvent = this.onScroll.bind(this)
    this.touchStart = this.onTouch.bind(this)
    this.touchMove = this.onTouchMove.bind(this)
    window.addEventListener('wheel', this.scrollOnceEvent)
    window.addEventListener('touchStart', this.touchStart)
    window.addEventListener('touchMove', this.touchMove)
  }

  firstIntro() {
    return new Promise((resolve) => {
      this.timeline = GSAP.timeline()
      this.timeline.set('.animatedis', { y: 0, yPercent: 100 })
      this.timeline.to('.preloader', {
        opacity: 0,
        delay: 1,
        onComplete: () => { document.querySelector('.preloader').classList.add('hidden') },
      })
      if (this.device === 'desktop') {
        this.timeline.to(this.roomChildren.cube143.scale, {
          x: 1.4,
          y: 1.4,
          z: 1.4,
          ease: 'back.out(2.5)',
          duration: 0.7,
        }).to(this.room.position, {
          x: -1.2,
          ease: 'power1.out',
          duration: 0.7,
        })
      }
      else {
        this.timeline.to(this.roomChildren.cube143.scale, {
          x: 1.4,
          y: 1.4,
          z: 1.4,
          ease: 'back.out(2.5)',
          duration: 0.7,
        }).to(this.room.position, { z: -1, ease: 'power1.out', duration: 0.7 })
      }
      this.timeline.to('.intro-text .animatedis', {
        yPercent: 0,
        stagger: 0.05,
        ease: 'back.out(1.7)',
      }).to('.arrow-svg-wrapper', {
        opacity: 1,
      }, 'same')
        .to('.toggle-bar', {
          opacity: 1,
          onComplete: resolve,
        }, 'same')
    })
  }

  onScroll(e) {
    if (e.deltaY > 0) {
      this.removeEventListeners()
      this.playSecondIntro()
    }
  }

  async playSecondIntro() {
    this.moveFlag = false
    this.scaleFlag = true
    await this.secondIntro()
    this.loadedIntro = true
    if (this.experience.theme.theme === 'dark')
      this.experience.world?.environment.openfishTankLight()

    this.scaleFlag = false
    this.emit('enablecontrols')
  }

  secondIntro() {
    return new Promise((resolve) => {
      this.secondTimeline = GSAP.timeline()
      this.secondTimeline
        .to('.intro-text .animatedis', {
          yPercent: 100,
          stagger: 0.05,
          ease: 'back.in(1.7)',
        }, 'fadeout')
        .to('.arrow-svg-wrapper', {
          opacity: 0,
        }, 'fadeout')
        .to(this.room.position, {
          x: 0,
          y: 0,
          z: 0,
          ease: 'power1.out',
        }, 'same').to(this.roomChildren.cube143.rotation, {
          y: 2 * Math.PI + Math.PI / 4,
        }, 'same').to(this.roomChildren.cube143.scale, {
          x: 10,
          y: 10,
          z: 10,
        }, 'same').to(this.camera?.orthographicCamera.position, {
          y: 3.5,
        }, 'same').to(this.roomChildren.cube143.position, {
          y: 11.7197,
          x: 0.001085,
          z: -0.960579,
        }, 'same').set(this.roomChildren.body.scale, {
          x: 1,
          y: 1,
          z: 1,
        })
        .to(this.roomChildren.cube143.scale, {
          x: 0,
          y: 0,
          z: 0,
        }, 'intro-text')
        .to('.hero-main-title .animatedis', {
          yPercent: 0,
          stagger: 0.07,
          ease: 'back.out(1.7)',
        }, 'intro-text')
        .to('.hero-main-description .animatedis', {
          yPercent: 0,
          stagger: 0.07,
          ease: 'back.out(1.7)',
        }, 'intro-text')
        .to('.first-sub .animatedis', {
          yPercent: 0,
          stagger: 0.07,
          ease: 'back.out(1.7)',
        }, 'intro-text')
        .to('.second-sub .animatedis', {
          yPercent: 0,
          stagger: 0.07,
          ease: 'back.out(1.7)',
        }, 'intro-text')
        .set(this.roomChildren.mini_floor.scale, { x: 1, y: 1, z: 1 })
        .to(this.roomChildren.aquarium.scale, { x: 1, y: 1, z: 1, ease: 'back.out(2.2)', duration: 0.5 }, '>-1')
        .to(this.roomChildren.clock.scale, { x: 1, y: 1, z: 1, ease: 'back.out(2.2)', duration: 0.5 }, '>-0.5')
        .to(this.roomChildren.shelves.scale, { x: 1, y: 1, z: 1, ease: 'back.out(2.2)', duration: 0.5 }, '>-0.4')
        .to(this.roomChildren.floor_items.scale, { x: 1, y: 1, z: 1, ease: 'back.out(2.2)', duration: 0.5 }, '>-0.3')
        .to(this.roomChildren.desk.scale, { x: 1, y: 1, z: 1, ease: 'back.out(2.2)', duration: 0.5 })
        .to(this.roomChildren.table_stuff.scale, { x: 1, y: 1, z: 1, ease: 'back.out(2.2)', duration: 0.5 }, '>-0.2')
        .to(this.roomChildren.computer.scale, { x: 1, y: 1, z: 1, ease: 'back.out(2.2)', duration: 0.5 }, '>-0.2')
        .to(this.roomChildren.fish.scale, { x: 1, y: 1, z: 1, ease: 'back.out(2.2)', duration: 0.5 }, '>-0.1')
        .to(this.roomChildren.chair.scale, { x: 1, y: 1, z: 1, ease: 'back.out(2.2)', duration: 0.5 }, 'chair')
        .to(this.roomChildren.chair.rotation, { y: 4 * Math.PI, ease: 'power2.out', duration: 1, onComplete: resolve }, 'chair')
        .to('.arrow-svg-wrapper', {
          opacity: 1,
        })
    })
  }

  scale() {
    if (this.device === 'desktop')
      this.room.scale.set(0.09, 0.09, 0.09)

    else
      this.room.scale.set(0.07, 0.07, 0.07)
  }

  resize() {
  }
}
