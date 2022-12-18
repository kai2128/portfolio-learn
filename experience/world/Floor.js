import gsap from 'gsap'
import * as THREE from 'three'
import { Experience } from '../Experience'

export class Floor {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene

    this.setFloor()
    this.setCircles()
  }

  setFloor() {
    this.geometry = new THREE.PlaneGeometry(100, 100)
    this.material = new THREE.MeshStandardMaterial({
      color: 0xFFE08A,
      side: THREE.DoubleSide,
    })
    this.plane = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.plane)
    this.plane.rotation.x = Math.PI / 2
    this.plane.position.y = -0.2
    this.plane.receiveShadow = true
  }

  setCircles() {
    this.geometry = new THREE.CircleGeometry(5, 64)
    const material = new THREE.MeshStandardMaterial({
      color: 0xE5A1AA,
    })
    const material2 = new THREE.MeshStandardMaterial({
      color: 0x8395CD,
    })
    const material3 = new THREE.MeshStandardMaterial({
      color: 0x7AD0AC,
    })
    this.circleFirst = new THREE.Mesh(this.geometry, material)
    this.circleSecond = new THREE.Mesh(this.geometry, material2)
    this.circleThird = new THREE.Mesh(this.geometry, material3)
    this.circleFirst.position.y = -0.19
    this.circleSecond.position.y = -0.18
    this.circleSecond.position.x = 2
    this.circleThird.position.y = -0.2
    this.circleFirst.scale.set(0, 0, 0)
    this.circleSecond.scale.set(0, 0, 0)
    this.circleThird.scale.set(0, 0, 0)
    this.scene?.add(this.circleFirst)
    this.scene?.add(this.circleSecond)
    this.scene?.add(this.circleThird)
    this.circleFirst.rotation.x = this.circleSecond.rotation.x = this.circleThird.rotation.x = -Math.PI / 2
    this.circleFirst.receiveShadow = this.circleSecond.receiveShadow = this.circleThird.receiveShadow = true

    this.scene.add(this.circleFirst)
    this.scene.add(this.circleSecond)
    this.scene.add(this.circleThird)
  }

  resize() {
  }

  update() {
  }
}
