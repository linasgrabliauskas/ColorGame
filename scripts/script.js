// Global variables
let startGameBtn = document.querySelector("#start-game-btn")
let colorsBoard = document.querySelector('.game-board__colors')
let mainColorBlock = document.querySelector(".game-board__main-color")
let scoreAmount = document.querySelector("#score-amount")
let timeLeftOutput = document.querySelector("#time-amount")
let levelBtns = document.querySelectorAll('.level')
let levelTitle = document.querySelector('.game-level-headline')
let boxes = document.querySelectorAll(".box")
let headline = document.querySelector('.game-level-headline')
let description = document.querySelector('.game-level-description')
let headlineHome = document.querySelector('.headline-home')
let homeBtn = document.querySelector('.home')
let scoreboardBtn = document.querySelector('.scoreboard')
// Section blocks
let headlineBlock = document.querySelector('.headline-section')
let gameBlock = document.querySelector('.game-section')
let scoreBlock = document.querySelector('.score-section')
let scoreboardBlock = document.querySelector('.scoreboard-section')
let scoreTable = document.querySelector('.table-body')
// Score and time
let score = 0
let time = 15000
let timeUp = true
let fullTimer, timer

// Functions 
// - Functions: Utility functions
function setDisplayNone(...queries){
    queries.forEach(query => query.style.display = 'none')
}
function setDisplayBlock(...queries){
    queries.forEach(query => query.style.display = 'block')
}

// - Functions: Main functions
function setColor() {
    boxes = document.querySelectorAll(".box")
    boxes.forEach(box => box.addEventListener("click", pickColor))
    boxes.forEach(box => {
        let h = Math.floor(Math.random()* 359)
        let s = Math.floor(Math.random()* 359) + '%'
        let l = Math.floor((Math.random()* 16) + 30) + '%'
        box.style.backgroundColor = `hsl(${h},${s},${l})`
    })
    let i = Math.floor(Math.random() * boxes.length)
    mainColorBlock.style.backgroundColor = boxes[i].style.backgroundColor
}

function startGame() {
    // Reset blocks
    setDisplayNone(headline, description, startGameBtn)
    setDisplayBlock(scoreBlock)
    mainColorBlock.style.display = 'flex'
    // Clear intervals
    clearTimeout(fullTimer)
    clearInterval(timer)
    // Reset stats
    timeUp = false
    let timeLeft = time / 1000
    score = 0
    // Setup boards
    setColor()
    // Set timers
    fullTimer = setTimeout(() => {
        timeUp = true
        addHighscore()
    }, time)
    timer = setInterval(() => timeLeftOutput.innerText = timeLeft > 0 ? `${--timeLeft} seconds` : `Times up!`, 1000)
}

function pickColor(e) {
    if(!timeUp) {
        let currentBoxColor = getComputedStyle(e.target).backgroundColor
        let mainBoxColor = getComputedStyle(mainColorBlock).backgroundColor
        if(currentBoxColor === mainBoxColor) {
            score++
            scoreAmount.innerText = score
            setColor()
        }
    }
}

function setLevel(e){
    score = 0
    scoreAmount.innerText = score
    // Reset blocks
    setDisplayBlock(headlineBlock, headline, description, startGameBtn, gameBlock)
    setDisplayNone(headlineHome, mainColorBlock, scoreBlock, scoreboardBlock)
    // Clear timers if game already running
    clearTimeout(fullTimer)
    clearInterval(timer)
    // Create colors board on level
    time = +e.target.dataset.time
    let boardBoxes = ''
    // Create boxes
    let boxCount = +e.target.dataset.level
    for (let i=0; i < boxCount; i++){
        boardBoxes += '<div class="box"></div>'
    }
    colorsBoard.innerHTML = boardBoxes
    timeLeftOutput.innerText = `${time / 1000} seconds`
    setColor()
    if (boxCount === 9) boxes.forEach(box => {
        box.classList.add('box--level1')
        levelTitle.innerText = 'EASY LEVEL'
    })
    if (boxCount === 16) boxes.forEach(box => {
        box.classList.add('box--level2')
        levelTitle.innerText = 'MEDIUM LEVEL'
    })
    if (boxCount === 25) boxes.forEach(box => {
        box.classList.add('box--level3')
        levelTitle.innerText = 'HARD LEVEL'
    })
}

function setHomePage(){
    setDisplayNone(headline, description, startGameBtn, scoreBlock, scoreboardBlock)
    setDisplayBlock(headlineBlock, gameBlock, headlineHome)
    mainColorBlock.style.display = 'flex'
    setColor()
}

function setScoreboardPage(){
    // Reset blocks
    setDisplayNone(scoreBlock, headlineBlock, gameBlock)
    setDisplayBlock(scoreboardBlock)
    let scoresArr
    // Take data from local storage
    if (localStorage.hasOwnProperty('findColorGame')){
        let scoresJSON = localStorage.getItem('findColorGame')
        scoresArr = JSON.parse(scoresJSON)
    } else {
        return
    }
    // Filter scores without names or score = 0
    let scoreData = scoresArr.filter(score => score.nick && score.score)
    // Sort scores data by score
    let sortedScores = scoreData.sort((a,b) => b.score - a.score)
    let scoresElements = ''
    sortedScores.forEach((score, index) => {
        scoresElements += `
           <tr>
               <td class="score-place">${index +1}</td>
               <td class="score-player">${score.nick}</td>
               <td class="score-score">${score.score}</td>
           </tr>
        `
    })
    scoreTable.innerHTML = scoresElements
}


function addHighscore(){
    // Input name
    let name = prompt("Your name or nickname:")
    // Get the existing data from LS
    let scoresArr
    if (localStorage.hasOwnProperty('findColorGame')){
        let scoresJSON = localStorage.getItem('findColorGame')
        scoresArr = JSON.parse(scoresJSON)
    } else {
        scoresArr = []
    }
    if(name){
        scoresArr.push({ nick: name, score })
        // Save back to localStorage
        localStorage.setItem('findColorGame', JSON.stringify(scoresArr))
    }
    // Reset Score 
    score = 0
    setScoreboardPage()
}

// Events
// - Load home page onLoad and on HomeClick
document.addEventListener("DOMContentLoaded", setHomePage)
homeBtn.addEventListener('click', setHomePage)
startGameBtn.addEventListener("click", startGame)
boxes.forEach(box => box.addEventListener("click", pickColor))
levelBtns.forEach(btn => btn.addEventListener('click', setLevel))
scoreboardBtn.addEventListener('click', setScoreboardPage)





