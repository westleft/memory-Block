let status = document.querySelector('.status')
let inputStatus = document.querySelector('.inputStatus')

let blockData = [
    { selector: document.querySelector('.block1'), name: '1', pitch: '1' },
    { selector: document.querySelector('.block2'), name: '2', pitch: '2' },
    { selector: document.querySelector('.block3'), name: '3', pitch: '3' },
    { selector: document.querySelector('.block4'), name: '4', pitch: '4' },
    { selector: document.querySelector('.block5'), name: '5', pitch: '5' },
    { selector: document.querySelector('.block6'), name: '6', pitch: '6' },
    { selector: document.querySelector('.block7'), name: '7', pitch: '7' },
    { selector: document.querySelector('.block8'), name: '8', pitch: '8' },
    { selector: document.querySelector('.block9'), name: '9', pitch: '9' }
]

let soundSetData = [
    { name: 'correct', set: [1, 3, 5, 8] },
    { name: 'wrong', set: [2, 4, 5.5, 7] }
]

let levelDatas = [
    '1234',
    '41213',
    '3314241',
    '125613',
    '45513264',
    '2312564632',
    '29489763295415',
    '13945135875621955975',
    '3125789543598966122148897543321'
]



let Blocks = function (blockAssign, setAssign) {
    this.allOn = false
    this.blocks = blockAssign.map((item, index) => (
        {
            name: item.name,
            el: item.selector,
            audio: this.getAudioObject(item.pitch)
        }
    ))
    this.soundSet = setAssign.map((item, index) => (
        {
            name: item.name,
            sets: item.set.map((pitch) => this.getAudioObject(pitch))
        }
    ))
}

Blocks.prototype.flash = function (note) {
    let block = this.blocks.find(d => d.name === note)
    if (block) {
        block.audio.currentTime = 0
        block.audio.play()
        block.el.classList.add('active')
        setTimeout(() => {
            if (this.allOn === false) {
                block.el.classList.remove('active')
            }
        }, 100)
    }
}

//全部亮燈
Blocks.prototype.turnAllOn = function () {
    this.allOn = true
    this.blocks.forEach((block) => {
        block.el.classList.add('active')
    })
}

//全部關燈
Blocks.prototype.turnAllOff = function () {
    this.allOn = false
    this.blocks.forEach((block) => {
        block.el.classList.remove('active')
    })
}

//音樂檔
Blocks.prototype.getAudioObject = function (pitch) {
    let audio =  new Audio("https://awiclass.monoame.com/pianosound/set/"+ pitch+".wav")
    audio.setAttribute("preload","auto")
    return audio
}

Blocks.prototype.playSet = function (type) {
    let sets = this.soundSet.find(set => set.name === type).sets
    sets.forEach((obj) => {
        obj.currentTime = 0
        obj.play()
    })
}

let Game = function () {
    this.block = blocks = new Blocks(blockData, soundSetData)
    this.levels = levelDatas
    this.currentLevel = 0
    this.playInterval = 400
    this.mode = 'waiting'
}

Game.prototype.startLevel = function () {
    this.showMessage('level' + this.currentLevel)
    let levelData = this.levels[this.currentLevel]
    this.startGame(levelData)
}

Game.prototype.showMessage = function (mes) {
    console.log(mes)
    status.textContent = mes
}

Game.prototype.startGame = function (answer) {
    this.node = 'gamePlay'
    this.answer = answer

    this.showStatus('')
    let notes = this.answer.split('')
    this.timer = setInterval(() => {
        let char = notes.shift()
        this.playNote(char)
        if (notes.length === 0) {
            this.startUserInput()
            clearInterval(this.timer)
        }

    }, this.playInterval)
    if(this.currentLevel >= 3){
        document.querySelector('.block5').style.display = 'flex'
        document.querySelector('.block6').style.display = 'flex'
    }
    if(this.currentLevel >= 6){
        document.querySelector('.block7').style.display = 'flex'
        document.querySelector('.block8').style.display = 'flex'
        document.querySelector('.block9').style.display = 'flex'
        console.log('df')
    }

}

Game.prototype.playNote = function (note) {
    this.block.flash(note)
}

Game.prototype.startUserInput = function () {
    this.userInput = ''
    this.mode = 'userInput'
}

Game.prototype.userSendInput = function (inputChar) {
    if (this.mode === 'userInput') {
        let tempString = this.userInput + inputChar
        this.playNote(inputChar)
        this.showStatus(tempString)

        if (this.answer.indexOf(tempString) === 0) {
            if (this.answer === tempString) {
                this.showMessage('Correct')
                this.currentLevel += 1
                this.mode = 'waiting'

                setTimeout(() => {
                    this.startLevel()
                }, 1000)
            }
        } else {
            this.showMessage('Wrong')
            // this.currentLevel = 0
            this.mode = 'waiting'
            
            setTimeout(() => {
                this.startLevel()
            }, 1000)
        }
        this.userInput += inputChar
    }
}


Game.prototype.showStatus = function (tempString) {
    inputStatus.textContent = ''
    this.answer.split('').forEach((item, index) => {
        let circle = `<div class="circle"></div>`
        inputStatus.innerHTML += circle
        // if (index < tempString.length) {
        //     circle.classList.add('correct')
        // }
    })
    if(tempString == ''){
        this.block.turnAllOff()
    }

    if (tempString == this.answer) {
        // inputStatus.classList.add('correct')
        setTimeout(() => {
            this.block.turnAllOn()
            blocks.playSet('correct')
        }, 500)
    }
    if(this.answer.indexOf(tempString) != 0){
        setTimeout(()=>{
            this.block.turnAllOn()
            blocks.playSet('wrong')
        },500)
    }
}

let game = new Game()

setTimeout(() =>{
    game.startLevel()
},1000)