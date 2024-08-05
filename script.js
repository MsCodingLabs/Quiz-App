// DOM-Elemente abrufen, Daten initialisieren
const dom = {
  title: document.getElementById('title'),  // TITEL des Quizzes
  progress: {
    progressFill: document.getElementById('progress-fill'),     // Fortschrittsbalken
    questionNumber: document.getElementById('question-number'), // Aktuelle Frage Nummer
    totalQuestions: document.getElementById('total-questions'), // Gesamte Fragenanzahl
  },
  questionWrap: document.getElementById('question-wrap'),       // Container für Fragen
  step: {
    question: document.getElementById('question'),              // Frage-Element
    questionPosition: document.getElementById('question-position'), // Frage-Position
  },
  answers: document.getElementById('answers'),                  // Antworten-Container
  next: document.getElementById('next'),                        // "Nächste Frage" Button
  result: {
    resultBlock: document.getElementById('result'),             // Ergebnis-Block
    validAnswers: document.getElementById('valid-answers'),     // Richtige Antworten Anzahl
    questionsCount: document.getElementById('result-total-questions'),  // Gesamtfragen im Ergebnis
  }
};

// TITEL setzen
dom.title.innerHTML = data.title;         // Titel des Quizzes im DOM setzen
let totalSteps = data.questions.length;   // Gesamtanzahl der Fragen
let step = 0;                             // Aktueller Schritt/Frage
let validAnswersCount = 0;                // Zähler für korrekte Antworten

// Klick auf den Button 'Nächste Frage'
dom.next.onclick = () => { 
  // Überprüfen, ob die aktuelle Schrittzahl kleiner ist als die Gesamtanzahl der Schritte
  if (step < totalSteps) {  
    // Wenn ja, wird die Schrittzahl um eins erhöht
    step++;   
    // Dann wird die Funktion 'renderQuiz' aufgerufen, um das Quiz mit den aktualisierten Schritten neu zu rendern    
    renderQuiz(totalSteps, step); 
  }
};

// Funktion zur Darstellung der gesamten Umfrage
function renderQuiz(total, step) {
  renderProgress(total, step);  // um den Fortschritt des Quiz anzuzeigen
  if (step < total) {           // Überprüfen, ob die aktuelle Schrittzahl kleiner ist als die Gesamtanzahl der Schritte
    // Wenn ja, werden die Antwortmöglichkeiten der aktuellen Frage aus den Daten extrahiert
    const answers = data.questions[step].answers; // Antworten der aktuellen Frage
     const answersHtml = buildAnswers(answers); // Funktion, um HTML-Code für Antworten erstellen
    renderQuestion(step);       // aktuelle Frage anzeigen
    renderAnswers(answersHtml); // generierte Antwortmöglichkeiten anzeigen
    isDisableButton(true); // 'Nächste Frage'-Button deaktivieren
  } else {
    // Wenn die aktuelle Schrittzahl nicht kleiner ist als die Gesamtanzahl der Schritte, wird das Ergebnis angezeigt
    renderResults(); 
  }
}

// Darstellung eines Fortschrittsbalkens
function renderProgress(total, step) {
  //  Der Fortschrittsprozentsatz wird basierend auf der aktuellen Schrittzahl und der Gesamtanzahl der Schritte berechnet und Fortschrittsbalken aufgefüllt:
  const progressPercent = 100 / total * step; // 100% / Ges.Anzahl der Fragen (in dem Fall 3) x Aktuelle Schritte, um % rauszubekommen
  dom.progress.questionNumber.innerHTML = step + 0; // Aktuelle Frage-Nummer
  dom.progress.totalQuestions.innerHTML = total; // Gesamtanzahl der Fragen
  dom.progress.progressFill.style.width = `${progressPercent}%`; // Die Breite des Fortschrittsbalkens wird auf den berechneten Prozentsatz gesetzt
}

// Darstellung der Frage 
function renderQuestion(step) {
  dom.step.questionPosition.innerHTML = `${step + 1}`; // die Anzeige der aktuellen Frageposition aktualisieren (step= eine Zahlfür die erste Frage, +1 =Pos. der Frage)
  dom.step.question.innerHTML = data.questions[step].question;  // Den Inhalt des Frageelements mit der aktuellen Frage aktualisieren
}

// Erstellung von HTML-Struktur für die Antworten
function buildAnswers(answers) {
  // ein neues Array erstellen, in dem jede Antwort in ein HTML-Div-Element umgewandelt wird
  return answers.map((answer, idx) => `<div class="quiz_answer" data-id="${idx + 1}">${answer}</div>`).join(''); 
                                      // Div-Elements mit der Klasse 'quiz_answer' erstellen
                                      // data-id ist ein Attribut, das die Antwortnummer speichert (begonnen mit 1 statt 0)
                                      // ${answer} ist der eigentliche Antworttext, der im Div-Element angezeigt wird
                                      // join(''), um das Array der HTML-Strings in einen einzigen String zu konvertieren
}

// Darstellung von Antworten im HTML
function renderAnswers(htmlString) {
  dom.answers.innerHTML = htmlString; // Antworten HTML anzeigen
    // den inneren HTML-Inhalt des Elements setzen, das die Antworten enthält, auf den übergebenen HTML-String
    // `dom.answers` ist das HTML-Element, das für die Anzeige der Antworten vorgesehen ist
    // `htmlString` ist der String, der die HTML-Struktur für die Antworten enthält
}

// Verfolgung des Klicks auf eine Antwort
dom.answers.onclick = (event) => {
  const target = event.target;                    // Angeclicktes Element speichern
  // Überprüfen, ob das geklickte Element die Klasse 'quiz_answer' enthält
  if (target.classList.contains('quiz_answer')) {   // Wenn eine Antwort angeklickt wurde
       // Holt die Antwortnummer aus dem data-id Attribut des geklickten Elements
    const answerNumber = target.dataset.id;       // Antwortnummer
    const isValid = checkAnswer(step, answerNumber); // Antwort überprüfen indem checkAnsweraufgerufen wird (step = aktuelle Frage /answerNumber = Nr. der geckliten Antwort)
    const answerClass = isValid ? 'quiz_answer_valid' : 'quiz_answer_invalid';  // Bestimmt die Klasse, die je nach Richtigkeit der Antwort hinzugefügt wird ('quiz_answer_valid'=richtige Antwort, 'quiz_answer_invalid'=falsche Antwort )
    target.classList.add(answerClass); // Klasse zum geklichkten Element hinzufügen, um die Antwort als richtig oder falsch zu markieren
    isDisableButton(false); // 'Nächste Frage'-Button aktivieren oder deaktivieren, basierend auf der Übergabe von 'false'
    validAnswersCount += isValid ? 1 : 0; // die Zählung der richtigen Antworten erhöhen, falls die Antwort korrekt ist
  }
};

// Überprüfung der Richtigkeit der Antwort
function checkAnswer(step, answer) {
  return data.questions[step].validAnswer == answer; // Vergleich: Ist die Antwort richtig?
      // `data.questions[step].validAnswer` enthält die korrekte Antwort für die Frage im aktuellen Schritt
      // `answer` ist die Antwortnummer, die der Benutzer ausgewählt hat
}

// Funktion zum Aktivieren oder Deaktivieren des "Next"-Buttons
function isDisableButton(isDisable) {
  dom.next.classList.toggle('quiz_btn_disable', isDisable); // 'Nächste Frage'-Button aktivieren/deaktivieren
  // `dom.next` ist das HTML-Element des 'Nächste Frage'-Button
  // `classList.toggle` fügt die Klasse 'quiz_btn_disable' hinzu, wenn `isDisable` true ist,
  // und entfernt sie, wenn `isDisable` false ist
}

// Ändern des Texts auf der Schaltfläche
function changeButtonOnResult() {
  dom.next.innerText = 'Ergebnis anzeigen'; // den Text der 'Nächste Frage'-Button in 'Ergebnis anzeigen' ändern
  dom.next.dataset.result = 'result';       // Datensatz 'result' für den Button 'Nächste Frage' ändern
          // `dataset` ermöglicht das Hinzufügen von benutzerdefinierten Datenattributen zu einem HTML-Element
}

// Funktion zum Anzeigen der Ergebnisse nach Abschluss des Quiz
function renderResults() {
  dom.answers.style.display = 'none'; // Element, das Antworten enthält ausblenden
  dom.next.style.display = 'none'; // 'Nächste Frage'-Button ausblenden
  dom.questionWrap.style.display = 'none'; // Fragenbereich ausblenden
  dom.result.resultBlock.style.display = 'block'; // Ergebnisbereich anzeigen
  dom.result.validAnswers.innerHTML = validAnswersCount; // Anzahl der korrekten Antworten aktualisieren/anzeigen
  dom.result.questionsCount.innerHTML = totalSteps; // Gesamtanzahl der Fragen aktualisieren/anzeigen
}

// Initiales Rendern des Quizzes
renderQuiz(totalSteps, step);  // Starte das Quiz