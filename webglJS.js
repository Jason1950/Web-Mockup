
    import * as THREE from './build/three.module.js';

    import Stats from './jsm/libs/stats.module.js';

    import { OrbitControls } from './jsm/controls/OrbitControls.js';
    import { FBXLoader } from './jsm/loaders/FBXLoader.js';

    let camera, scene, renderer, stats;

    let loaderAnim = document.getElementById('js-loader');


    const clock = new THREE.Clock();

    let mixer;
    let mixer2;
    let act ;
    let action;
    let animationArray =[];
    let animationTemp = null;
    var canvas;

    let flyState = false;
    let flyTimes = 0;

    let startX = 0, startY = 0, endX = 0, endY =0;

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
    loader.load( './3dfile/man_StandToFreehang.fbx', function ( object ) {
        object.animations[ 0 ].name ="standtofreehang";
        animationArray.push( object.animations[ 0 ]);            
    } );
    // loader.load( './3dfile/man_JoyfulJump.fbx', function ( object ) {
    //     object.animations[ 0 ].name ="jump";
    //     animationArray.push( object.animations[ 0 ]);            
    // } );
    loader.load( './3dfile/man_Pain.fbx', function ( object ) {
        object.animations[ 0 ].name ="pain";
        animationArray.push( object.animations[ 0 ]);            
    } );

    

    

    window.onload = function() {
        
        //create a new instance of shake.js.
        var myShakeEvent = new Shake({
            threshold: 14
        });
    
        // start listening to device motion
        myShakeEvent.start();
    
        // register a shake event
        window.addEventListener('shake', shakeEventDidOccur, false);

        //shake event callback
        function shakeEventDidOccur () {
            //put your own code here etc.
            // alert('Shake!');
            const fSpeed = 0.25, tSpeed = 0.25;

            // die
            action = mixer.clipAction( animationArray.find(item=>item.name=='die') );
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

        
        const group = new THREE.Group();

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
            // scene.add( object );
            group.add( object );

            // loaderAnim.remove();
            $('.fade4').delay(500).fadeOut(400);
            console.log('fade4 fade out');

        } );

        group.name = "groupMan";
        scene.add( group );
       

        
        canvas = document.getElementById("main3-canvas");
        console.log(canvas);
        // ---------------- 綁定 canvas 為 自己指定的element !! --------------- //
        renderer = new THREE.WebGLRenderer({ canvas: canvas,antialias: true });
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth*resizePara, window.innerHeight*resizePara );
        renderer.shadowMap.enabled = true;

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.maxPolarAngle = Math.PI / 2 - 0.11;
        controls.minPolarAngle = Math.PI / 3 - 0.15;
        controls.maxAzimuthAngle = Math.PI *1/4 ;   //from 120 ~ -180 degree 
        controls.minAzimuthAngle = -Math.PI *2/3 ;
        controls.enableZoom = false;
        controls.dampingFactor = 0.1;
        // controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
        // controls.autoRotateSpeed = 0.2; // 30

        controls.target.set( 0, 100, 0 );
        controls.update();
        window.addEventListener( 'resize', onWindowResize );
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

        var object3DMan = scene.getObjectByName( "groupMan" );
        
        if (object3DMan && flyState){
            object3DMan.updateMatrix();
            object3DMan.position.y += 2.5;
            object3DMan.rotation.y += 0.08;
            console.log('move 3d model');
            flyTimes += 1;
            if (flyTimes>150) {
                flyState = !flyState;
                flyTimes = 0;
                main3ButtnClick();
            }
        }

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
            playOnClick('pain');
        }
        }
    }
    }


    // Get a random animation, and play it 
    function playOnClick(name) {
        // let anim = Math.floor(Math.random() * possibleAnims.length) + 0;
        // playModifierAnimation(idle, 0.25, possibleAnims[anim], 0.25);
        console.log('click 3d model');
        // currentlyAnimating = false;
        JanimationPlay(name);
        console.log(animationArray);
        
    }

    function JanimationPlay(name){
        const fSpeed = 0.25, tSpeed = 0.25;
        // mixer.stopAllAction();
        let randInt = Math.floor(Math.random() * animationArray.length);
        console.log(animationArray);
        action = mixer.clipAction( animationArray.find(item=>item.name==name) );
        // action = mixer.clipAction( animationArray[randInt] );

       
        // action.reset();
        action.setLoop(THREE.LoopOnce);
        action.reset();
        action.play();
        action.crossFadeTo(action, fSpeed, true);
        setTimeout(function() {
            action.enabled = true;
            action.crossFadeTo(action, tSpeed, true);
            currentlyAnimating = false;
            }, action._clip.duration * 2000 - ((tSpeed + fSpeed) * 1000));
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


    

    wetherScroll();
    function wetherScroll(){
        
        var body=document.getElementsByTagName("body");
        $(document).bind('touchstart',function(event){
        var touch = event.targetTouches[0];
        //滑動起點的座標
        startX = touch.pageX;
        startY = touch.pageY;
        // console.log("startX:" startX "," "startY:" startY);
        });
        $(document).bind("touchmove",function(event){
        var touch = event.targetTouches[0];
        //手勢滑動時，手勢座標不斷變化，取最後一點的座標為最終的終點座標
            endX = touch.pageX;
            endY = touch.pageY;
            // console.log("endX:", endX, ",", "endY:" ,endY);
        })
        // ac();
        $(document).bind("touchend",function(event){
        var distanceX=endX-startX,
            distanceY=endY - startY;
            // console.log("distanceX:" distanceX "," "distanceY:" distanceY);
            //移動端裝置的螢幕寬度
            var clientHeight = document.documentElement.clientHeight;
            // console.log(clientHeight;*0.2);
            //判斷是否滑動了，而不是螢幕上單擊了
            if(startY!=Math.abs(distanceY)){
    //在滑動的距離超過螢幕高度的20%時，做某種操作
            if(Math.abs(distanceY)>clientHeight*0.2){
    //向下滑實行函式someAction1，向上滑實行函式someAction2
            distanceY <0 ? someAction1():someAction2();
            }
            }
            startX = startY = endX =endY =0;
        })
    }
    function someAction1(){
        console.log('gogogo');
        flyState = true;
        JanimationPlay('standtofreehang');
    }
    function someAction2(){
        console.log('.');
    }