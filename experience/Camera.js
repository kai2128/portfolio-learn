import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Experience } from './Experience'

export class Camera {
  constructor() {
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.canvas = this.experience.canvas
    this.scene = this.experience.scene

    this.createPerspectiveCamera()
    this.createOrthographicCamera()
    this.setOrbitControls()
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.perspectiveCamera, this.canvas)
    this.controls.enableDamping = true
    this.controls.enableZoom = false

    this.controls.enablePan = true
    // this.controls.minDistance = 1
    // this.controls.maxDistance = 10
    // this.controls.maxPolarAngle = Math.PI / 2
    // this.controls.minPolarAngle = Math.PI / 2
  }

  createPerspectiveCamera() {
    this.perspectiveCamera = new THREE.PerspectiveCamera(35, this.sizes?.aspect, 0.1, 1000)
    this.scene?.add(this.perspectiveCamera)
    this.perspectiveCamera.position.z = 12
    this.perspectiveCamera.position.y = 29
    this.perspectiveCamera.position.z = 14
  }

  createOrthographicCamera() {
    this.orthographicCamera = new THREE.OrthographicCamera(
      (-this.sizes.aspect * this.sizes.frustrum) / 2,
      (this.sizes.aspect * this.sizes.frustrum) / 2,
      this.sizes.frustrum / 2,
      -this.sizes.frustrum / 2,
      -50,
      50,
    )

    this.orthographicCamera.position.y = 3.5
    this.orthographicCamera.position.z = 4
    this.orthographicCamera.rotation.x = -Math.PI / 6

    this.scene?.add(this.orthographicCamera)

    // this.helper = new THREE.CameraHelper(this.orthographicCamera)
    // this.scene.add(this.helper)

    const size = 20
    const divisions = 20

    // const gridHelper = new THREE.GridHelper(size, divisions)
    // this.scene?.add(gridHelper)

    // const axesHelper = new THREE.AxesHelper(10)
    // this.scene?.add(axesHelper)
  }

  resize() {
    this.perspectiveCamera.aspect = this.sizes.aspect
    this.perspectiveCamera.updateProjectionMatrix()

    this.orthographicCamera.left = (-this.sizes.aspect * this.sizes.frustrum) / 2
    this.orthographicCamera.right = (this.sizes.aspect * this.sizes.frustrum) / 2
    this.orthographicCamera.top = this.sizes.frustrum / 2
    this.orthographicCamera.bottom = -this.sizes.frustrum / 2
    this.orthographicCamera.updateProjectionMatrix()
  }

  update() {
    this.controls?.update()
    // this.helper.matrixWorldNeedsUpdate = true
    // this.helper.update()
    // this.helper.position.copy(this.orthographicCamera.position)
    // this.helper.position.copy(this.orthographicCamera?.rotation)
  }
}
