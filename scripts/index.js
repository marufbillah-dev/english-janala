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

const loadLessons = () => {
  const allLessonsUrl = "https://openapi.programming-hero.com/api/levels/all";

  fetch(allLessonsUrl)
    .then((response) => response.json())
    .then((json) => displayLessons(json.data));
};

const loadLessonWord = (id) => {
  loadingSpinner(true);
  const wordByLessons = `https://openapi.programming-hero.com/api/level/${id}`;

  fetch(wordByLessons)
    .then((response) => response.json())
    .then((words) => {
      // set initial style for all the buttons
      const allLessonBtn = document.querySelectorAll(".lesson-btn");
      allLessonBtn.forEach((btn) => btn.classList.add("btn-outline"));

      // set active style on the clicked button
      const clickedBtn = document.getElementById(`lesson-btn-${id}`);
      clickedBtn.classList.remove("btn-outline");

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
    const synonymElement = synonyms.map(
      (synonym) =>
        `<span class="text-[1.25rem] font-normal bg-[#EDF7FF] rounded-lg px-5 py-1.5 w-fit">${synonym}</span>`,
    );
    return synonymElement.join(" ");
  };

  // get the parent element of word details
  const DetailsContainer = document.getElementById("details-container");
  DetailsContainer.innerHTML = `
        <div
              class="space-y-8 *:space-y-2.5 rounded-xl border border-[#EDF7FF] p-6 max-sm:p-3"
            >
              <div class="word">
                <h3 class="text-4xl font-semibold">
                  ${wordDetails.word} (<i class="fa-solid fa-microphone"></i> : ${wordDetails.pronunciation} )
                </h3>
              </div>
              <div class="meaning">
                <h4 class="text-2xl font-semibold">Meaning</h4>
                <p class="font-bangla text-2xl font-medium">${wordDetails.meaning}</p>
              </div>
              <div class="example">
                <h4 class="text-2xl font-semibold">Example</h4>
                <p class="text-2xl font-normal">
                  ${wordDetails.sentence}
                </p>
              </div>
              <div class="synonym">
                <h4 class="text-2xl font-semibold font-bangla">
                  সমার্থক শব্দ গুলো
                </h4>
                <div class="flex gap-4.5 flex-wrap" id="synonyms-container">
                  ${displaySynonyms(wordDetails.synonyms)}
                </div>
              </div>
            </div>
            <div class="modal-action justify-start">
              <form method="dialog">
                <button
                  class="btn btn-primary text-2xl font-normal text-white h-full px-9 py-1.5 rounded-xl font-bangla"
                >
                  Complete Learning
                </button>
              </form>
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
        <section class="py-18 bg-[#F8F8F8] rounded-3xl col-span-full">
          <div class="flex flex-col gap-4 items-center justify-center">
            <img src="./assets/alert-error.png" alt="" class="w-fit" />
            <p class="text-[#79716B] text-[1rem] font-normal font-bangla">
              এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
            </p>
            <h3 class="text-[#292524] text-[2.125rem] font-medium font-bangla">
              নেক্সট Lesson এ যান।
            </h3>
          </div>
        </section>
    `;
    loadingSpinner(false)
    return;
  }

  words.forEach((wordData) => {
    // create card element for fetch dynamic data into card
    const wordCard = document.createElement("div");
    wordCard.className =
      "p-14 max-sm:p-7 max-lg:p-10 flex flex-col justify-between gap-14 bg-white rounded-xl shadow-sm";
    wordCard.innerHTML = `
        <div class="card-content space-y-6">
            <h3 class="text-[2rem] font-bold">${wordData.word ? wordData.word : "শব্দ পাওয়া যায়নি!"}</h3>
            <p class="text-[1.25rem] font-medium">Meaning <span class="text-[#00BCFF] font-bold">/</span> Pronunciation</p>
            <h4 class="text-[#18181B] text-[2rem] font-semibold font-bangla">"${wordData.meaning ? wordData.meaning : "অর্থ পাওয়া যায়নি!"} <span class="text-[#00BCFF] font-bold">/</span> ${wordData.pronunciation ? wordData.pronunciation : "উচ্চারণ পাওয়া যায়নি!"}"</h4>
        </div>
        <div class="card-btns flex justify-between">
            <button class="btn bg-[#1A91FF]/10 h-full text-[#374957] aspect-square text-2xl px-3" onclick="loadWordDetails(${wordData.id})"><i class="fa-solid fa-circle-info"></i></button>
            <button class="btn bg-[#1A91FF]/10 h-full text-[#374957] aspect-square text-2xl px-3"><i class="fa-solid fa-volume-high"></i></button>
        </div>
    `;

    // append all the wordCard element into the parent container
    wordContainer.appendChild(wordCard);
  });
  loadingSpinner(false)
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
