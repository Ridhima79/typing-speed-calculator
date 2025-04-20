// Get references to DOM elements
const quoteDisplay    = document.getElementById("quoteDisplay");
const quoteInput      = document.getElementById("quoteInput");
const timerElement    = document.getElementById("timer");
const wpmElement      = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const mistakesElement = document.getElementById("mistakes");
const toggleDarkModeButton = document.getElementById("toggleDarkMode");

// Predefined paragraphs
const paragraphs = [
  `The quick brown fox jumps over the lazy dog. JavaScript is a versatile and powerful language used for building interactive websites. Typing tests can help you improve your speed and accuracy by practicing regularly. Always remember to keep your hands in the correct position and maintain a consistent rhythm. The more you practice, the better you will get at typing long passages without looking at the keyboard. Speed is important, but accuracy is key when it comes to typing effectively.`,
  `Technology is evolving at a rapid pace, and we are witnessing breakthroughs in artificial intelligence, machine learning, and data science. These advancements are shaping the future and have the potential to revolutionize various industries. It is important for individuals and organizations to stay informed and adapt to these changes to stay competitive in today's fast-paced world.`,
  `The world of programming is vast and ever-changing. With new languages, frameworks, and tools emerging every day, developers have a wealth of options to choose from. It can be overwhelming at times, but the key to success is perseverance and continuous learning. As the tech landscape evolves, so too must the skills and knowledge of developers.`,
  `Healthy eating and regular exercise are essential components of maintaining a balanced and fulfilling lifestyle. A nutritious diet can improve physical health, boost energy levels, and enhance mental well-being. Similarly, staying active through exercise helps to reduce the risk of chronic diseases and promotes overall health.`
];

let currentParagraph = "";
let totalTime        = 0;
let timeLeft         = 0;
let intervalId       = null;
let mistakes         = 0;

// Pick a random paragraph
function getRandomParagraph() {
  return paragraphs[Math.floor(Math.random() * paragraphs.length)];
}

// Start test with X minutes
function startTest(minutes) {
  resetTest();
  totalTime = minutes * 60;
  timeLeft  = totalTime;

  quoteInput.disabled = false;
  quoteInput.value    = "";
  quoteInput.focus();

  currentParagraph      = getRandomParagraph();
  quoteDisplay.innerText = currentParagraph;
  timerElement.innerText = timeLeft;

  intervalId = setInterval(() => {
    if (timeLeft <= 0) {
      endTest();
    } else {
      timeLeft--;
      timerElement.innerText = timeLeft;
    }
  }, 1000);
}

// End test, compute WPM & accuracy
function endTest() {
  clearInterval(intervalId);
  quoteInput.disabled = true;

  const inputWords   = quoteInput.value.trim().split(/\s+/).filter(w => w);
  const typedCount   = inputWords.length;
  const correctCount = countCorrectWords(inputWords);

  const wpm      = Math.round((correctCount / totalTime) * 60);
  const accuracy = typedCount > 0
                   ? Math.round((correctCount / typedCount) * 100)
                   : 0;

  wpmElement.innerText      = wpm;
  accuracyElement.innerText = accuracy;
  mistakesElement.innerText = mistakes;
}

// Reset state and UI
function resetTest() {
  clearInterval(intervalId);
  timerElement.innerText    = "0";
  quoteInput.disabled       = true;
  quoteInput.value          = "";
  quoteDisplay.innerText    = "";
  wpmElement.innerText      = "0";
  accuracyElement.innerText = "100";
  mistakesElement.innerText = "0";
  mistakes = 0;
}

// New input handler: always show the full paragraph, coloring each word
quoteInput.addEventListener("input", () => {
  const inputWords     = quoteInput.value.trim().split(/\s+/).filter(w => w);
  const paragraphWords = currentParagraph.split(/\s+/);

  mistakes = 0;
  let rendered = "";

  paragraphWords.forEach((word, idx) => {
    if (idx < inputWords.length) {
      // highlight the entire word, not just what's typed
      if (inputWords[idx] === word) {
        rendered += `<span class="correct">${word}</span> `;
      } else {
        rendered += `<span class="incorrect">${word}</span> `;
        mistakes++;
      }
    } else {
      rendered += word + " ";
    }
  });

  quoteDisplay.innerHTML = rendered.trim();
});

// Count how many words exactly match
function countCorrectWords(inputWords) {
  const paragraphWords = currentParagraph.split(/\s+/);
  let correct = 0;
  inputWords.forEach((w, i) => {
    if (w === paragraphWords[i]) correct++;
  });
  return correct;
}

// Dark Mode Toggle Function
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  // Change button text based on current mode
  if (document.body.classList.contains("dark-mode")) {
    toggleDarkModeButton.innerText = "🎀 white Mode";
  } else {
    toggleDarkModeButton.innerText = "🍭 pink Mode";
  }
}
