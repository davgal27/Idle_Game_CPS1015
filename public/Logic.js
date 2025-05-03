//START BUTTON LOGIC (Title screen, konkos animation, music)
const TitleScreen = document.getElementById("title_screen");
const StartButton = document.getElementById("start-button");
const TitleImage = document.getElementById("title-img");


TitleImage.style.visibility = 'hidden';
//SONGS LIST 
const landing = new Audio("assets/sounds/landing.mp3"); // bowser landing sound
const music1 = new Audio("assets/sounds/music1.mp3"); // Death By Glamour 8bit- 8bit universe remix
const music2 = new Audio("assets/sounds/music2.mp3"); // Digestive Biscuit - Kubbi
const music3 = new Audio("assets/sounds/music3.mp3"); // The Secret - DaXX
const music4 = new Audio("assets/sounds/music4.mp3"); //Get up n' fight - nexscard
// STARTING MUSIC LOGIC
const MusicList = [music1, music2, music3, music4];
let CurrentTrack = 0; //0 is music 1 , 1 is 2 etc 

// MUTE BUTTON LOGIC 
let IsMuted = false;
const MuteButton = document.getElementById("MuteButton");
let CurrentTimeOfSong = 0; // Would not have figured this out without AI 

MuteButton.addEventListener("click", ()=> {
    IsMuted = !IsMuted;

    if (IsMuted){
        CurrentTimeOfSong = MusicList[CurrentTrack].currentTime;
        MusicList.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        })
    } else {
        MusicList[CurrentTrack].currentTime = CurrentTimeOfSong;
        MusicList[CurrentTrack].play();
        PlayNextMusic();
    }
})
// PLAYING THE MUSIC 
function PlayNextMusic(){
    if (CurrentTrack >= MusicList.length) {
        CurrentTrack = 0;
    }
    if (!IsMuted) {
        MusicList[CurrentTrack].play();
        MusicList[CurrentTrack].onended = () => {
            CurrentTrack++;
            PlayNextMusic();
        };
    }
}
//start button
StartButton.addEventListener("click", () => { // WHEN CLICK ON START BUTTON, DO:

    TitleImage.style.visibility = 'hidden';
    TitleScreen.style.transition = "opacity 1s";
    TitleScreen.style.opacity = "0";

    setTimeout(() => { // fading title screen
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
    setTimeout( () =>{ // dbg to start 
        PlayNextMusic();
    }, 3500)
});

//BUILD BUTTON LOGIC (Counters for Apt, money,  apt/click)
// RESOURCES
let ApartmentsCount = 0;
let MoneyCount = 0;
let BuilderCount = 0;

// OTHER COUNTERS
let AptPerClick = 1;
let MoneyPerApt = 1;
let BuilderMultiplier = 1;
let DealWithPoliticianCount = 0;

// UPGRADE COSTS
let IncreaseApartmentSizeCost = 100;
let UpgradeClickerCost = 150;
let HireBuilderCost = 200;
let DealWithPoliticianCost = 19740;

//TIMED EVENT
let event = false;
let cooldown = false;

// GETTING STUFF FROM HTML:
// COUNTERS
const ApartmentsCountElement = document.getElementById("apartments-count");
const MoneyCountElement = document.getElementById("money-count");
const BuilderCountElement = document.getElementById("builders-count");
const MoneyPerAptElement = document.getElementById("moneyperapartment-count");
const AptPerClickElement = document.getElementById("apartmentperclick-count");
// UPGRADES
const HireBuilderCostElement = document.getElementById("builder-cost");
const IncreaseApartmentSizeCostElement = document.getElementById("apartment-cost");
const UpgradeClickerCostElement = document.getElementById("clickupgrade-cost");
const DealWithPoliticianCostElement = document.getElementById("politician-cost");

// UPDATING HTML TEXT CONTENT (the  counter spans)
function UpdateCounters() {
    //COUNTERS
    ApartmentsCountElement.textContent = ApartmentsCount;
    MoneyCountElement.textContent = MoneyCount;
    MoneyPerAptElement.textContent = MoneyPerApt;
    AptPerClickElement.textContent = AptPerClick;
    //timed event logic for updating during the event (broke with other methods)
    if (event) {
        BuilderCountElement.textContent = `${BuilderCount} ×${BuilderMultiplier}!`;
    } else {
        BuilderCountElement.textContent = BuilderCount;
    }
    //UPGRADES
    HireBuilderCostElement.textContent = HireBuilderCost;
    IncreaseApartmentSizeCostElement.textContent = IncreaseApartmentSizeCost;
    UpgradeClickerCostElement.textContent = UpgradeClickerCost;
    DealWithPoliticianCostElement.textContent = DealWithPoliticianCost; //timed event 
}

function BuildWithClick(){ // building an apartment with a click
    BuildApartment(AptPerClick);
}
function BuildApartment(amount){
    ApartmentsCount += amount;
    MoneyCount += MoneyPerApt * amount;
    UpdateCounters();
    CheckAchievements();
    SaveGame();
}

// UPGRADE LOGIC (Counters + upgrade buttons + timed event)

function IncreaseApartmentSize() {
    if (MoneyCount >= IncreaseApartmentSizeCost) {
        MoneyCount -= IncreaseApartmentSizeCost;
        MoneyPerApt += 1;
        IncreaseApartmentSizeCost = Math.floor(IncreaseApartmentSizeCost * 1.05);
        UpdateCounters();
        CheckAchievements();
        SaveGame();
    }
}
function UpgradeClick() {
    if (MoneyCount >= UpgradeClickerCost) {
        MoneyCount -= UpgradeClickerCost;
        AptPerClick += 1;
        UpgradeClickerCost = Math.floor(UpgradeClickerCost * 1.05);
        UpdateCounters();
        CheckAchievements();
        SaveGame();
    }
}
function HireBuilder() {
    if (MoneyCount >= HireBuilderCost) {
        MoneyCount -= HireBuilderCost;
        BuilderCount += 1;
        HireBuilderCost = Math.floor(HireBuilderCost * 1.05);
        UpdateCounters();
        CheckAchievements();
        SaveGame();
    }
}
setInterval(() => {
    BuildApartment(BuilderCount * BuilderMultiplier);// Each builder builds 1 apartment
    UpdateCounters();
}, 1000);

function DealWithPolitician() {
    if (MoneyCount >= DealWithPoliticianCost && !event && !cooldown) {
        MoneyCount -= DealWithPoliticianCost;
        DealWithPoliticianCost = Math.floor(DealWithPoliticianCost * 2);
        event = true;
        BuilderMultiplier = 10;
        DealWithPoliticianCount++;

        // EVENT TIMER 
        const eventTimer = document.getElementById("event-timer");
        eventTimer.style.display = "block";
        let eventStart = Date.now();
        let eventInterval = setInterval(() => {
            let elapsed = Math.floor((Date.now() - eventStart) / 1000);
            eventTimer.textContent = `Bribing Politician: ${elapsed}s elapsed`;
        }, 1000);
        
        setTimeout(() => {
            clearInterval(eventInterval);
            eventTimer.style.display = "none";
            BuilderMultiplier = 1;
            event = false;

            cooldown = true;
            const cooldownTimer = document.getElementById("cooldown-timer");
            cooldownTimer.style.display = "block";
            let cooldownStart = Date.now();
            let cooldownInterval = setInterval(() => {
                let elapsed = Math.floor((Date.now() - cooldownStart) / 1000);
                cooldownTimer.textContent = `Waiting For Protests To Stop: ${elapsed}s elapsed`;
            }, 1000);

            setTimeout(() => {
                clearInterval(cooldownInterval);
                cooldownTimer.style.display = "none";
                cooldown = false;
            }, 60000);
        }, 30000);

        UpdateCounters();
        CheckAchievements();
        SaveGame();
    }
}

// ACHIEVEMENT LOGIC (Counters + achievement unlocks + Popups)
const achievements = [
    { name: "Not Again!: ", threshold: 10, counter: () => ApartmentsCount, unlocked: false, description: "Reach 10 apartments" },
    { name: "Houses are Old School: ", threshold: 10000, counter: () => ApartmentsCount, unlocked: false, description: "Reach 10,000 apartments" },
    { name: "Concrete Over Country: ", threshold: 100000, counter: () => ApartmentsCount, unlocked: false, description: "Reach 100,000 apartments" },
    { name: "Who's Living in These??: ", threshold: 500000, counter: () => ApartmentsCount, unlocked: false, description: "Reach 500,000 apartments" },
    { name: "Pocket Money: ", threshold: 500000, counter: () => MoneyCount, unlocked: false, description: "Reach €500,000" },
    { name: "Have You Considered Charity?: ", threshold: 5000000, counter: () => MoneyCount, unlocked: false, description: "Reach €5M" },
    { name: "PLEASE Consider Charity: ", threshold: 50000000, counter: () => MoneyCount, unlocked: false, description: "Reach €50M" },
    { name: "Kick Back and Relax: ", threshold: 1, counter: () => BuilderCount, unlocked: false, description: "Hire 1 builder" },
    { name: "We’re Going to Need More Trucks: ", threshold: 100, counter: () => BuilderCount, unlocked: false, description: "Hire 100 builders" },
    { name: "At Least You're Creating Jobs: ", threshold: 200, counter: () => BuilderCount, unlocked: false, description: "Hire 200 builders" },
    { name: "Not What You Know but Who You Know: ", threshold: 2, counter: () => DealWithPoliticianCount, unlocked: false, description: "Deal with a politician... twice!" }
];


function CheckAchievements() {
    achievements.forEach(achievement => {
        if (!achievement.unlocked && achievement.counter() >= achievement.threshold) {
            UnlockAchievement(achievement); //calling function to unlock achievement
        }
    });
}

function UnlockAchievement(achievement) {
    achievement.unlocked = true;
    const AchievementElements = document.querySelectorAll('.achievement-name');
    AchievementElements.forEach(element => {
        if (element.textContent.includes(achievement.name)) {
            const AchievementItem = element.closest('.achievement-item');
            AchievementItem.classList.add('unlocked'); 
        }
    });

    //Popup
    const AchievementPopup = document.createElement('div');
    AchievementPopup.classList.add('achievement-popup');
    AchievementPopup.textContent = `Achievement unlocked: ${achievement.name}`;
    document.body.appendChild(AchievementPopup);


    setTimeout(() => {
        AchievementPopup.remove();
    }, 3000);
}
//to update the achievments upon refreshing visually, else only updated in JSON
function UpdateAchievementsUI()  {
    const container = document.querySelector('.achievements-list');
    container.innerHTML = ''; // Clear previous achievements

    achievements.forEach(achievement => {
        const item = document.createElement('div');
        item.classList.add('achievement-item');

        if (achievement.unlocked) {
            item.classList.add('unlocked'); // Add class if unlocked
        }

        // Create the achievement name span
        const name = document.createElement('span');
        name.classList.add('achievement-name');
        name.textContent = achievement.name;

        // Create the achievement description span
        const description = document.createElement('span');
        description.classList.add('achievement-description');
        description.textContent = achievement.description; // Adjust the text based on threshold or other data

        // Append the name and description to the achievement item
        item.appendChild(name);
        item.appendChild(description);

        // Append the achievement item to the container
        container.appendChild(item);
    });
}


// INTERACTION WITH NODE.JS BACKEND (save, load)
// SAVING
function SaveGame() {
    fetch('/SaveGame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            Counters: {
                ApartmentsCount,
                MoneyCount,
                MoneyPerApt,
                AptPerClick,
                BuilderCount,
                BuilderMultiplier,
                DealWithPoliticianCount
            },
            Achievements: achievements.map(a => ({ name: a.name, unlocked: a.unlocked }))
        })
    }).then(res => {
        if (!res.ok) console.error('Failed to save game');
    });
}

// LOADING
function LoadGame() {
    fetch('/LoadGame')
        .then(res => res.json())
        .then(data => {
            if (data.Counters) {
                ApartmentsCount = data.Counters.ApartmentsCount || 0;
                MoneyCount = data.Counters.MoneyCount || 0;
                MoneyPerApt = data.Counters.MoneyPerApt || 1;
                AptPerClick = data.Counters.AptPerClick || 1;
                BuilderCount = data.Counters.BuilderCount || 0;
                BuilderMultiplier = data.Counters.BuilderMultiplier || 1;
                DealWithPoliticianCount = data.Counters.DealWithPoliticianCount || 0;
            }

            if (Array.isArray(data.Achievements)) {
                data.Achievements.forEach(saved => {
                    const match = achievements.find(a => a.name === saved.name);
                    if (match) match.unlocked = saved.unlocked;
                });
            }

            UpdateCounters();
            CheckAchievements();
            UpdateAchievementsUI();
        });
}
window.onload = function(){
    LoadGame();
}; // calling the function to actually load the game 
