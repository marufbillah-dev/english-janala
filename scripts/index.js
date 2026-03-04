const loadingSpinner = (status) => {
  const spinner = document.getElementById("spinner");
  const wordContainer = document.getElementById("word-container");

  if (status === true) {
    spinner.classList.remove("hidden");
    wordContainer.classList.add("hidden");
  } else {
    wordContainer.classList.remove("hidden");
    spinner.classList.add("hidden");
  }
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const removeActive = () => {
  // set initial style for all the buttons
  const allLessonBtn = document.querySelectorAll(".lesson-btn");
  allLessonBtn.forEach((btn) => btn.classList.add("btn-outline"));
};

const loadLessons = () => {
  const allLessonsUrl = "https://openapi.programming-hero.com/api/levels/all";

  fetch(allLessonsUrl)
    .then((response) => response.json())
    .then((json) => displayLessons(json.data));
};

const loadLessonWord = (id) => {
  // remove all lesson buttons active styles
  removeActive();

  // set active style on the clicked button
  const clickedBtn = document.getElementById(`lesson-btn-${id}`);
  clickedBtn.classList.remove("btn-outline");

  loadingSpinner(true);

  const wordByLessons = `https://openapi.programming-hero.com/api/level/${id}`;

  fetch(wordByLessons)
    .then((response) => response.json())
    .then((words) => {
      displayWordsByLesson(words.data);
    });
};

const loadWordDetails = (id) => {
  const wordDetailsUrl = `https://openapi.programming-hero.com/api/word/${id}`;

  fetch(wordDetailsUrl)
    .then((response) => response.json())
    .then((wordDetails) => {
      displayWordDetails(wordDetails.data);
    });
};

const displayWordDetails = (wordDetails) => {
  // display synonyms dynamically
  const displaySynonyms = (synonyms) => {
    return synonyms.map(
      (synonym) =>
        `<span class="badge badge-primary badge-outline badge-lg font-medium p-4">${synonym}</span>`
    ).join("");
  };

   // get the parent element of word details
  const DetailsContainer = document.getElementById("details-container");
  DetailsContainer.innerHTML = `
    <div class="relative">
      <div class="bg-primary p-8 text-primary-content">
        <h3 class="text-4xl font-bold mb-2 capitalize">
          ${wordDetails.word}
        </h3>
        <p class="text-xl opacity-90 italic">
          <i class="fa-solid fa-volume-high mr-2"></i> ${wordDetails.pronunciation}
        </p>
      </div>
      
      <div class="p-8 space-y-8 bg-base-100">
        <div class="meaning border-l-4 border-primary pl-4">
          <h4 class="text-sm uppercase tracking-widest opacity-50 font-bold mb-1">Meaning</h4>
          <p class="font-bangla text-2xl font-semibold text-base-content">${wordDetails.meaning}</p>
        </div>

        <div class="example bg-base-200 p-6 rounded-2xl">
          <h4 class="text-sm uppercase tracking-widest opacity-50 font-bold mb-2">Example Sentence</h4>
          <p class="text-xl italic font-serif">"${wordDetails.sentence}"</p>
        </div>

        <div class="synonym">
          <h4 class="text-sm uppercase tracking-widest opacity-50 font-bold mb-3 font-bangla">সমার্থক শব্দ গুলো</h4>
          <div class="flex gap-2 flex-wrap" id="synonyms-container">
            ${displaySynonyms(wordDetails.synonyms)}
          </div>
        </div>

        <div class="modal-action mt-0 pt-4">
          <form method="dialog" class="w-full">
            <button class="btn btn-primary w-full shadow-lg shadow-primary/20">
              <i class="fa-solid fa-check-double"></i> Complete Learning
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

   // get the modal element by id and call the modal ()
  document.getElementById("word_details_modal").showModal();
};

const displayWordsByLesson = (words) => {
  // get the parent container of all card elements
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  // conditional rendering for empty array or object
  if (words.length === 0) {
    wordContainer.innerHTML = `
        <section class="py-20 bg-base-200/50 rounded-[2.5rem] col-span-full border-2 border-dashed border-base-300">
          <div class="flex flex-col gap-6 items-center justify-center text-center px-4">
            <div class="w-20 h-20 bg-error/10 flex items-center justify-center rounded-full">
                <i class="fa-solid fa-circle-exclamation text-error text-4xl"></i>
            </div>
            <div>
                <p class="text-lg font-bangla opacity-70">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h3 class="text-3xl font-bold font-bangla mt-2">নেক্সট Lesson এ যান।</h3>
            </div>
          </div>
        </section>
    `;
    loadingSpinner(false);
    return;
  }

  words.forEach((wordData) => {
    // create card element for fetch dynamic data into card
    const wordCard = document.createElement("div");
    wordCard.className = "group p-8 flex flex-col justify-between gap-8 bg-base-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-base-200";
    
    wordCard.innerHTML = `
        <div class="card-content space-y-4">
            <div class="flex justify-between items-start">
                <h3 class="text-3xl font-bold text-primary capitalize">${wordData.word || "Unknown"}</h3>
                <span class="badge badge-ghost font-mono opacity-50">#${wordData.id}</span>
            </div>
            <div class="space-y-1">
                <p class="text-xs uppercase tracking-tighter font-bold opacity-40">Meaning & Pronunciation</p>
                <h4 class="text-xl font-semibold font-bangla leading-relaxed">
                    ${wordData.meaning || "Not Found"} 
                    <span class="mx-2 text-primary/30">|</span> 
                    <span class="text-base font-normal italic opacity-70">${wordData.pronunciation || "N/A"}</span>
                </h4>
            </div>
        </div>
        <div class="card-btns flex gap-3 pt-4 border-t border-base-100">
            <button class="btn btn-circle btn-primary btn-outline flex-1 hover:text-white" onclick="loadWordDetails(${wordData.id})">
                <i class="fa-solid fa-circle-info"></i> Details
            </button>
            <button class="btn btn-circle btn-secondary btn-outline aspect-square" onclick="pronounceWord('${wordData.word}')">
                <i class="fa-solid fa-volume-high"></i>
            </button>
        </div>
    `;

    // append all the wordCard element into the parent container
    wordContainer.appendChild(wordCard);
  });
  loadingSpinner(false);
};

const displayLessons = (lessons) => {
  // get the parent element of all lesson buttons
  const lessonsContainer = document.getElementById("lessons-container");

  lessons.forEach((lesson) => {
    // create the lesson button element
    const lessonBtn = document.createElement("button");
    lessonBtn.className = "btn btn-outline btn-primary lesson-btn";
    lessonBtn.innerHTML = `<i class="fa-brands fa-leanpub"></i> Lesson - ${lesson.level_no}`;
    lessonBtn.setAttribute("onclick", `loadLessonWord(${lesson.level_no})`);
    lessonBtn.setAttribute("id", `lesson-btn-${lesson.level_no}`);

    // append button elements into the parent
    lessonsContainer.appendChild(lessonBtn);
  });
};

loadLessons();

let allWords = [];
fetch("https://openapi.programming-hero.com/api/words/all")
  .then((res) => res.json())
  .then((data) => {
    allWords = data.data;
  });

const searchVocabulary = () => {
  loadingSpinner(true);
  removeActive();

  const searchInputElement = document.getElementById("search-input");
  const searchValue = searchInputElement.value.trim().toLowerCase();

  const filteredWords = allWords.filter((wordObj) =>
    wordObj.word.toLowerCase().includes(searchValue),
  );

  displayWordsByLesson(filteredWords);

  const wordContainer = document.getElementById("word-container");

  if (filteredWords.length === 0) {
    wordContainer.innerHTML = `
      <section class="py-18 bg-[#F8F8F8] rounded-3xl col-span-full">
        <div class="flex flex-col gap-4 items-center justify-center">
          <div class="w-20 h-20 bg-error/10 flex items-center justify-center rounded-full">
                <i class="fa-solid fa-circle-exclamation text-error text-4xl"></i>
            </div>
          <p>
            The word "<b>${searchValue}</b>" not found!
          </p>
        </div>
      </section>
    `;
  }

  loadingSpinner(false);
};
document
  .getElementById("search-input")
  .addEventListener("input", searchVocabulary);