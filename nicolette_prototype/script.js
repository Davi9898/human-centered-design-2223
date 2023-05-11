let sections = document.querySelectorAll('section');

let upButton = document.querySelector('.up');
let downButton = document.querySelector('.down');
let copyButton = document.querySelector('.copy');
let earthquakeButton = document.querySelector('.earthquake');

upButton.addEventListener('click', scrollUp);
downButton.addEventListener('click', scrollDown);
copyButton.addEventListener('click', copyText);
earthquakeButton.addEventListener('click', shuffleSections);

let currentSection = null;  
let isShuffling = false; 

function scrollUp() {
    let currentScrollPosition = window.scrollY || document.documentElement.scrollTop;
    for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].offsetTop < currentScrollPosition) {
            window.scrollTo({
                top: sections[i].offsetTop,
                behavior: 'smooth'
            });
            currentSection = sections[i];  // Update current section
            break;
        }
    }
}

function scrollDown() {
    let currentScrollPosition = window.scrollY || document.documentElement.scrollTop;
    for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop > currentScrollPosition + 1) {  // Add 1 to avoid precision issues
            window.scrollTo({
                top: sections[i].offsetTop,
                behavior: 'smooth'
            });
            currentSection = sections[i];  // Update current section
            break;
        }
    }
}

async function copyText() {
    if(currentSection){
        let copiedText = currentSection.innerText;
        await navigator.clipboard.writeText(copiedText);
        let sectionTitle = currentSection.querySelector('h2').innerText;
        showNotification(sectionTitle);
    }
}

function showNotification(sectionTitle) {
    let notification = document.getElementById('notification');
    notification.innerText = ` ${sectionTitle} gekopieerd naar het clipboard!`;
    notification.classList.remove('hidden');
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 4000);
}

let observer = new IntersectionObserver((entries) => {
    if (!isShuffling) {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                currentSection = entry.target;
            }
        });
    }
}, {threshold: 0.5});

sections.forEach(section => {
    observer.observe(section);
});

function shuffleSections() {
    let sectionsArray = Array.from(sections);
    sectionsArray.sort(() => Math.random() - 0.5);
    let parent = sections[0].parentNode;
    document.body.classList.add('earthquake');
    observer.disconnect();
    isShuffling = true;
    sectionsArray.forEach(section => {
        parent.appendChild(section);
    });
    sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
    setTimeout(() => {
        document.body.classList.remove('earthquake');
        isShuffling = false;
    }, 1000);
    setTimeout(() => {
        // Calculate the new current section
        let currentScrollPosition = window.scrollY || document.documentElement.scrollTop;
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].getBoundingClientRect().top >= 0) {
                currentSection = sections[i];
                break;
            }
        }
    }, 1100);  // Run this a bit later than the earthquake class removal
}

if (annyang) {
    // Define the commands
    var commands = {
        'scroll omhoog': function() {
            scrollUp();
        },
        'scroll naar beneden': function() {
            scrollDown();
        },
        'kopieer': function() {  // Use the Dutch word for "copy"
            copyText();
        },
        'aardbeving': function() {
            shuffleSections();
        }
    };

    // Add the commands to annyang
    annyang.addCommands(commands);

    // Set the language to Dutch
    annyang.setLanguage('nl-NL');

    // Start listening
    annyang.start();
}