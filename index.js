const $ = tag => document.querySelector(tag)

const cards = ['corazon-9.jpg', 'corazon-2.jpg', 'pica-6.jpg', 'pica-Q.jpg', 'trebol-T.jpg', 'corazon-A.jpg', 'pica-J.jpg', 'trebol-4.jpg', 'pica-5.jpg', 'trebol-6.jpg', 'trebol-7.jpg', 'pica-2.jpg', 'diamante-Q.jpg', 'trebol-8.jpg', 'corazon-6.jpg', 'diamante-A.jpg', 'pica-7.jpg', 'trebol-3.jpg', 'diamante-J.jpg', 'trebol-K.jpg', 'corazon-J.jpg', 'diamante-T.jpg', 'corazon-5.jpg', 'pica-4.jpg', 'trebol-J.jpg', 'diamante-K.jpg', 'corazon-4.jpg', 'corazon-3.jpg', 'diamante-5.jpg', 'diamante-8.jpg', 'corazon-Q.jpg', 'diamante-6.jpg', 'corazon-8.jpg', 'corazon-K.jpg', 'diamante-2.jpg', 'trebol-9.jpg', 'diamante-3.jpg', 'diamante-4.jpg', 'trebol-2.jpg', 'trebol-5.jpg', 'pica-A.jpg', 'corazon-T.jpg', 'pica-9.jpg', 'trebol-A.jpg', 'pica-T.jpg', 'diamante-9.jpg', 'pica-3.jpg', 'diamante-7.jpg', 'pica-8.jpg', 'trebol-Q.jpg', 'pica-K.jpg', 'corazon-7.jpg']

let value_count_dealer = [0]
let value_count_user = [0]

let cards_dealer = ['back.jpg','back.jpg']
let cards_user = ['back.jpg','back.jpg']

let point = 1000

function showCards(cards){
	const board = $('#board')
	cards.map(card=>{
		if(card){
			const img = document.createElement('img')
			img.src = './assets/cards/'+card
			board.appendChild(img)
		}
	})
}

function getValueCard(card){
	let v = card.split('-')
	if(['T','J','Q','K'].includes(v[1][0])){
		return 10
	}
	else if(v[1][0] === 'A') return 11
	else return Number(v[1][0])
}

function extraerCard(cards){
	let index = Math.floor(Math.random()*cards.length)
	return cards[index]
}


function resetearBoard(){

	activeBoton($('#play'),false)
	activeBoton($('#pedir'),true)
	activeBoton($('#detener'),true)

	value_count_dealer = [0]
	value_count_user = [0]

	$('#count_dealer').innerText = count(value_count_dealer)
	$('#count_user').innerText = count(value_count_user)

	cards_dealer = ['back.jpg','back.jpg']
	cards_user = ['back.jpg','back.jpg']

	render(cards_dealer,cards_user)
}


function repartir(cards){
	activeBoton($('#play'),true)
	activeBoton($('#pedir'),false)
	activeBoton($('#detener'),false)

	const one = [0]
	const two = [0,0]

	value_count_dealer = [0]
	value_count_user = [0]

	cards_dealer = ['back.jpg']
	cards_user = []

	two.map(()=>{
		let card = extraerCard(cards)
		cards_user.push(card)
		value_count_user.push(getValueCard(card))
	})
	$('#count_user').innerText = count(value_count_user)

	one.map(()=>{
		let card = extraerCard(cards)
		cards_dealer.unshift(card)
		value_count_dealer.push(getValueCard(card))
	})
	$('#count_dealer').innerText = count(value_count_dealer)

	render(cards_dealer,cards_user)
}

function activeBoton(boton,status){
	boton.disabled = status
	if(status){
		boton.classList.remove('opacity-100')
		boton.classList.add('opacity-20')
	} else {
		boton.classList.remove('opacity-20')
		boton.classList.add('opacity-100')
	}
}

function pedirCard(cards){
	let card = extraerCard(cards)
	cards_user.push(card)
	value_count_user.push(getValueCard(card))

	if(count(value_count_user) <= 21){
		$('#count_user').innerHTML = count(value_count_user)
		render(cards_dealer,cards_user)
	} else {
		activeBoton($('#pedir'),true)
		activeBoton($('#detener'),true)
		$('#count_user').innerHTML = count(value_count_user)
		point -= 50
		render(cards_dealer,cards_user)
		resultado('perdiste')
	}
}

function pedirCardDealer(cards){
	if(cards_dealer[1] === 'back.jpg'){
		let card = extraerCard(cards)
		cards_dealer[1] = card
		value_count_dealer.push(getValueCard(card))
	} else {
		let card = extraerCard(cards)
		cards_dealer.push(card)
		value_count_dealer.push(getValueCard(card))
	}
	$('#count_dealer').innerText = count(value_count_dealer)
	render(cards_dealer,cards_user)
}

function count(player){
	return player.reduce((suma,valor)=>{
		if(suma+valor>21 && valor === 11) return suma+1
		else return suma+valor
	}, 0)
}

function render(cards_dealer,cards_user){
	const board_user = $('#board_user')
	board_user.innerHTML = ''
	cards_user.map(card=>{
		const img = document.createElement('img')
		img.src = './assets/cards/'+card
		img.classList.add('rounded','w-12')
		board_user.appendChild(img)
	})
	const board_dealer = $('#board_dealer')
	board_dealer.innerHTML = ''
	cards_dealer.map(card=>{
		const img = document.createElement('img')
		img.src = './assets/cards/'+card
		img.classList.add('rounded','w-12')
		board_dealer.appendChild(img)
	})
}

render(cards_dealer,cards_user)
activeBoton($('#play'),false)
activeBoton($('#pedir'),true)
activeBoton($('#detener'),true)

$('#resultado').addEventListener('click', ()=>{
	resetearBoard()
	$('#resultado').classList.add('hidden')
})

function resultado(result){
	$('#resultado img').src = `./assets/${result}.png`
	$('#resultado span').innerText = result
	$('#resultado').classList.remove('hidden')
	updatePoint(point)
}

function updatePoint(point){
	$('#point').innerText = point
}


updatePoint(point)
$('#play').addEventListener('click', ()=> repartir(cards))
$('#pedir').addEventListener('click', ()=> pedirCard(cards))
$('#detener').addEventListener('click', ()=> {
	activeBoton($('#pedir'),true)
	activeBoton($('#detener'),true)
	const dealerPlaying = setInterval(()=>{
		pedirCardDealer(cards)
		if(count(value_count_dealer) === count(value_count_user) && $('#detener').disabled === true ){
			clearInterval(dealerPlaying)
			render(cards_dealer,cards_user)
			resultado('empataste')
		}
		if(count(value_count_dealer)<=21 && count(value_count_dealer) > count(value_count_user)){
			clearInterval(dealerPlaying)
			point -= 50
			render(cards_dealer,cards_user)
			resultado('perdiste')
		}
		if(count(value_count_dealer)>21){
			clearInterval(dealerPlaying)
			point += 50
			render(cards_dealer,cards_user)
			resultado('ganaste')
		}
	}, 1750)
})