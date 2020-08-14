function mazeMesh(field){
  let all = new THREE.Geometry(); 
  let cubeMaterial = new THREE.MeshLambertMaterial({color: new THREE.Color('rgb(255,50,100)')});
  let cubeGeometry = new THREE.BoxGeometry(5, 5, 5);

  for (let i = 0; i < field.length; i++) {
    for(let j = 0; j <field.length; j++){
      if(field[i][j]==0){
        let cubeMesh = new THREE.Mesh(cubeGeometry);
        cubeMesh.position.x = j*5-27.5;
        cubeMesh.position.y = 2.5;
        cubeMesh.position.z = i*5-27.5;
        all.mergeMesh(cubeMesh);
      }
    }
  }
  let allMesh = new THREE.Mesh(all,cubeMaterial);
  return allMesh;

}

window.onload = function(){
  //////// GUI ////////// 
  let gui = new dat.GUI();
  let option = new function() {
    this.walk = false;
    this.mazeSize = 40;
  };
  let temp = option.mazeSize-1;
  gui.add(option,'walk');
  let controller = gui.add(option, 'mazeSize', 26, 50).step(2);
  controller.onFinishChange(function(value) {
    scene.remove(mesh);
    mazeSize = option.mazeSize-1;
    maze = mazeMaker(mazeSize);
    mesh = mazeMesh(maze[0]);
    scene.add(mesh);
    mesh.position.x = 22.5 - Math.floor((mazeSize-3)/2)*5;
    mesh.position.y = 0;
    mesh.position.z = 22.5 - Math.floor((mazeSize-3)/2)*5;

    plane.scale.x = mazeSize/temp;
    plane.scale.y = mazeSize/temp;

    index =0;
    count =0;
    ii=0;
    roomObj=maze[1];
    for(i in indicator){
      scene.remove(indicator[i]);
    }
    
    makeIndicator();
    console.log("mazeArray",maze[1]);
    mouse=dijkstra(maze);
    ball.position.x = -(Math.floor(mazeSize/2)-maze[1][0].y)*5;
    ball.position.y =  2.5;
    ball.position.z = -(Math.floor(mazeSize/2)-maze[1][0].x)*5;
    resize();
  });
  function resize(){
    aspect = window.innerWidth / window.innerHeight;
    frustumSizeH = mazeSize*3.5;
    frustumSizeW = frustumSizeH*aspect;     
    camera.left = -frustumSizeW;
    camera.right = frustumSizeW;
    camera.top =  frustumSizeH;
    camera.bottom = -frustumSizeH;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize',resize,false);


  let mazeSize = option.mazeSize-1;
  let scene = new THREE.Scene();//模型都放在這裡面

  ///////// Maze ////////////
  let maze = mazeMaker(mazeSize);//不是奇數會少一些牆
  let mesh = mazeMesh(maze[0]);
  scene.add(mesh);
  mesh.position.x = 22.5 - Math.floor((mazeSize-3)/2)*5;//3:22.5 5:17.5 7:12.5 9:7.5 11:2.5 13:-2.5 15:-7.5
  mesh.position.y = 0;
  mesh.position.z = 22.5 - Math.floor((mazeSize-3)/2)*5;;
  //console.log("maze[1]",maze[1][0][0].x);

  /////roomIndicator///////
  let indicator=[];  
  let indicatorGeomatry = new THREE.OctahedronGeometry(2.5,0);
  let indicatorMaterial;
  makeIndicator();
  function makeIndicator(){
    indicator=[];
    for(i in maze[1]){
      if(maze[1][i].roomType==2){
        indicatorMaterial = new THREE.MeshLambertMaterial({color:new THREE.Color('rgb(250,200,50)'), wireframe: false});
        indicator[i]=new THREE.Mesh(indicatorGeomatry, indicatorMaterial);
        indicator[i].position.x =-(Math.floor(mazeSize/2)-maze[1][i].y)*5;
        indicator[i].position.y =  6;
        indicator[i].position.z =-(Math.floor(mazeSize/2)-maze[1][i].x)*5;
        indicator[i].scale.y=4;
        indicator[i].rotation.y=15;
        scene.add(indicator[i]);
      }
      else if(maze[1][i].roomType==3){
        indicatorMaterial = new THREE.MeshLambertMaterial({color:new THREE.Color('rgb(50,200,50)'), wireframe: false});
        indicator[i]=new THREE.Mesh(indicatorGeomatry, indicatorMaterial);
        indicator[i].position.x =-(Math.floor(mazeSize/2)-maze[1][i].y)*5;
        indicator[i].position.y =  6;
        indicator[i].position.z =-(Math.floor(mazeSize/2)-maze[1][i].x)*5;
        indicator[i].scale.y=4;
        indicator[i].rotation.y=15;
        scene.add(indicator[i]);
      }
    }  
  }
  

  //////walk////////
  mouse=dijkstra(maze);

  //////// Ball //////////////
  let ballGeomatry = new THREE.SphereGeometry(2.5, 15, 15);
  let ballMaterial = new THREE.MeshToonMaterial({color:new THREE.Color('rgb(135,115,155)'), wireframe: false});
  let ball = new THREE.Mesh(ballGeomatry, ballMaterial);
  ball.position.x = -(Math.floor(mazeSize/2)-maze[1][0].y)*5;
  ball.position.y =  2.5;
  ball.position.z = -(Math.floor(mazeSize/2)-maze[1][0].x)*5;
  scene.add(ball);  

  ////// Camera /////////////
  let aspect = window.innerWidth / window.innerHeight;
  let frustumSizeH = mazeSize*3.5;
  let frustumSizeW = frustumSizeH*aspect;
  let camera = new THREE.OrthographicCamera( -frustumSizeW, frustumSizeW , frustumSizeH, -frustumSizeH, 1, 2000 );
  camera.position.x = 45;
  camera.position.y = 180;
  camera.position.z = 45;
  camera.lookAt(scene.position);

  let renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color('rgb(215,210,225)'));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  //板子
  let planeGeometry = new THREE.PlaneBufferGeometry(mazeSize*5, mazeSize*5);
  let planeMaterial = new THREE.MeshBasicMaterial({color:new THREE.Color('rgb(150,30,110)')});
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);

  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 0;
  plane.position.y = 0;
  plane.position.z = 0;

  scene.add(plane);

  ///////////   光   源  /////////////////
  //HemisphereLight( skyColor : Integer, groundColor : Integer, intensity : Float )
  let hemiLight = new THREE.HemisphereLight( 0xffffff, 0x6171C7, 0.9 );
  hemiLight.position.set( 0, 20, 0 );
  scene.add( hemiLight );

  let directLight = new THREE.DirectionalLight(0xffffff,0.9);
  directLight.color.setHSL( 0.1, 1, 0.9 );
  directLight.position.set(0, 70, 0);
  scene.add(directLight);

  let directLightShadow = new THREE.DirectionalLight(0x262ACA);
  directLightShadow .position.set(0, 0, 50);
  scene.add(directLightShadow );

  let directLightShadowRight = new THREE.DirectionalLight(0xffffff,0.5);
  directLightShadowRight.color.setHSL( 0.1, 1, 0.8 );
  directLightShadowRight .position.set(50, 0, 0);
  scene.add(directLightShadowRight );

  ///////////    Helper    ///////////////    
  /*let hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 5 );
  scene.add( hemiLightHelper );

  let dirLightHeper = new THREE.DirectionalLightHelper( directLight, 10 );
  scene.add( dirLightHeper );

  let directLightShadowHelper  = new THREE.DirectionalLightHelper( directLightShadow , 10 );
  scene.add( directLightShadowHelper  );

  let directLightShadowHelper2  = new THREE.DirectionalLightHelper( directLightShadowRight , 10 );
  scene.add( directLightShadowHelper2  );

  let gridHelper = new THREE.GridHelper( mazeSize*5, mazeSize );
  scene.add( gridHelper );

  let axes = new THREE.AxesHelper(20);
  scene.add(axes);*/
  
  //renderer.render(scene, camera);
  let index=0;
  let count=0;
  let ii=0;
  let pIndex;
  render();                   
  function render(){
    if(option.walk){
      if(index != mouse.length-1 ){
        let pointA = mouse[index];
        let pointB = mouse[index+1];
               
        for(i in maze[2]){
          if(pointA[0]==maze[2][i][0][0] && pointA[1]==maze[2][i][0][1] && pointB[0]==maze[2][i][1][0] && pointB[1]==maze[2][i][1][1]){
            pIndex=i;
            break;
          }
        }
        //console.log("pIndex",pIndex);
        //console.log("ii",maze[2][pIndex][2][ii][1]);
        let dirX = maze[2][pIndex][2][ii+1][1] - maze[2][pIndex][2][ii][1];
        let dirY = maze[2][pIndex][2][ii+1][0] - maze[2][pIndex][2][ii][0];
        if(count<10){
          if(dirX <0 ){
            ball.position.x -= 0.5;
            count++;

          }else if(dirX >0){
            ball.position.x +=0.5;
            count++;

          }else if (dirY <0) {
            ball.position.z -=0.5;
            count++;

          }else if(dirY >0){
            ball.position.z +=0.5;
            count++;

          }
        }else if(count == 10){

          //console.log("ii",maze[2][pIndex][2][ii],maze[2][pIndex][2][ii+1],ii);
          if(ii==maze[2][pIndex][2].length-2){
            //console.log("pI",pIndex);
            index++;
            ii=0;

          }else{
            ii++
          }
          count =0;
          
        }
      }
    }else{
      if(index == mouse.length-1){
        index=0;
        ii=0;
        count=0;
        ball.position.x = -(Math.floor(mazeSize/2)-maze[1][0].y)*5;
        ball.position.y =  2.5;
        ball.position.z = -(Math.floor(mazeSize/2)-maze[1][0].x)*5;
      }
      
    }
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
  document.getElementById("WebGL-output").appendChild(renderer.domElement);//在<div>
}
