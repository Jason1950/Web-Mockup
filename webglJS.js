
    import * as THREE from './build/three.module.js';

    import Stats from './jsm/libs/stats.module.js';

    import { OrbitControls } from './jsm/controls/OrbitControls.js';
    import { FBXLoader } from './jsm/loaders/FBXLoader.js';

    let camera, scene, renderer, stats;

    const clock = new THREE.Clock();

    let mixer;
    let mixer2;
    let act ;
    let action;
    let animationArray =[];
    let animationTemp = null;
    var canvas;

    const resizePara = 1; //4/5;
    let raycaster = new THREE.Raycaster();
    let currentlyAnimating = false;

    let man_txt = new THREE.TextureLoader().load('./pics/man.jpg');
    // let man_txt = new THREE.TextureLoader().load('./pics/stacy.jpg');

    man_txt.flipY = true; // we flip the texture so that its the right way up

    const man_mtl = new THREE.MeshPhongMaterial({
    map: man_txt,
    color: 0xffffff,
    skinning: true
    });

    // model
    const loader = new FBXLoader();

    loader.load( './3dfile/man_Dying.fbx', function ( object ) {
        object.animations[ 0 ].name ="die";
        animationArray.push( object.animations[ 0 ]);            
    } );

    // loader.load( './3dfile/man_Angry.fbx', function ( object ) {
    //     object.animations[ 0 ].name ="angry";
    //     animationArray.push( object.animations[ 0 ]);            
    // } );

    // loader.load( './3dfile/man_ZombieIdle.fbx', function ( object ) {
    //     object.animations[ 0 ].name ="zombie";
    //     animationArray.push( object.animations[ 0 ]);            
    // } );
    // loader.load( './3dfile/man_JoyfulJump.fbx', function ( object ) {
    //     object.animations[ 0 ].name ="jump";
    //     animationArray.push( object.animations[ 0 ]);            
    // } );

    window.onload = function() {
    
        //create a new instance of shake.js.
        var myShakeEvent = new Shake({
            threshold: 15
        });
    
        // start listening to device motion
        myShakeEvent.start();
    
        // register a shake event
        window.addEventListener('shake', shakeEventDidOccur, false);
    
        //shake event callback
        function shakeEventDidOccur () {
            // playOnClick();
            //put your own code here etc.
            // alert('Shake!');
            // JanimationPlay();
            const fSpeed = 0.25, tSpeed = 0.25;
            // mixer.stopAllAction();
            // let randInt = Math.floor(Math.random() * animationArray.length);
            action = mixer.clipAction( animationArray[0] );
            // action.reset();
            action.setLoop(THREE.LoopOnce);
            action.reset();
            action.play();
            action.crossFadeTo(action, fSpeed, true);
            setTimeout(function() {
                action.enabled = true;
                action.crossFadeTo(action, tSpeed, true);
                currentlyAnimating = false;
                }, action._clip.duration * 900 - ((tSpeed + fSpeed) * 1000));
            }
    };

    init();
    animate();

    function init() {

        // const container = document.createElement( 'div' );
        // // container.className='tclose'
        // container.setAttribute("id", "hk1");
        // document.body.appendChild( container );
        // const main2Canvas = document.querySelector("#hk1 canvas");
        // console.log(main2Canvas);
        // var canvas = document.querySelector("#canvas");
        // container.width = 300;

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
        camera.position.set( 10, 200, 350 );

        scene = new THREE.Scene();
        // scene.background = new THREE.Color( 0xf5c1bd );
        scene.background = new THREE.Color( 0xa0a0a0 );
        scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
        hemiLight.position.set( 0, 200, 0 );
        scene.add( hemiLight );

        const dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.position.set( 0, 200, 100 );
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 180;
        dirLight.shadow.camera.bottom = - 100;
        dirLight.shadow.camera.left = - 120;
        dirLight.shadow.camera.right = 120;
        scene.add( dirLight );

        // scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

        // ground
        const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
        mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;
        scene.add( mesh );

        const grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        scene.add( grid );

        
        // loader.load( './man_ZombieIdle.fbx', function ( object ) {
        loader.load( './3dfile/man.fbx', function ( object ) {

            mixer = new THREE.AnimationMixer( object );
  
            // const action = mixer.clipAction( animationArray[0] );
            // action.play();
            
            object.traverse( function ( child ) {

                if ( child.isMesh ) {

                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material = man_mtl;

                }

            } );
            object.name = "man";
            scene.add( object );

        } );
       

        

        canvas = document.getElementById("main3-canvas");
        // canvas.width = '50%';
        // canvas.z-index = '50%';
        console.log(canvas);
        renderer = new THREE.WebGLRenderer({ canvas: canvas,antialias: true });
        
        // renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth*resizePara, window.innerHeight*resizePara );
        renderer.shadowMap.enabled = true;
        // container.appendChild( renderer.domElement );

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.maxPolarAngle = Math.PI / 2 - 0.11;
        controls.minPolarAngle = Math.PI / 3 - 0.15;
        controls.maxAzimuthAngle = Math.PI *1/4 ;   //from 120 ~ -180 degree 
        controls.minAzimuthAngle = -Math.PI *2/3 ;
        // controls.enableDamping = true;
        controls.enableZoom = false;
        // controls.minDistance = 8;
        // controls.maxDistance = 17;
        // controls.enablePan = false;
        controls.dampingFactor = 0.1;
        // controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
        // controls.autoRotateSpeed = 0.2; // 30

        controls.target.set( 0, 100, 0 );
        controls.update();

        window.addEventListener( 'resize', onWindowResize );

        // stats
        // stats = new Stats();
        // container.appendChild( stats.dom );

    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth*resizePara, window.innerHeight*resizePara );

    }

    //

    function animate() {
        // canvas.width = 500;
        requestAnimationFrame( animate );

        const delta = clock.getDelta();
        // console.log(mixer2);
        if ( mixer ) mixer.update( delta );

        // if(mixer2){
        //     mixer2.update( delta );
        //     console.log('1');
        // }else if(mixer){
        //     mixer.update( delta );
        // }

        renderer.render( scene, camera );

        // stats.update();

    }


    // ******************************************** //
    //                                              //
    //                mouse click                   //
    //                                              //
    // ******************************************** //


    
    window.addEventListener('click', e => raycast(e));
    window.addEventListener('touchend', e => raycast(e, true));

    function raycast(e, touch = false) {
    var mouse = {};
    if (touch) {
        mouse.x = 2 * (e.changedTouches[0].clientX / window.innerWidth) - 1;
        mouse.y = 1 - 2 * (e.changedTouches[0].clientY / window.innerHeight);
    } else {
        mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
        mouse.y = 1 - 2 * (e.clientY / window.innerHeight);
    }
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects[0]) {
        var object = intersects[0].object;
        // console.log(object.name);
        if (object.name === 'rp_eric_rigged_001_geo') {

        if (!currentlyAnimating) {
            currentlyAnimating = true;
            playOnClick();
        }
        }
    }
    }


    // Get a random animation, and play it 
    function playOnClick() {
        // let anim = Math.floor(Math.random() * possibleAnims.length) + 0;
        // playModifierAnimation(idle, 0.25, possibleAnims[anim], 0.25);
        console.log('click 3d model');
        // currentlyAnimating = false;
        JanimationPlay();
        console.log(animationArray);
        
    }

    function JanimationPlay(){
        const fSpeed = 0.25, tSpeed = 0.25;
        // mixer.stopAllAction();
        let randInt = Math.floor(Math.random() * animationArray.length);
        action = mixer.clipAction( animationArray[randInt] );
        // action.reset();
        action.setLoop(THREE.LoopOnce);
        action.reset();
        action.play();
        action.crossFadeTo(action, fSpeed, true);
        setTimeout(function() {
            action.enabled = true;
            action.crossFadeTo(action, tSpeed, true);
            currentlyAnimating = false;
            }, action._clip.duration * 900 - ((tSpeed + fSpeed) * 1000));
    }

    function playModifierAnimation(from, fSpeed, to, tSpeed) {
        to.setLoop(THREE.LoopOnce);
        to.reset();
        to.play();
        from.crossFadeTo(to, fSpeed, true);
        setTimeout(function() {
          from.enabled = true;
          to.crossFadeTo(from, tSpeed, true);
          currentlyAnimating = false;
        }, to._clip.duration * 1000 - ((tSpeed + fSpeed) * 1000));
      }

    //   let clips = fileAnimations.filter(val => val.name !== 'idle');

    //   possibleAnims = clips.map(val => {
    //     let clip = THREE.AnimationClip.findByName(clips, val.name);
    //     clip.tracks.splice(3, 3);
    //     clip.tracks.splice(9, 3);
    //     clip = mixer.clipAction(clip);
    //     return clip;
    //    }
    //   );