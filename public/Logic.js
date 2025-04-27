const TitleScreen = document.getElementById("title_screen");
const StartButton = document.getElementById("start-button");
const TitleImage = document.getElementById("title-img");
const landing = new Audio("assets/sounds/landing.mp3");

StartButton.addEventListener("click", () => {
    
    TitleScreen.style.opacity = "0";
    TitleImage.style.visibility = 'hidden';  // Or use opacity: 0;

    // Set a delay to show the image and trigger the shootDown animation after 4 seconds
    setTimeout(() => {
        TitleImage.style.visibility = 'visible';  // Or use opacity: 1;
        TitleImage.style.animation = 'shootDown 0.5s ease-out forwards';
        TitleImage.style.animationDelay = '0s';
        landing.play();
    }, 2000); // Image appears after 4 seconds

    // Set the shake animation with a 4.5-second delay (after shootDown finishes)
    setTimeout(() => {
        TitleImage.style.animation = 'shake 0.2s ease forwards'; // Trigger shake animation after the shootDown animation
    }, 2400); // Shake animation starts after 4.5 seconds from the button click (0.5s after shootDown)
});