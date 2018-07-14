var countLeft = 0;
var countRight = 0;

var xhr = new XMLHttpRequest()
xhr.open('GET','data.json')
xhr.send()
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4 && xhr.status === 200) {
  	var responseText = xhr.responseText;
    onLoadJsonParse(responseText);
  } 
}

var elemAfter = document.getElementsByClassName("after");
for (i = 0; i < elemAfter.length; i++){
	elemAfter[i].addEventListener("click", changeElementColumn)
}

var elemBefore = document.getElementsByClassName("before");
for (i = 0; i < elemBefore.length; i++){
	elemBefore[i].addEventListener("click", changeElementColumn)
}

var searchField = document.getElementById("searchField");
searchField.addEventListener("input", onSearch);

function onLoadJsonParse(text){
	/**
	* Парсит JSON строку, превращая ее в object.
	* Вызывает функцию создания книги.
	*
	* @param {string} text: JSON строка
	*/
	var jsonDoc = JSON.parse(text);
	for (key in jsonDoc){
		let book = jsonDoc[key];
		createElem(book);
	}
}

function createElem(book){
	/**
	* Создает div элемент для книги.
	* 
	* @param {object} book: объект книги. 
	*/
	let title = document.createElement("div");
    
	title.className = "title";
	let nameSpan = document.createElement("span");
	nameSpan.innerHTML = '<b>Название</b>: ' + book["name"];
	let authorSpan = document.createElement("span");
	authorSpan.innerHTML = '<b>Автор</b>: ' + book["author"];
	title.appendChild(nameSpan);
	title.appendChild(authorSpan);
	
	let pic = document.createElement("div");
	pic.className = "pic";
	let imgSpan = document.createElement("span");
	let img = document.createElement("img");
	img.setAttribute("src", book["img"])
	imgSpan.appendChild(img);
	pic.appendChild(imgSpan);

	let newItem = document.createElement("div");
	newItem.className = "item";
	newItem.appendChild(pic);
	newItem.appendChild(title);
	newItem.setAttribute("number", key);

	if (book["column"] == "left"){
		createLeft(newItem);
	} else{
		createRight(newItem);
	}
	updateCounters()
}

function changeElementColumn (event){
	/**
	* Срабатывает при нажатии на стрелочку в блоке книги.
	* Переносит книгу в другой список.
	*
	* @param {object} event: объект события. 
	*/
	let item = event.target.parentNode
	let newItem = document.createElement("div");
 	newItem.innerHTML = item.innerHTML;
 	newItem.setAttribute("number", item.getAttribute("number"));
 	newItem.className = "item";
 	
 	if (item.parentNode.className == "left"){
 		let left = document.getElementsByClassName("left")[0];
 		newItem.removeChild(newItem.getElementsByClassName("after")[0]);
 		left.removeChild(item);
 		changeXmlElementColumn(newItem.getAttribute("number"),"right");
 		createRight(newItem);

 		countLeft--;
 	}
 	else{
 		let right = document.getElementsByClassName("right")[0];
 		newItem.removeChild(newItem.getElementsByClassName("before")[0]);
 		right.removeChild(item);
 		changeXmlElementColumn(newItem.getAttribute("number"),"left");
 		createLeft(newItem);

 		countRight--;
 	}	
 	updateCounters()
}

function createLeft(item){
	/**
	* Добавляет к элементу книги правую стрелку.
	*
	* @param {DOM element} item: div блок книги. 
	*/
	let left = document.getElementsByClassName("left")[0];

	let itemAfter = document.createElement("div");
	itemAfter.className = "after";
	itemAfter.addEventListener("click", changeElementColumn)
	item.appendChild(itemAfter);

	left.appendChild(item);

	countLeft++;
}

function createRight(item){
	/**
	* Добавляет к элементу книги левю стрелку.
	*
	* @param {DOM element} item: div блок книги. 
	*/
	let right = document.getElementsByClassName("right")[0];

	let itemBefore = document.createElement("div");
	itemBefore.className = "before";
	itemBefore.addEventListener("click", changeElementColumn)
	item.appendChild(itemBefore);
	
	right.appendChild(item);

	countRight++
}	

function changeXmlElementColumn(itemNumber, column){
	/**
	* Посылает серверу запрос на изменения значения атрибута "column".
	*
	* @param {number} itemNumber: номер книги. 
	* @param {string} column: значение атрибута column (left/right). 
	*/
	let xhr = new XMLHttpRequest();
 	xhr.open("POST", '../server.py');
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
	    if(xhr.readyState == 4 && xhr.status == 200) {
	        console.log("Success!")
	    }
	}
	xhr.send(itemNumber+"&"+column);
}

function onSearch(event){
	/**
	* Функция для фильтрации объектов.
	* Срабатывает при изменении текстового поля.
	* 
	* @param {object} event: объект события.  
	*/
	var titles = document.getElementsByClassName("title");
	var i, j = 0;
	for (i = 0; i<titles.length; i++){
		let item = titles[i].parentNode;
		let name = titles[i].childNodes[0].innerText.substring(11);
		let author = titles[i].childNodes[1].innerText.substring(7);
		let title = author+" - "+name;
		let text = event.target.value
		if (title.indexOf(text)!=-1){
			item.removeAttribute('style');
		} 
		else {
			item.style.display = "none";
		}	
	}
}

function updateCounters(){
	/**
	* Обновляет счетчики книг.
	*/
	let counters = document.getElementsByClassName("counter");
	counters[0].innerText = "Кол-во книг: "+countLeft
	counters[1].innerText = "Кол-во книг: "+countRight
}

function addBook(form){
	/**
	* Функция добавления новой книги.
	* Посылает запрос на сервер на добавление новой книги.
	* 
	* @param {object} form: данные html формы.  
	*/
	let xhr = new XMLHttpRequest();
 	xhr.open("POST", '../server.py');
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
	    if(xhr.readyState == 4 && xhr.status == 200) {
	        console.log("Success!")
	    }
	}
	xhr.send(form[0].value+"&"+form[1].value+"&"+form[2].value);
	var book = {author: form[0].value, 
				name: form[1].value, 
				img: form[2].value,
				column: "left"}
	createElem(book);
	updateCounters();
}
