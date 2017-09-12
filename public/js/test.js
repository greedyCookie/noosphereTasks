//mvp

let Presenter = class {//interact with model and view
	//after document ready gets score info from local storage
	getScoreTable(){//done
		var scoreSheet = model.getScoreInfo();
		console.log(localStorage);
		view.printScoreTable(scoreSheet)
		
		// var userScoreContainer = document.createElement('div')

	}
	//works after start game button has been clicked
	//invoke methods to setup game field and draw cubes in random position
	onClickStartGame(){//done
		model.blockArr = view.setGameField();
		model.maxLength = model.blockArr.length;
		model.resetScore();
		this.changeScoreVal(0);
		var cubesArr = model.setRandomCubeProps(5);
		console.log(cubesArr);
		view.randomCubeDraw(cubesArr);
		model.startCountdown();
	}
	//action on cube click. 
	handleCubeClick () {
		
		model.handleCubeClick(this.id);
		var score = model.getScore();
		view.hideCasualCube(this.id);
		presenter.changeScoreVal(score);
		var qty = model.checkDrawCubePerm();
		var cubesArr = model.setRandomCubeProps(qty);
		view.randomCubeDraw(cubesArr);
	}


	//gives the view current timer value
	changeTimeoutVal(val){
		view.setTmoutVal(val);
	}
	//gives the view current score value
	changeScoreVal(val){
		view.setScoreVal(val);
	}

	callModalForm(score){
		view.drawModalForm(score);
	}

	resetGameProps(){
		view.clearGameField();
		view.setScoreVal(0);
		model.resetScore();
	}
	//invokes methods to put user score in score table
	handlePlayerScorePrint(){
		var userName = document.getElementById('player_name').value;
		var score = model.getResultScore();
		var userScore = model.updateLocalStor(userName, score);
		this.showPlayerScore(userScore)
	}
	//redraws score table after sorting
	showPlayerScore(userScore){
		view.hideModalForm();
		view.clearScoreTable();
		this.getScoreTable();
	}

}
	//interacts only with presenter
let Model = class {
	constructor(){
		this.score = 0,
		this.resultScore = 0;
		this.counter = 60,
		this.blockArr = [],
		this.maxLength = 0,
		this.colors = ['#5cb85c','#d9534f','#428bca']
		//this.intervalId = 0;
	}
	//get score form local storage
	getScoreInfo(){
		var scoreSheet = [];
		for(let i = 0; i < localStorage.length; i++){
		scoreSheet.push(JSON.parse(localStorage[i]));
		};
		this.sortScoreTable(scoreSheet)
		return scoreSheet;
	}

	sortScoreTable(scoreSheet){
		scoreSheet.sort(function(a,b){
			if(a.score < b.score){
				return 1;
			}else if (a.score > b.score) {
				return -1;
			}else return 0;
		});
		
	}

	startCountdown(){//done
		console.log('starting countdown');
		if(window.intervalId > 0){
			clearInterval(window.intervalId);			
		}
		var counter = this.counter;
		window.intervalId = setInterval(function(){

			if(counter > 0){
				console.log(counter);
				counter--;
				presenter.changeTimeoutVal(counter);
			}else{
				model.setResultScore();
				clearInterval(window.intervalId);	
				presenter.changeTimeoutVal('01:00');
				presenter.callModalForm(model.score);
				presenter.resetGameProps();


			}
		}, 1000)
	}
	//used to add clicked cube id to arr 
	handleCubeClick(elemId){//done
		this.score++;
		console.log(elemId);
		console.log(this.score);
		var stringArr = elemId.split('');
		var elNumber = stringArr[3] + stringArr[4];
		this.blockArr.push(+elNumber);
		console.log(this.blockArr);
	}
	//setting up properties of cube that need to be spawned
	setRandomCubeProps(qty){//done
		var cubesArr = [];
		
		for(let i = 0; i<qty; i++){
		var elem = {
			elId: '',
			backgroundColor: '',
			onclick: ''
		};
		var elNumber = Math.floor(Math.random() *  this.blockArr.length);
		elNumber = this.blockArr.splice(elNumber,1);
		console.log(this.blockArr);
		if(elNumber < 10) elem.elId = 'div' + 0 + elNumber;
		else elem.elId = 'div' + elNumber;

		elem.backgroundColor = this.colors[(Math.floor(Math.random()*this.colors.length))];
		elem.onclick = presenter.handleCubeClick;
		cubesArr.push(elem);
		}
		return cubesArr;
	}
	//desides what number of cubes must be spawned
	checkDrawCubePerm(){//done
		var qty = Math.floor(Math.random() * 3);
		if(this.blockArr.length == this.maxLength){
			if(qty == 0) return 1;
			else if (qty > 0)return qty;
		}else if (!this.blockArr.length == 0 && qty >= 0) {
			return qty;
		}

	}
	resetScore(){
		this.score = 0;
	}

	getScore(){
		return this.score;
	}

	setResultScore(){
		this.resultScore = this.score;
	}

	getResultScore(){
		return this.resultScore;
	}
	//updates local storage with new rec 
	updateLocalStor(userName,score){
		console.log(userName + ':' + score);
		var userScore = {
			'userName': userName, 
			'score':score
		}
		localStorage.setItem( localStorage.length.toString(), JSON.stringify(userScore));
		return userScore;
	}
}
	//interact with presenter only
let View = class {

	printScoreTable(scoreSheet){//done
		var container = document.createElement('div');
		container.className = 'col-md-9';
		container.id = 'score_table_inside_wrap';
		for(let i = 0; i< scoreSheet.length; i++){
			this.printScoreRec(scoreSheet[i], container);
			
		}
	}
	//wrap record of user score in bootstap containers
	printScoreRec(record, container){
		var userNameContainer = document.createElement('div');
		var userScoreContainer = document.createElement('div');		
		userNameContainer.className = 'col-md-7';
		userScoreContainer.className = 'col-md-2';
		userNameContainer.innerHTML = record.userName;
		userScoreContainer.innerHTML = record.score;
		container.appendChild(userNameContainer);
		container.appendChild(userScoreContainer);
		document.getElementById('score_table').appendChild(container);
	}
	//draws game field
	setGameField(){//ch req
		//check if there is existing game field
		this.clearGameField();
		//disables start game button
		document.getElementById('start_button').disabled=true;
		//draws game field
		var blockArr = [];
		var row = document.createElement('div');
		row.className = 'row';
		gaming_field.appendChild(row);
	(function(){
		for(let i = 0; i< 54; i++){
			blockArr.push(i);
			var divContainer = document.createElement('div');
			var newDiv = document.createElement('div');
			if(i < 10) newDiv.id = 'div' + 0 + (i);
			else newDiv.id = 'div' +(i);
			divContainer.className = 'col-xs-1';
			newDiv.className = 'test';
			row.appendChild(divContainer);
			divContainer.appendChild(newDiv);
		}
		console.log(blockArr);

	})();
	return blockArr;
	}

	clearGameField(){
		document.getElementById('gaming_field').innerHTML = '';
		document.getElementById('start_button').disabled=false;
	}
	
	randomCubeDraw(cubesArr){
		
		for(let i = 0; i< cubesArr.length; i++){
			var div = document.getElementById(cubesArr[i].elId);
			div.style.backgroundColor = cubesArr[i].backgroundColor;
			div.onclick = cubesArr[i].onclick;

		}

	}

	setTmoutVal(val){
		console.log(val);
		document.getElementById('timer').value= val;

	}
	
	setScoreVal(val){
		console.log(val);
		document.getElementById('score').value= val;
	}
	//resets cube options
	hideCasualCube(cubeId){


		var cube = document.getElementById(cubeId);
		cube.onclick = '';
		cube.style.backgroundColor = '#fdfdfd';
	}

	drawModalForm(score){
		document.getElementById('score_count').innerHTML = "You'r score: " + score; 
		$('#myModal').modal('show');
	}

	hideModalForm(){
		$('#myModal').modal('hide');
	}

	clearScoreTable(){
		document.getElementById('score_table').innerHTML = "";
	}
}



var view = new View;
var presenter = new Presenter;
var model = new Model;

window.onload = presenter.getScoreTable();
