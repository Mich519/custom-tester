class Question {

    constructor(description, answer1, answer2, answer3, answer4) {
        this.questionDOMElement = this.#createQuestionDomElement(description, answer1, answer2, answer3, answer4);
    }

    #createQuestionDomElement(description, answer1, answer2, answer3, answer4) {
        const questionContainer = document.createElement("div");
        questionContainer.setAttribute("id", "question-container");

        // create description DOM element
        const descriptionContainer = document.createElement("div");
        descriptionContainer.setAttribute("id", "description-container");

        const descriptionElement = document.createElement("p");
        descriptionElement.innerHTML = description;
        descriptionContainer.appendChild(descriptionElement);

        this.answerCheckboxes = []

        // create answer DOM elements
        this.answerElements = [
            this.#createAnswerDOMElement(answer1, true),
            this.#createAnswerDOMElement(answer2, false),
            this.#createAnswerDOMElement(answer3, false),
            this.#createAnswerDOMElement(answer4, false)
        ];

        this.answerElements = this.answerElements.sort((a, b) => 0.5 - Math.random());

        questionContainer.appendChild(descriptionContainer);
        this.answerElements.forEach(e => questionContainer.appendChild(e))

        return questionContainer;
    }

    #createAnswerDOMElement(answerText, isCorrectAnswer) {
        // create answer container
        const answerElement = document.createElement("div");

        // create answer text 
        const answerTextElement = document.createElement("p");
        answerTextElement.innerHTML = answerText;

        // create answer checkbox
        const answerCheckboxElement = document.createElement("input");
        answerCheckboxElement.setAttribute("type", "checkbox");
        answerCheckboxElement['isCorrectAnswer'] = isCorrectAnswer;
        this.answerCheckboxes.push(answerCheckboxElement);

        
        answerElement.appendChild(answerCheckboxElement);
        answerElement.appendChild(answerTextElement);
        

        return answerElement;
    }

    removeFromDOM() {
        const questionContainer = document.getElementById("question-form");
        if (document.contains(this.questionDOMElement))
            questionContainer.removeChild(this.questionDOMElement);
    }

    addToDOM() {
        // append to parent DOM element
        const questionContainer = document.getElementById("question-form");
        questionContainer.appendChild(this.questionDOMElement);
    }

    calculatePoints() {
        let points = 0;
        this.answerCheckboxes.forEach(answerCheckbox => {
            if (answerCheckbox.checked == true) {
                if (answerCheckbox['isCorrectAnswer'] == true)
                    points += 3;
                else
                    points -= 1;
            }
        });
        return points;
    }

    highlightAnswers() {
        this.answerCheckboxes.forEach(answerCheckbox => {
            if (answerCheckbox['isCorrectAnswer'] == true) {
                answerCheckbox.parentNode.style.backgroundColor = "green";
            } else if (answerCheckbox.checked == true && answerCheckbox['isCorrectAnswer'] == false)
                answerCheckbox.parentNode.style.backgroundColor = "red";
        });
    }
}

class Tester {
    constructor() {
        this.numOfTestQuestions = 10;
        this.allQuestionElements = [];
        this.currentQuestionElements = [];

        const checkButton = document.getElementById("check-button");
        checkButton.addEventListener("click", () => {
            this.#checkAnswers();
        });
    }

    initQuestions() {
        const questions_filename = "assets/questions.xml";
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", questions_filename, false);
        xmlhttp.send();
        const xmlDoc = xmlhttp.responseXML;
        const questionsXml = xmlDoc.getElementsByTagName('test')[0].children;
        for (let question of questionsXml) {
            const questionObject = new Question(
                question.getElementsByTagName('description')[0].innerHTML,
                question.getElementsByTagName('answer1')[0].innerHTML,
                question.getElementsByTagName('answer2')[0].innerHTML,
                question.getElementsByTagName('answer3')[0].innerHTML,
                question.getElementsByTagName('answer4')[0].innerHTML
            );
            this.allQuestionElements.push(questionObject);
        }
        this.#loadQuestions();
    }

    #checkAnswers() {
        let points = 0;
        this.currentQuestionElements.forEach(e => {
            points += e.calculatePoints();
            e.highlightAnswers();
        })
        alert("Zdobyłeś/aś: " + points.toString() + "/" + (this.numOfTestQuestions * 3).toString())
    }

    #loadQuestions() {
        // shuffle and and pick first n questions
        for (let i = this.allQuestionElements.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [this.allQuestionElements[i - 1], this.allQuestionElements[j]] = [this.allQuestionElements[j], this.allQuestionElements[i - 1]];
        }
        this.currentQuestionElements = this.allQuestionElements.slice(0, this.numOfTestQuestions);

        // remove previous questions
        this.currentQuestionElements.forEach(e => e.removeFromDOM());

        // add new questions 
        this.currentQuestionElements.forEach(e => e.addToDOM());
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    const tester = new Tester();
    tester.initQuestions();
});