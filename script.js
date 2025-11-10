document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-btn');
    const nextButton = document.getElementById('next-btn');
    const restartButton = document.getElementById('restart-btn');
    const themeToggleButton = document.getElementById('theme-toggle');

    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');
    
    const questionContainer = document.getElementById('question-container');
    const questionTextElement = document.getElementById('question-text');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const questionCounterElement = document.getElementById('question-counter');
    const timerElement = document.getElementById('timer');
    const scoreTextElement = document.getElementById('score-text');
    const feedbackTextElement = document.getElementById('feedback-text');
    const summaryContainer = document.getElementById('summary-container');

    let shuffledQuestions, currentQuestionIndex;
    let score = 0;
    let timerInterval;
    const TOTAL_QUESTIONS = 40;
    const EXAM_TIME_SECONDS = 60 * 60; // 60 minutes

    // --- Theme Logic ---
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.className = savedTheme;
        } else {
            document.body.className = 'light-theme'; // Default
        }
    }

    function toggleTheme() {
        console.log('toggleTheme function');
        const body = document.body;
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeToggleButton.textContent = '☀️ Tema Claro';
            localStorage.setItem('theme', 'dark-theme');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeToggleButton.textContent = '🌙 Tema Oscuro';
            localStorage.setItem('theme', 'light-theme');
        }
    }

    themeToggleButton.addEventListener('click', toggleTheme);

    const allQuestions = [
    // ----------------------
    // HTML - 70 questions
    // ----------------------
    {
        question: "Which HTML tag defines a paragraph?",
        answers: [
        { text: "<p>", correct: true },
        { text: "<para>", correct: false },
        { text: "<paragraph>", correct: false },
        { text: "<text>", correct: false }
        ]
    },
    {
        question: "Which HTML element is used to create a hyperlink?",
        answers: [
        { text: "<a>", correct: true },
        { text: "<link>", correct: false },
        { text: "<href>", correct: false },
        { text: "<url>", correct: false }
        ]
    },
    {
        question: "Which attribute is required for the <img> tag for it to display an image?",
        answers: [
        { text: "src", correct: true },
        { text: "href", correct: false },
        { text: "alt", correct: false },
        { text: "title", correct: false }
        ]
    },
    {
        question: "What is the purpose of the `alt` attribute in an `<img>` tag?",
        answers: [
        { text: "Provide alternative text for accessibility and when the image cannot load.", correct: true },
        { text: "Set the image URL.", correct: false },
        { text: "Set the image title tooltip.", correct: false },
        { text: "Define image dimensions.", correct: false }
        ]
    },
    {
        question: "Which element is used to define the most important heading?",
        answers: [
        { text: "<h1>", correct: true },
        { text: "<h6>", correct: false },
        { text: "<header>", correct: false },
        { text: "<heading>", correct: false }
        ]
    },
    {
        question: "Which element is semantic for page navigation links?",
        answers: [
        { text: "`<nav>`", correct: true },
        { text: "<navigation>", correct: false },
        { text: "<menu>", correct: false },
        { text: "<links>", correct: false }
        ]
    },
    {
        question: "How do you create an unordered list in HTML?",
        answers: [
        { text: "<ul>", correct: true },
        { text: "<ol>", correct: false },
        { text: "<list>", correct: false },
        { text: "<li>", correct: false }
        ]
    },
    {
        question: "Which tag creates a list item inside a list?",
        answers: [
        { text: "<li>", correct: true },
        { text: "<item>", correct: false },
        { text: "<listitem>", correct: false },
        { text: "<ulitem>", correct: false }
        ]
    },
    {
        question: "Which element contains metadata and links to scripts/styles and the document title?",
        answers: [
        { text: "<head>", correct: true },
        { text: "<header>", correct: false },
        { text: "<meta>", correct: false },
        { text: "<body>", correct: false }
        ]
    },
    {
        question: "What does the `<title>` element specify?",
        answers: [
        { text: "The document title shown in the browser tab.", correct: true },
        { text: "The main heading on the page.", correct: false },
        { text: "SEO keywords.", correct: false },
        { text: "The page's meta description.", correct: false }
        ]
    },
    {
        question: "Which attribute of the `<a>` tag opens the link in a new tab or window?",
        answers: [
        { text: "target=\"_blank\"", correct: true },
        { text: "href=\"_blank\"", correct: false },
        { text: "rel=\"new\"", correct: false },
        { text: "open=\"new\"", correct: false }
        ]
    },
    {
        question: "Which element represents the main content of the document that is unique to that page?",
        answers: [
        { text: "`<main>`", correct: true },
        { text: "<section>", correct: false },
        { text: "<div>", correct: false },
        { text: "<article>", correct: false }
        ]
    },
    {
        question: "Which semantic element represents independent, self-contained content?",
        answers: [
        { text: "<article>", correct: true },
        { text: "<section>", correct: false },
        { text: "<aside>", correct: false },
        { text: "<div>", correct: false }
        ]
    },
    {
        question: "True or false: The `<footer>` element is used to represent the footer for its nearest sectioning content or sectioning root.",
        answers: [
        { text: "True", correct: true },
        { text: "False", correct: false },
        { text: "Sometimes", correct: false },
        { text: "Only for pages", correct: false }
        ]
    },
    {
        question: "Which tag is used to define a table row?",
        answers: [
        { text: "<tr>", correct: true },
        { text: "<td>", correct: false },
        { text: "<th>", correct: false },
        { text: "<table-row>", correct: false }
        ]
    },
    {
        question: "Which HTML tag defines a table header cell?",
        answers: [
        { text: "<th>", correct: true },
        { text: "<td>", correct: false },
        { text: "<thead>", correct: false },
        { text: "<header>", correct: false }
        ]
    },
    {
        question: "Which element should you use to include an external JavaScript file?",
        answers: [
        { text: "<script src=\"app.js\"></script>", correct: true },
        { text: "<script href=\"app.js\"></script>", correct: false },
        { text: "<javascript src=\"app.js\">", correct: false },
        { text: "<link rel=\"script\" href=\"app.js\">", correct: false }
        ]
    },
    {
        question: "Which element provides a way to show preformatted text where whitespace is preserved?",
        answers: [
        { text: "<pre>", correct: true },
        { text: "<code>", correct: false },
        { text: "<samp>", correct: false },
        { text: "<kbd>", correct: false }
        ]
    },
    {
        question: "Which tag is used for marking up computer code within a document?",
        answers: [
        { text: "<code>", correct: true },
        { text: "<program>", correct: false },
        { text: "<script>", correct: false },
        { text: "<pre>", correct: false }
        ]
    },
    {
        question: "What is the purpose of the `<label>` element?",
        answers: [
        { text: "Associate text with a form control for better accessibility.", correct: true },
        { text: "Label an image.", correct: false },
        { text: "Name a section.", correct: false },
        { text: "Add a tooltip.", correct: false }
        ]
    },
    {
        question: "Which input type creates a color picker in supporting browsers?",
        answers: [
        { text: "type=\"color\"", correct: true },
        { text: "type=\"picker\"", correct: false },
        { text: "type=\"colorpicker\"", correct: false },
        { text: "type=\"palette\"", correct: false }
        ]
    },
    {
        question: "Which attribute makes a form input required by the browser?",
        answers: [
        { text: "required", correct: true },
        { text: "validate", correct: false },
        { text: "mandatory", correct: false },
        { text: "must", correct: false }
        ]
    },
    {
        question: "What does the `<fieldset>` element do?",
        answers: [
        { text: "Groups related form controls and labels.", correct: true },
        { text: "Creates a new form.", correct: false },
        { text: "Defines a data field.", correct: false },
        { text: "Groups scripts.", correct: false }
        ]
    },
    {
        question: "Which attribute of `<script>` tells the browser to execute the script after the document has been parsed?",
        answers: [
        { text: "defer", correct: true },
        { text: "async", correct: false },
        { text: "delay", correct: false },
        { text: "later", correct: false }
        ]
    },
    {
        question: "Which attribute of `<script>` downloads and executes the script asynchronously (without blocking HTML parsing)?",
        answers: [
        { text: "async", correct: true },
        { text: "defer", correct: false },
        { text: "parallel", correct: false },
        { text: "now", correct: false }
        ]
    },
    {
        question: "Which HTML5 element is used for content tangentially related to the main content (often a sidebar)?",
        answers: [
        { text: "`<aside>`", correct: true },
        { text: "<side>", correct: false },
        { text: "<sidebar>", correct: false },
        { text: "<menu>", correct: false }
        ]
    },
    {
        question: "How do you add a comment in HTML?",
        answers: [
        { text: "<!-- This is a comment -->", correct: true },
        { text: "// This is a comment", correct: false },
        { text: "/* This is a comment */", correct: false },
        { text: "# This is a comment", correct: false }
        ]
    },
    {
        question: "Which element is recommended to embed short inline quotations?",
        answers: [
        { text: "<q>", correct: true },
        { text: "<blockquote>", correct: false },
        { text: "<cite>", correct: false },
        { text: "<quote>", correct: false }
        ]
    },
    {
        question: "Which element is intended for longer, block-level quotations?",
        answers: [
        { text: "<blockquote>", correct: true },
        { text: "<q>", correct: false },
        { text: "<cite>", correct: false },
        { text: "<quote>", correct: false }
        ]
    },
    {
        question: "Which attribute on `<a>` mitigates security/privacy concerns when using target=\"_blank\"?",
        answers: [
        { text: "rel=\"noopener noreferrer\"", correct: true },
        { text: "safe=\"true\"", correct: false },
        { text: "secure=\"true\"", correct: false },
        { text: "rel=\"nofollow\"", correct: false }
        ]
    },
    {
        question: "Which element provides a semantic container for a navigation list of links?",
        answers: [
        { text: "`<nav>`", correct: true },
        { text: "<menu>", correct: false },
        { text: "<list>", correct: false },
        { text: "<links>", correct: false }
        ]
    },
    {
        question: "Which attribute on `<input>` sets a maximum allowed value for numeric input?",
        answers: [
        { text: "max", correct: true },
        { text: "maxlength", correct: false },
        { text: "limit", correct: false },
        { text: "maximum", correct: false }
        ]
    },
    {
        question: "What does the `<progress>` element represent?",
        answers: [
        { text: "Completion progress of a task.", correct: true },
        { text: "An animated spinner.", correct: false },
        { text: "A status message.", correct: false },
        { text: "A timeline.", correct: false }
        ]
    },
    {
        question: "Which element is best to use for marking up keyboard input from the user?",
        answers: [
        { text: "<kbd>", correct: true },
        { text: "<code>", correct: false },
        { text: "<samp>", correct: false },
        { text: "<var>", correct: false }
        ]
    },
    {
        question: "Which element marks up sample output from a program or system?",
        answers: [
        { text: "<samp>", correct: true },
        { text: "<code>", correct: false },
        { text: "<pre>", correct: false },
        { text: "<output>", correct: false }
        ]
    },
    {
        question: "Which element represents the result of a calculation or user action in HTML5?",
        answers: [
        { text: "<output>", correct: true },
        { text: "<result>", correct: false },
        { text: "<calc>", correct: false },
        { text: "<value>", correct: false }
        ]
    },
    {
        question: "Which element embeds another HTML document inside the current one?",
        answers: [
        { text: "<iframe>", correct: true },
        { text: "<embed>", correct: false },
        { text: "<frame>", correct: false },
        { text: "<object>", correct: false }
        ]
    },
    {
        question: "Which element is used to group and label a set of options for forms?",
        answers: [
        { text: "<optgroup>", correct: true },
        { text: "<optionset>", correct: false },
        { text: "<group>", correct: false },
        { text: "<selectgroup>", correct: false }
        ]
    },
    {
        question: "What is the default display type of the `<span>` element?",
        answers: [
        { text: "inline", correct: true },
        { text: "block", correct: false },
        { text: "inline-block", correct: false },
        { text: "flex", correct: false }
        ]
    },
    {
        question: "What is the default display type of the `<div>` element?",
        answers: [
        { text: "block", correct: true },
        { text: "inline", correct: false },
        { text: "inline-block", correct: false },
        { text: "flex", correct: false }
        ]
    },
    {
        question: "Which element should be used for the site header content?",
        answers: [
        { text: "<header>", correct: true },
        { text: "<head>", correct: false },
        { text: "<top>", correct: false },
        { text: "<nav>", correct: false }
        ]
    },
    {
        question: "Which attribute on `<form>` defines the HTTP method used when submitting the form?",
        answers: [
        { text: "method", correct: true },
        { text: "action", correct: false },
        { text: "type", correct: false },
        { text: "submit", correct: false }
        ]
    },
    {
        question: "Which attribute on `<form>` defines the URL where form data is sent?",
        answers: [
        { text: "action", correct: true },
        { text: "method", correct: false },
        { text: "endpoint", correct: false },
        { text: "href", correct: false }
        ]
    },
    {
        question: "Which HTTP method is typically used to retrieve data without side effects?",
        answers: [
        { text: "GET", correct: true },
        { text: "POST", correct: false },
        { text: "PUT", correct: false },
        { text: "DELETE", correct: false }
        ]
    },
    {
        question: "Which element is used to embed audio content with playback controls?",
        answers: [
        { text: "<audio controls>", correct: true },
        { text: "<sound controls>", correct: false },
        { text: "<music controls>", correct: false },
        { text: "<player controls>", correct: false }
        ]
    },
    {
        question: "Which attribute allows the browser to preload video or audio resources?",
        answers: [
        { text: "preload", correct: true },
        { text: "prefetch", correct: false },
        { text: "autopreload", correct: false },
        { text: "buffer", correct: false }
        ]
    },
    {
        question: "Which element defines an option in a drop-down list?",
        answers: [
        { text: "<option>", correct: true },
        { text: "<choice>", correct: false },
        { text: "<select-option>", correct: false },
        { text: "<item>", correct: false }
        ]
    },
    {
        question: "Which attribute on `<input>` allows selecting multiple files?",
        answers: [
        { text: "multiple", correct: true },
        { text: "multifile", correct: false },
        { text: "files", correct: false },
        { text: "many", correct: false }
        ]
    },
    {
        question: "What does the `charset` meta tag usually define?",
        answers: [
        { text: "Character encoding (e.g., UTF-8).", correct: true },
        { text: "Language of the page.", correct: false },
        { text: "Viewport settings.", correct: false },
        { text: "SEO keywords.", correct: false }
        ]
    },
    {
        question: "Which tag is needed to make a page responsive on mobile devices via viewport?",
        answers: [
        { text: "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">", correct: true },
        { text: "<meta name=\"mobile\" content=\"true\">", correct: false },
        { text: "<meta viewport>", correct: false },
        { text: "<meta responsive>", correct: false }
        ]
    },
    {
        question: "Which element is appropriate to mark up a site logo or branding within the header?",
        answers: [
        { text: "<figure> with <img> and <figcaption> if caption is needed", correct: true },
        { text: "<brand>", correct: false },
        { text: "<logo>", correct: false },
        { text: "<icon>", correct: false }
        ]
    },
    {
        question: "Which element should contain the navigation landmark for screen readers?",
        answers: [
        { text: "<nav>", correct: true },
        { text: "<div>", correct: false },
        { text: "<ul>", correct: false },
        { text: "<menu>", correct: false }
        ]
    },
    {
        question: "Which attribute on `<a>` is used to provide the link URL?",
        answers: [
        { text: "href", correct: true },
        { text: "src", correct: false },
        { text: "link", correct: false },
        { text: "data-href", correct: false }
        ]
    },
    {
        question: "Which element is commonly used to embed SVG vector images inline?",
        answers: [
        { text: "<svg>", correct: true },
        { text: "<vector>", correct: false },
        { text: "<graphic>", correct: false },
        { text: "<image>", correct: false }
        ]
    },
    {
        question: "Which attribute makes a link indicate that it is an external resource and should be ignored by search engines?",
        answers: [
        { text: "rel=\"nofollow\"", correct: true },
        { text: "rel=\"external\"", correct: false },
        { text: "target=\"_external\"", correct: false },
        { text: "href-rel=\"nofollow\"", correct: false }
        ]
    },
    {
        question: "Which element is used to provide a caption for a `<figure>`?",
        answers: [
        { text: "<figcaption>", correct: true },
        { text: "<caption>", correct: false },
        { text: "<label>", correct: false },
        { text: "<legend>", correct: false }
        ]
    },
    {
        question: "Which attribute can be used on `<script>` to specify the script's MIME type (rarely needed now)?",
        answers: [
        { text: "type", correct: true },
        { text: "mime", correct: false },
        { text: "lang", correct: false },
        { text: "format", correct: false }
        ]
    },
    {
        question: "Which element should be used to denote strongly emphasized text with importance?",
        answers: [
        { text: "<strong>", correct: true },
        { text: "<b>", correct: false },
        { text: "<em>", correct: false },
        { text: "<big>", correct: false }
        ]
    },
    {
        question: "Which element is used to represent emphasized text (stress emphasis)?",
        answers: [
        { text: "<em>", correct: true },
        { text: "<i>", correct: false },
        { text: "<strong>", correct: false },
        { text: "<mark>", correct: false }
        ]
    },
    {
        question: "Which element is preferred for marking up highlighted text?",
        answers: [
        { text: "<mark>", correct: true },
        { text: "<highlight>", correct: false },
        { text: "<strong>", correct: false },
        { text: "<b>", correct: false }
        ]
    },
    {
        question: "Which element defines a client-side image map?",
        answers: [
        { text: "<map>", correct: true },
        { text: "<area>", correct: false },
        { text: "<imagemap>", correct: false },
        { text: "<coords>", correct: false }
        ]
    },
    {
        question: "Which attribute on `<img>` improves accessibility and SEO by giving a textual description?",
        answers: [
        { text: "alt", correct: true },
        { text: "desc", correct: false },
        { text: "title", correct: false },
        { text: "caption", correct: false }
        ]
    },
    {
        question: "Which input type is used for numeric input with arrows in many browsers?",
        answers: [
        { text: "type=\"number\"", correct: true },
        { text: "type=\"numeric\"", correct: false },
        { text: "type=\"range\"", correct: false },
        { text: "type=\"spin\"", correct: false }
        ]
    },
    {
        question: "Which element is used to define the base URL for relative URLs on a page?",
        answers: [
        { text: "<base href=\"https://example.com/\">", correct: true },
        { text: "<baseurl>", correct: false },
        { text: "<basepath>", correct: false },
        { text: "<root>", correct: false }
        ]
    },
    {
        question: "Which attribute on `<a>` adds a tooltip when hovering over the link?",
        answers: [
        { text: "title", correct: true },
        { text: "alt", correct: false },
        { text: "tooltip", correct: false },
        { text: "hint", correct: false }
        ]
    },
    {
        question: "Which HTML element is used to display a scalar measurement within a known range (eg. battery level)?",
        answers: [
        { text: "<meter>", correct: true },
        { text: "<progress>", correct: false },
        { text: "<gauge>", correct: false },
        { text: "<range>", correct: false }
        ]
    },
    {
        question: "Which attribute makes an `<input>` field read-only?",
        answers: [
        { text: "readonly", correct: true },
        { text: "disabled", correct: false },
        { text: "lock", correct: false },
        { text: "fixed", correct: false }
        ]
    },
    {
        question: "Which element is used for the document's visible content?",
        answers: [
        { text: "<body>", correct: true },
        { text: "<content>", correct: false },
        { text: "<document>", correct: false },
        { text: "<page>", correct: false }
        ]
    },
    {
        question: "What is the correct way to declare the language of an HTML document (example for English)?",
        answers: [
        { text: "<html lang=\"en\">", correct: true },
        { text: "<html language=\"english\">", correct: false },
        { text: "<html lang=\"eng\">", correct: false },
        { text: "<html code=\"en\">", correct: false }
        ]
    },
    {
        question: "Which HTML element is used to provide a set of radio buttons grouped logically?",
        answers: [
        { text: "Use multiple <input type=\"radio\"> with the same name attribute", correct: true },
        { text: "<radiogroup>", correct: false },
        { text: "<group>", correct: false },
        { text: "<multiradio>", correct: false }
        ]
    },
    {
        question: "Which attribute on `<input>` defines a placeholder text shown when the field is empty?",
        answers: [
        { text: "placeholder", correct: true },
        { text: "title", correct: false },
        { text: "hint", correct: false },
        { text: "value", correct: false }
        ]
    },
    {
        question: "Which HTML element allows embedding third-party widgets and plugins?",
        answers: [
        { text: "<embed>", correct: true },
        { text: "<plugin>", correct: false },
        { text: "<object>", correct: false },
        { text: "<iframe>", correct: false }
        ]
    },
    {
        question: "Which element groups the visible controls in a form and can include a legend?",
        answers: [
        { text: "<fieldset>", correct: true },
        { text: "<group>", correct: false },
        { text: "<controls>", correct: false },
        { text: "<formgroup>", correct: false }
        ]
    },
    {
        question: "Which attribute is used to indicate alternative text for the `<area>` element in image maps?",
        answers: [
        { text: "alt", correct: true },
        { text: "title", correct: false },
        { text: "desc", correct: false },
        { text: "label", correct: false }
        ]
    },

    // ----------------------
    // CSS - 65 questions
    // ----------------------
    {
        question: "What does CSS stand for?",
        answers: [
        { text: "Cascading Style Sheets", correct: true },
        { text: "Creative Style Sheets", correct: false },
        { text: "Computer Style Sheets", correct: false },
        { text: "Colorful Style Sheets", correct: false }
        ]
    },
    {
        question: "How do you select an element with id=\"header\" in CSS?",
        answers: [
        { text: "#header", correct: true },
        { text: ".header", correct: false },
        { text: "header", correct: false },
        { text: "*header", correct: false }
        ]
    },
    {
        question: "How do you select all <p> elements that are direct children of a <div>?",
        answers: [
        { text: "div > p", correct: true },
        { text: "div p", correct: false },
        { text: "div + p", correct: false },
        { text: "div ~ p", correct: false }
        ]
    },
    {
        question: "Which property changes the text color of an element?",
        answers: [
        { text: "color", correct: true },
        { text: "font-color", correct: false },
        { text: "text-color", correct: false },
        { text: "foreground", correct: false }
        ]
    },
    {
        question: "Which property controls the space inside an element between its border and content?",
        answers: [
        { text: "padding", correct: true },
        { text: "margin", correct: false },
        { text: "border", correct: false },
        { text: "gap", correct: false }
        ]
    },
    {
        question: "Which property controls the space outside an element, between the border and other elements?",
        answers: [
        { text: "margin", correct: true },
        { text: "padding", correct: false },
        { text: "border-spacing", correct: false },
        { text: "gap", correct: false }
        ]
    },
    {
        question: "What is the CSS box model order from inside out?",
        answers: [
        { text: "content → padding → border → margin", correct: true },
        { text: "margin → border → padding → content", correct: false },
        { text: "padding → border → content → margin", correct: false },
        { text: "content → border → padding → margin", correct: false }
        ]
    },
    {
        question: "Which property makes an element a flex container?",
        answers: [
        { text: "display: flex;", correct: true },
        { text: "display: block;", correct: false },
        { text: "display: grid;", correct: false },
        { text: "position: flex;", correct: false }
        ]
    },
    {
        question: "What does `justify-content: center;` do in a flex container?",
        answers: [
        { text: "Aligns flex items along the main axis to the center.", correct: true },
        { text: "Aligns items along the cross axis.", correct: false },
        { text: "Centers text inside an element.", correct: false },
        { text: "Centers the container itself.", correct: false }
        ]
    },
    {
        question: "What does `align-items: center;` do in a flex container?",
        answers: [
        { text: "Aligns flex items along the cross axis to the center.", correct: true },
        { text: "Aligns items along the main axis.", correct: false },
        { text: "Sets the vertical-align property.", correct: false },
        { text: "Centers text inside each item.", correct: false }
        ]
    },
    {
        question: "Which property sets how elements wrap inside a flex container?",
        answers: [
        { text: "flex-wrap", correct: true },
        { text: "wrap", correct: false },
        { text: "flex-flow", correct: false },
        { text: "flex-direction", correct: false }
        ]
    },
    {
        question: "Which property controls the stacking order of positioned elements?",
        answers: [
        { text: "z-index", correct: true },
        { text: "stack", correct: false },
        { text: "order", correct: false },
        { text: "elevation", correct: false }
        ]
    },
    {
        question: "What does `box-sizing: border-box;` change about element sizing?",
        answers: [
        { text: "Includes padding and border in element's width and height.", correct: true },
        { text: "Excludes border from width calculation.", correct: false },
        { text: "Removes margin from size calculation.", correct: false },
        { text: "Makes element invisible.", correct: false }
        ]
    },
    {
        question: "Which unit is relative to the font-size of the parent element?",
        answers: [
        { text: "em", correct: true },
        { text: "px", correct: false },
        { text: "cm", correct: false },
        { text: "%", correct: false }
        ]
    },
    {
        question: "Which unit is relative to the root element font size?",
        answers: [
        { text: "rem", correct: true },
        { text: "em", correct: false },
        { text: "vh", correct: false },
        { text: "vw", correct: false }
        ]
    },
    {
        question: "Which property creates rounded corners?",
        answers: [
        { text: "border-radius", correct: true },
        { text: "corner-radius", correct: false },
        { text: "round-corners", correct: false },
        { text: "radius", correct: false }
        ]
    },
    {
        question: "Which property adds a drop shadow to an element's box?",
        answers: [
        { text: "box-shadow", correct: true },
        { text: "shadow", correct: false },
        { text: "text-shadow", correct: false },
        { text: "drop-shadow", correct: false }
        ]
    },
    {
        question: "Which property adds shadow to text?",
        answers: [
        { text: "text-shadow", correct: true },
        { text: "font-shadow", correct: false },
        { text: "shadow-text", correct: false },
        { text: "text-outline", correct: false }
        ]
    },
    {
        question: "How do you hide an element while keeping it accessible to screen readers?",
        answers: [
        { text: "Use position and large negative offset or clip technique (e.g., position:absolute; left:-9999px; width:1px; height:1px; overflow:hidden;)", correct: true },
        { text: "display: none;", correct: false },
        { text: "visibility: hidden;", correct: false },
        { text: "opacity: 0;", correct: false }
        ]
    },
    {
        question: "Which CSS property changes the font family of an element?",
        answers: [
        { text: "font-family", correct: true },
        { text: "font", correct: false },
        { text: "typeface", correct: false },
        { text: "font-name", correct: false }
        ]
    },
    {
        question: "Which property sets the font size of text?",
        answers: [
        { text: "font-size", correct: true },
        { text: "text-size", correct: false },
        { text: "size", correct: false },
        { text: "font-height", correct: false }
        ]
    },
    {
        question: "Which property controls the transparency of an element?",
        answers: [
        { text: "opacity", correct: true },
        { text: "transparent", correct: false },
        { text: "visibility", correct: false },
        { text: "alpha", correct: false }
        ]
    },
    {
        question: "Which property hides an element and removes it from the layout flow?",
        answers: [
        { text: "display: none;", correct: true },
        { text: "visibility: hidden;", correct: false },
        { text: "opacity: 0;", correct: false },
        { text: "position: absolute;", correct: false }
        ]
    },
    {
        question: "Which property is used to center text inside an element?",
        answers: [
        { text: "text-align: center;", correct: true },
        { text: "align-text: center;", correct: false },
        { text: "center-text: true;", correct: false },
        { text: "justify-content: center;", correct: false }
        ]
    },
    {
        question: "Which pseudo-class is used when the user hovers over an element?",
        answers: [
        { text: ":hover", correct: true },
        { text: ":active", correct: false },
        { text: ":focus", correct: false },
        { text: ":visited", correct: false }
        ]
    },
    {
        question: "Which pseudo-class targets the first child element of its parent?",
        answers: [
        { text: ":first-child", correct: true },
        { text: ":first", correct: false },
        { text: ":nth-child(1)", correct: false },
        { text: ":child-first", correct: false }
        ]
    },
    {
        question: "Which CSS property is used to create transitions between property values?",
        answers: [
        { text: "transition", correct: true },
        { text: "animate", correct: false },
        { text: "transform", correct: false },
        { text: "motion", correct: false }
        ]
    },
    {
        question: "Which property rotates, scales or translates an element in 2D/3D?",
        answers: [
        { text: "transform", correct: true },
        { text: "rotate", correct: false },
        { text: "translate", correct: false },
        { text: "position", correct: false }
        ]
    },
    {
        question: "Which property defines a two-dimensional grid layout?",
        answers: [
        { text: "display: grid;", correct: true },
        { text: "display: flex;", correct: false },
        { text: "display: table;", correct: false },
        { text: "display: block;", correct: false }
        ]
    },
    {
        question: "Which property defines the size of columns in CSS Grid?",
        answers: [
        { text: "grid-template-columns", correct: true },
        { text: "grid-columns", correct: false },
        { text: "columns", correct: false },
        { text: "grid-cols", correct: false }
        ]
    },
    {
        question: "Which property controls the gap between rows and columns in Grid or Flexbox (modern browsers)?",
        answers: [
        { text: "gap", correct: true },
        { text: "grid-gap", correct: false },
        { text: "gutter", correct: false },
        { text: "spacing", correct: false }
        ]
    },
    {
        question: "Which property will collapse adjacent whitespace in inline elements if set to normal (default)?",
        answers: [
        { text: "white-space: normal;", correct: true },
        { text: "text-space: collapse;", correct: false },
        { text: "space-collapse: true;", correct: false },
        { text: "whitespace-collapse: normal;", correct: false }
        ]
    },
    {
        question: "Which property controls whether an element's content can break onto a new line?",
        answers: [
        { text: "white-space", correct: true },
        { text: "line-break", correct: false },
        { text: "word-wrap", correct: false },
        { text: "wrap", correct: false }
        ]
    },
    {
        question: "Which property changes the order of flex items without changing the DOM?",
        answers: [
        { text: "order", correct: true },
        { text: "z-index", correct: false },
        { text: "flex-order", correct: false },
        { text: "position", correct: false }
        ]
    },
    {
        question: "Which value of `display` yields an element that participates in layout as a block and applies flex layout to its children?",
        answers: [
        { text: "flex", correct: true },
        { text: "block", correct: false },
        { text: "inline-block", correct: false },
        { text: "inline-flex", correct: false }
        ]
    },
    {
        question: "Which CSS shorthand property sets font-style, font-variant, font-weight, font-size/line-height and font-family?",
        answers: [
        { text: "font", correct: true },
        { text: "text", correct: false },
        { text: "type", correct: false },
        { text: "font-style", correct: false }
        ]
    },
    {
        question: "Which CSS property is used to control whether an element's background image scrolls with the page or is fixed?",
        answers: [
        { text: "background-attachment", correct: true },
        { text: "background-position", correct: false },
        { text: "background-repeat", correct: false },
        { text: "background-origin", correct: false }
        ]
    },
    {
        question: "Which pseudo-element inserts content before an element's content?",
        answers: [
        { text: "::before", correct: true },
        { text: ":before", correct: false },
        { text: "::first", correct: false },
        { text: ":first-child", correct: false }
        ]
    },
    {
        question: "Which pseudo-element inserts content after an element's content?",
        answers: [
        { text: "::after", correct: true },
        { text: ":after", correct: false },
        { text: "::last", correct: false },
        { text: ":last-child", correct: false }
        ]
    },
    {
        question: "Which property is recommended to create a responsive image that doesn't overflow its container?",
        answers: [
        { text: "max-width: 100%; height: auto;", correct: true },
        { text: "width: 100px; height: auto;", correct: false },
        { text: "width: auto; height: 100%;", correct: false },
        { text: "responsive: true;", correct: false }
        ]
    },

    // ----------------------
    // JavaScript - 65 questions
    // (including 20+ output code questions)
    // ----------------------
    {
        question: "How do you declare a variable that cannot be reassigned in JavaScript?",
        answers: [
        { text: "const", correct: true },
        { text: "let", correct: false },
        { text: "var", correct: false },
        { text: "immutable", correct: false }
        ]
    },
    {
        question: "How do you declare a block-scoped variable that can be reassigned?",
        answers: [
        { text: "let", correct: true },
        { text: "var", correct: false },
        { text: "const", correct: false },
        { text: "static", correct: false }
        ]
    },
    {
        question: "What is the result of `typeof []` in JavaScript?",
        answers: [
        { text: "\"object\"", correct: true },
        { text: "\"array\"", correct: false },
        { text: "\"list\"", correct: false },
        { text: "\"object[]\"", correct: false }
        ]
    },
    {
        question: "Which method converts a JavaScript object into a JSON string?",
        answers: [
        { text: "JSON.stringify()", correct: true },
        { text: "JSON.parse()", correct: false },
        { text: "toJSON()", correct: false },
        { text: "stringify()", correct: false }
        ]
    },
    {
        question: "Which method parses a JSON string into a JavaScript object?",
        answers: [
        { text: "JSON.parse()", correct: true },
        { text: "JSON.stringify()", correct: false },
        { text: "parseJSON()", correct: false },
        { text: "eval()", correct: false }
        ]
    },
    {
        question: "What does `==` do in JavaScript?",
        answers: [
        { text: "Performs abstract equality comparison with type coercion.", correct: true },
        { text: "Performs strict equality comparison without coercion.", correct: false },
        { text: "Assigns values.", correct: false },
        { text: "Throws an error.", correct: false }
        ]
    },
    {
        question: "What does `===` do in JavaScript?",
        answers: [
        { text: "Performs strict equality comparison (type and value).", correct: true },
        { text: "Performs abstract equality (with coercion).", correct: false },
        { text: "Assigns value and type.", correct: false },
        { text: "Compares only types.", correct: false }
        ]
    },
    {
        question: "Which method adds one or more elements to the end of an array?",
        answers: [
        { text: "push()", correct: true },
        { text: "pop()", correct: false },
        { text: "unshift()", correct: false },
        { text: "shift()", correct: false }
        ]
    },
    {
        question: "Which method removes the last element from an array and returns it?",
        answers: [
        { text: "pop()", correct: true },
        { text: "shift()", correct: false },
        { text: "remove()", correct: false },
        { text: "delete()", correct: false }
        ]
    },
    {
        question: "Which method removes the first element of an array and returns it?",
        answers: [
        { text: "shift()", correct: true },
        { text: "pop()", correct: false },
        { text: "unshift()", correct: false },
        { text: "splice()", correct: false }
        ]
    },
    {
        question: "Which method adds elements to the beginning of an array?",
        answers: [
        { text: "unshift()", correct: true },
        { text: "push()", correct: false },
        { text: "addFirst()", correct: false },
        { text: "prepend()", correct: false }
        ]
    },
    {
        question: "What does `Array.map()` return?",
        answers: [
        { text: "A new array containing the results of applying a function to every element.", correct: true },
        { text: "The same array modified in place.", correct: false },
        { text: "A filtered subset of elements.", correct: false },
        { text: "Undefined", correct: false }
        ]
    },
    {
        question: "What does `Array.filter()` return?",
        answers: [
        { text: "A new array with elements that pass the test function.", correct: true },
        { text: "A new array with modified elements.", correct: false },
        { text: "A boolean indicating whether any element passed the test.", correct: false },
        { text: "The original array", correct: false }
        ]
    },
    {
        question: "What does `Array.reduce()` do?",
        answers: [
        { text: "Executes a reducer function on each element resulting in a single value.", correct: true },
        { text: "Removes elements from an array.", correct: false },
        { text: "Creates a copy of the array.", correct: false },
        { text: "Finds an element index.", correct: false }
        ]
    },
    {
        question: "What is hoisting in JavaScript?",
        answers: [
        { text: "Behavior where declarations are moved to the top of their scope before execution.", correct: true },
        { text: "A method to optimize loops.", correct: false },
        { text: "The process of garbage collection.", correct: false },
        { text: "A way to import modules.", correct: false }
        ]
    },
    {
        question: "What type will `typeof null` return?",
        answers: [
        { text: "\"object\"", correct: true },
        { text: "\"null\"", correct: false },
        { text: "\"undefined\"", correct: false },
        { text: "\"error\"", correct: false }
        ]
    },
    {
        question: "Which statement is used to handle exceptions in JavaScript?",
        answers: [
        { text: "try...catch", correct: true },
        { text: "if...else", correct: false },
        { text: "switch...case", correct: false },
        { text: "throw...catch", correct: false }
        ]
    },
    {
        question: "Which keyword is used to create an asynchronous function?",
        answers: [
        { text: "async", correct: true },
        { text: "await", correct: false },
        { text: "defer", correct: false },
        { text: "asyncify", correct: false }
        ]
    },
    {
        question: "Which operator is used to get the remainder of a division?",
        answers: [
        { text: "%", correct: true },
        { text: "/", correct: false },
        { text: "mod", correct: false },
        { text: "rem", correct: false }
        ]
    },
    {
        question: "Which function converts a string to a floating point number?",
        answers: [
        { text: "parseFloat()", correct: true },
        { text: "parseInt()", correct: false },
        { text: "Number()", correct: false },
        { text: "toFloat()", correct: false }
        ]
    },
    {
        question: "Which function converts a string to an integer?",
        answers: [
        { text: "parseInt()", correct: true },
        { text: "parseFloat()", correct: false },
        { text: "toInteger()", correct: false },
        { text: "Number.parse()", correct: false }
        ]
    },
    {
        question: "Which method removes whitespace from both ends of a string?",
        answers: [
        { text: "trim()", correct: true },
        { text: "strip()", correct: false },
        { text: "clean()", correct: false },
        { text: "trimSpaces()", correct: false }
        ]
    },
    {
        question: "Which method returns a new string with specified replacements (does not modify the original)?",
        answers: [
        { text: "replace()", correct: true },
        { text: "replaceAll()", correct: false },
        { text: "splice()", correct: false },
        { text: "update()", correct: false }
        ]
    },
    {
        question: "How do you select an element with id=\"app\" in the DOM?",
        answers: [
        { text: "document.getElementById(\"app\")", correct: true },
        { text: "document.querySelectorAll(\"#app\")", correct: false },
        { text: "document.getElementsByClassName(\"app\")", correct: false },
        { text: "document.find(\"#app\")", correct: false }
        ]
    },
    {
        question: "Which method returns the first element that matches a CSS selector?",
        answers: [
        { text: "document.querySelector()", correct: true },
        { text: "document.querySelectorAll()", correct: false },
        { text: "document.getElementsByTagName()", correct: false },
        { text: "document.getElement()", correct: false }
        ]
    },
    // ----------------------
    // JavaScript - Output code / scenario based questions (20+)
    // ----------------------
    {
        question: "What is the output of the following code?\nconsole.log('5' + 3);",
        answers: [
        { text: "'53'", correct: true },
        { text: "8", correct: false },
        { text: "NaN", correct: false },
        { text: "Error", correct: false }
        ]
    },
    {
        question: "What is the output of the following code?\nconsole.log(+'5' + 3);",
        answers: [
        { text: "8", correct: true },
        { text: "'53'", correct: false },
        { text: "NaN", correct: false },
        { text: "undefined", correct: false }
        ]
    },
    {
        question: "What is the output of the following code?\nconsole.log(typeof undefined);",
        answers: [
        { text: "\"undefined\"", correct: true },
        { text: "\"object\"", correct: false },
        { text: "\"null\"", correct: false },
        { text: "\"void\"", correct: false }
        ]
    },
    {
        question: "What is the output of the following code?\nconsole.log(typeof NaN);",
        answers: [
        { text: "\"number\"", correct: true },
        { text: "\"NaN\"", correct: false },
        { text: "\"object\"", correct: false },
        { text: "\"undefined\"", correct: false }
        ]
    },
    {
        question: "What is the output of the following code?\nconsole.log(Boolean(''));",
        answers: [
        { text: "false", correct: true },
        { text: "true", correct: false },
        { text: "undefined", correct: false },
        { text: "null", correct: false }
        ]
    },
    {
        question: "What is the output of the following code?\nconsole.log([] + []);",
        answers: [
        { text: "'' (empty string)", correct: true },
        { text: "[]", correct: false },
        { text: "undefined", correct: false },
        { text: "[object Object][object Object]", correct: false }
        ]
    },
    {
        question: "What will the following code output?\nconsole.log([1,2,3].map(x => x * 2));",
        answers: [
        { text: "[2,4,6]", correct: true },
        { text: "[1,2,3]", correct: false },
        { text: "['2','4','6']", correct: false },
        { text: "undefined", correct: false }
        ]
    },
    {
        question: "What is the output of the following code?\nconsole.log(typeof null);",
        answers: [
        { text: "\"object\"", correct: true },
        { text: "\"null\"", correct: false },
        { text: "\"undefined\"", correct: false },
        { text: "\"error\"", correct: false }
        ]
    },
    {
        question: "What is the output of the following code?\nconsole.log(0 == false);\nconsole.log(0 === false);",
        answers: [
        { text: "true and false", correct: true },
        { text: "false and false", correct: false },
        { text: "true and true", correct: false },
        { text: "false and true", correct: false }
        ]
    },
    {
        question: "What is the output of the following code?\nconsole.log('Hello'.charAt(1));",
        answers: [
        { text: "\"e\"", correct: true },
        { text: "\"H\"", correct: false },
        { text: "\"l\"", correct: false },
        { text: "\"o\"", correct: false }
        ]
    },
    {
        question: "What is the output of the following code?\nlet a = [1,2,3];\nlet b = a;\nb.push(4);\nconsole.log(a);",
        answers: [
        { text: "[1,2,3,4]", correct: true },
        { text: "[1,2,3]", correct: false },
        { text: "[4]", correct: false },
        { text: "Error", correct: false }
        ]
    },
    {
        question: "What is the output of the following code?\nconsole.log('5' - 2);",
        answers: [
        { text: "3", correct: true },
        { text: "'3'", correct: false },
        { text: "NaN", correct: false },
        { text: "52", correct: false }
        ]
    },
    {
        question: "What is the output of the following code?\nconsole.log([1,2] + [3,4]);",
        answers: [
        { text: "'1,23,4'", correct: true },
        { text: "[1,2,3,4]", correct: false },
        { text: "NaN", correct: false },
        { text: "'[1,2][3,4]'", correct: false }
        ]
    },
    {
        question: "What is the output of the following code?\nconsole.log('10' / '2');",
        answers: [
        { text: "5", correct: true },
        { text: "'5'", correct: false },
        { text: "NaN", correct: false },
        { text: "Error", correct: false }
        ]
    },
    {
        question: "What is the output of the following code?\nconsole.log(!!'false');",
        answers: [
        { text: "true", correct: true },
        { text: "false", correct: false },
        { text: "undefined", correct: false },
        { text: "NaN", correct: false }
        ]
    },
    {
        question: "What is the output of the following code?\nconsole.log([...'abc']);",
        answers: [
        { text: "['a','b','c']", correct: true },
        { text: "['abc']", correct: false },
        { text: "['a b c']", correct: false },
        { text: "Error", correct: false }
        ]
    },
    {
        question: "What is the output of the following code?\nconsole.log(void 0 === undefined);",
        answers: [
        { text: "true", correct: true },
        { text: "false", correct: false },
        { text: "undefined", correct: false },
        { text: "TypeError", correct: false }
        ]
    },
    {
        question: "Consider the code:\nconsole.log(1 + '2' + 3);\nWhat is the output?",
        answers: [
        { text: "'123'", correct: true },
        { text: "6", correct: false },
        { text: "'33'", correct: false },
        { text: "Error", correct: false }
        ]
    },
    {
        question: "Consider the code:\nconsole.log(1 + 2 + '3');\nWhat is the output?",
        answers: [
        { text: "'33'", correct: true },
        { text: "6", correct: false },
        { text: "'123'", correct: false },
        { text: "Error", correct: false }
        ]
    },
    {
        question: "What is the output of the following code?\nconsole.log(Boolean('0'));\nconsole.log(Boolean(0));",
        answers: [
        { text: "true and false", correct: true },
        { text: "false and true", correct: false },
        { text: "true and true", correct: false },
        { text: "false and false", correct: false }
        ]
    },
    {
        question: "What will be printed by this code?\nlet x;\nconsole.log(x);",
        answers: [
        { text: "undefined", correct: true },
        { text: "null", correct: false },
        { text: "0", correct: false },
        { text: "Error", correct: false }
        ]
    },
    {
        question: "What is the output of the following code snippet?\nconsole.log( [1,2,3].slice(0,2) );",
        answers: [
        { text: "[1,2]", correct: true },
        { text: "[1,2,3]", correct: false },
        { text: "[2,3]", correct: false },
        { text: "undefined", correct: false }
        ]
    },
    {
        question: "What is the output of the following code?\nconsole.log('abc'.indexOf('b'));",
        answers: [
        { text: "1", correct: true },
        { text: "0", correct: false },
        { text: "2", correct: false },
        { text: "-1", correct: false }
        ]
    },
    {
        question: "What is the output of the code below?\nconst a = { x: 1 };\nconst b = { x: 1 };\nconsole.log(a === b);",
        answers: [
        { text: "false", correct: true },
        { text: "true", correct: false },
        { text: "TypeError", correct: false },
        { text: "undefined", correct: false }
        ]
    },
    {
        question: "What is the output of the following code?\nconsole.log( typeof function(){} );",
        answers: [
        { text: "\"function\"", correct: true },
        { text: "\"object\"", correct: false },
        { text: "\"undefined\"", correct: false },
        { text: "\"callable\"", correct: false }
        ]
    },
    {
        question: "What will the following code print?\nconsole.log([].length);",
        answers: [
        { text: "0", correct: true },
        { text: "undefined", correct: false },
        { text: "1", correct: false },
        { text: "null", correct: false }
        ]
    },
    {
        question: "What is the output of the following code?\nconsole.log(''.length);",
        answers: [
        { text: "0", correct: true },
        { text: "undefined", correct: false },
        { text: "1", correct: false },
        { text: "NaN", correct: false }
        ]
    },
    // ----------------------
    // Remaining JavaScript non-output intermediate/basic questions
    // ----------------------
    {
        question: "Which keyword creates a property on the prototype of a constructor function when used as a method definition inside a class?",
        answers: [
        { text: "Methods defined in class body are added to prototype automatically", correct: true },
        { text: "prototype", correct: false },
        { text: "proto", correct: false },
        { text: "__proto__", correct: false }
        ]
    },
    {
        question: "Which operator is used to spread elements of an iterable into individual elements?",
        answers: [
        { text: "... (spread operator)", correct: true },
        { text: "++ (increment)", correct: false },
        { text: "& (and)", correct: false },
        { text: "* (multiply)", correct: false }
        ]
    },
    {
        question: "Which method merges two arrays returning a new array without modifying the originals?",
        answers: [
        { text: "concat()", correct: true },
        { text: "push()", correct: false },
        { text: "splice()", correct: false },
        { text: "merge()", correct: false }
        ]
    },
    {
        question: "Which primitive types exist in JavaScript (ES6+)?",
        answers: [
        { text: "string, number, bigint, boolean, undefined, symbol, null", correct: true },
        { text: "string, number, object, boolean", correct: false },
        { text: "int, float, string, bool", correct: false },
        { text: "string, char, boolean, undefined", correct: false }
        ]
    },
    {
        question: "What will `Promise.resolve(1)` return to `.then()` callback?",
        answers: [
        { text: "1 (resolved value)", correct: true },
        { text: "Promise object", correct: false },
        { text: "undefined", correct: false },
        { text: "Error", correct: false }
        ]
    },
    {
        question: "Which method is best to add an event listener without overriding existing handlers?",
        answers: [
        { text: "element.addEventListener('click', handler)", correct: true },
        { text: "element.onclick = handler", correct: false },
        { text: "element.attachEvent('onclick', handler)", correct: false },
        { text: "element.setListener('click', handler)", correct: false }
        ]
    },
    {
        question: "Which global object provides local storage for key/value pairs with no expiry?",
        answers: [
        { text: "localStorage", correct: true },
        { text: "sessionStorage", correct: false },
        { text: "cookies", correct: false },
        { text: "indexedDB", correct: false }
        ]
    },
    {
        question: "Which method stops propagation of an event to parent elements?",
        answers: [
        { text: "event.stopPropagation()", correct: true },
        { text: "event.preventDefault()", correct: false },
        { text: "event.cancel()", correct: false },
        { text: "event.stop()", correct: false }
        ]
    },
    {
        question: "Which method prevents the default action associated with the event?",
        answers: [
        { text: "event.preventDefault()", correct: true },
        { text: "event.stopPropagation()", correct: false },
        { text: "event.cancel()", correct: false },
        { text: "event.prevent()", correct: false }
        ]
    },
    {
        question: "Which DOM method returns a NodeList of elements matching the selector?",
        answers: [
        { text: "document.querySelectorAll()", correct: true },
        { text: "document.querySelector()", correct: false },
        { text: "document.getElementsByClassName()", correct: false },
        { text: "document.getElementById()", correct: false }
        ]
    },
    {
        question: "What is event delegation?",
        answers: [
        { text: "Attaching a single listener on a parent to handle events from its children.", correct: true },
        { text: "Stopping event propagation in the capturing phase.", correct: false },
        { text: "Handling events with inline handlers only.", correct: false },
        { text: "Using multiple listeners for the same element.", correct: false }
        ]
    },
    {
        question: "Which syntax correctly defines an arrow function that returns the sum of two numbers?",
        answers: [
        { text: "(a, b) => a + b", correct: true },
        { text: "function(a,b) => a + b", correct: false },
        { text: "(a, b) => { a + b }", correct: false },
        { text: "=> (a, b) { return a + b }", correct: false }
        ]
    },
    {
        question: "Which of these creates a shallow copy of an array?",
        answers: [
        { text: "arr.slice()", correct: true },
        { text: "arr", correct: false },
        { text: "arr.push()", correct: false },
        { text: "arr.splice()", correct: false }
        ]
    },
    {
        question: "Which storage API is cleared when the browser tab is closed?",
        answers: [
        { text: "sessionStorage", correct: true },
        { text: "localStorage", correct: false },
        { text: "cookies", correct: false },
        { text: "indexedDB", correct: false }
        ]
    },
    {
        question: "Which method is used to make an HTTP request in modern browsers (built-in)?",
        answers: [
        { text: "fetch()", correct: true },
        { text: "XMLHttpRequest.open()", correct: false },
        { text: "ajax()", correct: false },
        { text: "http.request()", correct: false }
        ]
    },
    {
        question: "Which keyword is used to pause execution until a Promise resolves within an async function?",
        answers: [
        { text: "await", correct: true },
        { text: "wait", correct: false },
        { text: "pause", correct: false },
        { text: "hold", correct: false }
        ]
    },
    {
        question: "Which method returns a shallow copy of an array from start to end (end not included)?",
        answers: [
        { text: "slice()", correct: true },
        { text: "splice()", correct: false },
        { text: "copy()", correct: false },
        { text: "clone()", correct: false }
        ]
    },
    {
        question: "Which Array method changes the contents of an array by removing or replacing existing elements?",
        answers: [
        { text: "splice()", correct: true },
        { text: "slice()", correct: false },
        { text: "concat()", correct: false },
        { text: "map()", correct: false }
        ]
    },
    {
        question: "Which built-in object provides methods for mathematical operations like rounding and random numbers?",
        answers: [
        { text: "Math", correct: true },
        { text: "Number", correct: false },
        { text: "Maths", correct: false },
        { text: "Random", correct: false }
        ]
    },
    {
        question: "Which of these methods will schedule a function to run after at least the given milliseconds?",
        answers: [
        { text: "setTimeout(fn, ms)", correct: true },
        { text: "setInterval(fn, ms)", correct: false },
        { text: "requestAnimationFrame(fn)", correct: false },
        { text: "schedule(fn, ms)", correct: false }
        ]
    },
    {
        question: "Which method repeatedly calls a function with a fixed time delay between each call?",
        answers: [
        { text: "setInterval(fn, ms)", correct: true },
        { text: "setTimeout(fn, ms)", correct: false },
        { text: "requestAnimationFrame(fn)", correct: false },
        { text: "setRepeat(fn, ms)", correct: false }
        ]
    },
    {
        question: "Which of the following returns true if at least one element in the array passes the test implemented by the provided function?",
        answers: [
        { text: "some()", correct: true },
        { text: "every()", correct: false },
        { text: "filter()", correct: false },
        { text: "map()", correct: false }
        ]
    },
    {
        question: "Which of the following returns true only if all elements in the array pass the test?",
        answers: [
        { text: "every()", correct: true },
        { text: "some()", correct: false },
        { text: "filter()", correct: false },
        { text: "reduce()", correct: false }
        ]
    },
    {
        question: "Which operator is used to access properties of an object using a string key when the key is dynamic?",
        answers: [
        { text: "bracket notation (obj[key])", correct: true },
        { text: "dot notation (obj.key)", correct: false },
        { text: "arrow operator", correct: false },
        { text: "colon operator", correct: false }
        ]
    },
    {
        question: "What will `Object.keys({a:1,b:2}).length` return?",
        answers: [
        { text: "2", correct: true },
        { text: "0", correct: false },
        { text: "1", correct: false },
        { text: "undefined", correct: false }
        ]
    },
    {
        question: "Which method checks whether a property exists directly on an object (not in its prototype chain)?",
        answers: [
        { text: "Object.hasOwnProperty(prop)", correct: true },
        { text: "prop in object", correct: false },
        { text: "object.hasOwn(prop)", correct: false },
        { text: "object.contains(prop)", correct: false }
        ]
    },
    {
        question: "Which built-in object allows scheduling a function to run before the next repaint?",
        answers: [
        { text: "requestAnimationFrame()", correct: true },
        { text: "setTimeout()", correct: false },
        { text: "setInterval()", correct: false },
        { text: "queueMicrotask()", correct: false }
        ]
    },
    {
        question: "Which method converts a value to a string suitable for JSON transmission?",
        answers: [
        { text: "JSON.stringify()", correct: true },
        { text: "JSON.toString()", correct: false },
        { text: "Stringify()", correct: false },
        { text: "toJSON()", correct: false }
        ]
    },
    {
        question: "Which statement creates a new Promise that resolves after 1 second with value 'done'?",
        answers: [
        { text: "new Promise(resolve => setTimeout(() => resolve('done'), 1000))", correct: true },
        { text: "Promise.resolve('done', 1000)", correct: false },
        { text: "delay('done', 1000)", correct: false },
        { text: "setTimeout(() => Promise.resolve('done'), 1000)", correct: false }
        ]
    },
    {
        question: "Which method creates a shallow copy of an object merging properties from sources into target?",
        answers: [
        { text: "Object.assign(target, ...sources)", correct: true },
        { text: "Object.merge(target, ...sources)", correct: false },
        { text: "target.merge(...sources)", correct: false },
        { text: "clone(target, ...sources)", correct: false }
        ]
    },
    {
        question: "Which of the following is true about arrow functions compared to traditional functions?",
        answers: [
        { text: "Arrow functions do not have their own `this` binding.", correct: true },
        { text: "Arrow functions hoist like function declarations.", correct: false },
        { text: "Arrow functions can be used as constructors with `new`.", correct: false },
        { text: "Arrow functions create a new prototype property.", correct: false }
        ]
    },
    {
        question: "Which global method queues a microtask to be executed after the current call stack but before rendering?",
        answers: [
        { text: "queueMicrotask()", correct: true },
        { text: "setTimeout(...,0)", correct: false },
        { text: "Promise.resolve().then(...)", correct: false },
        { text: "requestAnimationFrame()", correct: false }
        ]
    },
    {
        question: "Which method returns a promise that resolves when all input promises resolve?",
        answers: [
        { text: "Promise.all()", correct: true },
        { text: "Promise.race()", correct: false },
        { text: "Promise.any()", correct: false },
        { text: "Promise.allSettled()", correct: false }
        ]
    },
    {
        question: "Which method returns a promise that resolves as soon as one of the input promises resolves?",
        answers: [
        { text: "Promise.race()", correct: true },
        { text: "Promise.all()", correct: false },
        { text: "Promise.any()", correct: false },
        { text: "Promise.resolve()", correct: false }
        ]
    },
    {
        question: "Which method returns a promise that resolves if any of the input promises fulfills, otherwise rejects?",
        answers: [
        { text: "Promise.any()", correct: true },
        { text: "Promise.all()", correct: false },
        { text: "Promise.race()", correct: false },
        { text: "Promise.first()", correct: false }
        ]
    },
    {
        question: "What does `document.createElement('div')` do?",
        answers: [
        { text: "Creates and returns a new DIV element (not yet attached to the DOM).", correct: true },
        { text: "Creates and attaches a DIV to the DOM immediately.", correct: false },
        { text: "Selects an existing DIV element.", correct: false },
        { text: "Throws an error if no DIV exists.", correct: false }
        ]
    },
    {
        question: "Which of these loops iterates over the enumerable property names of an object?",
        answers: [
        { text: "for...in", correct: true },
        { text: "for...of", correct: false },
        { text: "forEach", correct: false },
        { text: "while", correct: false }
        ]
    },
    {
        question: "Which of these loops iterates over iterable values (like arrays)?",
        answers: [
        { text: "for...of", correct: true },
        { text: "for...in", correct: false },
        { text: "forEach", correct: false },
        { text: "map", correct: false }
        ]
    },
    {
        question: "Which of the following is true about `const` with objects?",
        answers: [
        { text: "You can mutate properties, but cannot reassign the variable binding.", correct: true },
        { text: "You cannot change properties or reassign.", correct: false },
        { text: "You cannot change properties but can reassign.", correct: false },
        { text: "It creates an immutable deep copy.", correct: false }
        ]
    },
    {
        question: "Which method is used to parse an integer in a specified base?",
        answers: [
        { text: "parseInt(string, radix)", correct: true },
        { text: "Number.parse(string, base)", correct: false },
        { text: "int()", correct: false },
        { text: "parseInteger()", correct: false }
        ]
    },
    {
        question: "Which of these returns the current timestamp in milliseconds since the Unix epoch?",
        answers: [
        { text: "Date.now()", correct: true },
        { text: "new Date().getTime()", correct: false },
        { text: "performance.now()", correct: false },
        { text: "Date.timestamp()", correct: false }
        ]
    },
    {
        question: "Which API provides low-level storage for large amounts of structured data in the browser?",
        answers: [
        { text: "indexedDB", correct: true },
        { text: "localStorage", correct: false },
        { text: "sessionStorage", correct: false },
        { text: "cookies", correct: false }
        ]
    },
    {
        question: "Which keyword allows you to import named exports from a module (ES modules)?",
        answers: [
        { text: "import { name } from 'module'", correct: true },
        { text: "require('module')", correct: false },
        { text: "include 'module'", correct: false },
        { text: "load 'module'", correct: false }
        ]
    },
    {
        question: "Which technique improves perceived performance by only rendering visible elements in a long list?",
        answers: [
        { text: "Virtualization (virtual scrolling)", correct: true },
        { text: "Lazy loading images", correct: false },
        { text: "Preloading resources", correct: false },
        { text: "Bundling scripts", correct: false }
        ]
    },
    {
        question: "Which of the following will correctly check whether a value is NaN (not a number)?",
        answers: [
        { text: "Number.isNaN(value)", correct: true },
        { text: "isNaN(value)", correct: false },
        { text: "value === NaN", correct: false },
        { text: "typeof value === 'NaN'", correct: false }
        ]
    },
    {
        question: "Which method creates a shallow copy of a portion of an array into a new array object?",
        answers: [
        { text: "slice()", correct: true },
        { text: "splice()", correct: false },
        { text: "copy()", correct: false },
        { text: "clone()", correct: false }
        ]
    }
    ]; // end allQuestions


    function startQuiz() {
        startScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        
        shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5).slice(0, TOTAL_QUESTIONS);
        currentQuestionIndex = 0;
        score = 0;
        
        startTimer(EXAM_TIME_SECONDS);
        setNextQuestion();
    }

    function startTimer(duration) {
        let time = duration;
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            const minutes = Math.floor(time / 60);
            let seconds = time % 60;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            timerElement.textContent = `${minutes}:${seconds}`;
            time--;

            if (time < 0) {
                clearInterval(timerInterval);
                showResults();
            }
        }, 1000);
    }

    function setNextQuestion() {
        resetState();
        if (currentQuestionIndex < shuffledQuestions.length) {
            questionContainer.classList.add('fade-out');
            setTimeout(() => {
                questionContainer.classList.remove('fade-out');
                showQuestion(shuffledQuestions[currentQuestionIndex]);
            }, 300);
            questionCounterElement.textContent = `Question ${currentQuestionIndex + 1} of ${TOTAL_QUESTIONS}`;
        } else {
            clearInterval(timerInterval);
            showResults();
        }
    }

    function showQuestion(question) {
        // Set the question text
        questionTextElement.innerText = question.question;

        // 🔀 Shuffle answers so the correct one isn't always in the same position
        const shuffledAnswers = question.answers
            .map(a => ({ ...a })) // shallow copy
            .sort(() => Math.random() - 0.5);

        // Add fade-in animation class
        questionContainer.classList.remove('fade-in'); // reset if applied before
        void questionContainer.offsetWidth; // trick to reflow and restart animation
        questionContainer.classList.add('fade-in');

        // Create answer buttons dynamically
        shuffledAnswers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('btn', 'fade-in'); // each answer fades in too
            if (answer.correct) {
                button.dataset.correct = answer.correct;
            }
            button.addEventListener('click', selectAnswer);
            answerButtonsElement.appendChild(button);
        });
    }

    function resetState() {
        nextButton.classList.add('hidden');
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
    }

    function selectAnswer(e) {
        const selectedButton = e.target;
        const correct = selectedButton.dataset.correct === 'true';

        shuffledQuestions[currentQuestionIndex].selectedCorrect = correct; // Store if user selected correct

        if (correct) {
            score++;
        }

        Array.from(answerButtonsElement.children).forEach(button => {
            setStatusClass(button, button.dataset.correct === 'true');
            button.disabled = true; // Disable all buttons after selection
        });

        if (shuffledQuestions.length > currentQuestionIndex + 1) {
            nextButton.classList.remove('hidden');

            // 🔥 Reiniciar animación de aparición para el botón "Next"
            nextButton.classList.remove('fade-in-up'); 
            void nextButton.offsetWidth; // Forzar reflow para reiniciar la animación
            nextButton.classList.add('fade-in-up');
        } else {
            // Última pregunta → mostrar resultados con una breve pausa
            setTimeout(() => {
                clearInterval(timerInterval);
                showResults();
            }, 1500);
        }
    }

    function setStatusClass(element, correct) {
        clearStatusClass(element);
        if (correct) {
            element.classList.add('correct');
        } else {
            element.classList.add('wrong');
        }
    }

    function clearStatusClass(element) {
        element.classList.remove('correct');
        element.classList.remove('wrong');
    }

    function showResults() {
        quizScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        
        const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);
        scoreTextElement.innerText = `${score} out of ${TOTAL_QUESTIONS} (${percentage}%)`;

        summaryContainer.innerHTML = ''; // Clear previous summary

        shuffledQuestions.forEach((q, index) => {
            const item = document.createElement('div');
            item.classList.add('summary-item');
            item.classList.add(q.selectedCorrect ? 'correct' : 'wrong'); // Use stored correctness
            item.innerText = `${index + 1}. ${q.question}`;
            summaryContainer.appendChild(item);
        });

        if (percentage >= 80) {
            feedbackTextElement.innerText = "Congratulations! You have passed the practice exam.";
            feedbackTextElement.className = 'pass';
        } else {
            feedbackTextElement.innerText = "Keep studying. You haven't reached the passing score yet.";
            feedbackTextElement.className = 'fail';
        }
    }
    
    startButton.addEventListener('click', startQuiz);
    
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        setNextQuestion();
    });
    
    restartButton.addEventListener('click', () => {
        resultScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        summaryContainer.innerHTML = ''; // Clear summary on restart
    });    
    
    loadTheme();
    console.log(allQuestions.length + " questions loaded.");

});