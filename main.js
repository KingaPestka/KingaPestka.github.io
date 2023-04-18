import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {
  FBXLoader
} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import {
  GLTFLoader
} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import {
  OrbitControls
} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';


class BasicCharacterControls {
  constructor(params) {
    this._Init(params);
  }

  _Init(params) {
    this._params = params;
    this._move = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    };
    this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
    this._acceleration = new THREE.Vector3(1, 0.25, 50.0);
    this._velocity = new THREE.Vector3(0, 0, 0);

    document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
  }

  _onKeyDown(event) {
    switch (event.keyCode) {
      case 87: // w
        this._move.forward = true;
        break;
      case 65: // a
        this._move.left = true;
        break;
      case 83: // s
        this._move.backward = true;
        break;
      case 68: // d
        this._move.right = true;
        break;
      case 38: // up
      case 37: // left
      case 40: // down
      case 39: // right
        break;
    }
  }

  _onKeyUp(event) {
    switch (event.keyCode) {
      case 87: // w
        this._move.forward = false;
        break;
      case 65: // a
        this._move.left = false;
        break;
      case 83: // s
        this._move.backward = false;
        break;
      case 68: // d
        this._move.right = false;
        break;
      case 38: // up
      case 37: // left
      case 40: // down
      case 39: // right
        break;
    }
  }

  Update(timeInSeconds) {

    console.log("Updating....");


    const velocity = this._velocity;
    const frameDecceleration = new THREE.Vector3(
      velocity.x * this._decceleration.x,
      velocity.y * this._decceleration.y,
      velocity.z * this._decceleration.z
    );
    frameDecceleration.multiplyScalar(timeInSeconds);
    frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
      Math.abs(frameDecceleration.z), Math.abs(velocity.z));

    velocity.add(frameDecceleration);

    const controlObject = this._params.target;
    const _Q = new THREE.Quaternion();
    const _A = new THREE.Vector3();
    const _R = controlObject.quaternion.clone();

    if (this._move.forward) {
      velocity.z += this._acceleration.z * timeInSeconds;
    }
    if (this._move.backward) {
      velocity.z -= this._acceleration.z * timeInSeconds;
    }
    if (this._move.left) {
      _A.set(0, 2, 0);
      _Q.setFromAxisAngle(_A, Math.PI * timeInSeconds * this._acceleration.y);
      _R.multiply(_Q);
    }
    if (this._move.right) {
      _A.set(0, 2, 0);
      _Q.setFromAxisAngle(_A, -Math.PI * timeInSeconds * this._acceleration.y);
      _R.multiply(_Q);
    }

    console.log(velocity)
    // if(this.x = 6){
    //  window.open('https://www.youtube.com/watch?v=NA4PWYW5Grw','newwindow');
    //  }
    // }
    //  if (this._move.backward && fbx.position.x == 6 ){
    //    window.open('https://www.youtube.com/watch?v=NA4PWYW5Grw','newwindow');
    // }
    // if (this.x === new THREE.Vector3(1) ) {
    //    window.open('https://www.youtube.com/watch?v=NA4PWYW5Grw','newwindow');
    //}


    // if(this._params.target = new THREE.Vector3(1,1,1)){
    //    window.open('https://www.youtube.com/watch?v=NA4PWYW5Grw','newwindow');

    // if (===1){
    //    window.open('https://www.youtube.com/watch?v=NA4PWYW5Grw','newwindow');
    //}  


    controlObject.quaternion.copy(_R);

    const oldPosition = new THREE.Vector3();
    oldPosition.copy(controlObject.position);

    const forward = new THREE.Vector3(0, 0, 3);
    forward.applyQuaternion(controlObject.quaternion);
    forward.normalize();

    const sideways = new THREE.Vector3(0, 0, 0);
    sideways.applyQuaternion(controlObject.quaternion);
    sideways.normalize();

    sideways.multiplyScalar(velocity.x * timeInSeconds);
    forward.multiplyScalar(velocity.z * timeInSeconds);

    controlObject.position.add(forward);
    controlObject.position.add(sideways);

    oldPosition.copy(controlObject.position);

    console.log("Control Object");
    console.log(controlObject.position.x);

    if (controlObject.position.x > 10){
      window.open('https://www.deviantart.com/kingapestkaart','newwindow'); 
      location.reload('http://127.0.0.1:5500/');
    }  

  }

}


class LoadModelDemo {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this._threejs.domElement);

    window.addEventListener('resize', () => {
      this._OnWindowResize();
    }, false);

    const fov = 40;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(90, 50, 150);


   // const target = new THREE.Vector3(0, 20, 0);
    //this._camera.lookAt(target);
    //this._camera.rotation.set(0, Math.PI/1, 100);
    

    this._scene = new THREE.Scene();

    let light = new THREE.DirectionalLight(0xffffff  , 0.3);
    light.position.set(20, 50, 50);
    light.target.position.set(0, 0, 0);
    light.castShadow = false;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25.0;
    light.shadow.camera.near = 25.0;
    light.shadow.camera.far = 25.0;
    light.shadow.camera.left = 25;
    light.shadow.camera.right = -25;
    light.shadow.camera.top = 25;
    light.shadow.camera.bottom = -25;
    this._scene.add(light);

    light = new THREE.AmbientLight(0xffffff  , 1.5);
    this._scene.add(light);

    const controls = new OrbitControls( //orbit around the place
      this._camera, this._threejs.domElement);
    controls.target.set(-20,25, 5);
    controls.update();

    //const loader = new THREE.TextureLoader();
    const texture = new THREE.TextureLoader().load(
      './resources/1.jpg' //changes background colour
    );
    /// './resources/posx.jpg',
    /// './resources/purple.jpg',
    ///'./resources/posy.jpg',
    ///'./resources/negy.jpg',
    ///'./resources/posz.jpg',
    ///'./resources/negz.jpg',
    /// ]);
    this._scene.background = texture;

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(0, 0, 0),


      new THREE.MeshBasicMaterial({
        color: 0xba83eb ///color of plane base







      }));
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    //  plane.DirectionalLight = 1;
    this._scene.add(plane);


    this._mixers = [];
    this._previousRAF = null;

    this._LoadAnimatedModel();
    //this._LoadAnimatedModelAndPlay(
    //  './resources/hotair/', 'final_base.fbx', 'final_base4.fbx', new THREE.Vector3(0, 10, 5));
    this._LoadAnimatedModelAndPlay(
      './resources/hotair/', 'pinktrees.fbx', 'pinktrees.fbx', new THREE.Vector3(0, 10, 5));
    this._LoadAnimatedModelAndPlay(
       './resources/hotair/', 'greentrees.fbx', 'greentrees.fbx', new THREE.Vector3(0, 10, 5));
    this._LoadAnimatedModelAndPlay(
        './resources/hotair/', 'base10.fbx', 'base10.fbx', new THREE.Vector3(0, 10, 6));
    this._LoadAnimatedModelAndPlay(
        './resources/hotair/', 'purpleflowers.fbx', 'purpleflowers.fbx', new THREE.Vector3(0, 10, 5));
    this._LoadAnimatedModelAndPlay(
        './resources/hotair/', 'pinkflowers.fbx', 'pinkflowers.fbx', new THREE.Vector3(0, 10, 5));
    this._LoadAnimatedModelAndPlay(
        './resources/hotair/', 'orangeflowers.fbx', 'orangeflowers.fbx', new THREE.Vector3(0, 10, 5));
    this._LoadAnimatedModelAndPlay(
        './resources/hotair/', 'stones.fbx', 'stones.fbx', new THREE.Vector3(0, 10, 5));
   // this._LoadAnimatedModelAndPlay(
    //    './resources/hotair/', 'stophouse.fbx', 'stophouse.fbx', new THREE.Vector3(0, 10, 5));
    this._LoadAnimatedModelAndPlay(
        './resources/hotair/', 'stop.fbx', 'stop.fbx', new THREE.Vector3(0, 10, 5));
    this._LoadAnimatedModelAndPlay(
        './resources/hotair/', 'step.fbx', 'step_movement10.fbx', new THREE.Vector3(0, 10, 5));
    this._LoadAnimatedModelAndPlay(
        './resources/hotair/', 'step.fbx', 'step_movement11.fbx', new THREE.Vector3(2, 12, 5));
    this._LoadAnimatedModelAndPlay(
        './resources/hotair/', 'step.fbx', 'step_movement12.fbx', new THREE.Vector3(4, 14, 5));
    this._LoadAnimatedModelAndPlay(
        './resources/hotair/', 'step.fbx', 'step_movement13.fbx', new THREE.Vector3(6, 16, 5));
    this._LoadAnimatedModelAndPlay(
        './resources/hotair/', 'step.fbx', 'step_movement14.fbx', new THREE.Vector3(8, 18, 5));
    this._LoadAnimatedModelAndPlay(
        './resources/hotair/', 'step.fbx', 'step_movement15.fbx', new THREE.Vector3(10, 20, 5));
    this._LoadAnimatedModelAndPlay(
        './resources/hotair/', 'frame.fbx', 'frame.fbx', new THREE.Vector3(0, 10, 5));
    this._LoadAnimatedModelAndPlay(
        './resources/hotair/', 'bench4.fbx', 'bench4.fbx', new THREE.Vector3(0, 10, 5));
    this._LoadAnimatedModelAndPlay(
        './resources/hotair/', 'roof8.fbx', 'roof8.fbx', new THREE.Vector3(0, 10, 5));
    this._LoadAnimatedModelAndPlay(
        './resources/hotair/', 'platform.fbx', 'platform.fbx', new THREE.Vector3(-12, 5, 7));
    this._LoadAnimatedModelAndPlay(
        './resources/hotair/', 'cloud1.fbx', 'cloud1.fbx', new THREE.Vector3(30, 45, -10));
    this._LoadAnimatedModelAndPlay(
        './resources/hotair/', 'cloud2.fbx', 'cloud2.fbx', new THREE.Vector3(0, 50, 0));
    this._LoadAnimatedModelAndPlay(
        './resources/hotair/', 'cloud3.fbx', 'cloud3.fbx', new THREE.Vector3(15, 35, 10));
    this._LoadAnimatedModelAndPlay(
        './resources/hotair/', 'cloud4.fbx', 'cloud4.fbx', new THREE.Vector3(15, 60, 5));
   // this._LoadAnimatedModelAndPlay(
    //    './resources/hotair/', 'cloud5.fbx', 'cloud5_fly.fbx', new THREE.Vector3(0, 10, 5));
    this._RAF();
    this._LoadModel();
    this._LoadModel2();
    this._LoadModel(
      '/resources/house/cubehouse.fbx');

  }




  _LoadAnimatedModel() {
    const loader = new FBXLoader();
    loader.setPath('./resources/hotair/');
    loader.load('test_bal5.fbx', (fbx) => {
      fbx.scale.setScalar(0.05);
      fbx.position.set(-50,35,10);
    
      fbx.traverse(c => {
        c.castShadow = false;
      });

      const params = {
        target: fbx,
        camera: this._camera,
      }
      this._controls = new BasicCharacterControls(params);

      const anim = new FBXLoader();
      anim.setPath('./resources/hotair/');
      anim.load('test_bal6.fbx', (anim) => {
        const m = new THREE.AnimationMixer(fbx);
        this._mixers.push(m);
        const idle = m.clipAction(anim.animations[0]);
        idle.play();
      });
      this._scene.add(fbx);
      //this._Checker(1, 1);
    });
  }

  _LoadAnimatedModelAndPlay(path, modelFile, animFile, offset) {
    const loader = new FBXLoader();
    loader.setPath(path);
    loader.load(modelFile, (fbx) => {
      fbx.scale.setScalar(0.002);
     
      fbx.traverse(c => {
        c.castShadow = true;
      });
      fbx.position.copy(offset);

      const anim = new FBXLoader();
      anim.setPath(path);
      anim.load(animFile, (anim) => {
        const m = new THREE.AnimationMixer(fbx);
        this._mixers.push(m);
        const idle = m.clipAction(anim.animations[0]);
        idle.play();
      });
      this._scene.add(fbx);
    });
  }

  _LoadModel() {
    const loader = new GLTFLoader();
    loader.load('./resources/', (gltf) => {
       gltf.scale.Vector3(1, 1, 1)


      gltf.scene.traverse(c => {
        c.castShadow = true;
        c.scale.Vector3(1, 1, 1)

      });

      this._scene.add(gltf.scene);
    });
  }
  _LoadModel2() {
    const loader = new GLTFLoader();
    loader.load('./resources/bench2.gltf', (gltf) => {
      // gltf.scale.Vector3(1, 1, 1)


      gltf.scene.traverse(c => {
        c.castShadow = true;
        //c.scale.Vector3(1, 1, 1)

      });

      this._scene.add(gltf.scene);
    });
  }
  //_loadModel() {
  //    const loader = new OBJLoader();

  // load a resource
  //loader.load(
  // resource URL
  //'./resources/monster.obj',
  // called when resource is loaded
  //	function ( object ) {

  //	scene.add( object );

  //},
  // called when loading is in progresses
  //	function ( xhr ) {

  //	console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  //},
  //// called when loading has errors
  //	function ( error ) {

  //	console.log( 'An error happened' );
  //
  //}
  //);
  // }
  //_LoadModel() {
  //  const loader = new THREE.FBXLoader();
  // fbxloader.load('./resources/house/cubehouse.fbx', (object) => {


  // fbx.scene.traverse(c => {
  //  c.castShadow = true;

  // });

  //   scene.add(object);
  // });
  // }

  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  _RAF() {
    requestAnimationFrame((t) => {
      if (this._previousRAF === null) {
        this._previousRAF = t;
      }

      this._RAF();

      this._threejs.render(this._scene, this._camera);
      this._Step(t - this._previousRAF);
      this._previousRAF = t;
    });
  }

  _Step(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;
    if (this._mixers) {
      this._mixers.map(m => m.update(timeElapsedS));
    }

    if (this._controls) {
      this._controls.Update(timeElapsedS);
    }
  }

  //_Checker(x, z) {
  //  if (fbx.position.x === 1 && fbx.position.z === 1) {
  //    window.open('https://www.youtube.com/watch?v=NA4PWYW5Grw', 'newwindow');
//
  //  }
  //}
}
let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new LoadModelDemo();
});