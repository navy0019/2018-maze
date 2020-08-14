function mazeMaker(dimension) {
	let fieldMap =[];
	for(let i = 0; i < dimension; i++) {
		fieldMap[i]=[];
		for (let j = 0; j < dimension; j++) {
			fieldMap[i][j]=0;
		}
	}

	let roomMap =[];
	for(let i =0; i<Math.floor(dimension/6);i++){
		roomMap[i]=[];
		for (let j = 0; j < Math.floor(dimension/6); j++) {
			roomMap[i][j]=[];
		}
	}

	let mainWayRoom=[];
	let between_rooms_path_field =[];//房間之間的走道的詳細座標
	let singleRoom=[];

	setObjInRoomMap();
	setMainWayRoom(0,0,roomMap.length-1,roomMap.length-1);
	setSideRoom();
	connectRoomMap();
	roomMapShow();
	changeRoomMap();//將roomMap放入一維陣列
	setRoomType();

	function setObjInRoomMap(){
		let middle;
		if(fieldMap.length%6==5){
			middle=3;
		}else if(fieldMap.length%6==1){
			middle=1;
		}else{
			middle=2;
		}
		for(let i=2+middle,x=0;i<fieldMap.length-2;i+=6,x++){
			for(let j=2+middle,y=0; j<fieldMap.length-2;j+=6,y++){
				roomMap[x][y].push(new Room(i,j,false));
				//console.log("ij",i,j)      
			}      
		}
		//console.log("middle ",middle)
	}
	function setMainWayRoom(startX,startY,endX,endY){
		let nextX = startX;
		let nextY = startY;
		let dirX,dirY;
		if(endX - startX >0){
			dirX = 1;
		}else if(endX - startX < 0){
			dirX = -1;
		}else{
			dirX = 0;
		}
		if(endY - startY >0){
			dirY = 1;
		}else if(endY - startY < 0){
			dirY = -1;
		}else{
			dirY = 0;
		}
		mainWayRoom.push([nextX,nextY]);
		while(nextX != endX || nextY != endY){
			let preX = nextX;
			let preY = nextY;
			let next=[];
			if(nextX + dirX <= endX){
				next.push([dirX,0]);
			}
			if(nextY + dirY <= endY){
				next.push([0,dirY]);
			}
			let addDir=next[Math.floor(Math.random()*next.length)];
			nextX += addDir[0];
			nextY += addDir[1];
			mainWayRoom.push([nextX,nextY]);
			updateRoom(roomMap[preX][preY][0],roomMap[nextX][nextY][0]);
			//console.log("hhh ",roomMap[preX][preY]);
		}
	}
	function setSideRoom(){
		let side=[];
		let roomNumberNow = mainWayRoom.length;
		let roomNumberMax = Math.floor(Math.pow(roomMap.length,2)/2)+Math.floor(Math.pow(roomMap.length,2)/8)+1;
		for(let i = roomNumberNow;i< roomNumberMax;i++){
			let ran = Math.floor(Math.random()* mainWayRoom.length);
			let x = mainWayRoom[ran][0];
			let y = mainWayRoom[ran][1];
			let newRoom = checkSpace(x,y,roomMap,false);

			if(newRoom){
				//console.log("length "+newRoom.length)
				let dir = newRoom[Math.floor(Math.random()*newRoom.length)];
				mainWayRoom.push(dir);
				side.push(dir);
				updateRoom(roomMap[x][y][0],roomMap[dir[0]][dir[1]][0]);
				roomNumberNow = mainWayRoom.length;
			}else{
				//console.log("length false "+newRoom)
				//console.log("false");
				roomNumberNow = mainWayRoom.length;
			}
			
		}
		randomConnect(side);
	}
	function randomConnect(side){
		for(i in side){
			let chance=Math.random();
			if(chance >0.5){
				let newP=checkSpace(side[i][0],side[i][1],roomMap,true);
				let dir = newP[Math.floor(Math.random()*newP.length)];

				updateRoom(roomMap[side[i][0]][side[i][1]][0],roomMap[dir[0]][dir[1]][0]);
			}
		}
	}
	function checkSpace(x,y,roomMap,type){
		let dir=[];
		if(x+1<roomMap.length && roomMap[x+1][y][0].show==type){
			dir.push([x+1,y]);
		}
		if(x-1>=0 && roomMap[x-1][y][0].show==type){
			dir.push([x-1,y]);
		}
		if(y+1<roomMap.length && roomMap[x][y+1][0].show==type){
			dir.push([x,y+1]);
		}
		if(y-1>=0 && roomMap[x][y-1][0].show==type){
			dir.push([x,y-1]);
		}

		if(dir.length!=0){
			return dir;
		}else{
			return false;
		}
	}
	function updateRoom(room1,room2){
		room1.show = true;
		room2.show = true;
		checkRepeat(room1,room2);
		checkRepeat(room2,room1);
		function checkRepeat(room1,room2){
			let count=0;
			if(room1.connected.length >=1){
				for(let i=0;i < room1.connected.length;i++){      
					if(room1.connected[i].x!= room2.x || room1.connected[i].y!= room2.y){
						count++;
					}        
				}
				if(count==room1.connected.length){
					room1.connected.push(room2);
				}        
			}else{
				room1.connected.push(room2);
			}
		}

	}

	function roomMapShow(){
		for(let i=0;i<roomMap.length;i++){
			for(let j=0;j<roomMap.length;j++){
				if(roomMap[i][j][0].show==true){
					roomMap[i][j][0].setType(fieldMap,1);
				}
			}
		}
	}

	function connectRoomMap(){
		for(let i=0;i<roomMap.length;i++){
			for(let j=0;j<roomMap.length;j++){
				for(let k=0;k<roomMap[i][j][0].connected.length;k++){
					if(roomMap[i][j][0].connected[k].x >= roomMap[i][j][0].x && roomMap[i][j][0].connected[k].y >= roomMap[i][j][0].y){
						between_rooms_path_field.push([[roomMap[i][j][0].x,roomMap[i][j][0].y],[roomMap[i][j][0].connected[k].x,roomMap[i][j][0].connected[k].y],[]]);
						let index = findEdgeListIndex(roomMap[i][j][0].x,roomMap[i][j][0].y,roomMap[i][j][0].connected[k].x,roomMap[i][j][0].connected[k].y);
						let roomDir = setDirection(roomMap[i][j][0],roomMap[i][j][0].connected[k]);
						pathField(roomMap[i][j][0],roomMap[i][j][0].connected[k],roomDir,between_rooms_path_field[index][2]);
					}
					
				}

			}
		}

	}
	function pathField(room1,room2,roomDir,edgeList){
		let middleX ,middleY,startX,startY,endX,endY;
		middleX = Math.floor((room1.x+room2.x)/2);
		middleY = Math.floor((room1.y+room2.y)/2);
		startX=room1.x;
		startY=room1.y;
		endX = room2.x;
		endY = room2.y;
		edgeList.push([startX,startY]); 
		if(roomDir==1 || roomDir==2){
			goLineX(middleX);
			goLineY(endY);
			goLineX(endX);         
		}else if(roomDir==3 || roomDir==4){
			goLineY(middleY);
			goLineX(endX);
			goLineY(endY);
		}
		function goLineX(endA){
			while(startX != endA){
				if(startX > endX){
					dirX=-1;
				}else if(startX < endX){
					dirX= 1;
				}else{
					dirX= 0;
				}

				startX+=dirX;
				fieldMap[startX][startY]=1;
				edgeList.push([startX,startY]); 

			}
		}
		function goLineY(endA){
			while(startY != endA){
				if(startY > endY){
					dirY=-1;
				}else if(startY < endY){
					dirY= 1;
				}else{
					dirY= 0;
				}
				startY+=dirY;
				fieldMap[startX][startY]=1;
				edgeList.push([startX,startY]); 
			}      
		}
	}
	function setDirection(room1,room2){
		let diffX,diffY,startX,startY,endX,endY;
		startX=room1.x;
		startY=room1.y;
		endX = room2.x;
		endY = room2.y;
		diffX=startX-endX;
		diffY=startY-endY;

		if((diffX == 0 && diffY>0) ){
			//左
			return 3;

		}else if((diffX == 0 && diffY<0) ){
      		//右
      		return 4;

      	}else if((diffY == 0 && diffX>0) ){
      		//上  
      		return 1;

      	}else if((diffY == 0 && diffX<0)){
      		//下
      		return 2;
      	}

    }
    function findEdgeListIndex(room1x,room1y,room2x,room2y){
    	let count=0;
    	for(let i = 0;i<between_rooms_path_field.length;i++){
    		if(room1x==between_rooms_path_field[i][0][0] && room1y==between_rooms_path_field[i][0][1] && room2x==between_rooms_path_field[i][1][0] && room2y==between_rooms_path_field[i][1][1]){
    			return i;
    		}else{
    			count++;
    		}
    	}
    	if(count==roomMap.length*roomMap.length){
    		console.log("can't find");
    	}
    }

    function changeRoomMap(){
    	for(let i=0;i<roomMap.length;i++){
    		for(let j=0;j<roomMap.length;j++){
    			if(roomMap[i][j][0].show==true){
    				singleRoom.push(roomMap[i][j][0]);
    			}
    		}
    	}
    }
    function setRoomType(){
    	let t1num=Math.floor(singleRoom.length/3);
    	let t2num=Math.floor(singleRoom.length/10);
    	//將房間部分改變
    	//隨機生成用
    	for(let i=0;i<t1num;i++){
    		let ran=Math.floor(Math.random()*(singleRoom.length-2))+1;
    		if(singleRoom[ran].roomType==1){
    			singleRoom[ran].roomType=2;
    		}else{
    			i--;
    		}    
    	}
    	for(let i=0;i<t2num;i++){
    		let ran=Math.floor(Math.random()*(singleRoom.length-2))+1;
    		if(singleRoom[ran].roomType==1){
    			singleRoom[ran].roomType=3;
    		}else{
    			i--;
    		}  
    	}
    }

    console.log("roomMap",roomMap);
    console.log("singleRoom",singleRoom);
    console.log("path",between_rooms_path_field);
    console.log("fieldMap",fieldMap)
    return [fieldMap ,singleRoom ,between_rooms_path_field,roomMap]
    
}