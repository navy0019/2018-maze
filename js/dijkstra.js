function dijkstra(maze){

    let adjacencyMatrix=[];
    let short=[];
    let correct=[];
    serAdjacencyMatrix();
    makeDijkstra(0);
    returnCorrect();

    function returnCorrect(){    
        let end=short[short.length-1];
        let start=0;
        correct.push([maze[1][short.length-1].x,maze[1][short.length-1].y]);
        correct.unshift([maze[1][end].x,maze[1][end].y]);
        while(end!=start){
            correct.unshift([maze[1][short[end]].x,maze[1][short[end]].y]);
            end=short[end];
        }
        console.log("correct",correct);
    }
    function makeDijkstra(startRoomIndex){
        
        let visited=[];
        let dis=[];//某個點連到其他各點的權重

        for(let i =0;i<maze[1].length;i++){
            visited.push(false);
            dis.push(Infinity);
            short.push(0);
        }

        dis[startRoomIndex]=0;
        short[startRoomIndex]=startRoomIndex;

        for(let i =0;i<visited.length;i++){
            let a=-1;
            let min=Infinity;
            for(let j=0;j<visited.length;j++){
                if(!visited[j] && dis[j]<min){
                    a=j;
                    min = dis[j];
                }
            }
            if(a==-1){
                break;
            }
            visited[a]=true;
            for(let k = 0;k<visited.length;k++){
                if(!visited[k] && dis[a]+ adjacencyMatrix[a][k]< dis[k]){
                    dis[k]= dis[a]+ adjacencyMatrix[a][k];
                    short[k]=a;
                }
            }

        }

        console.log("dis",dis);
        console.log("short",short);



    }

    function bubble(nextArray){
        let temp;
        for(let i=0;i<nextArray.length-1;i++){
            for(let j=0;j<nextArray.length-1-i;j++){
                if(maze[1][nextArray[j]].roomType > maze[1][nextArray[j+1]].roomType){
                    temp=nextArray[j];
                    nextArray[j]=nextArray[j+1];
                    nextArray[j+1]=temp;
                }
            }
        }
    }
    function findSingleRoomIndex(room1x,room1y){
        let count=0;
        for(let i=0;i<maze[1].length;i++){
            if(room1x==maze[1][i].x && room1y==maze[1][i].y){
                return i;
            }else{
                count++;
            }
            if(count==maze[1].length){
                return false;
            }       
        }
    }


    function serAdjacencyMatrix(){
        let count=0;
        for(let i = 0;i<maze[3].length;i++){
            for(let j = 0;j<maze[3].length;j++){
                if(maze[3][i][j][0].show==true){
                    count++;
                }
            }
        }
        for(let i = 0;i<count;i++){
            adjacencyMatrix[i]=[];
            for(let j = 0;j<count;j++){
                adjacencyMatrix[i][j]=Infinity;
                if(j==i){
                    adjacencyMatrix[i][j]=0;
                }
            }
        }
        for(let i=0;i<maze[1].length;i++){
            for(let k=0;k<maze[1][i].connected.length;k++){
                let index= findSingleRoomIndex(maze[1][i].connected[k].x,maze[1][i].connected[k].y);
                adjacencyMatrix[i][index]=maze[1][i].connected[k].roomType;
            }
        }
        console.log("adjacencyMatrix",adjacencyMatrix);
    }
    return correct;  
}

