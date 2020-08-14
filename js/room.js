class Room{
	constructor(x,y,show) {
		this.x = x;
		this.y = y;
		this.show=show;
		this.connected=[];
		this.roomType=1;
	}
	setType(field,n){
		this.roomType=n;
		switch(this.roomType){
			case 1:
			this.setArea(field,1); 
			break;

			case 2:
			this.setArea(field,2); 
			break;

			case 3:
			this.setArea(field,3); 
			break;  
		}
	}
	setArea(field,score){	
		for(let i=-1;i<2;i++){
			for(let j=-1;j<2;j++){
				field[i+this.x][j+this.y]=score;
			}
		}  
	}
	connect(n){
		this.connected.push(n);
		return this.connected;
	}
	indexOf(x,y){
		if(x==this.x && y==this.y){
			return true;
		}else{
			return false;
		}
		
	}
} 