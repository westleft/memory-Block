let blockData = [
    { selector: document.querySelector('.block1'), name: '1', pitch: '1' },
    { selector: document.querySelector('.block2'), name: '2', pitch: '2' },
    { selector: document.querySelector('.block3'), name: '3', pitch: '3' },
    { selector: document.querySelector('.block4'), name: '4', pitch: '4' }
]

let soundSetData = [
    { name: 'correct', set: [1, 3, 5, 8] },
    { name: 'wrong', set: [2, 4, 5.5, 7] }
]

let levelDatas = [
    '1324',
    '1232114143',
    '13214443214321'
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
    return new Audio("https://awiclass.monoame.com/pianosound/set/" + pitch + ".wav")
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
    this.level = levelDatas
    this.currentLevel = 0
    this.playInterval = 400
    this.mode = 'waiting'
}

Game.prototype.startGame = function (answer) {
    this.node = 'gamePlay'
    this.answer = answer

    let notes = this.answer.split('')
    this.timer = setInterval(() => {
        let char = notes.shift()
        this.playNote(char)
        if (notes.length === 0) {
            this.startUserInput()
            clearInterval(this.timer)
        }
        console.log(char);

    }, this.playInterval)

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
        if (this.answer.indexOf(tempString) === 0) {
            console.log('nice');
            if (this.answer === tempString) {
                console.log('correct');
            }
        }
        this.userInput += inputChar
        console.log(tempString);
    }
}

let game = new Game()

game.startGame('12333')

// blocks.playSet('wrong')

console.log(blocks);