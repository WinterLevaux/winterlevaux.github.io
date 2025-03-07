const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;




//begin gradient function

function createGradient() {
    return ctx.createLinearGradient(0, canvas.height, canvas.width, 0);
}

function createRainGradient() {
    let gradient = createGradient()
    gradient.addColorStop(0, '#F0FFFF');
    gradient.addColorStop(0.2, '#89CFF0');
    gradient.addColorStop(0.4, '#0096FF');
    gradient.addColorStop(0.6, '#6495ED');
    gradient.addColorStop(0.8, '#7393B3');
    gradient.addColorStop(1, '#6082B6');
    return gradient;
}

function createLofiRainGradient() {
    let gradient = createGradient()
    gradient.addColorStop(0, '#DC8564');
    gradient.addColorStop(0.2, '#F4CCCC');
    gradient.addColorStop(0.4, '#007F87');
    gradient.addColorStop(0.6, '#885CA4');
    gradient.addColorStop(0.8, '#BCACD4');
    gradient.addColorStop(1, '#603450');
    return gradient;
}



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

        context.fillStyle = this.getHeavyRainGradient(context, nextX * this.fontSize, nextY * this.fontSize);
        let text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
        context.fillText(text, nextX * this.fontSize, nextY * this.fontSize);

        if (nextY * this.fontSize > this.canvasHeight) {
            this.finished = true;
        }
    }

    getHeavyRainGradient(context, x, y) {
        let gradient = context.createLinearGradient(x, y, x, y + this.fontSize);
        gradient.addColorStop(0, '#6F8FAF');
        gradient.addColorStop(0.6, '#6495ED');
        gradient.addColorStop(0.8, '#7393B3');
        gradient.addColorStop(1, '#6082B6');
        return gradient;
    }
}


class LightningBolt {
    constructor(x, y, fontSize, canvasWidth, canvasHeight) {
        this.characters = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンあぁいぃうぅえぇおぉかきくけこさしすせそたちつってとなにぬねのはひふへほまみむめもやゃゆゅよょらりるれろわゐをん0123456789";
        this.x = x;
        this.y = y;
        this.fontSize = fontSize + 7;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.finished = false;
        this.positions = [{ x: this.x, y: this.y }];
        this.forks = [];
        this.forkCount = 0;
        this.maxForks = 2; // Changed to 3 as per requirement
        this.minForks = 1;
        this.lifespan = 2000; // 3 seconds lifespan
        this.creationTime = Date.now();
        this.hasForkedEarly = false;
        this.direction = Math.random() < 0.5 ? -1 : 1; // -1 for left, 1 for right
        this.directionStrength = Math.random() * 0.5 + 0.5; // Random strength between 0.5 and 1
        this.symbolFrequency = 0.5; // Adjust this value to change the frequency of symbols (0-1)
    }

    draw(context) {
        if (this.finished && Date.now() - this.creationTime > this.lifespan) return true;

        if (!this.finished) {
            let lastPos = this.positions[this.positions.length - 1];
            let nextX = lastPos.x;
            let nextY = lastPos.y + 1;

            // Make the bolt more jagged
            nextX += (Math.random() - 0.5) * 4 * this.directionStrength;

            // Apply directional trend
            nextX += this.direction * this.directionStrength;

            // Ensure lightning stays within canvas bounds
            nextX = Math.max(0, Math.min(nextX, this.canvasWidth / this.fontSize));

            // Check if the bolt has hit the side of the screen
            if (nextX <= 0 || nextX >= this.canvasWidth / this.fontSize) {
                //this.finished = true;
                this.direction = !this.direction
                return false;
            }

            // Early forking
            let earlyForkRegion = this.canvasHeight * 0.4;
            if (!this.hasForkedEarly && nextY > this.canvasHeight * 0.15 && nextY < earlyForkRegion) {
                if (Math.random() < 0.1) {
                    this.forks.push(new LightningBolt(nextX, nextY, this.fontSize - 5, this.canvasWidth, this.canvasHeight));
                    this.forkCount++;
                    this.hasForkedEarly = true;
                }
            }

            // Regular forking
            let forkChance = Math.min(0.05 + (nextY / this.canvasHeight) * 0.2, 0.25);
            if (this.forkCount < this.maxForks && Math.random() < forkChance) {
                this.forks.push(new LightningBolt(nextX, nextY, this.fontSize - 5, this.canvasWidth, this.canvasHeight));
                this.forkCount++;
            }

            this.positions.push({ x: nextX, y: nextY });

            if (nextY * this.fontSize > this.canvasHeight) {
                if (this.forkCount < this.minForks) {
                    this.forks.push(new LightningBolt(nextX, nextY - 10, this.fontSize - 5, this.canvasWidth, this.canvasHeight));
                    this.forkCount++;
                } else {
                    this.finished = true;
                }
            }
        }

        // Draw the main bolt
        this.drawBolt(context, this.positions);

        // Draw forks
        // this.forks.forEach(fork => fork.draw(context));

        return false;
    }

    drawBolt(context, positions) {
        for (let i = 0; i < positions.length - 1; i++) {
            let pos = positions[i];
            let nextPos = positions[i + 1];

            //Draw a line between positions
            context.strokeStyle = this.getLightningGradient(context, pos.x * this.fontSize, pos.y * this.fontSize);
            context.lineWidth = this.fontSize / 3 / 2;
            context.beginPath();
            context.moveTo(pos.x * this.fontSize, pos.y * this.fontSize);
            context.lineTo(nextPos.x * this.fontSize, nextPos.y * this.fontSize);
            context.stroke();

            // Add symbols along the line
            let distance = Math.sqrt(Math.pow(nextPos.x - pos.x, 2) + Math.pow(nextPos.y - pos.y, 2));
            let steps = Math.ceil(distance / this.symbolFrequency);

            for (let j = 0; j < steps; j++) {
                if (Math.random() < this.symbolFrequency) {
                    let interpX = pos.x + (nextPos.x - pos.x) * (j / steps);
                    let interpY = pos.y + (nextPos.y - pos.y) * (j / steps);

                    context.fillStyle = this.getLightningGradient(context, interpX * this.fontSize, interpY * this.fontSize);
                    context.font = this.fontSize + 'px monospace';
                    let text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
                    context.fillText(text, interpX * this.fontSize, interpY * this.fontSize);
                }
            }
        }
    }

    getLightningGradient(context, x, y) {
        let gradient = context.createLinearGradient(x, y, x, y + this.fontSize);
        gradient.addColorStop(1, '#D8A444');  // Metalic Gold
        //gradient.addColorStop(0.5, '#FFA500'); // Orange
        //gradient.addColorStop(1, '#DAA520');   // Golden rod
        return gradient;
    }
}


//BEGIN ANIMATION FUNCTIONS
function rainAnimation(timeStamp) {
    //because this is the first animation run, this is the default color
    let gradient = createRainGradient();


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

function heavyRainAnimation(timeStamp) {
    let gradient = createRainGradient();

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
            heavyrainCooldown = Math.random() * 25 +25; // Reset cooldown
            heavyrainTimer = 0;
        } else {
            heavyrainTimer += deltaTime;
        }

        HeavyRainDroplets.forEach((droplet, index) => {
            droplet.draw(ctx);
            if (droplet.finished) {
                HeavyRainDroplets.splice(index, 1); // Remove finished heavy rain
            }
        });

        timer = 0;
    } else {
        timer += deltaTime;
    }

    animationId = requestAnimationFrame(heavyRainAnimation);
}

function lightningAnimation(timeStamp) {
    let gradient = createRainGradient();

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

        if (lightningBoltTimer > lightningBoltCooldown) {
            // Start lightning within 20th and 80th percentile of horizontal space
            let startX = Math.floor(effect.columns * 0.2 + Math.random() * (effect.columns * 0.6));
            lightningBolts.push(new LightningBolt(startX, 0, effect.fontSize, canvas.width, canvas.height));
            lightningBoltCooldown = Math.random() * 1000 + 1000;
            lightningBoltTimer = 0;
        } else {
            lightningBoltTimer += deltaTime * 2;
        }

        lightningBolts = lightningBolts.filter(bolt => !bolt.draw(ctx));

        timer = 0;
    } else {
        timer += deltaTime;
    }

    animationId = requestAnimationFrame(lightningAnimation);
}

function lofiRainAnimation(timeStamp) {
    //because this is the first animation run, this is the default color
    let gradient = createLofiRainGradient();


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

    animationId = requestAnimationFrame(lofiRainAnimation);
}



timer = 0
const effect = new Effect(canvas.width, canvas.height);
let lastTime = 0;
const fps = 60;
const nextFrame = 5000 / fps;
let HeavyRainDroplets = [];
let heavyrainTimer = 0;
let heavyrainCooldown = Math.random() * 25 + 25;
let lightningBolts = [];
let lightningBoltTimer = 0;
let lightningBoltCooldown =  Math.random() * 750 + 750;



animationId = requestAnimationFrame(rainAnimation); //this is the default rain animation




////BEGIN EVENT LISTENERS

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
    animationId = requestAnimationFrame(lightningAnimation);
});

// document.getElementById('heavy-rain-thunderstorm-animation').addEventListener('click', function () {
//     console.log('thunderstorm w/ heavy rain')
//     cancelAnimationFrame(animationId);
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     animationId = requestAnimationFrame(heavyRainAnimation)
// });


// Event listener for the 'Thunderstorm' button
document.getElementById('lofi-rain-animation').addEventListener('click', function () {
    console.log('lofi-rain')
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animationId = requestAnimationFrame(lofiRainAnimation);
});




//For Music
document.addEventListener("DOMContentLoaded", function () {
    const audioPlayer = document.getElementById('audio-player');
    document.getElementById('audio-player').loop = true;

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





// window.requestAnimationFrame = (function(){
//     return  window.requestAnimationFrame       ||
//             window.webkitRequestAnimationFrame ||
//             window.mozRequestAnimationFrame    ||
//             window.oRequestAnimationFrame      ||
//             window.msRequestAnimationFrame     ||
//             function (callback) {
//                 window.setTimeout(callback, 1000 / 60);
//             };
// })();


//_________________________________________________________________________
//Begin section about text


function showContent(content) {
    const contentBlock = document.getElementById('content-block');
    contentBlock.classList.remove('hidden');

    switch(content) {
        case 'about':
            contentBlock.innerHTML = '<p>Winter Levaux (they/she) is a current masters student of Statistics at University of California Irvine (UCI), specializing in Bayesian Non-Parameterics. They received their undergraduate degree in Statistics from UCLA in 2021 and have worked at start-ups between graduating college and starting graduate school. They like to spend their time studying, practicing creative programming, learning more about the cyberpunk genre, and petting their cat Lyra. </p>';
            break;
        case 'github':
            contentBlock.innerHTML = '<p>Go to my <a href="https://github.com/Winter-analysis" target=”_blank”>Github</a></p>';
            break;
        case 'resume':
            contentBlock.innerHTML = "<p>Go to my <a href='https://linkedin.com/in/winter-levaux' target=”_blank”>Linkedin</a> <br> Download my resume <a href='WinterLevaux_Resume.pdf' target='_blank'>here </p>";
            break;
        case 'contact':
            contentBlock.innerHTML = '<p style="monospace">School Email: <a href= "mailto:wlevaux@uci.edu">wlevaux@uci.edu</a> <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Personal Email: <a href="mailto:winterlevaux@gmail.com"> winterlevaux@gmail.com</a> <br> Phone Number: (510)-912-7294&nbsp;&nbsp;&nbsp;&nbsp;</p>';
            break;
        case 'misc':
            contentBlock.innerHTML = '<p>...</p>';
            break;
        default:
            contentBlock.innerHTML = '';
    }
}




