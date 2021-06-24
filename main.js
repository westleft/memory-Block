let blockData = [
    { selector: document.querySelector('.block1'), name: '1', pitch: '1' },
    { selector: document.querySelector('.block2'), name: '2', pitch: '2' },
    { selector: document.querySelector('.block3'), name: '3', pitch: '3' },
    { selector: document.querySelector('.block4'), name: '4', pitch: '4' }
]

let soundSetData = [
    { name: 'corrent', set: [1, 3, 5, 8] },
    { name: 'wrong', set: [2, 4, 5.5, 7] }
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

Blocks.prototype.playSet = function(type){
    this.soundSet.find( set => set.name === type )
}

let blocks = new Blocks(blockData, soundSetData)

blocks.flash('1')

console.log(blocks);