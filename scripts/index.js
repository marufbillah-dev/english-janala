const loadLessons = () => {
  const allLessonsUrl = "https://openapi.programming-hero.com/api/levels/all";

  fetch(allLessonsUrl)
    .then((response) => response.json())
    .then((json) => displayLessons(json.data));
};

const loadLessonWord = (id) => {
  const wordByLessons = `https://openapi.programming-hero.com/api/level/${id}`;

  fetch(wordByLessons)
    .then((response) => response.json())
    .then((words) => displayWordsByLesson(words.data));
};

const displayWordsByLesson = (words) => {
  // get the parent container of all card elements
  const cardContainer = document.getElementById("word-container");
  cardContainer.innerHTML = "";

  // conditional rendering for empty array or object
  if (words.length === 0) {
    cardContainer.innerHTML = `
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
            <button class="btn bg-[#1A91FF]/10 h-full text-[#374957] aspect-square text-2xl px-3"><i class="fa-solid fa-circle-info"></i></button>
            <button class="btn bg-[#1A91FF]/10 h-full text-[#374957] aspect-square text-2xl px-3"><i class="fa-solid fa-volume-high"></i></button>
        </div>
    `;

    // append all the wordCard element into the parent container
    cardContainer.appendChild(wordCard);
  });
};

const displayLessons = (lessons) => {
  // get the parent element of all lesson buttons
  const lessonsContainer = document.getElementById("lessons-container");

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
