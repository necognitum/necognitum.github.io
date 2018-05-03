var tests = {
"tests":  [
{
  "qID": 331,
  "qName": "Конститутивные ферменты",
  "rA": [
    "Постоянно синтезируются в микробных клетках в определенных концентрациях",
    "Концентрация не зависит от наличия соответствующего субстрата",
    ],
  "wA": [
    "Концентрация резко вырастает при наличии соответствующего субстрата",
    "В отсутствии субстрата находятся в следовых количествах",
    "Относятся к факторам роста микроорганизмов"]
},
{
  "qID": 381,
  "qName": "Для микроскопического метода диагностики гонореи берут:",
  "rA": [
    "Отделяемое из уретры"
    ],
  "wA": [
    "СМЖ",
    "Пунктат из бубона",
    "Испражнения",
    "Кровь больного"]
},
{
  "qID": 472,
  "qName": "Что характерно для первичного сифилиса:",
  "rA": [
    "твердый шанкр"
    ],
  "wA": [
    "мягкий шанкр",
    "гумма",
    "сыпь",
    "поражение ЦНС"]
},
{
  "qID": 407,
  "qName": "Остаточный патогенный фактор некоторых бактерий, проявляющийся после гибели микроба:",
  "rA": [
    "эндотоксин"
    ],
  "wA": [
    "экзотоксин",
    "патогенные ферменты",
    "эксфолиативные токсины",
    "антигены"]
}
]
};
var test = 0;
var amountTest = 0;
var iterGlobal = 0;
var exit = 0;
var key = [];
var selected = [];
var right = 0;
var wrongAnswers = [];
document.querySelector(".button").addEventListener("click", startQuiz);
function startQuiz() {
	var variant = document.querySelector('.select').selectedIndex;
	document.querySelector(".checkbox-wrapper").style.display = "none";
	console.log(variant);
	var varfile;
	switch(variant) {
		case 0:
			varfile = 'var1.json';
			break;
		case 1:
			varfile = 'var2.json';
			break;
		case 2:
			varfile = 'var3.json';
			break;
		case 3:
			varfile = 'var4.json';
			break;
		case 4:
			varfile = 'var5.json';
			break;
		case 5:
			varfile = 'all.json';
			break;
	}
	var xhr = new XMLHttpRequest();
	var xhrre;
	xhr.open('GET', varfile, false);
	xhr.send();
	if (xhr.status != 200) {
	  test = tests.tests;
	  alert( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
	} else {
	  xhrre = JSON.parse(xhr.responseText);
	  test = xhrre.tests;
	}
	if (document.querySelector(".checkbox").checked === true) {
	test = shuffle(test);
	}
	amountTest = test.length;
	iterGlobal = 0;
	exit = 0;
	key = [];
	selected = [];
	right = 0;
	wrongAnswers = [];
	document.querySelector(".button").removeEventListener("click", startQuiz);
	newQuestion();
	startTimer();
}
function newQuestion() {
	drawStatus();
	while (document.querySelector('.answers').hasChildNodes()) {
    	document.querySelector('.answers').removeChild(document.querySelector('.answers').lastChild);
	} // Очищаем предыдущие варианты	
	currentQuestion = test[iterGlobal]; // Текущий вопрос
	key = getKey(currentQuestion.rA.length, currentQuestion.wA.length); // Ключ к вопросу
	drawQuestion(currentQuestion, key);

	document.querySelector(".button").innerHTML = "ПОДТВЕРДИТЬ";
	document.querySelector(".button").addEventListener("click", compare);
	document.querySelector(".button").removeEventListener("click", newQuestion);
	if (document.querySelector(".select").getAttribute('hidden') == null) document.querySelector(".select").setAttribute('hidden', 'true');

}
function compare() {
	for (var i= 0; i < key.length; i++) {
		if (key[i] == 1) {
			document.getElementById(i + 1).className += " answers__answer_right";
		}
	}
	if (key.join(";") == selected.join(";")) {
		right++;
	} else {
		wrongAnswers.push(iterGlobal);
	}
	iterGlobal++;
  	if (iterGlobal < amountTest) {
 		document.querySelector(".button").innerHTML = "ДАЛЕЕ";
 		document.querySelector(".button").addEventListener("click", newQuestion);
 		document.querySelector(".button").removeEventListener("click", compare);
	} else {
		document.querySelector(".button").innerHTML = "ЗАКОНЧИТЬ";
 		document.querySelector(".button").addEventListener("click", drawEnd);
  		document.querySelector(".button").addEventListener("click", drawStatus);
 		document.querySelector(".button").removeEventListener("click", compare);
	}
}

function drawStatus() {
	var iter = iterGlobal + 1;
	if (iterGlobal == amountTest) iter = iterGlobal;
	var accuracy = right * 100 / iterGlobal;
	if (right == 0) {
		accuracy = 0;
	}
	var wrong = iterGlobal - right;
	document.querySelector(".status__index").innerHTML = iter + " / " + amountTest;
	document.querySelector(".status__accuracy").innerHTML = Math.round(accuracy) + "% | " + wrong + " неверно";
}


function drawQuestion(currentQuestion, key) {
	document.querySelector('.question__name').innerHTML = currentQuestion.qName;
	rA = shuffle(currentQuestion.rA);
	rAi = 0;
	wA = shuffle(currentQuestion.wA);
	wAi = 0;
	selected = [];
	amountAnswers = rA.length + wA.length;
	for (var i = 0; i < amountAnswers; i++) {
		if (key[i] == 0) {
			var answer = document.createElement('div');
			answer.className = "answers__answer answers__answer_unselected";
			answer.id = i + 1;
			answer.innerHTML = wA[wAi];
			wAi++;
			document.querySelector('.answers').appendChild(answer);
			document.querySelector('.answers').lastChild.addEventListener("click", getSelected);
			selected.push(0);
		} else {
			var answer = document.createElement('div');
			answer.className = "answers__answer answers__answer_unselected";
			answer.id = i + 1;
			answer.innerHTML = rA[rAi];
			rAi++;
			document.querySelector('.answers').appendChild(answer);
			document.querySelector('.answers').lastChild.addEventListener("click", getSelected);	
			selected.push(0);		
		}
	}
}

function drawEnd() {
	stopTimer();
	while (document.querySelector('.answers').hasChildNodes()) {
    document.querySelector('.answers').removeChild(document.querySelector('.answers').lastChild);
	}
	document.querySelector(".button").setAttribute('hidden', 'true');
	document.querySelector('.question__name').innerHTML = "РЕЗУЛЬТАТ"
	document.querySelector(".result").removeAttribute('hidden');
	document.querySelector(".bblock").removeAttribute('hidden');
	document.querySelector(".bblcok__button1").addEventListener("click", function() {window.location.reload(false) });
	var accuracy = right * 100 / iterGlobal;
	document.querySelector('.result').innerHTML = Math.round(accuracy) + "%";
	if (wrongAnswers.length > 0) {
		document.querySelector(".bblcok__button2").addEventListener("click", reMatch);
	} else {
		document.querySelector(".bblcok__button2").className += " bblcok__button2_inactive";
	}
}

function reMatch() {
	startTimer();
	var newTest = [];
	for (var i=0; i < wrongAnswers.length; i++) {
		var iTest = wrongAnswers[i];
		newTest.push(test[iTest]);
	}
	test = newTest;
	iterGlobal = 0;
	amountTest = test.length;
	right = 0;
	key = [];
	selected = [];
	wrongAnswers = [];
	document.querySelector(".button").removeAttribute('hidden', 'true');
	document.querySelector(".result").setAttribute('hidden', 'true');
	document.querySelector(".bblock").setAttribute('hidden', 'true');
 	document.querySelector(".button").removeEventListener("click", drawEnd);
 	document.querySelector(".bblcok__button2").removeEventListener("click", reMatch);
	newQuestion();
}
function getSelected(elem) {
	selected[elem.target.id - 1] = 1;
	elem.target.className = "answers__answer answers__answer_selected";
	elem.target.removeEventListener("click", getSelected);
	elem.target.addEventListener("click", getUnSelected);
}
function getUnSelected(elem) {
	selected[elem.target.id - 1] = 0;
	elem.target.className = "answers__answer answers__answer_unselected";
	elem.target.removeEventListener("click", getUnSelected);
	elem.target.addEventListener("click", getSelected);
}
var timer;
function startTimer() {
	if (timer) clearInterval(timer);
	secs = 0;
	min = 0;
	document.querySelector('.status__time').innerHTML = min + ":0" + secs;
	timer = setInterval(
		function () {
			secs++;
			if (secs == 60) {
				secs = 0;
				min++;
			}
			if (secs < 10) {
				document.querySelector('.status__time').innerHTML = min + ":0" + secs;
			} else {
				document.querySelector('.status__time').innerHTML = min + ":" + secs;
			}
		},
		1000
	);
}
function stopTimer() {
    if (timer) clearInterval(timer); 	
}
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
function getKey(rAL, wAL) {
	arr = [];
	for (rAL; rAL > 0; rAL--) {
		arr.push(1);
	}
	for (wAL; wAL > 0; wAL--) {
		arr.push(0);
	}
	shuffle(arr);
	return(arr);
}
/*
function newQuestion(i) {
	var currentTest = test[i];
	var amountAnswers = currentTest.rA.length + currentTest.wA.length;
	var key = getKey(currentTest.rA.length, currentTest.wA.length);
	var iterKey = 0;
	var iterWA = 0;
	var iterRA = 0;
	var allAnswers = [];
	for (iterKey; iterKey < amountAnswers; iterKey++) {
		if (key[iterKey] == 0) {
			allAnswers.push(currentTest.wA[iterWA]);
			iterWA++;
		} else {
			allAnswers.push(currentTest.rA[iterRA]);
			iterRA++;
		}
	}
	document.querySelector('.question__name').innerHTML = currentTest.qName;
	var amountAnswersIter = amountAnswers;
	var iter = 0;
	while (document.querySelector('.answers').hasChildNodes()) {
    	document.querySelector('.answers').removeChild(document.querySelector('.answers').lastChild);
	}	
	for (amountAnswersIter; amountAnswersIter > 0; amountAnswersIter--) {
		var answer = document.createElement('div');
		answer.className = "answers__answer answers__answer_unselected";
		answer.id = iter + 1;
		answer.innerHTML = allAnswers[iter];
		document.querySelector('.answers').appendChild(answer);
		document.querySelector('.answers').lastChild.addEventListener("click", getSelected);
		selected.push(0);
		iter++;
	}
	iter = 0;
	function compare(elem) {
		var iter = 0;
		console.log(key);
		for (iter; iter < key.length; iter++) {
			if (key[iter] == 1) {
				console.log(iter);
				document.getElementById(iter + 1).className += " answers__answer_right";
			}
		}
		if (selected == key) right++;
		elem.toElement.removeEventListener("click", compare);
		elem.toElement.addEventListener("click", goToNext);	
		elem.toElement.innerHTML = "ДАЛЕЕ";
	}
	function goToNext(elem) {
	newQuestion(2)
	elem.toElement.removeEventListener("click", goToNext);
	elem.toElement.addEventListener("click", compare);
	elem.toElement.innerHTML = "ПОДТВЕРДИТЬ";
	}
	document.querySelector('.button').addEventListener("click", compare);

}
newQuestion(1)
function getSelected(elem) {
	selected[elem.toElement.id - 1] = 1;
	console.log(selected);
	elem.toElement.className = "answers__answer answers__answer_selected";
	elem.toElement.removeEventListener("click", getSelected);
	elem.toElement.addEventListener("click", getUnSelected);
}
function getUnSelected(elem) {
	selected[elem.toElement.id - 1] = 0;
	console.log(selected);
	elem.toElement.className = "answers__answer answers__answer_unselected";
	elem.toElement.removeEventListener("click", getUnSelected);
	elem.toElement.addEventListener("click", getSelected);
}
*/
