const loadLessons = () => {
  const allLevelsUrl = "https://openapi.programming-hero.com/api/levels/all";

  fetch(allLevelsUrl)
    .then((response) => response.json())
    .then((json) => displayLessons(json.data));
};

const displayLessons = (lessons) => {
  lessons.forEach(lesson => {
    // get the parent element of all lesson buttons
    const lessonsContainer = document.getElementById("lessons-container");

    // create the lesson button element
    const lessonBtn = document.createElement("button");
    lessonBtn.className = "btn btn-outline btn-primary"; 
    lessonBtn.innerHTML = `<i class="fa-brands fa-leanpub"></i> Lesson - ${lesson.level_no}`

    // append button elements into the parent
    lessonsContainer.appendChild(lessonBtn);
  });
};

loadLessons();
