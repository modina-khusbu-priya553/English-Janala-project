// fetch lessons data

const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all") //promise of response
    .then((response) => response.json()) //promise of json data
    .then((data) => displayLessons(data.data)); //data is the json data, data.data is the array of lessons
     
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

        // add html

        btnDiv.innerHTML = `
        <button class="btn btn-outline btn-primary">
        <i class="fa-solid fa-book-open" style="color: rgb(66, 42, 213);">
        </i>lesson-${lesson.level_no}</button>
        `

        // append the child button to the parent lessonContainer
        lessonsContainer.appendChild(btnDiv);
    });
};

loadLessons();