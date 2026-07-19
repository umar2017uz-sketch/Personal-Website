/*==========================================================
                GLOBAL PAGE ANIMATIONS
==========================================================*/

document.addEventListener('DOMContentLoaded', () => {

    /*======================================================
                    HOME PAGE ANIMATIONS
    ======================================================*/

    const panels = document.querySelectorAll('.panel');
    const navDots = document.querySelectorAll('.navDot');

    // Fade-in animation
    if (panels.length > 0) {

        const observer = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }

            });

        }, { threshold: 0.35 });

        panels.forEach(panel => observer.observe(panel));
    }

    // Active sidebar dot (THIS WAS MISSING)
    if (navDots.length > 0 && panels.length > 0) {

        const navObserver = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                navDots.forEach(dot =>
                    dot.classList.remove('active')
                );

                const id = entry.target.getAttribute('id');

                const activeDot = document.querySelector(
                    `.navDot[href="#${id}"]`
                );

                if (activeDot) {
                    activeDot.classList.add('active');
                }

            });

        }, { threshold: 0.6 });

        panels.forEach(panel => navObserver.observe(panel));
    }


    /*======================================================
                    TRIVIA QUIZ
    ======================================================*/

    if (document.querySelector('.quizCard')) {

        initializeTrivia();

    }

});


/*==========================================================
                TRIVIA INITIALIZATION
==========================================================*/

function initializeTrivia() {

    /*======================================================
                        QUESTION DATA
    ======================================================*/

    const questions = [

        {
            category: 'HTML Fundamentals',
            question: 'What does HTML primarily control in a webpage?',
            answers: [
                'Page structure and content',
                'Database connections',
                'Server operating systems',
                'Internet speed optimization'
            ],
            correct: 0
        },

        {
            category: 'CSS Layout',
            question: 'Which CSS property creates a Flexbox container?',
            answers: [
                'justify-content',
                'display: flex',
                'align-items',
                'position: relative'
            ],
            correct: 1
        },

        {
            category: 'JavaScript Basics',
            question: 'What is the result of 2 + "2" in JavaScript?',
            answers: [
                '4',
                '22',
                'NaN',
                'undefined'
            ],
            correct: 1
        },

        {
            category: 'DOM Manipulation',
            question: 'Which method selects an element by its ID?',
            answers: [
                'querySelectorAll()',
                'getElementsByClassName()',
                'getElementById()',
                'createElement()'
            ],
            correct: 2
        },

        {
            category: 'Software Engineering',
            question: 'What is the primary purpose of Git?',
            answers: [
                'Styling web pages',
                'Managing databases',
                'Version control and collaboration',
                'Hosting websites'
            ],
            correct: 2
        }

    ];


    /*======================================================
                        STATE
    ======================================================*/

    let currentQuestion = 0;

    let score = 0;

    let answered = false;


    /*======================================================
                        ELEMENTS
    ======================================================*/

    const questionSlide = document.getElementById('questionSlide');

    const resultSlide = document.getElementById('resultSlide');

    const questionCategory = document.getElementById('questionCategory');

    const questionText = document.getElementById('questionText');

    const answersContainer = document.getElementById('answersContainer');

    const feedbackMessage = document.getElementById('feedbackMessage');

    const nextButton = document.getElementById('nextButton');

    const currentQuestionEl = document.getElementById('currentQuestion');

    const scoreEl = document.getElementById('score');

    const progressBar = document.getElementById('progressBar');

    const finalScoreEl = document.getElementById('finalScore');

    const resultMessageEl = document.getElementById('resultMessage');

    const correctCountEl = document.getElementById('correctCount');

    const percentageEl = document.getElementById('percentage');

    const restartButton = document.getElementById('restartButton');

    const factText = document.getElementById('factText');


    /*======================================================
                        FACTS
    ======================================================*/

    const facts = [

        'JavaScript was created in just 10 days in 1995.',

        'CSS stands for Cascading Style Sheets.',

        'HTML is not a programming language; it is a markup language.',

        'Git was originally created by Linus Torvalds.',

        'Modern browsers can execute JavaScript at incredibly high speeds.'

    ];


    /*======================================================
                    LOAD QUESTION
    ======================================================*/

    function loadQuestion(index) {

        const q = questions[index];

        // Update top bar
        currentQuestionEl.textContent = index + 1;

        scoreEl.textContent = score;

        progressBar.style.width =
            `${((index + 1) / questions.length) * 100}%`;

        // Reset state
        answered = false;

        feedbackMessage.textContent = '';

        feedbackMessage.className = 'feedbackMessage';

        nextButton.classList.remove('show');

        // Set question content
        questionCategory.textContent = q.category;

        questionText.textContent = q.question;

        // Create answer buttons
        answersContainer.innerHTML = '';

        q.answers.forEach((answer, i) => {

            const button = document.createElement('button');

            button.className = 'answerButton';

            button.dataset.index = i;

            button.innerHTML = `
                <span class="answerLetter">
                    ${String.fromCharCode(65 + i)}
                </span>

                <span class="answerContent">
                    ${answer}
                </span>
            `;

            button.addEventListener('click', () =>
                selectAnswer(i, button));

            answersContainer.appendChild(button);

        });

        // Update fact panel
        factText.textContent = facts[index];

    }


    /*======================================================
                    SELECT ANSWER
    ======================================================*/

    function selectAnswer(selectedIndex, selectedButton) {

        if (answered) return;

        answered = true;

        const q = questions[currentQuestion];

        const buttons =
            answersContainer.querySelectorAll('.answerButton');

        buttons.forEach(btn => btn.classList.add('disabled'));

        // Correct answer
        if (selectedIndex === q.correct) {

            score++;

            scoreEl.textContent = score;

            selectedButton.classList.add('correct');

            feedbackMessage.textContent =
                '✓ Correct! Great job.';

            feedbackMessage.classList.add('correct');

        }

        // Wrong answer
        else {

            selectedButton.classList.add('incorrect');

            buttons[q.correct].classList.add('correct');

            feedbackMessage.textContent =
                '✗ Incorrect. The highlighted answer is correct.';

            feedbackMessage.classList.add('incorrect');

        }

        // Show continue button
        nextButton.classList.add('show');

    }


    /*======================================================
                    SLIDE TRANSITION
    ======================================================*/

function slideToNext() {

    const oldSlide = document.getElementById('questionSlide');

    // Animate current slide out
    oldSlide.classList.add('slide-exit-active');

    setTimeout(() => {

        // Move to next question
        currentQuestion++;

        // If quiz is finished
        if (currentQuestion >= questions.length) {

            oldSlide.remove();
            showResults();
            return;
        }

        // Create a completely new slide from scratch
        const q = questions[currentQuestion];

        const newSlide = document.createElement('div');
        newSlide.className = 'questionSlide slide-enter';
        newSlide.id = 'questionSlide';

        newSlide.innerHTML = `
            <div class="questionCategory" id="questionCategory">
                ${q.category}
            </div>

            <h2 class="questionText" id="questionText">
                ${q.question}
            </h2>

            <div class="answersContainer" id="answersContainer">
                ${q.answers.map((answer, i) => `
                    <button class="answerButton" data-index="${i}">
                        <span class="answerLetter">
                            ${String.fromCharCode(65 + i)}
                        </span>
                        <span class="answerContent">
                            ${answer}
                        </span>
                    </button>
                `).join('')}
            </div>

            <div class="feedbackMessage" id="feedbackMessage"></div>

            <div class="questionActions">
                <button id="nextButton" class="nextButton">
                    Next Question
                    <span class="arrow">→</span>
                </button>
            </div>
        `;

        // Add new slide to viewport
        document.getElementById('questionViewport').appendChild(newSlide);

        // Remove old slide
        oldSlide.remove();

        // Trigger entrance animation
        requestAnimationFrame(() => {
            newSlide.classList.add('slide-enter-active');
            newSlide.classList.remove('slide-enter');
        });

        // Mark as active after animation
        setTimeout(() => {
            newSlide.classList.remove('slide-enter-active');
            newSlide.classList.add('active');
        }, 40);

        // Re-select elements INSIDE the new slide
        const newButtons = newSlide.querySelectorAll('.answerButton');
        const newNextButton = newSlide.querySelector('#nextButton');
        const newFeedback = newSlide.querySelector('#feedbackMessage');

        // Update top bar and progress
        currentQuestionEl.textContent = currentQuestion + 1;
        progressBar.style.width =
            `${((currentQuestion + 1) / questions.length) * 100}%`;
        factText.textContent = facts[currentQuestion];

        // Reset state
        answered = false;

        // Attach click listeners to the NEW buttons
        newButtons.forEach((btn, i) => {

            btn.addEventListener('click', () => {

                if (answered) return;
                answered = true;

                newButtons.forEach(b => b.classList.add('disabled'));

                if (i === q.correct) {

                    score++;
                    scoreEl.textContent = score;

                    btn.classList.add('correct');

                    newFeedback.textContent =
                        '✓ Correct! Great job.';
                    newFeedback.classList.add('correct');

                }

                else {

                    btn.classList.add('incorrect');
                    newButtons[q.correct].classList.add('correct');

                    newFeedback.textContent =
                        '✗ Incorrect. The highlighted answer is correct.';
                    newFeedback.classList.add('incorrect');

                }

                // Show next button
                newNextButton.classList.add('show');

            });

        });

        // Attach next button listener
        newNextButton.addEventListener('click', slideToNext);

    }, 150);
}


    /*======================================================
                    SHOW RESULTS
    ======================================================*/

    function showResults() {

        // Hide question slide
        questionSlide.classList.remove('active');

        questionSlide.classList.add('hidden');

        // Show result slide
        resultSlide.classList.remove('hidden');

        resultSlide.classList.add('active', 'slide-enter');

        requestAnimationFrame(() => {

            resultSlide.classList.add('slide-enter-active');

            resultSlide.classList.remove('slide-enter');

        });

        // Calculate stats
        const percentage =
            Math.round((score / questions.length) * 100);

        finalScoreEl.textContent = score;

        correctCountEl.textContent = score;

        percentageEl.textContent = `${percentage}%`;

        // Result message
        if (score === 5) {

            resultMessageEl.textContent =
                'Outstanding! You have an excellent understanding of web development fundamentals.';

        }

        else if (score === 4) {

            resultMessageEl.textContent =
                'Excellent work! You have strong web development knowledge with only a few minor mistakes.';

        }

        else if (score === 3) {

            resultMessageEl.textContent =
                'Good effort! You understand the basics and are on the right track to becoming a skilled developer.';

        }

        else {

            resultMessageEl.textContent =
                'Keep learning! Every developer starts somewhere, and practice is the fastest way to improve.';

        }

    }


    /*======================================================
                    RESTART QUIZ
    ======================================================*/

    function restartQuiz() {

        currentQuestion = 0;

        score = 0;

        // Hide results
        resultSlide.classList.add('hidden');

        resultSlide.classList.remove('active');

        // Show questions again
        questionSlide.classList.remove('hidden');

        questionSlide.classList.add('active', 'slide-enter');

        loadQuestion(0);

        requestAnimationFrame(() => {

            questionSlide.classList.add('slide-enter-active');

            questionSlide.classList.remove('slide-enter');

        });

        setTimeout(() => {

            questionSlide.classList.remove('slide-enter-active');

        }, 450);

    }


    /*======================================================
                    EVENT LISTENERS
    ======================================================*/

    nextButton.addEventListener('click', slideToNext);

    restartButton.addEventListener('click', restartQuiz);


    /*======================================================
                    START QUIZ
    ======================================================*/

    loadQuestion(0);

}