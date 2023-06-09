import {
    Scene,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    PerspectiveCamera,
    WebGLRenderer,
    Vector2,
    Vector3,
    Vector4,
    Quaternion,
    Matrix4,
    Spherical,
    Box3,
    Sphere,
    Raycaster,
    MathUtils,
    MOUSE,
    AxesHelper,
    GridHelper,
    DirectionalLight,
    AmbientLight,
    MeshLambertMaterial,
    LineBasicMaterial,
    LineSegments,
    EdgesGeometry,
    Clock,
    Color
  } from "three";
  
  import CameraControls from 'camera-controls';
  
  const subsetOfTHREE = {
    MOUSE,
    Vector2,
    Vector3,
    Vector4,
    Quaternion,
    Matrix4,
    Spherical,
    Box3,
    Sphere,
    Raycaster,
    MathUtils: {
      DEG2RAD: MathUtils.DEG2RAD,
      clamp: MathUtils.clamp
    }
  };
  
  const canvas = document.getElementById("three-canvas");
  
  //1 The scene
  const scene = new Scene();
  const grid = new GridHelper();
  //scene.add(grid);
  
  //2 The Object
  const geometry = new BoxGeometry(0.5, 0.5, 0.5);
  
  var geo = new EdgesGeometry(geometry);
  const line1 = new LineSegments(geo, new LineBasicMaterial( { color: 'black' } ) );
  const line2 = new LineSegments(geo, new LineBasicMaterial( { color: 'black' } ) );
  line2.position.x += 1;
  const line3 = new LineSegments(geo, new LineBasicMaterial( { color: 'black' } ) );
  line3.position.x -= 1;

  scene.add(line1, line2, line3)

  const line4 = new LineSegments(geo, new LineBasicMaterial( { color: 'black' } ) );
  line4.position.y += 1;
  const line5 = new LineSegments(geo, new LineBasicMaterial( { color: 'black' } ) );
  line5.position.x += 1;
  line5.position.y += 1;
  const line6 = new LineSegments(geo, new LineBasicMaterial( { color: 'black' } ) );
  line6.position.x -= 1;
  line6.position.y += 1;

  scene.add(line4, line5, line6)

  const blue = 0x000099;
  const green = 0x009900;
  const red = 0x990000;
  
  const blueMaterial = new MeshLambertMaterial({ color: 'white',
  polygonOffset: true,
  polygonOffsetFactor: 1, 
  polygonOffsetUnits: 1
});
  const greenMaterial = new MeshLambertMaterial({ color: 'white',
  polygonOffset: true,
  polygonOffsetFactor: 1, 
  polygonOffsetUnits: 1
 });
  const redMaterial = new MeshLambertMaterial({ color: 'white',
  polygonOffset: true,
  polygonOffsetFactor: 1, 
  polygonOffsetUnits: 1
});
  
  const cube = new Mesh(geometry, blueMaterial);

  const cube2 = new Mesh(geometry, greenMaterial);
  cube2.position.x += 1;
  
  
  const cube3 = new Mesh(geometry, redMaterial);
  cube3.position.x -= 1;


  scene.add(cube, cube2, cube3);

  const cube4 = new Mesh(geometry, new MeshLambertMaterial({ color: 'white' }));
  cube4.position.y += -1;

  const cube5 = new Mesh(geometry, new MeshLambertMaterial({ color: 'white' }));
  cube5.position.x += 1;
  cube5.position.y += -1;
  
  
  const cube6 = new Mesh(geometry, new MeshLambertMaterial({ color: 'white' }));
  cube6.position.x += -1;
  cube6.position.y += -1;

  scene.add(cube4, cube5, cube6);

  
  //3 The Camera
  const camera = new PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight
  );
  //camera.position.y = 0; // Z let's you move backwards and forwards. X is sideways, Y is upward and do
  //camera.lookAt(cube5);
  scene.add(camera);
  
  //4 The Renderer
  const renderer = new WebGLRenderer({
    canvas: canvas,
  });
  
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.setClearColor(0xffffff);
  
  window.addEventListener("resize", () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  });
  
  // Controls
  
  CameraControls.install( { THREE: subsetOfTHREE } ); 
  const clock = new Clock();
  const cameraControls = new CameraControls(camera, canvas);
  cameraControls.setLookAt(0, -3, 2, 0, -0.5, 0);
  
  // Lights
  
  const light = new DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 0.5);
  const baseLight = new AmbientLight(0xffffff, 1);
  scene.add(light, baseLight);
  
  // Raycaster
  
  const objectsToTest = { 
    [cube.uuid]: {object: cube, color: 'white'},
    [cube2.uuid]: {object: cube2, color: 'white'},
    [cube3.uuid]: {object: cube3, color: 'white'},

    [cube4.uuid]: {object: cube4, color: 'white'},
    [cube5.uuid]: {object: cube5, color: 'white'},
    [cube6.uuid]: {object: cube6, color: 'white'},
    };
  const objectsArray = Object.values(objectsToTest).map(item => item.object);
  
  const raycaster = new Raycaster();
  const mouse = new Vector2();
  let previousSelectedUuid;
  
  window.addEventListener('mousemove', (event) => {
      mouse.x = event.clientX / canvas.clientWidth * 2 - 1;
      mouse.y = - (event.clientY / canvas.clientHeight) * 2 + 1;
  
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(objectsArray);
  
    if(!intersects.length) {
      resetPreviousSelection();
      return;
    };
  
    const firstIntersection = intersects[0];
    firstIntersection.object.material.color.set('orange')
  
    const isNotPrevious = previousSelectedUuid !== firstIntersection.object.uuid;
      if(previousSelectedUuid !== undefined && isNotPrevious) {
      resetPreviousSelection();
    } 
    
  
    previousSelectedUuid = firstIntersection.object.uuid;
  });
  
  function resetPreviousSelection() {
    if(previousSelectedUuid === undefined) return;
    const previousSelected = objectsToTest[previousSelectedUuid];
    previousSelected.object.material.color.set('white');
  }
  
  
  
  function animate() {
    const delta = clock.getDelta();
      cameraControls.update( delta );
      renderer.render( scene, camera );
    requestAnimationFrame(animate);
  }
  
  animate();
  