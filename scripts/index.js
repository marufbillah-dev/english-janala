const loadLessons = () => {
  const allLessonsUrl = "https://openapi.programming-hero.com/api/levels/all";

  fetch(allLessonsUrl)
    .then((response) => response.json())
    .then((json) => displayLessons(json.data));
};

const loadLessonWord = (id) => {
  // get word-container and no-lesson section
  const wordsSection = document.getElementById("words-for-lessons");
  const noLesson = document.getElementById("no-lesson");

  // onclick: show wordsSection and hide noLesson section
  wordsSection.classList.remove("hidden");
  noLesson.classList.add("hidden");

  const wordByLessons = `https://openapi.programming-hero.com/api/level/${id}`;

  fetch(wordByLessons)
    .then((response) => response.json())
    .then((words) => displayWordsByLesson(words.data));
};

const displayWordsByLesson = (words) => {
  // get the parent container of all card elements
  const cardContainer = document.getElementById("word-container");
  cardContainer.innerHTML = "";

  words.forEach((wordData) => {
    // create card element for fetch dynamic data into card
    const wordCard = document.createElement("div");
    wordCard.className = "p-14 bg-white rounded-xl";
    wordCard.innerHTML = `
        <div class="card-content space-y-6">
            <h3 class="text-[2rem] font-bold">${wordData.word}</h3>
            <p class="text-[1.25rem] font-medium">Meaning <span class="text-[#00BCFF] font-bold">/</span> Pronunciation</p>
            <h4 class="text-[#18181B] text-[2rem] font-semibold">${wordData.meaning} <span class="text-[#00BCFF] font-bold">/</span> ${wordData.pronunciation}</h4>
          </div>
    `;

    // append all the wordCard element into the parent container
    cardContainer.appendChild(wordCard);
  });
};

const displayLessons = (lessons) => {
  // get the parent element of all lesson buttons
  const lessonsContainer = document.getElementById("lessons-container");
  lessonsContainer.innerHTML = "";

  lessons.forEach((lesson) => {
    // create the lesson button element
    const lessonBtn = document.createElement("button");
    lessonBtn.className = "btn btn-outline btn-primary";
    lessonBtn.innerHTML = `<i class="fa-brands fa-leanpub"></i> Lesson - ${lesson.level_no}`;
    lessonBtn.setAttribute("onclick", `loadLessonWord(${lesson.level_no})`);

    // append button elements into the parent
    lessonsContainer.appendChild(lessonBtn);
  });
};

loadLessons();
