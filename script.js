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

    let currentQuestionIndex;
    let score = 0;
    let timerInterval;
    const TOTAL_QUESTIONS = 50;
    const EXAM_TIME_SECONDS = 60 * 60; // 60 minutes

    const EXAM_DISTRIBUTION = {
        html: 13,           // 25% - Module 1: HTML Fundamentals
        css: 11,            // 22.5% - Module 2: CSS Fundamentals
        integrate: 13,      // 25% - Module 3: Integrating HTML & CSS
        responsive: 6,      // 12.5% - Module 4: Responsive Web Design
        accessibility: 7    // 15% - Module 5: Accessibility & Best Practices
    };
    
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Function to generate exam according to distribution
    function generateExam(allQuestions, distribution) {
        const examQuestions = [];
        const questionsByCategory = {};

        // Group questions by category
        allQuestions.forEach(q => {
            if (!questionsByCategory[q.category]) {
                questionsByCategory[q.category] = [];
            }
            questionsByCategory[q.category].push(q);
        });

        // Select questions according to distribution
        for (const [category, count] of Object.entries(distribution)) {
            const categoryQuestions = questionsByCategory[category] || [];
            const shuffled = shuffleArray(categoryQuestions);
            const selected = shuffled.slice(0, count);
            examQuestions.push(...selected);
        }

        // Shuffle the final exam questions
        return shuffleArray(examQuestions);
    }

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
    	// ========================================
    	// MODULE 1: HTML FUNDAMENTALS (~50 questions)
    	// Category: html
    	// ========================================
    	// 1.1 Document Structure and Markup Basics
    	{ category: "html", question: "What is the correct DOCTYPE declaration for HTML5?", answers: [{ text: "<!DOCTYPE HTML5>", correct: false }, { text: "<!DOCTYPE html>", correct: true }, { text: "<DOCTYPE html>", correct: false }, { text: "<!DOCUMENT html>", correct: false }] },
    	{ category: "html", question: "Which meta tag is essential for proper UTF-8 character encoding?", answers: [{ text: "<meta encoding='utf-8'>", correct: false }, { text: "<meta charset='utf-8'>", correct: true }, { text: "<meta type='utf-8'>", correct: false }, { text: "<meta content='utf-8'>", correct: false }] },
    	{ category: "html", question: "Which meta tag configures the viewport for responsive design?", answers: [{ text: "<meta name='responsive' content='width=device-width'>", correct: false }, { text: "<meta name='viewport' content='width=device-width, initial-scale=1'>", correct: true }, { text: "<meta viewport='device-width'>", correct: false }, { text: "<meta name='screen' content='mobile'>", correct: false }] },
    	{ category: "html", question: "Where should the <title> element be placed in an HTML document?", answers: [{ text: "Inside <body>", correct: false }, { text: "Inside <head>", correct: true }, { text: "Before <!DOCTYPE>", correct: false }, { text: "After <body>", correct: false }] },
    	{ category: "html", question: "What is the purpose of the lang attribute in the <html> tag?", answers: [{ text: "Defines the programming language", correct: false }, { text: "Specifies the document's natural language", correct: true }, { text: "Sets the page layout direction", correct: false }, { text: "Declares the HTML version", correct: false }] },
    	{ category: "html", question: "Which of the following is proper HTML5 markup nesting?", answers: [{ text: "<p><div>Text</div></p>", correct: false }, { text: "<div><p>Text</p></div>", correct: true }, { text: "<span><body>Text</body></span>", correct: false }, { text: "<h1><h2>Text</h2></h1>", correct: false }] },
    	{ category: "html", question: "How should special characters like < and > be escaped in HTML content?", answers: [{ text: "\\< and \\>", correct: false }, { text: "&lt; and &gt;", correct: true }, { text: "{< and >}", correct: false }, { text: "No escaping needed", correct: false }] },
    	{ category: "html", question: "Which attribute must NOT have duplicate values across a single HTML page?", answers: [{ text: "class", correct: false }, { text: "name", correct: false }, { text: "id", correct: true }, { text: "type", correct: false }] },
    	// 1.2 Structured and Semantic HTML Content
    	{ category: "html", question: "Which element defines the main unique content of a document?", answers: [{ text: "<content>", correct: false }, { text: "<section>", correct: false }, { text: "<main>", correct: true }, { text: "<primary>", correct: false }] },
    	{ category: "html", question: "What is the purpose of the <article> element?", answers: [{ text: "Any text content", correct: false }, { text: "Self-contained, independently distributable content", correct: true }, { text: "Grouping blog articles only", correct: false }, { text: "Creating layout columns", correct: false }] },
    	{ category: "html", question: "What is the semantic purpose of the <aside> element?", answers: [{ text: "Main page content", correct: false }, { text: "Tangentially related or complementary content", correct: true }, { text: "Side navigation only", correct: false }, { text: "Footer content", correct: false }] },
    	{ category: "html", question: "Which element should wrap a set of primary navigation links?", answers: [{ text: "<menu>", correct: false }, { text: "<nav>", correct: true }, { text: "<links>", correct: false }, { text: "<navigation>", correct: false }] },
    	{ category: "html", question: "How many <main> elements should typically be present on a page?", answers: [{ text: "As many as needed", correct: false }, { text: "Exactly one", correct: true }, { text: "At least two", correct: false }, { text: "None if using <div>", correct: false }] },
    	{ category: "html", question: "Which element groups table body content?", answers: [{ text: "<table-body>", correct: false }, { text: "<body>", correct: false }, { text: "<tbody>", correct: true }, { text: "<tgroup>", correct: false }] },
    	{ category: "html", question: "What is the correct use of the <hr> element?", answers: [{ text: "Decorative horizontal line", correct: false }, { text: "Creating paragraph spacing", correct: false }, { text: "Representing a thematic break between sections", correct: true }, { text: "Separating list items", correct: false }] },
    	{ category: "html", question: "Which element is used for term-definition pairs?", answers: [{ text: "<ul> with <li>", correct: false }, { text: "<ol> with <li>", correct: false }, { text: "<dl> with <dt> and <dd>", correct: true }, { text: "<list> with <term>", correct: false }] },
    	{ category: "html", question: "What is the semantic difference between <section> and <article>?", answers: [{ text: "No difference", correct: false }, { text: "<section> groups related content; <article> is self-contained", correct: true }, { text: "<article> is older than <section>", correct: false }, { text: "<section> is for blog posts only", correct: false }] },
    	{ category: "html", question: "Which heading level should typically be used only once per page?", answers: [{ text: "<h2>", correct: false }, { text: "<h1>", correct: true }, { text: "<h3>", correct: false }, { text: "All can be used multiple times", correct: false }] },
    	{ category: "html", question: "What is the purpose of the <caption> element in tables?", answers: [{ text: "To style table headers", correct: false }, { text: "To provide a table title or summary", correct: true }, { text: "To create table footer", correct: false }, { text: "To group table columns", correct: false }] },
    	{ category: "html", question: "Which element should be used for standalone line breaks in addresses or poetry?", answers: [{ text: "<br>", correct: true }, { text: "<lb>", correct: false }, { text: "<newline>", correct: false }, { text: "Multiple <p> tags", correct: false }] },
    	// 1.3 Media, Forms, and Navigation
    	{ category: "html", question: "Which attribute is mandatory for accessibility in <img> tags?", answers: [{ text: "title", correct: false }, { text: "alt", correct: true }, { text: "caption", correct: false }, { text: "description", correct: false }] },
    	{ category: "html", question: "What is the purpose of the loading='lazy' attribute on images?", answers: [{ text: "Load image faster", correct: false }, { text: "Defer image loading until near viewport", correct: true }, { text: "Reduce image quality", correct: false }, { text: "Make image responsive", correct: false }] },
    	{ category: "html", question: "Which elements should wrap media with captions?", answers: [{ text: "<media> and <caption>", correct: false }, { text: "<figure> and <figcaption>", correct: true }, { text: "<img> and <cap>", correct: false }, { text: "<picture> and <title>", correct: false }] },
    	{ category: "html", question: "Which input type is used for date selection in HTML5 forms?", answers: [{ text: "type='calendar'", correct: false }, { text: "type='date'", correct: true }, { text: "type='datetime'", correct: false }, { text: "type='picker'", correct: false }] },
    	{ category: "html", question: "Which form attribute specifies the HTTP method for submission?", answers: [{ text: "action", correct: false }, { text: "method", correct: true }, { text: "type", correct: false }, { text: "submit", correct: false }] },
    	{ category: "html", question: "What is the purpose of rel='noopener noreferrer' with target='_blank'?", answers: [{ text: "Improve SEO", correct: false }, { text: "Enhance security and performance when opening in new tab", correct: true }, { text: "Prevent link from opening", correct: false }, { text: "Add animations", correct: false }] },
    	{ category: "html", question: "Which attribute provides suggestions for input fields?", answers: [{ text: "<suggest>", correct: false }, { text: "<datalist>", correct: true }, { text: "<options>", correct: false }, { text: "autocomplete", correct: false }] },
    	{ category: "html", question: "What is the purpose of the <fieldset> element?", answers: [{ text: "Create form layout grid", correct: false }, { text: "Group related form controls together", correct: true }, { text: "Validate form inputs", correct: false }, { text: "Submit form data", correct: false }] },
    	{ category: "html", question: "Which button type prevents form submission?", answers: [{ text: "type='submit'", correct: false }, { text: "type='button'", correct: true }, { text: "type='reset'", correct: false }, { text: "type='click'", correct: false }] },
    	{ category: "html", question: "What enctype is required for file upload forms?", answers: [{ text: "application/json", correct: false }, { text: "multipart/form-data", correct: true }, { text: "text/plain", correct: false }, { text: "application/x-www-form-urlencoded", correct: false }] },
    	{ category: "html", question: "Which attribute links a <label> to its form control?", answers: [{ text: "name", correct: false }, { text: "for", correct: true }, { text: "id", correct: false }, { text: "link", correct: false }] },
    	{ category: "html", question: "What is the purpose of the srcset attribute on images?", answers: [{ text: "Set image source", correct: false }, { text: "Provide multiple image sources for different screen sizes", correct: true }, { text: "Set image style", correct: false }, { text: "Link to external images", correct: false }] },
    	{ category: "html", question: "Which element adds subtitles or captions to video content?", answers: [{ text: "<subtitle>", correct: false }, { text: "<track kind='captions'>", correct: true }, { text: "<caption>", correct: false }, { text: "<text>", correct: false }] },
    	{ category: "html", question: "What is the recommended minimum size for touch targets?", answers: [{ text: "24×24 px", correct: false }, { text: "44×44 px", correct: true }, { text: "100×100 px", correct: false }, { text: "16×16 px", correct: false }] },
    	{ category: "html", question: "Which attribute makes an iframe more secure?", answers: [{ text: "security='high'", correct: false }, { text: "sandbox", correct: true }, { text: "safe='true'", correct: false }, { text: "protected", correct: false }] },
    	{ category: "html", question: "What HTML5 constraint validates email format?", answers: [{ text: "required", correct: false }, { text: "type='email'", correct: true }, { text: "validate='email'", correct: false }, { text: "format='email'", correct: false }] },
    	{ category: "html", question: "Which attribute describes the purpose of an iframe?", answers: [{ text: "description", correct: false }, { text: "title", correct: true }, { text: "alt", correct: false }, { text: "caption", correct: false }] },
    	{ category: "html", question: "What is the purpose of the <output> element?", answers: [{ text: "Display user input", correct: false }, { text: "Show result of a calculation or user action", correct: true }, { text: "Print form data", correct: false }, { text: "Export data", correct: false }] },
    	{ category: "html", question: "Which form method should be used for search queries?", answers: [{ text: "POST", correct: false }, { text: "GET", correct: true }, { text: "PUT", correct: false }, { text: "SEARCH", correct: false }] },
    	{ category: "html", question: "What attribute provides width and height to reduce layout shift?", answers: [{ text: "size", correct: false }, { text: "width and height", correct: true }, { text: "dimensions", correct: false }, { text: "aspect-ratio", correct: false }] },
    	{ category: "html", question: "Which input type creates a color picker?", answers: [{ text: "type='color'", correct: true }, { text: "type='picker'", correct: false }, { text: "type='palette'", correct: false }, { text: "type='rgb'", correct: false }] },
    	{ category: "html", question: "What does the pattern attribute do in input fields?", answers: [{ text: "Sets input style", correct: false }, { text: "Validates input against a regular expression", correct: true }, { text: "Creates repeated inputs", correct: false }, { text: "Defines input placeholder", correct: false }] },
    	{ category: "html", question: "Which attribute makes a form control required?", answers: [{ text: "mandatory", correct: false }, { text: "required", correct: true }, { text: "needed", correct: false }, { text: "validate", correct: false }] },
    	{ category: "html", question: "What is the purpose of the <legend> element?", answers: [{ text: "Create table legend", correct: false }, { text: "Provide a caption for <fieldset>", correct: true }, { text: "Add image descriptions", correct: false }, { text: "Define form actions", correct: false }] },
    	{ category: "html", question: "Which input type creates a range slider?", answers: [{ text: "type='slider'", correct: false }, { text: "type='range'", correct: true }, { text: "type='scale'", correct: false }, { text: "type='number'", correct: false }] },
    	{ category: "html", question: "What attribute suggests input format to mobile keyboards?", answers: [{ text: "keyboard", correct: false }, { text: "inputmode", correct: true }, { text: "keytype", correct: false }, { text: "format", correct: false }] },
    	{ category: "html", question: "Which element groups dropdown options?", answers: [{ text: "<optgroup>", correct: true }, { text: "<group>", correct: false }, { text: "<options>", correct: false }, { text: "<select-group>", correct: false }] },
    	{ category: "html", question: "What is the semantic purpose of <address>?", answers: [{ text: "Display any address", correct: false }, { text: "Provide contact information for article/page author", correct: true }, { text: "Show company address only", correct: false }, { text: "Create address form", correct: false }] },
    	{ category: "html", question: "Which HTML5 element embeds external content?", answers: [{ text: "<external>", correct: false }, { text: "<embed>", correct: true }, { text: "<plugin>", correct: false }, { text: "<content>", correct: false }] },
    	{ category: "html", question: "What is the correct way to comment in HTML?", answers: [{ text: "// comment", correct: false }, { text: "/* comment */", correct: false }, { text: "<!-- comment -->", correct: true }, { text: "# comment", correct: false }] },
    	{ category: "html", question: "Which element defines a description list?", answers: [{ text: "<dl>", correct: true }, { text: "<list>", correct: false }, { text: "<desc>", correct: false }, { text: "<description>", correct: false }] },
    	{ category: "html", question: "What does the defer attribute do on scripts?", answers: [{ text: "Delays script forever", correct: false }, { text: "Executes script after HTML parsing completes", correct: true }, { text: "Disables the script", correct: false }, { text: "Runs script immediately", correct: false }] },
    	{ category: "html", question: "What does the async attribute do on scripts?", answers: [{ text: "Synchronizes scripts", correct: false }, { text: "Downloads script asynchronously and executes when ready", correct: true }, { text: "Makes script wait", correct: false }, { text: "Validates script", correct: false }] },
    	{ category: "html", question: "Which input type creates a telephone number field?", answers: [{ text: "type='phone'", correct: false }, { text: "type='tel'", correct: true }, { text: "type='telephone'", correct: false }, { text: "type='number'", correct: false }] },
    	{ category: "html", question: "Which element represents a progress bar?", answers: [{ text: "<bar>", correct: false }, { text: "<progress>", correct: true }, { text: "<meter>", correct: false }, { text: "<loading>", correct: false }] },
    	{ category: "html", question: "Which element represents a scalar measurement within a range?", answers: [{ text: "<range>", correct: false }, { text: "<meter>", correct: true }, { text: "<progress>", correct: false }, { text: "<scale>", correct: false }] },
    	{ category: "html", question: "What is the purpose of the <time> element?", answers: [{ text: "Display current time", correct: false }, { text: "Represent dates/times in machine-readable format", correct: true }, { text: "Create timers", correct: false }, { text: "Set timezone", correct: false }] },
    	{ category: "html", question: "Which attribute makes media elements show playback controls?", answers: [{ text: "show-controls", correct: false }, { text: "controls", correct: true }, { text: "player", correct: false }, { text: "ui", correct: false }] },
    	{ category: "html", question: "What does the autoplay attribute do?", answers: [{ text: "Automatically plays media when page loads", correct: true }, { text: "Plays on click", correct: false }, { text: "Loops media", correct: false }, { text: "Mutes media", correct: false }] },
    	// ========================================
    	// MODULE 2: CSS FUNDAMENTALS (~45 questions)
    	// Category: css
    	// ========================================
    	// 2.1 Core CSS Concepts
    	{ category: "css", question: "Which CSS selector has the highest specificity?", answers: [{ text: "Element selector (p)", correct: false }, { text: "Class selector (.class)", correct: false }, { text: "ID selector (#id)", correct: true }, { text: "Universal selector (*)", correct: false }] },
    	{ category: "css", question: "What does 'cascade' mean in CSS?", answers: [{ text: "The order of stylesheets", correct: false }, { text: "The process determining which styles apply based on specificity and source order", correct: true }, { text: "Property inheritance", correct: false }, { text: "Document flow", correct: false }] },
    	{ category: "css", question: "What is the correct box model order from inside out?", answers: [{ text: "Margin, Border, Padding, Content", correct: false }, { text: "Content, Padding, Border, Margin", correct: true }, { text: "Content, Margin, Border, Padding", correct: false }, { text: "Padding, Content, Border, Margin", correct: false }] },
    	{ category: "css", question: "What does box-sizing: border-box do?", answers: [{ text: "Removes element border", correct: false }, { text: "Includes padding and border in element's total width and height", correct: true }, { text: "Adds box shadow", correct: false }, { text: "Makes the box square", correct: false }] },
    	{ category: "css", question: "How do you calculate specificity for '#header .nav li'?", answers: [{ text: "0-1-1", correct: false }, { text: "1-1-1", correct: true }, { text: "0-2-1", correct: false }, { text: "1-0-2", correct: false }] },
    	{ category: "css", question: "Which properties are inherited by default?", answers: [{ text: "margin and padding", correct: false }, { text: "color and font-family", correct: true }, { text: "width and height", correct: false }, { text: "border and background", correct: false }] },
    	{ category: "css", question: "What is the purpose of CSS custom properties (variables)?", answers: [{ text: "Make CSS heavier", correct: false }, { text: "Centralize design values and reduce repetition", correct: true }, { text: "Increase specificity", correct: false }, { text: "Compile CSS faster", correct: false }] },
    	{ category: "css", question: "Which unit is relative to the parent element's font size?", answers: [{ text: "px", correct: false }, { text: "rem", correct: false }, { text: "em", correct: true }, { text: "pt", correct: false }] },
    	{ category: "css", question: "Which unit is relative to the root element's font size?", answers: [{ text: "px", correct: false }, { text: "rem", correct: true }, { text: "em", correct: false }, { text: "%", correct: false }] },
    	{ category: "css", question: "What does the :hover pseudo-class do?", answers: [{ text: "Style visited links", correct: false }, { text: "Apply styles when cursor moves over element", correct: true }, { text: "Style first child", correct: false }, { text: "Style focused elements", correct: false }] },
    	{ category: "css", question: "Which selector targets the first child of a parent?", answers: [{ text: ":first", correct: false }, { text: ":first-child", correct: true }, { text: ":child(1)", correct: false }, { text: ":nth(1)", correct: false }] },
    	{ category: "css", question: "What is the purpose of the ::before pseudo-element?", answers: [{ text: "Insert content before page loads", correct: false }, { text: "Insert generated content before element's content", correct: true }, { text: "Style the element before hover", correct: false }, { text: "Load CSS before HTML", correct: false }] },
    	{ category: "css", question: "Which CSS property controls text color?", answers: [{ text: "text-color", correct: false }, { text: "color", correct: true }, { text: "font-color", correct: false }, { text: "foreground", correct: false }] },
    	{ category: "css", question: "What does font-weight: bold equal numerically?", answers: [{ text: "400", correct: false }, { text: "700", correct: true }, { text: "900", correct: false }, { text: "500", correct: false }] },
    	{ category: "css", question: "Which property controls the space between lines of text?", answers: [{ text: "line-spacing", correct: false }, { text: "line-height", correct: true }, { text: "text-spacing", correct: false }, { text: "leading", correct: false }] },
    	// 2.2 Layout, Effects, and Positioning
    	{ category: "css", question: "What is the difference between position: absolute and position: fixed?", answers: [{ text: "No difference", correct: false }, { text: "absolute positions relative to nearest positioned ancestor; fixed positions relative to viewport", correct: true }, { text: "fixed doesn't work on mobile", correct: false }, { text: "absolute is faster", correct: false }] },
    	{ category: "css", question: "What does the z-index property control?", answers: [{ text: "Zoom level", correct: false }, { text: "Stacking order of positioned elements", correct: true }, { text: "Vertical alignment", correct: false }, { text: "Z-axis animations", correct: false }] },
    	{ category: "css", question: "Which property creates smooth state transitions?", answers: [{ text: "animation", correct: false }, { text: "transform", correct: false }, { text: "transition", correct: true }, { text: "smooth", correct: false }] },
    	{ category: "css", question: "What does position: sticky do?", answers: [{ text: "Makes element stick to cursor", correct: false }, { text: "Toggles between relative and fixed based on scroll position", correct: true }, { text: "Prevents element from moving", correct: false }, { text: "Creates sticky notes", correct: false }] },
    	{ category: "css", question: "Which transform function rotates an element?", answers: [{ text: "spin()", correct: false }, { text: "rotate()", correct: true }, { text: "turn()", correct: false }, { text: "twist()", correct: false }] },
    	{ category: "css", question: "What does overflow: hidden do?", answers: [{ text: "Hides the element", correct: false }, { text: "Clips content that exceeds element's box", correct: true }, { text: "Makes element invisible", correct: false }, { text: "Removes element from flow", correct: false }] },
    	{ category: "css", question: "Which property controls element opacity?", answers: [{ text: "transparency", correct: false }, { text: "opacity", correct: true }, { text: "alpha", correct: false }, { text: "visibility", correct: false }] },
    	{ category: "css", question: "What does display: none do?", answers: [{ text: "Makes element transparent", correct: false }, { text: "Removes element from document flow completely", correct: true }, { text: "Hides element but keeps space", correct: false }, { text: "Collapses element borders", correct: false }] },
    	{ category: "css", question: "What is the difference between display: none and visibility: hidden?", answers: [{ text: "No difference", correct: false }, { text: "display: none removes from flow; visibility: hidden keeps space", correct: true }, { text: "visibility: hidden is faster", correct: false }, { text: "display: none is for images only", correct: false }] },
    	{ category: "css", question: "Which property creates rounded corners?", answers: [{ text: "corner-radius", correct: false }, { text: "border-radius", correct: true }, { text: "round-corners", correct: false }, { text: "corner-style", correct: false }] },
    	{ category: "css", question: "What does box-shadow do?", answers: [{ text: "Creates element border", correct: false }, { text: "Adds shadow effect to element's box", correct: true }, { text: "Darkens element background", correct: false }, { text: "Applies shadow to text", correct: false }] },
    	{ category: "css", question: "Which filter applies blur effect?", answers: [{ text: "filter: blur(5px)", correct: true }, { text: "blur: 5px", correct: false }, { text: "filter: fuzzy(5px)", correct: false }, { text: "effect: blur(5px)", correct: false }] },
    	{ category: "css", question: "What does @keyframes define?", answers: [{ text: "CSS variables", correct: false }, { text: "Animation sequence steps", correct: true }, { text: "Media queries", correct: false }, { text: "Import statements", correct: false }] },
    	{ category: "css", question: "Which property sets animation timing?", answers: [{ text: "animation-speed", correct: false }, { text: "animation-duration", correct: true }, { text: "animation-time", correct: false }, { text: "duration", correct: false }] },
    	{ category: "css", question: "What does will-change property do?", answers: [{ text: "Predicts future CSS changes", correct: false }, { text: "Hints browser about upcoming transformations for optimization", correct: true }, { text: "Changes element automatically", correct: false }, { text: "Validates CSS syntax", correct: false }] },
    	// 2.3 Frameworks, Preprocessors, and Performance
    	{ category: "css", question: "What is the main advantage of CSS preprocessors like Sass?", answers: [{ text: "Execute CSS in browser", correct: false }, { text: "Write more maintainable CSS with variables, nesting, and mixins", correct: true }, { text: "Replace CSS completely", correct: false }, { text: "Make CSS slower", correct: false }] },
    	{ category: "css", question: "What does CSS minification do?", answers: [{ text: "Reduces CSS specificity", correct: false }, { text: "Removes whitespace and comments to reduce file size", correct: true }, { text: "Minimizes CSS properties", correct: false }, { text: "Converts CSS to inline", correct: false }] },
    	{ category: "css", question: "What is critical CSS?", answers: [{ text: "Most important CSS rules", correct: false }, { text: "Above-the-fold CSS inlined for faster initial render", correct: true }, { text: "CSS for critical errors", correct: false }, { text: "High-priority stylesheets", correct: false }] },
    	{ category: "css", question: "What does autoprefixing do?", answers: [{ text: "Adds CSS comments", correct: false }, { text: "Automatically adds vendor prefixes for browser compatibility", correct: true }, { text: "Prefixes all class names", correct: false }, { text: "Validates CSS", correct: false }] },
    	{ category: "css", question: "Which CSS methodology promotes reusability and naming conventions?", answers: [{ text: "BEM (Block Element Modifier)", correct: true }, { text: "HTML5", correct: false }, { text: "Bootstrap", correct: false }, { text: "Flexbox", correct: false }] },
    	{ category: "css", question: "What is the purpose of CSS Grid system in frameworks like Bootstrap?", answers: [{ text: "Create databases", correct: false }, { text: "Provide responsive column-based layout structure", correct: true }, { text: "Display images in grid", correct: false }, { text: "Organize CSS files", correct: false }] },
    	{ category: "css", question: "What does @import do in CSS?", answers: [{ text: "Imports JavaScript", correct: false }, { text: "Includes external CSS files", correct: true }, { text: "Imports images", correct: false }, { text: "Loads fonts", correct: false }] },
    	{ category: "css", question: "Which technique reduces unused CSS in production?", answers: [{ text: "CSS compression", correct: false }, { text: "Tree-shaking or purging", correct: true }, { text: "Inline all CSS", correct: false }, { text: "Use only IDs", correct: false }] },
    	{ category: "css", question: "What is the benefit of CSS concatenation?", answers: [{ text: "Increases file size", correct: false }, { text: "Reduces HTTP requests by combining files", correct: true }, { text: "Improves specificity", correct: false }, { text: "Validates CSS", correct: false }] },
    	{ category: "css", question: "Which CSS unit is best for responsive typography?", answers: [{ text: "px", correct: false }, { text: "rem or em", correct: true }, { text: "pt", correct: false }, { text: "cm", correct: false }] },
    	{ category: "css", question: "What does the clamp() function do?", answers: [{ text: "Restricts elements to viewport", correct: false }, { text: "Sets a value between minimum and maximum bounds", correct: true }, { text: "Clips content", correct: false }, { text: "Validates input", correct: false }] },
    	{ category: "css", question: "Which property respects user's motion preferences?", answers: [{ text: "@media (prefers-reduced-motion)", correct: true }, { text: "@media (no-animation)", correct: false }, { text: "animation: none", correct: false }, { text: "motion: reduce", correct: false }] },
    	{ category: "css", question: "What does the min() function return?", answers: [{ text: "Minimum element size", correct: false }, { text: "The smallest of given values", correct: true }, { text: "Minimum specificity", correct: false }, { text: "Minimized CSS", correct: false }] },
    	{ category: "css", question: "What does the max() function return?", answers: [{ text: "Maximum element size", correct: false }, { text: "The largest of given values", correct: true }, { text: "Maximum specificity", correct: false }, { text: "Maximized CSS", correct: false }] },
    	{ category: "css", question: "Which positioning value keeps element in normal flow?", answers: [{ text: "absolute", correct: false }, { text: "static", correct: true }, { text: "fixed", correct: false }, { text: "sticky", correct: false }] },
    	{ category: "css", question: "What is the default display value for <div>?", answers: [{ text: "inline", correct: false }, { text: "block", correct: true }, { text: "inline-block", correct: false }, { text: "flex", correct: false }] },
    	{ category: "css", question: "What is the default display value for <span>?", answers: [{ text: "inline", correct: true }, { text: "block", correct: false }, { text: "inline-block", correct: false }, { text: "flex", correct: false }] },
    	{ category: "css", question: "Which property controls text alignment?", answers: [{ text: "align", correct: false }, { text: "text-align", correct: true }, { text: "content-align", correct: false }, { text: "alignment", correct: false }] },
    	{ category: "css", question: "What does cursor: pointer indicate?", answers: [{ text: "Element is loading", correct: false }, { text: "Element is clickable/interactive", correct: true }, { text: "Element has error", correct: false }, { text: "Element is disabled", correct: false }] },
    	{ category: "css", question: "What does text-transform: uppercase do?", answers: [{ text: "Transforms text position", correct: false }, { text: "Converts text to uppercase letters", correct: true }, { text: "Moves text up", correct: false }, { text: "Makes text bold", correct: false }] },
    	{ category: "css", question: "Which property controls letter spacing?", answers: [{ text: "letter-space", correct: false }, { text: "letter-spacing", correct: true }, { text: "spacing", correct: false }, { text: "char-spacing", correct: false }] },
    	{ category: "css", question: "What does word-break: break-all do?", answers: [{ text: "Breaks all words", correct: false }, { text: "Allows breaking within words to prevent overflow", correct: true }, { text: "Removes all words", correct: false }, { text: "Adds hyphens", correct: false }] },
    	{ category: "css", question: "Which property adds shadow to text?", answers: [{ text: "shadow", correct: false }, { text: "text-shadow", correct: true }, { text: "font-shadow", correct: false }, { text: "text-effect", correct: false }] },
    	{ category: "css", question: "What does white-space: nowrap do?", answers: [{ text: "Removes spaces", correct: false }, { text: "Prevents text from wrapping to new line", correct: true }, { text: "Adds white space", correct: false }, { text: "Makes background white", correct: false }] },
    	{ category: "css", question: "Which property controls the pointer cursor?", answers: [{ text: "mouse", correct: false }, { text: "cursor", correct: true }, { text: "pointer", correct: false }, { text: "icon", correct: false }] },
    	{ category: "css", question: "What does object-fit: cover do on images?", answers: [{ text: "Covers entire page", correct: false }, { text: "Scales image to cover container while maintaining aspect ratio", correct: true }, { text: "Adds image cover", correct: false }, { text: "Hides image", correct: false }] },
    	{ category: "css", question: "Which property creates a gradient background?", answers: [{ text: "background: gradient()", correct: false }, { text: "background: linear-gradient() or radial-gradient()", correct: true }, { text: "gradient: linear()", correct: false }, { text: "background-gradient", correct: false }] },
    	{ category: "css", question: "What does backdrop-filter do?", answers: [{ text: "Filters background images", correct: false }, { text: "Applies graphical effects to area behind element", correct: true }, { text: "Removes backdrop", correct: false }, { text: "Validates filters", correct: false }] },
    	{ category: "css", question: "Which property controls how overflowing content scrolls?", answers: [{ text: "scroll-type", correct: false }, { text: "overflow-x and overflow-y", correct: true }, { text: "scrollbar", correct: false }, { text: "flow", correct: false }] },
    	// ========================================
    	// MODULE 3: INTEGRATING HTML & CSS (~50 questions)
    	// Category: integrate
    	// ========================================
    	// 3.1 Stylesheets, precedence, and project structure
    	{ category: "integrate", question: "What is the correct precedence order (lowest to highest)?", answers: [{ text: "Inline > External > Internal", correct: false }, { text: "External > Internal > Inline", correct: false }, { text: "User agent > External/Internal (by order) > Inline", correct: true }, { text: "Internal > External > Inline", correct: false }] },
    	{ category: "integrate", question: "When is it appropriate to use inline styles?", answers: [{ text: "For all styles", correct: false }, { text: "For one-off overrides, email templates, or dynamic script values", correct: true }, { text: "Never", correct: false }, { text: "Only for colors", correct: false }] },
    	{ category: "integrate", question: "What is a good practice for organizing project files?", answers: [{ text: "Put everything in root", correct: false }, { text: "Organize into predictable folders like /css, /js, /img, /fonts", correct: true }, { text: "Mix HTML, CSS and JS in same folder", correct: false }, { text: "Use random file names", correct: false }] },
    	{ category: "integrate", question: "When should you use !important in CSS?", answers: [{ text: "For all important styles", correct: false }, { text: "Only for utilities or accessibility fixes, documented clearly", correct: true }, { text: "To increase specificity easily", correct: false }, { text: "Never", correct: false }] },
    	{ category: "integrate", question: "How do you properly link an external stylesheet?", answers: [{ text: "<style src='style.css'>", correct: false }, { text: "<link rel='stylesheet' href='style.css'>", correct: true }, { text: "<css href='style.css'>", correct: false }, { text: "<stylesheet>style.css</stylesheet>", correct: false }] },
    	{ category: "integrate", question: "Where should external stylesheets be linked?", answers: [{ text: "Before </body>", correct: false }, { text: "Inside <head>", correct: true }, { text: "After <body>", correct: false }, { text: "Before <!DOCTYPE>", correct: false }] },
    	{ category: "integrate", question: "What is the purpose of media='print' on a stylesheet link?", answers: [{ text: "Print the CSS file", correct: false }, { text: "Apply styles only when printing", correct: true }, { text: "Enable printing on page", correct: false }, { text: "Compress CSS", correct: false }] },
    	{ category: "integrate", question: "Which naming convention helps maintain consistent CSS?", answers: [{ text: "Random names", correct: false }, { text: "BEM (Block Element Modifier)", correct: true }, { text: "ALL_CAPS", correct: false }, { text: "numbers only", correct: false }] },
    	{ category: "integrate", question: "What should be separated when using build tools?", answers: [{ text: "HTML from CSS", correct: false }, { text: "Source (/src) from build output (/dist)", correct: true }, { text: "Images from fonts", correct: false }, { text: "Dev from production", correct: false }] },
    	{ category: "integrate", question: "Why prefer external stylesheets over inline styles?", answers: [{ text: "Inline is faster", correct: false }, { text: "External allows caching and maintainability", correct: true }, { text: "External increases specificity", correct: false }, { text: "Inline doesn't work", correct: false }] },
    	// 3.2 Forms and interactive elements
    	{ category: "integrate", question: "How do you correctly associate a <label> with an <input>?", answers: [{ text: "Place label before input", correct: false }, { text: "Use 'for' attribute on label matching input's 'id'", correct: true }, { text: "Use 'name' attribute", correct: false }, { text: "No association needed", correct: false }] },
    	{ category: "integrate", question: "Which HTML5 attribute validates email format?", answers: [{ text: "required", correct: false }, { text: "type='email'", correct: true }, { text: "validate='email'", correct: false }, { text: "pattern", correct: false }] },
    	{ category: "integrate", question: "Which pseudo-class styles keyboard-focused elements?", answers: [{ text: ":hover", correct: false }, { text: ":active", correct: false }, { text: ":focus", correct: false }, { text: ":focus-visible", correct: true }] },
    	{ category: "integrate", question: "What CSS property is best for spacing form elements?", answers: [{ text: "margin on each element", correct: false }, { text: "gap in flexbox or grid container", correct: true }, { text: "padding on each element", correct: false }, { text: "multiple <br> tags", correct: false }] },
    	{ category: "integrate", question: "How do you style invalid form inputs?", answers: [{ text: ".invalid class", correct: false }, { text: ":invalid pseudo-class", correct: true }, { text: "[invalid] attribute selector", correct: false }, { text: "JavaScript only", correct: false }] },
    	{ category: "integrate", question: "Which CSS property ensures consistent form layout across screens?", answers: [{ text: "Fixed widths", correct: false }, { text: "Flexbox or Grid with responsive units", correct: true }, { text: "Tables", correct: false }, { text: "Absolute positioning", correct: false }] },
    	{ category: "integrate", question: "What aria attribute links error messages to form fields?", answers: [{ text: "aria-error", correct: false }, { text: "aria-describedby", correct: true }, { text: "aria-invalid", correct: false }, { text: "aria-message", correct: false }] },
    	{ category: "integrate", question: "How should error messages be announced to screen readers?", answers: [{ text: "Display only", correct: false }, { text: "Use aria-live or role='alert'", correct: true }, { text: "Use console.log", correct: false }, { text: "Hidden text", correct: false }] },
    	{ category: "integrate", question: "Which button semantic indicates an action (not navigation)?", answers: [{ text: "<a> tag", correct: false }, { text: "<button> element", correct: true }, { text: "<input type='link'>", correct: false }, { text: "<div onclick>", correct: false }] },
    	{ category: "integrate", question: "What ensures comfortable touch targets on mobile?", answers: [{ text: "Minimum 24×24px", correct: false }, { text: "Minimum 44×44px with adequate spacing", correct: true }, { text: "Maximum 20×20px", correct: false }, { text: "Any size works", correct: false }] },
    	// 3.3 Standards compliance and debugging
    	{ category: "integrate", question: "What is the purpose of HTML/CSS validators?", answers: [{ text: "Improve performance", correct: false }, { text: "Detect syntax errors and ensure standards compliance", correct: true }, { text: "Add styles automatically", correct: false }, { text: "Compress code", correct: false }] },
    	{ category: "integrate", question: "Which browser tool is essential for debugging CSS?", answers: [{ text: "Console", correct: false }, { text: "Elements/Inspector panel to view computed styles", correct: true }, { text: "Network tab", correct: false }, { text: "Sources panel", correct: false }] },
    	{ category: "integrate", question: "How do you debug specificity issues?", answers: [{ text: "Add more !important", correct: false }, { text: "Inspect computed styles to see winning rule, then adjust selectors", correct: true }, { text: "Reload page", correct: false }, { text: "Change all to IDs", correct: false }] },
    	{ category: "integrate", question: "What does autoprefixing mean?", answers: [{ text: "Adding comments automatically", correct: false }, { text: "Automatically adding vendor prefixes (-webkit-, -moz-) for compatibility", correct: true }, { text: "Prefixing class names", correct: false }, { text: "Validating CSS", correct: false }] },
    	{ category: "integrate", question: "Which DevTools feature helps diagnose Grid/Flexbox issues?", answers: [{ text: "Console.log()", correct: false }, { text: "Grid/Flex inspector overlays", correct: true }, { text: "JavaScript alerts", correct: false }, { text: "HTML validator", correct: false }] },
    	{ category: "integrate", question: "What should you do after fixing CSS in DevTools?", answers: [{ text: "Leave it in browser", correct: false }, { text: "Persist changes to source files and commit", correct: true }, { text: "Take screenshot only", correct: false }, { text: "Nothing", correct: false }] },
    	{ category: "integrate", question: "How do you test responsive designs?", answers: [{ text: "Desktop only", correct: false }, { text: "Use responsive design mode and test on real devices", correct: true }, { text: "Guess breakpoints", correct: false }, { text: "Don't test", correct: false }] },
    	{ category: "integrate", question: "What does linting do for CSS?", answers: [{ text: "Compiles CSS", correct: false }, { text: "Analyzes code for errors and style issues", correct: true }, { text: "Minifies CSS", correct: false }, { text: "Adds colors", correct: false }] },
    	{ category: "integrate", question: "Which approach helps avoid specificity conflicts?", answers: [{ text: "Use only IDs", correct: false }, { text: "Favor class selectors over IDs and reduce nesting depth", correct: true }, { text: "Use !important everywhere", correct: false }, { text: "Inline all styles", correct: false }] },
    	{ category: "integrate", question: "What is the purpose of CSS source maps?", answers: [{ text: "Create site maps", correct: false }, { text: "Map compiled/minified CSS back to source for debugging", correct: true }, { text: "Show geographic data", correct: false }, { text: "Validate CSS", correct: false }] },
    	{ category: "integrate", question: "How should stylesheets be ordered?", answers: [{ text: "Random order", correct: false }, { text: "Base → Layout → Components → Utilities", correct: true }, { text: "Alphabetically", correct: false }, { text: "By file size", correct: false }] },
    	{ category: "integrate", question: "What indicates a well-formed HTML document?", answers: [{ text: "Has colors", correct: false }, { text: "Properly nested tags, closed elements, valid DOCTYPE", correct: true }, { text: "Uses tables", correct: false }, { text: "Has JavaScript", correct: false }] },
    	{ category: "integrate", question: "Which tool profiles CSS rendering performance?", answers: [{ text: "HTML validator", correct: false }, { text: "Performance/Rendering tab in DevTools", correct: true }, { text: "Console", correct: false }, { text: "Sources panel", correct: false }] },
    	{ category: "integrate", question: "What does 'progressive enhancement' mean?", answers: [{ text: "Adding features randomly", correct: false }, { text: "Building basic functionality first, then enhancing for modern browsers", correct: true }, { text: "Progressive images only", correct: false }, { text: "Gradual color changes", correct: false }] },
    	{ category: "integrate", question: "How do you check cross-browser compatibility?", answers: [{ text: "Test in one browser", correct: false }, { text: "Test across different browsers and use feature queries (@supports)", correct: true }, { text: "Assume all browsers same", correct: false }, { text: "Don't check", correct: false }] },
    	{ category: "integrate", question: "What CSS feature allows conditional styling based on support?", answers: [{ text: "@if", correct: false }, { text: "@supports", correct: true }, { text: "@media", correct: false }, { text: "@check", correct: false }] },
    	{ category: "integrate", question: "Which layout overlay helps debug positioning?", answers: [{ text: "Grid overlay", correct: false }, { text: "Box Model visualization in DevTools", correct: true }, { text: "Color picker", correct: false }, { text: "Font inspector", correct: false }] },
    	{ category: "integrate", question: "What indicates good CSS architecture?", answers: [{ text: "Long selectors", correct: false }, { text: "Modular, reusable components with low specificity", correct: true }, { text: "Everything inline", correct: false }, { text: "Single huge file", correct: false }] },
    	{ category: "integrate", question: "How do you style form validation states without layout shift?", answers: [{ text: "Add/remove elements", correct: false }, { text: "Reserve space for messages and toggle visibility", correct: true }, { text: "Use alerts", correct: false }, { text: "Ignore layout", correct: false }] },
    	{ category: "integrate", question: "What makes a button accessible?", answers: [{ text: "Large size only", correct: false }, { text: "Semantic <button>, visible focus, keyboard accessible", correct: true }, { text: "Bright colors", correct: false }, { text: "Animations", correct: false }] },
    	{ category: "integrate", question: "Which CSS methodology prevents naming collisions?", answers: [{ text: "Random names", correct: false }, { text: "BEM or similar naming conventions", correct: true }, { text: "Short names", correct: false }, { text: "Numbers", correct: false }] },
    	{ category: "integrate", question: "What is the benefit of CSS custom properties over preprocessor variables?", answers: [{ text: "No benefit", correct: false }, { text: "Can be changed dynamically at runtime and cascade", correct: true }, { text: "Compile faster", correct: false }, { text: "Better specificity", correct: false }] },
    	{ category: "integrate", question: "How do you debug cascade issues?", answers: [{ text: "Guess randomly", correct: false }, { text: "Check computed styles to see which rule wins and why", correct: true }, { text: "Delete all CSS", correct: false }, { text: "Use only inline styles", correct: false }] },
    	{ category: "integrate", question: "What indicates proper separation of concerns?", answers: [{ text: "CSS in HTML attributes", correct: false }, { text: "HTML for structure, CSS for presentation, JS for behavior", correct: true }, { text: "Everything in JavaScript", correct: false }, { text: "Inline styles everywhere", correct: false }] },
    	{ category: "integrate", question: "Which practice improves CSS maintainability?", answers: [{ text: "Long selector chains", correct: false }, { text: "Design tokens (CSS variables) and component patterns", correct: true }, { text: "Duplicate code", correct: false }, { text: "No comments", correct: false }] },
    	{ category: "integrate", question: "How should relative paths be used?", answers: [{ text: "Avoid them", correct: false }, { text: "Consistently (e.g., ../css/style.css) without fragile deep nesting", correct: true }, { text: "Only absolute paths", correct: false }, { text: "Randomly", correct: false }] },
    	{ category: "integrate", question: "What is the purpose of /src and /dist folders?", answers: [{ text: "Store images", correct: false }, { text: "Separate source code from built/compiled output", correct: true }, { text: "Backup files", correct: false }, { text: "Version control", correct: false }] },
    	{ category: "integrate", question: "Which file should be the default entry point?", answers: [{ text: "main.html", correct: false }, { text: "index.html", correct: true }, { text: "home.html", correct: false }, { text: "start.html", correct: false }] },
    	{ category: "integrate", question: "What makes forms keyboard accessible?", answers: [{ text: "Mouse only", correct: false }, { text: "Logical tab order, visible focus indicators, semantic controls", correct: true }, { text: "Touch only", correct: false }, { text: "Voice commands", correct: false }] },
    	{ category: "integrate", question: "What is the difference between <link> and @import for CSS?", answers: [{ text: "No difference", correct: false }, { text: "<link> loads in parallel (faster); @import loads sequentially", correct: true }, { text: "@import is faster", correct: false }, { text: "<link> is deprecated", correct: false }] },
    	{ category: "integrate", question: "Where should <script> tags typically be placed?", answers: [{ text: "In <head>", correct: false }, { text: "Before </body> or with defer attribute", correct: true }, { text: "Before <!DOCTYPE>", correct: false }, { text: "Doesn't matter", correct: false }] },
    	{ category: "integrate", question: "What is the purpose of the noscript element?", answers: [{ text: "Disable scripts", correct: false }, { text: "Provide fallback content when JavaScript is disabled", correct: true }, { text: "Comment out scripts", correct: false }, { text: "Load scripts", correct: false }] },
    	{ category: "integrate", question: "Which attribute prevents form validation?", answers: [{ text: "nocheck", correct: false }, { text: "novalidate", correct: true }, { text: "skip-validation", correct: false }, { text: "validate='false'", correct: false }] },
    	{ category: "integrate", question: "What does autocomplete='off' do?", answers: [{ text: "Disables the input", correct: false }, { text: "Prevents browser from auto-filling the field", correct: true }, { text: "Completes text automatically", correct: false }, { text: "Validates input", correct: false }] },
    	{ category: "integrate", question: "Which CSS selector targets an input when it's focused?", answers: [{ text: "input:active", correct: false }, { text: "input:focus", correct: true }, { text: "input:hover", correct: false }, { text: "input:selected", correct: false }] },
    	{ category: "integrate", question: "How do you create a CSS-only tooltip?", answers: [{ text: "JavaScript only", correct: false }, { text: "Use ::after pseudo-element with :hover", correct: true }, { text: "Use title attribute", correct: false }, { text: "Use <tooltip> tag", correct: false }] },
    	{ category: "integrate", question: "What makes a table accessible?", answers: [{ text: "Large text only", correct: false }, { text: "<caption>, <th> with scope, proper structure", correct: true }, { text: "Colors", correct: false }, { text: "Borders", correct: false }] },
    	// ========================================
    	// MODULE 4: RESPONSIVE WEB DESIGN (~25 questions)
    	// Category: responsive
    	// ========================================
    	// 4.1 Responsive design fundamentals
    	{ category: "responsive", question: "What is the best approach for responsive design?", answers: [{ text: "Desktop-first", correct: false }, { text: "Mobile-first", correct: true }, { text: "Tablet-first", correct: false }, { text: "Order doesn't matter", correct: false }] },
    	{ category: "responsive", question: "How do you make an image responsive with CSS?", answers: [{ text: "width: 100%", correct: false }, { text: "max-width: 100%; height: auto;", correct: true }, { text: "responsive: true;", correct: false }, { text: "flex: 1;", correct: false }] },
    	{ category: "responsive", question: "Which HTML attribute serves different images for different screen sizes?", answers: [{ text: "src", correct: false }, { text: "srcset", correct: true }, { text: "sources", correct: false }, { text: "media", correct: false }] },
    	{ category: "responsive", question: "What does a mobile-first media query look like?", answers: [{ text: "@media (max-width: 768px)", correct: false }, { text: "@media (min-width: 768px)", correct: true }, { text: "@media (mobile)", correct: false }, { text: "@media screen", correct: false }] },
    	{ category: "responsive", question: "Which CSS function is useful for fluid typography?", answers: [{ text: "calc()", correct: false }, { text: "clamp()", correct: true }, { text: "var()", correct: false }, { text: "fluid()", correct: false }] },
    	{ category: "responsive", question: "What is the purpose of the viewport meta tag?", answers: [{ text: "Show viewport", correct: false }, { text: "Control layout viewport and initial scale on mobile", correct: true }, { text: "Add viewport styles", correct: false }, { text: "Create viewports", correct: false }] },
    	{ category: "responsive", question: "Which unit creates fluid grids that scale?", answers: [{ text: "px only", correct: false }, { text: "% or fr units", correct: true }, { text: "pt", correct: false }, { text: "cm", correct: false }] },
    	{ category: "responsive", question: "What CSS property sets aspect ratio?", answers: [{ text: "ratio", correct: false }, { text: "aspect-ratio", correct: true }, { text: "proportion", correct: false }, { text: "width-height", correct: false }] },
    	{ category: "responsive", question: "Which media feature detects device orientation?", answers: [{ text: "@media (direction)", correct: false }, { text: "@media (orientation: portrait/landscape)", correct: true }, { text: "@media (rotate)", correct: false }, { text: "@media (position)", correct: false }] },
    	// 4.2 Modern layout systems
    	{ category: "responsive", question: "When should you use Flexbox vs CSS Grid?", answers: [{ text: "Always use Grid", correct: false }, { text: "Flexbox for one-dimensional layouts; Grid for two-dimensional", correct: true }, { text: "Always use Flexbox", correct: false }, { text: "They're interchangeable", correct: false }] },
    	{ category: "responsive", question: "Which CSS Grid property creates responsive columns automatically?", answers: [{ text: "grid-template-columns: auto;", correct: false }, { text: "grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));", correct: true }, { text: "grid-auto-columns: responsive;", correct: false }, { text: "grid-columns: flexible;", correct: false }] },
    	{ category: "responsive", question: "What does auto-fit do in CSS Grid?", answers: [{ text: "Fits content to grid", correct: false }, { text: "Automatically fits as many columns as possible, collapsing empty tracks", correct: true }, { text: "Auto-sizes images", correct: false }, { text: "Validates grid", correct: false }] },
    	{ category: "responsive", question: "What is the difference between auto-fit and auto-fill?", answers: [{ text: "No difference", correct: false }, { text: "auto-fit collapses empty tracks; auto-fill keeps them", correct: true }, { text: "auto-fill is faster", correct: false }, { text: "auto-fit is deprecated", correct: false }] },
    	{ category: "responsive", question: "Which Flexbox property controls spacing between items?", answers: [{ text: "spacing", correct: false }, { text: "gap", correct: true }, { text: "margin", correct: false }, { text: "padding", correct: false }] },
    	{ category: "responsive", question: "What does flex-wrap: wrap do?", answers: [{ text: "Wraps text", correct: false }, { text: "Allows flex items to wrap to new lines", correct: true }, { text: "Wraps containers", correct: false }, { text: "Creates gift wrapping", correct: false }] },
    	{ category: "responsive", question: "Which Grid property defines row heights?", answers: [{ text: "grid-rows", correct: false }, { text: "grid-template-rows", correct: true }, { text: "row-height", correct: false }, { text: "rows", correct: false }] },
    	{ category: "responsive", question: "What does justify-content do in Flexbox?", answers: [{ text: "Vertical alignment", correct: false }, { text: "Distributes space along main axis", correct: true }, { text: "Validates content", correct: false }, { text: "Justifies text", correct: false }] },
    	{ category: "responsive", question: "What does align-items do in Flexbox?", answers: [{ text: "Aligns text", correct: false }, { text: "Aligns items along cross axis", correct: true }, { text: "Creates rows", correct: false }, { text: "Distributes space", correct: false }] },
    	{ category: "responsive", question: "Which CSS function returns the smaller value?", answers: [{ text: "min()", correct: true }, { text: "small()", correct: false }, { text: "lesser()", correct: false }, { text: "minimum()", correct: false }] },
    	// 4.3 Performance for responsive experiences
    	{ category: "responsive", question: "Which technique improves initial page load performance?", answers: [{ text: "Load all images in high-res", correct: false }, { text: "Lazy loading with loading='lazy' and inline critical CSS", correct: true }, { text: "Use only PNG images", correct: false }, { text: "Disable caching", correct: false }] },
    	{ category: "responsive", question: "Which modern image format provides better compression?", answers: [{ text: "BMP", correct: false }, { text: "WebP or AVIF", correct: true }, { text: "GIF", correct: false }, { text: "TIFF", correct: false }] },
    	{ category: "responsive", question: "What is the purpose of preconnect?", answers: [{ text: "Connect cables", correct: false }, { text: "Establish early connections to important third-party origins", correct: true }, { text: "Pre-load images", correct: false }, { text: "Validate connections", correct: false }] },
    	{ category: "responsive", question: "Which metric measures layout stability?", answers: [{ text: "FPS", correct: false }, { text: "CLS (Cumulative Layout Shift)", correct: true }, { text: "TTL", correct: false }, { text: "FCP", correct: false }] },
    	{ category: "responsive", question: "What does LCP measure?", answers: [{ text: "Load Complete Percentage", correct: false }, { text: "Largest Contentful Paint - loading performance", correct: true }, { text: "Low Content Page", correct: false }, { text: "Link Click Performance", correct: false }] },
    	{ category: "responsive", question: "How do you prevent layout shift from images?", answers: [{ text: "Don't use images", correct: false }, { text: "Specify width and height attributes", correct: true }, { text: "Use only small images", correct: false }, { text: "Load images last", correct: false }] },
    	{ category: "responsive", question: "Which CSS property prevents horizontal scrolling?", answers: [{ text: "scroll: none", correct: false }, { text: "overflow-x: hidden", correct: true }, { text: "no-scroll: true", correct: false }, { text: "scrollbar: hidden", correct: false }] },
    	{ category: "responsive", question: "What does the 'vw' unit represent?", answers: [{ text: "Very wide", correct: false }, { text: "1% of viewport width", correct: true }, { text: "Variable width", correct: false }, { text: "View width", correct: false }] },
    	{ category: "responsive", question: "What does the 'vh' unit represent?", answers: [{ text: "Very high", correct: false }, { text: "1% of viewport height", correct: true }, { text: "Variable height", correct: false }, { text: "View height", correct: false }] },
    	{ category: "responsive", question: "Which CSS property prevents text from getting too wide?", answers: [{ text: "width: 100%", correct: false }, { text: "max-width: 60ch or similar", correct: true }, { text: "text-width", correct: false }, { text: "wrap: true", correct: false }] },
    	{ category: "responsive", question: "What does flex-shrink control?", answers: [{ text: "Element size", correct: false }, { text: "How much a flex item can shrink relative to others", correct: true }, { text: "Font shrinking", correct: false }, { text: "Container shrinking", correct: false }] },
    	{ category: "responsive", question: "What does flex-grow control?", answers: [{ text: "Element size", correct: false }, { text: "How much a flex item can grow relative to others", correct: true }, { text: "Font growing", correct: false }, { text: "Container growing", correct: false }] },
    	{ category: "responsive", question: "Which Grid function automatically sizes tracks?", answers: [{ text: "auto", correct: false }, { text: "minmax()", correct: true }, { text: "size()", correct: false }, { text: "track()", correct: false }] },
    	// ========================================
    	// MODULE 5: ACCESSIBILITY, USABILITY & BEST PRACTICES (~30 questions)
    	// Category: accessibility
    	// ========================================
    	// 5.1 Accessibility and usability
    	{ category: "accessibility", question: "What is the minimum color contrast ratio for normal text (WCAG AA)?", answers: [{ text: "3:1", correct: false }, { text: "4.5:1", correct: true }, { text: "7:1", correct: false }, { text: "2:1", correct: false }] },
    	{ category: "accessibility", question: "Which semantic landmarks improve screen reader navigation?", answers: [{ text: "<div> and <span>", correct: false }, { text: "<main>, <nav>, <header>, <footer>, <aside>", correct: true }, { text: "<section> only", correct: false }, { text: "<article> only", correct: false }] },
    	{ category: "accessibility", question: "How do you hide content visually but keep it for screen readers?", answers: [{ text: "display: none;", correct: false }, { text: "visibility: hidden;", correct: false }, { text: "position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden;", correct: true }, { text: "opacity: 0;", correct: false }] },
    	{ category: "accessibility", question: "What is the purpose of skip links?", answers: [{ text: "Skip pages", correct: false }, { text: "Allow keyboard users to bypass repetitive navigation", correct: true }, { text: "Skip loading", correct: false }, { text: "Skip images", correct: false }] },
    	{ category: "accessibility", question: "Which attribute describes form field errors?", answers: [{ text: "aria-error", correct: false }, { text: "aria-describedby", correct: true }, { text: "aria-message", correct: false }, { text: "error-text", correct: false }] },
    	{ category: "accessibility", question: "What does aria-live do?", answers: [{ text: "Creates live video", correct: false }, { text: "Announces dynamic content changes to screen readers", correct: true }, { text: "Makes content animated", correct: false }, { text: "Tests if user is active", correct: false }] },
    	{ category: "accessibility", question: "Which media query respects user motion preferences?", answers: [{ text: "@media (prefers-reduced-motion)", correct: true }, { text: "@media (no-animation)", correct: false }, { text: "@media (motion-off)", correct: false }, { text: "@media (static)", correct: false }] },
    	{ category: "accessibility", question: "What makes a focus indicator visible?", answers: [{ text: "High contrast outline or ring", correct: true }, { text: "Transparent border", correct: false }, { text: "outline: none;", correct: false }, { text: "Hidden focus", correct: false }] },
    	{ category: "accessibility", question: "Which ARIA role announces important messages?", answers: [{ text: "role='message'", correct: false }, { text: "role='alert'", correct: true }, { text: "role='notice'", correct: false }, { text: "role='important'", correct: false }] },
    	{ category: "accessibility", question: "What is keyboard trap and why avoid it?", answers: [{ text: "A design pattern", correct: false }, { text: "When keyboard focus gets stuck, preventing navigation - major accessibility barrier", correct: true }, { text: "A CSS property", correct: false }, { text: "A security feature", correct: false }] },
    	{ category: "accessibility", question: "Which heading structure is proper?", answers: [{ text: "h1 > h3 > h2", correct: false }, { text: "h1 > h2 > h3", correct: true }, { text: "h3 > h2 > h1", correct: false }, { text: "All h1", correct: false }] },
    	{ category: "accessibility", question: "What is the purpose of alt text on images?", answers: [{ text: "SEO only", correct: false }, { text: "Provide text alternative for users who cannot see images", correct: true }, { text: "Image captions", correct: false }, { text: "Decoration", correct: false }] },
    	{ category: "accessibility", question: "When should alt='' (empty alt) be used?", answers: [{ text: "Never", correct: false }, { text: "For decorative images that convey no information", correct: true }, { text: "For all images", correct: false }, { text: "When lazy", correct: false }] },
    	{ category: "accessibility", question: "What makes navigation predictable?", answers: [{ text: "Random menu order", correct: false }, { text: "Consistent layout, clear labels, logical structure", correct: true }, { text: "Hidden menus", correct: false }, { text: "Hover-only navigation", correct: false }] },
    	{ category: "accessibility", question: "Which practice improves form usability?", answers: [{ text: "Placeholder as label", correct: false }, { text: "Clear labels, error messages near fields, logical tab order", correct: true }, { text: "Hidden required fields", correct: false }, { text: "Submit on every keystroke", correct: false }] },
    	// 5.2 Best practices and quality assurance
    	{ category: "accessibility", question: "What does 'separation of concerns' mean?", answers: [{ text: "Separate files by size", correct: false }, { text: "Keep HTML (structure), CSS (presentation), and JS (behavior) separate", correct: true }, { text: "Separate developers", correct: false }, { text: "Alphabetical organization", correct: false }] },
    	{ category: "accessibility", question: "Which naming convention prevents CSS collisions?", answers: [{ text: "Random names", correct: false }, { text: "BEM (Block Element Modifier)", correct: true }, { text: "Short names", correct: false }, { text: "Numbers only", correct: false }] },
    	{ category: "accessibility", question: "What are design tokens?", answers: [{ text: "Security tokens", correct: false }, { text: "Centralized design values (colors, spacing) often as CSS custom properties", correct: true }, { text: "Authentication keys", correct: false }, { text: "Payment tokens", correct: false }] },
    	{ category: "accessibility", question: "What is progressive enhancement?", answers: [{ text: "Adding features randomly", correct: false }, { text: "Building core functionality first, then enhancing for capable browsers", correct: true }, { text: "Progressive images only", correct: false }, { text: "Gradual transitions", correct: false }] },
    	{ category: "accessibility", question: "How do you test cross-browser compatibility?", answers: [{ text: "Test in one browser", correct: false }, { text: "Test across multiple browsers and use @supports for fallbacks", correct: true }, { text: "Assume all browsers are same", correct: false }, { text: "Don't test", correct: false }] },
    	{ category: "accessibility", question: "What is a performance budget?", answers: [{ text: "Project cost limit", correct: false }, { text: "Set limits on file sizes and metrics to maintain speed", correct: true }, { text: "CPU usage limit", correct: false }, { text: "Memory limit", correct: false }] },
    	{ category: "accessibility", question: "Which metric measures interactivity responsiveness?", answers: [{ text: "FPS", correct: false }, { text: "INP (Interaction to Next Paint)", correct: true }, { text: "LCP", correct: false }, { text: "TTI", correct: false }] },
    	{ category: "accessibility", question: "What does FCP measure?", answers: [{ text: "File Compression Percentage", correct: false }, { text: "First Contentful Paint - when first content renders", correct: true }, { text: "Full Content Parsed", correct: false }, { text: "Frame Count Per-second", correct: false }] },
    	{ category: "accessibility", question: "Which practice improves code maintainability?", answers: [{ text: "No comments", correct: false }, { text: "Clear naming, modular structure, documentation, version control", correct: true }, { text: "Long variable names", correct: false }, { text: "Duplicate code", correct: false }] },
    	// 5.3 SEO and analytics
    	{ category: "accessibility", question: "Which elements are most important for SEO?", answers: [{ text: "Divs and spans", correct: false }, { text: "<title>, <meta name='description'>, headings, and image alt text", correct: true }, { text: "Only title", correct: false }, { text: "Color schemes", correct: false }] },
    	{ category: "accessibility", question: "What is a KPI in web analytics?", answers: [{ text: "Key Performance Indicator - metric reflecting business goals", correct: true }, { text: "Keyword Performance Index", correct: false }, { text: "A cookie type", correct: false }, { text: "SEO tool", correct: false }] },
    	{ category: "accessibility", question: "What is the purpose of a sitemap?", answers: [{ text: "Show site map to users", correct: false }, { text: "Help search engines discover and index pages", correct: true }, { text: "Create site layout", correct: false }, { text: "Analytics tracking", correct: false }] },
    	{ category: "accessibility", question: "What does canonical URL prevent?", answers: [{ text: "Hacking", correct: false }, { text: "Duplicate content issues in search engines", correct: true }, { text: "404 errors", correct: false }, { text: "Slow loading", correct: false }] },
    	{ category: "accessibility", question: "Which meta tag tells search engines not to index a page?", answers: [{ text: "<meta name='noindex'>", correct: false }, { text: "<meta name='robots' content='noindex'>", correct: true }, { text: "<meta name='search' content='false'>", correct: false }, { text: "<meta hidden='true'>", correct: false }] },
    	{ category: "accessibility", question: "What is structured data (Schema.org)?", answers: [{ text: "Organized folders", correct: false }, { text: "Markup that helps search engines understand content context", correct: true }, { text: "Database structure", correct: false }, { text: "File organization", correct: false }] },
    	{ category: "accessibility", question: "What is the purpose of tabindex='0'?", answers: [{ text: "Removes from tab order", correct: false }, { text: "Makes element keyboard focusable in natural order", correct: true }, { text: "Sets first tab", correct: false }, { text: "Disables tabbing", correct: false }] },
    	{ category: "accessibility", question: "What does tabindex='-1' do?", answers: [{ text: "Makes element first in tab order", correct: false }, { text: "Removes from tab order but allows programmatic focus", correct: true }, { text: "Reverses tab order", correct: false }, { text: "Validates tabs", correct: false }] },
    	{ category: "accessibility", question: "Which attribute announces button state to screen readers?", answers: [{ text: "aria-state", correct: false }, { text: "aria-pressed or aria-expanded", correct: true }, { text: "state", correct: false }, { text: "button-state", correct: false }] },
    	{ category: "accessibility", question: "What does aria-hidden='true' do?", answers: [{ text: "Hides element visually", correct: false }, { text: "Hides element from assistive technologies", correct: true }, { text: "Hides element completely", correct: false }, { text: "Makes element transparent", correct: false }] },
    	{ category: "accessibility", question: "Which practice improves readability?", answers: [{ text: "Small text", correct: false }, { text: "Adequate line-height (1.5+), line-length (60-70ch), contrast", correct: true }, { text: "All caps", correct: false }, { text: "Justified text", correct: false }] },
    	{ category: "accessibility", question: "What is WCAG?", answers: [{ text: "Web Content Accessibility Guidelines", correct: true }, { text: "Website Color and Graphics", correct: false }, { text: "Web Coding and Grammar", correct: false }, { text: "Worldwide Content Association", correct: false }] },
    	{ category: "accessibility", question: "Which WCAG level is legally required in many jurisdictions?", answers: [{ text: "A", correct: false }, { text: "AA", correct: true }, { text: "AAA", correct: false }, { text: "B", correct: false }] },
    	{ category: "accessibility", question: "What makes video content accessible?", answers: [{ text: "High resolution only", correct: false }, { text: "Captions, transcripts, audio descriptions", correct: true }, { text: "Autoplay", correct: false }, { text: "Large player", correct: false }] },
    	{ category: "accessibility", question: "Which heading level comes after h3?", answers: [{ text: "h5", correct: false }, { text: "h4", correct: true }, { text: "h2", correct: false }, { text: "h6", correct: false }] },
    	{ category: "accessibility", question: "What is the purpose of lang attribute on elements?", answers: [{ text: "Set programming language", correct: false }, { text: "Indicate natural language for correct pronunciation by screen readers", correct: true }, { text: "Language translation", correct: false }, { text: "Spell check", correct: false }] }
    ]; // end allQuestions

    const shuffledQuestions = generateExam(allQuestions, EXAM_DISTRIBUTION);

    function startQuiz() {
        startScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        
        // shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5).slice(0, TOTAL_QUESTIONS);
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
    
    function shuffleAnswers(question) {
        question.answers = question.answers
            .map(a => ({ ...a }))
            .sort(() => Math.random() - 0.5);
        return question;
    }

    function showQuestion(question) {
        // // Set the question text
        // questionTextElement.innerText = question.question;

        // // 🔀 Shuffle answers so the correct one isn't always in the same position
        // const shuffledAnswers = question.answers
        //     .map(a => ({ ...a })) // shallow copy
        //     .sort(() => Math.random() - 0.5);

        // // Add fade-in animation class
        // questionContainer.classList.remove('fade-in'); // reset if applied before
        // void questionContainer.offsetWidth; // trick to reflow and restart animation
        // questionContainer.classList.add('fade-in');

        // // Create answer buttons dynamically
        // shuffledAnswers.forEach(answer => {
        //     const button = document.createElement('button');
        //     button.innerText = answer.text;
        //     button.classList.add('btn', 'fade-in'); // each answer fades in too
        //     if (answer.correct) {
        //         button.dataset.correct = answer.correct;
        //     }
        //     button.addEventListener('click', selectAnswer);
        //     answerButtonsElement.appendChild(button);
        // });
        
        const mixed = shuffleAnswers(question);

        questionTextElement.innerText = mixed.question;
        questionContainer.classList.remove('fade-in'); // reset if applied before
        void questionContainer.offsetWidth; // trick to reflow and restart animation
        questionContainer.classList.add('fade-in');

        mixed.answers.forEach(answer => {
            const btn = document.createElement("button");
            btn.innerText = answer.text;
            btn.classList.add('btn', 'fade-in');
    
            if (answer.correct) btn.dataset.correct = true;
    
            btn.addEventListener("click", selectAnswer);
            answerButtonsElement.appendChild(btn);
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