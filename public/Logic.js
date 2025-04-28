//START BUTTON LOGIC (Title screen, konkos animation, music)
const TitleScreen = document.getElementById("title_screen");
const StartButton = document.getElementById("start-button");
const TitleImage = document.getElementById("title-img");
const landing = new Audio("assets/sounds/landing.mp3");
const music1 = new Audio("assets/sounds/music1.mp3"); // Dbg
const music2 = new Audio("assets/sounds/music2.mp3"); // Dayx
StartButton.addEventListener("click", () => { // WHEN CLICK ON START BUTTON, DO:

    TitleImage.style.visibility = 'hidden';
    TitleScreen.style.transition = "opacity 1s";
    TitleScreen.style.opacity = "0";

    setTimeout(() => { // fading titlescrn
        TitleScreen.style.display = "none";
    }, 1000);
    
    setTimeout(() => { // making konkos fall and shake (mimicking superhero effect)
        TitleImage.style.visibility = 'visible'; 
        TitleImage.style.animation = 'shootDown 0.5s ease-out forwards';
        TitleImage.style.animationDelay = '0s';
        landing.play(); // bowser landing sound
    }, 2000); 
    
    setTimeout(() => {
        TitleImage.style.animation = 'shake 0.2s ease forwards'; // shake
    }, 2400);
    setTimeout( () =>{ // dbg starting
        music1.play();

    }, 4000)
});

//BUILD BUTTON LOGIC (Counters)
const BuildButton = document.getElementById("build-button");
const ApartmentCount = document.getElementById("apartments-count");
const MoneyCount = document.getElementById("money-count");
const BuilderCount = document.getElementById("builders-count");


// UPGRADE LOGIC (Counters + upgrade buttons + timed event)
// ACHIEVEMENT LOGIC (Counters + achievement unlocks + Popups)
