//function for words synonyms
const loadSynonyms = (arr) => {

    // map for array to get all the words in the array
    const synonyms = arr.map((element) =>`<span class="badge bg-sky-100 p-4">${element}</span>`);
    return synonyms.join(" ");
}

// Speaker function for word pronunciation
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

// loading spinner function
const manageLoading = (status) => {
    const loadingSpinner = document.getElementById("spinner");
    if(status == true){
        loadingSpinner.classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    }else{
        loadingSpinner.classList.add("hidden");
        document.getElementById("word-container").classList.remove("hidden");
    }
};


// fetch lessons data

const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all") //promise of response
    .then((response) => response.json()) //promise of json data
    .then((data) => displayLessons(data.data)); //data is the json data, data.data is the array of lessons
     
};

// function for removing active class from all buttons when a button is clicked, so that only the clicked button will have the active class
const removeActive = () => {
    const lessonButtons = document.querySelectorAll(".lesson-btn");

    // loop through all the buttons and remove the active class
    lessonButtons.forEach((btn) => btn.classList.remove("active"));
};

// fetch words by level_no and make the level_no as id  dynamic by passing it as an argument to the function
const loadLevelWords = (id) => {

    manageLoading(true); // show loading spinner when the function is called

    // ** id is the level_no of the lesson, it will be passed as an argument when the button is clicked
    const url =`https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then((response) => response.json())
    .then((data) => {

        removeActive(); // remove active class from all buttons before adding active class to the clicked button
        const clickBtn = document.getElementById(`lessons-btn-${id}`);
        
        // add active class to the clicked button
        clickBtn.classList.add("active");
        displayWords(data.data);
    });
};

// display words in the UI and get word id when the info button is clicked and pass it as an argument to the loadWordDetails function 

const displayWords = (words) => {

    const wordContainer = document.getElementById("word-container");

    wordContainer.innerHTML ="";

    // if there is no word in the lesson, then show a message to the user
    if(words.length === 0){
        wordContainer.innerHTML = `
        <div class="text-center col-span-full space-y-3 py-10">
            <img src ="./assets/alert-error.png" alt="alert error" class="mx-auto">
            <P class="font-bangla text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</P>
            <h2 class="text-5xl font-medium font-bangla">নেক্সট Lesson এ যান</h2>
        </div>
        `;
        manageLoading(false); // hide loading spinner when there is no word in the lesson
        return;
    };


    words.forEach((word) => {
        const card = document.createElement("div");
        card.innerHTML =`
        <div class="bg-white text-center py-10 px-5 rounded-lg shadow-sm space-y-4">
            <h2 class="font-bold text-2xl">${word.word? word.word: "Word not available"}</h2>
            <p class="font-semibold">Meaning / Pronunciation</p>
            <div class="font-bangla text-2xl font-medium">"${word.meaning? word.meaning: "Meaning not available"} / ${word.pronunciation? word.pronunciation: "Pronunciation not available"}"</div>
            <div class="flex justify-between items-center">

                <button onclick="loadWordDetails(${word.id})" class="btn bg-sky-100 hover:bg-sky-200">
                <i class="fa-solid fa-circle-info"></i></button>
                <button onclick="pronounceWord('${word.word}')" class="btn  bg-sky-100 hover:bg-sky-200"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
        `
        wordContainer.appendChild(card);
        manageLoading(false); // hide loading spinner when the words are displayed in the UI
    });
};

// fetch word details by word id and make the word id as dynamic by passing it as an argument to the function
const loadWordDetails = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const response = await fetch(url);
    const details = await response.json();
    
    displayWordDetails(details.data);
};

// display word details in the UI
const displayWordDetails = (details) => {

    const detailsContainer = document.getElementById("details-container");
    detailsContainer.innerHTML = `
    <div class="bg-slate-50 shadow-sm rounded-lg space-y-6 p-4">
            <h2 class="font-semibold text-xl">${details.word} (<i class="fa-solid fa-microphone-lines"></i>:ইগার)</h2>
            <div class="space-y-2">
                <h3 class="font-semibold text-sm">Meaning</h3>
                <p>"${details.meaning? details.meaning: "Meaning not available"}"</p>

            </div>
            <div class="space-y-2">
                <h3 class="font-semibold text-sm">Example</h3>
                <p>"${details.sentence? details.sentence: "Example not available"}"</p>
            </div>
            
            <div class="space-y-2">
                <p class="font-bangla font-semibold">সমার্থক শব্দ গুলো</p>
                <div class="">${loadSynonyms(details.synonyms? details.synonyms: ["Synonyms not available"])}</div>
            </div>

        </div>
    
    `;

    document.getElementById("word_modal").showModal();

};


// display lessons in the UI

const displayLessons = (lessons) => {

    // 1. get the container element and empty it
    const lessonsContainer = document.getElementById("lessons-container");
    lessonsContainer.innerHTML = "";

    // 2. loop through the lessons and create a card for each lesson
    lessons.forEach((lesson) => {
        // create a div element for the card
        const btnDiv = document.createElement("div");

        // add html content to the button

// ** onclick event will call the loadLevelWords function with the level_no as argument when the button is clicked, and the button id is also dynamic based on the level_no
        btnDiv.innerHTML = `
        <button 
            id="lessons-btn-${lesson.level_no}" 
            onclick="loadLevelWords(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"> 
        <i class="fa-solid fa-book-open" style="color: rgb(66, 42, 213);">
        </i>lesson-${lesson.level_no}</button>
        `

        // append the child button to the parent lessonContainer
        lessonsContainer.appendChild(btnDiv);
    });
};

loadLessons();

