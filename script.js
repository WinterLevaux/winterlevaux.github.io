const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gradient = ctx.createLinearGradient(0, canvas.height, canvas.width, 0);

gradient.addColorStop(0, '#F0FFFF');
gradient.addColorStop(0.2, '#89CFF0');
gradient.addColorStop(0.4, '#0096FF');
gradient.addColorStop(0.6, '#6495ED');
gradient.addColorStop(0.8, '#7393B3');
gradient.addColorStop(1, '#6082B6');

class Symbol {
    constructor(x, y, fontSize, canvasHeight, delay) {
        this.characters = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンあぁいぃうぅえぇおぉかきくけこさしすせそたちつってとなにぬねのはひふへほまみむめもやゃゆゅよょらりるれろわゐをん0123456789";
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.text = '';
        this.canvasHeight = canvasHeight;
        this.delay = delay;
        this.start = false;
    }

    draw(context) {
        if (this.delay > 0) {
            this.delay--;
            return;
        }
        this.start = true;
        this.text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
        context.fillText(this.text, this.x * this.fontSize, this.y * this.fontSize);

        if (this.y * this.fontSize > this.canvasHeight && Math.random() > 0.99) {
            this.y = 0;
        } else {
            this.y += 1;
        }
    }
}

class Effect {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.fontSize = 40;
        this.columns = this.canvasWidth / this.fontSize;
        this.symbols = [];
        this.#initialize();
    }

    #initialize() {
        for (let i = 0; i < this.columns; i++) {
            const x = i;
            const y = Math.random() * -this.canvasHeight / this.fontSize;
            const delay = Math.floor(Math.random() * 100); // Random delay for each symbol
            this.symbols.push(new Symbol(x, y, this.fontSize, this.canvasHeight, delay));
        }
    }

    resize(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.columns = this.canvasWidth / this.fontSize;
        this.symbols = [];
        this.#initialize();
    }
}

class HeavyRainDrops {
    constructor(x, y, fontSize, canvasHeight) {
        this.characters = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンあぁいぃうぅえぇおぉかきくけこさしすせそたちつってとなにぬねのはひふへほまみむめもやゃゆゅよょらりるれろわゐをん0123456789";
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.canvasHeight = canvasHeight;
        this.finished = false; // To track when the heavy rain reaches the bottom
        this.positions = [{ x: this.x, y: this.y }]; // Track the positions of the heavy rain drops
    }

    draw(context) {
        if (this.finished) return;

        let lastPos = this.positions[this.positions.length - 1];
        let nextX = lastPos.x;
        let nextY = lastPos.y + 2; // Move faster than the rain

        // 1/10 chance to shift left or right
        if (Math.random() < 0.9) {
            nextX += (Math.random() < 0.5) ? -1 : 1;
        }

        // 1/20 chance to branch
        if (Math.random() < 0.05) {
            this.positions.push({ x: nextX, y: nextY }); // Create the branch
        }

        this.positions.push({ x: nextX, y: nextY });

        context.fillStyle = this.getGradient(context, nextX * this.fontSize, nextY * this.fontSize);
        let text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
        context.fillText(text, nextX * this.fontSize, nextY * this.fontSize);

        if (nextY * this.fontSize > this.canvasHeight) {
            this.finished = true;
        }
    }

    getGradient(context, x, y) {
        let gradient = context.createLinearGradient(x, y, x, y + this.fontSize);
        gradient.addColorStop(0, '#6F8FAF');
        gradient.addColorStop(0.6, '#6495ED');
        gradient.addColorStop(0.8, '#7393B3');
        gradient.addColorStop(1, '#6082B6');
        return gradient;
    }
}

const effect = new Effect(canvas.width, canvas.height);
let lastTime = 0;
const fps = 60;
const nextFrame = 5000 / fps;
let HeavyRainDroplets = [];
let heavyrainTimer = 0;
let heavyrainCooldown = Math.random() * 100 + 100; // Randomize between 10-20 seconds

function heavyRainAnimation(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    if (timer > nextFrame) {
        ctx.fillStyle = 'rgba(220,220,220,.2)';
        ctx.textAlign = 'center';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = gradient;
        ctx.font = effect.fontSize + 'px monospace';

        effect.symbols.forEach(symbol => {
            symbol.draw(ctx);
        });

        // Handle heavy rain drops
        if (heavyrainTimer > heavyrainCooldown) {
            HeavyRainDroplets.push(new HeavyRainDrops(Math.floor(Math.random() * effect.columns), 0, effect.fontSize, canvas.height));
            heavyrainCooldown = Math.random() * 100 + 100; // Reset cooldown
            heavyrainTimer = 0;
        } else {
            heavyrainTimer += deltaTime;
        }

        // Draw and clean up lightning bolts
        HeavyRainDroplets.forEach((bolt, index) => {
            bolt.draw(ctx);
            if (bolt.finished) {
                HeavyRainDroplets.splice(index, 1); // Remove finished bolts
            }
        });

        timer = 0;
    } else {
        timer += deltaTime;
    }

    requestAnimationFrame(heavyRainAnimation);
}


//animationId = requestAnimationFrame(heavyRainAnimation);



timer = 0
function rainAnimation(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    if (timer > nextFrame) {
        ctx.fillStyle = 'rgba(220,220,220,.2)'; // Silver background color
        ctx.textAlign = 'center'; // Center the text horizontally
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Clear canvas with slight transparency
        ctx.fillStyle = gradient;
        ctx.font = effect.fontSize + 'px monospace';

        effect.symbols.forEach(symbol => {
            symbol.draw(ctx);
        });

        timer = 0;
    } else {
        timer += deltaTime;
    }

    animationId = requestAnimationFrame(rainAnimation);
}

animationId = requestAnimationFrame(rainAnimation); //this is the default rain animation

// Event listeners for buttons...
// (No changes needed here, so not repeating this part)




// Event listener for the 'No Rain' button
document.getElementById('none-animation').addEventListener('click', function () {
    console.log('stop')
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.body.style.backgroundColor = '#D3D3D3'; // Set background color
});


// Event listener for the 'No Rain' button
document.getElementById('street-rain-animation').addEventListener('click', function () {
    console.log('rain')
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animationId = requestAnimationFrame(rainAnimation);
});

document.getElementById('heavy-rain-animation').addEventListener('click', function(){
    console.log('heavyrain')
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animationId = requestAnimationFrame(heavyRainAnimation);
});

// Event listener for the 'Thunderstorm' button
document.getElementById('thunderstorm-animation').addEventListener('click', function () {
    console.log('thunderstorm')
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animationId = requestAnimationFrame(rainAnimation);
});

// Event listener for the 'Thunderstorm' button
document.getElementById('lofi-rain-animation').addEventListener('click', function () {
    console.log('lofi-rain')
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animationId = requestAnimationFrame(rainAnimation);
});




//For Music
document.addEventListener("DOMContentLoaded", function () {
    const audioPlayer = document.getElementById('audio-player');

    // Function to play audio based on the selected option
    function playMusic(src) {
        audioPlayer.src = src;
        audioPlayer.play();
    }


    // Event listeners for the dropdown options
    document.getElementById('none-music').addEventListener('click', function () {
        audioPlayer.pause();
        audioPlayer.currentTime = 0; // Reset the audio to the start
    });

    document.getElementById('street-rain-music').addEventListener('click', function () {
        playMusic('big_drops_rain.mp3'); // Update with correct file path
    });

    document.getElementById('thunderstorm-music').addEventListener('click', function () {
        playMusic('thunderstorm.mp3'); // Update with correct file path
    });

    document.getElementById('lofi-rain-music').addEventListener('click', function () {
        playMusic('summer_rain_lofi.mp3'); // Update with correct file path
    });
});




window.addEventListener('resize',function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    effect.resize(canvas.width, canvas.height)
});
