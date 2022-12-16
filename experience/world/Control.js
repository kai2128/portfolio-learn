import * as THREE from 'three'
import GSAP from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import ASScroll from '@ashthornton/asscroll'
import { Experience } from '../Experience'

export class Control {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.time = this.experience.time
    this.camera = this.experience.camera
    this.room = this.experience.world.room.actualRoom
    this.sunlight = this.experience.world.environment.sunlight
    this.fishTankLight = this.experience.world?.room.fishTankLight
    this.sizes = this.experience.sizes
    this.room.children.forEach((child) => {
      if (child.type === 'RectAreaLight')
        this.reactLight = child
    })

    GSAP.registerPlugin(ScrollTrigger)
    this.mm = GSAP.matchMedia()
    this.setSmoothScroll()
    this.setScrollTrigger()
  }

  setupASScroll() {
    // https://github.com/ashthornton/asscroll
    const asscroll = new ASScroll({
      ease: 0.5,
      disableRaf: true,
    })

    GSAP.ticker.add(asscroll.update)

    ScrollTrigger.defaults({
      scroller: asscroll.containerElement,
    })

    ScrollTrigger.scrollerProxy(asscroll.containerElement, {
      scrollTop(value) {
        if (arguments.length) {
          asscroll.currentPos = value
          return
        }
        return asscroll.currentPos
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      },
      fixedMarkers: true,
    })

    asscroll.on('update', ScrollTrigger.update)
    ScrollTrigger.addEventListener('refresh', asscroll.resize)

    requestAnimationFrame(() => {
      asscroll.enable({
        newScrollElements: document.querySelectorAll(
          '.gsap-marker-start, .gsap-marker-end, [asscroll]',
        ),
      })
    })
    return asscroll
  }

  setSmoothScroll() {
    this.asscroll = this.setupASScroll()
  }

  setScrollTrigger() {
    // Desktop
    this.mm.add('(min-width: 969px)', () => {
      this.room.scale.set(0.09, 0.09, 0.09)
      this.fishTankLight.width = 0.3
      this.fishTankLight.height = 1.4

      // first section
      this.firstMoveTimeline = GSAP.timeline({
        scrollTrigger: {
          trigger: '.first-move',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
      this.firstMoveTimeline.to(this.camera?.orthographicCamera?.position, {
        x: () => this.sizes?.width * -0.0017,
      }, 'move')
        .to(this.sunlight.position, {
          x: () => this.sizes?.width * -0.0017,
        }, 'move')

      // second section
      this.secondMoveTimeline = GSAP.timeline({
        scrollTrigger: {
          trigger: '.second-move',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
        .to(this.room.position, {
          x: -1,
          z: () => this.sizes?.height * 0.0032,
        }, 'move and zoom')
        .to(this.room.scale, {
          x: 0.4,
          z: 0.4,
          y: 0.4,
        }, 'move and zoom')
        .to(this.reactLight, {
          width: this.reactLight.width * 4,
          height: this.reactLight.height * 4,
        }, 'move and zoom')

      // third section
      this.thirdMoveTimeline = GSAP.timeline({
        scrollTrigger: {
          trigger: '.third-move',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
        .to(this.camera?.orthographicCamera?.position, {
          y: -2.5,
          x: -6.4,
        })
    })
    // Mobile
    this.mm.add('(max-width: 968px)', () => {
      // resets
      this.room.scale.set(0.07, 0.07, 0.07)
      this.room.position.set(0, 0, 0)
      this.fishTankLight.width = 0.2
      this.fishTankLight.height = 1.0

      this.firstMoveTimeline = GSAP.timeline({
        scrollTrigger: {
          trigger: '.first-move',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
        .to(this.room.scale, {
          x: 0.1,
          y: 0.1,
          z: 0.1,
        })

      this.secondMoveTimeline = GSAP.timeline({
        scrollTrigger: {
          trigger: '.second-move',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      }).to(this.room.scale, {
        x: 0.15,
        y: 0.15,
        z: 0.15,
      }, 'scale and move').to(this.fishTankLight, {
        width: 0.2 * 3.15,
        height: 1.0 * 3.15,
      }, 'scale and move').to(this.room.position, {
        x: 1.2,
      }, 'scale and move')

      this.thirdMoveTimeline = GSAP.timeline({
        scrollTrigger: {
          trigger: '.third-move',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      }).to(this.camera?.orthographicCamera?.position, {
        y: 0.3,
      })
    })

    this.mm.add('all', () => {
      this.sections = document.querySelectorAll('.section')
      this.sections.forEach((section) => {
        this.progressWrapper = section.querySelector('.progress-wrapper')
        this.progressBar = section.querySelector('.progress-bar')
        if (section.classList.contains('right')) {
          GSAP.to(section, {
            borderTopLeftRadius: 10,
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top top',
              scrub: 0.6,
            },
          })
          GSAP.to(section, {
            borderBottomLeftRadius: 700,
            scrollTrigger: {
              trigger: section,
              start: 'bottom bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          })
        }
        else {
          GSAP.to(section, {
            borderTopRightRadius: 10,
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top top',
              scrub: 0.6,
            },
          })
          GSAP.to(section, {
            borderBottomRightRadius: 700,
            scrollTrigger: {
              trigger: section,
              start: 'bottom bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          })
        }
        GSAP.from(this.progressBar, {
          height: 0,
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.4,
            pin: this.progressWrapper,
            pinSpacing: false,
          },
        })
      })

      // mini platform animation
      this.secondPartTimeline = GSAP.timeline({
        scrollTrigger: {
          trigger: '.third-move',
          start: 'center center',
        },
      }).to(this.camera?.orthographicCamera?.position, {
        y: 0.3,
      })

      this.room.children.forEach((child) => {
        if (child.name === 'Mini_Floor') {
          this.first = GSAP.to(child.position, {
            x: -7.27417,
            z: 17.711,
            duration: 0.3,
            ease: 'back.out(2)',
          })
        }
        if (child.name === 'Mailbox') {
          this.second = GSAP.to(child.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.3,
            ease: 'back.out(2)',
          })
        }
        if (child.name === 'Lamp') {
          this.third = GSAP.to(child.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.3,
            ease: 'back.out(2)',
          })
        }
        if (child.name === 'FloorFirst') {
          this.fourth = GSAP.to(child.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.3,
            ease: 'back.out(2)',
          })
        }
        if (child.name === 'FloorSecond') {
          this.fifth = GSAP.to(child.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.3,
            ease: 'back.out(2)',
          })
        }
        if (child.name === 'FloorThird') {
          this.sixth = GSAP.to(child.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.3,
            ease: 'back.out(2)',
          })
        }
        if (child.name === 'Dirt') {
          this.seventh = GSAP.to(child.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.3,
            ease: 'back.out(2)',
          })
        }
        if (child.name === 'Flower') {
          this.eighth = GSAP.to(child.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.3,
            ease: 'back.out(2)',
          })
        }
      })

      this.secondPartTimeline.add(this.first)
      this.secondPartTimeline.add(this.second)
      this.secondPartTimeline.add(this.third)
      this.secondPartTimeline.add(this.fourth, '-=0.2')
      this.secondPartTimeline.add(this.fifth, '-=0.2')
      this.secondPartTimeline.add(this.sixth, '-=0.2')
      this.secondPartTimeline.add(this.seventh)
      this.secondPartTimeline.add(this.eighth, '-=0.1')
    })
  }

  resize() {
  }

  update() {
  }
}
