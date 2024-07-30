const words = [
    "cat", "dog", "bat", "rat", "hat", "mat", "sat", "pat", "fat", "vat", 
    "car", "bar", "far", "jar", "tar", "war", "mar", "par", "tar", "zar",
    "cap", "gap", "lap", "map", "nap", "sap", "tap", "zap", "rap", "yap",
    "cab", "dab", "fab", "jab", "lab", "nab", "tab", "jab", "fab", "sab",
    "bed", "fed", "led", "red", "wed", "ted", "zed", "med", "ged", "ped",
    "cot", "dot", "got", "hot", "lot", "not", "pot", "rot", "sot", "tot",
    "cub", "dub", "hub", "nub", "pub", "rub", "sub", "tub", "yub", "zub",
    "big", "dig", "fig", "gig", "jig", "pig", "rig", "wig", "zig", "lig",
    "ban", "can", "dan", "fan", "man", "pan", "ran", "tan", "van", "wan"
];

let currentWord;
let missingLetterIndex;
let validLetters = [];
let displayWord;
let bubblesContainer = document.getElementById("bubbles-container");
let wordDisplay = document.getElementById("word-display");
let correctSound = document.getElementById("correct-sound");
let wrongSound = document.getElementById("wrong-sound");
let popSound = document.getElementById("pop-sound");
let resetSound = document.getElementById("reset-sound");

function startGame() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    missingLetterIndex = Math.floor(Math.random() * currentWord.length);
    displayWord = currentWord.replace(currentWord[missingLetterIndex], `<span class="blink">_</span>`);
    wordDisplay.innerHTML = displayWord; // Use innerHTML to include the span tag
    validLetters = getValidLetters(currentWord, missingLetterIndex);
    generateBubbles();
}

function getValidLetters(word, index) {
    let letterOptions = [];
    for (let i = 0; i < words.length; i++) {
        if (words[i].startsWith(word.slice(0, index)) && words[i].endsWith(word.slice(index + 1))) {
            letterOptions.push(words[i][index]);
        }
    }
    return [...new Set(letterOptions)]; // remove duplicates
}

function generateBubbles() {
    bubblesContainer.innerHTML = ""; // Clear previous bubbles
    let letters = getRandomLetters(validLetters);
    letters.forEach(letter => {
        let bubble = document.createElement("div");
        bubble.classList.add("bubble");
        bubble.innerText = letter;
        bubble.style.bottom = "-50px"; // Start position below the container
        bubble.style.left = Math.random() * 90 + "%";
        let speed = Math.random() * 3 + 2; // Varied speed between 2 and 5
        bubble.dataset.speed = speed;
        bubble.addEventListener("click", () => onBubblePop(bubble, letter));
        bubblesContainer.appendChild(bubble);
    });
}

function getRandomLetters(validLetters) {
    let letters = validLetters.slice();
    while (letters.length < 10) { // Increase number of bubbles to 10
        let charCode = 65 + Math.floor(Math.random() * 26);
        let letter = String.fromCharCode(charCode);
        if (!letters.includes(letter)) {
            letters.push(letter);
        }
    }
    return shuffleArray(letters);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function onBubblePop(bubble, letter) {
    popSound.play();
    bubble.remove();
    if (validLetters.includes(letter)) {
        correctSound.play();
        displayWord = displayWord.replace(`<span class="blink">_</span>`, letter);
        wordDisplay.innerHTML = displayWord;
        if (!displayWord.includes(`<span class="blink">_</span>`)) {
            setTimeout(startGame, 1000); // Start new word after 1 second delay
        }
    } else {
        wrongSound.play();
        resetSound.play();
        generateBubbles(); // Reset bubbles for the same word
    }
}

function moveBubbles() {
    let bubbles = document.querySelectorAll(".bubble");
    bubbles.forEach(bubble => {
        let bottom = parseFloat(bubble.style.bottom);
        let speed = parseFloat(bubble.dataset.speed);
        bottom += speed;
        if (bottom > parseFloat(bubblesContainer.clientHeight)) {
            bottom = -50; // Reset bubble position after it leaves the container
        }
        bubble.style.bottom = bottom + "px";
    });
}

startGame();
setInterval(moveBubbles, 50);
