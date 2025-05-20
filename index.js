let flashcards = JSON.parse(localStorage.getItem('flashcards') || '[]');
let tempDeck = [];
let currentCard = null;
let showEnglish = true;
let perfectedCount = 0;
let totalSessionCards = 0;

let faceUpLanguage = 'english';

function toggleFaceup(lang) {
    faceUpLanguage = lang;
    document.getElementById('englishToggle').classList.toggle('disabled', lang !== 'english');
    document.getElementById('spanishToggle').classList.toggle('disabled', lang !== 'spanish');
    document.querySelector('#englishToggle input').checked = lang === 'english';
    document.querySelector('#spanishToggle input').checked = lang === 'spanish';
}

toggleFaceup('english');

if (flashcards.length > 0) {
    document.getElementById('startButton').disabled = false;
}

function saveFlashcards() {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    renderEditor();
}

function addFlashcard() {
    const english = document.getElementById('english').value.trim();
    const spanish = document.getElementById('spanish').value.trim();
    if (english && spanish) {
    flashcards.push({ english, spanish });
    saveFlashcards();
    document.getElementById('english').value = '';
    document.getElementById('spanish').value = '';
    document.getElementById('startButton').disabled = false;
    }
}

function startStudy() {
    if (flashcards.length === 0) return;
    const reviewAll = document.getElementById('reviewAllCheckbox').checked;
    tempDeck = flashcards.map(card => ({ ...card, bucket: 1 }));
    perfectedCount = 0;
    totalSessionCards = tempDeck.length;
    document.getElementById('flashcard').style.display = 'block';
    document.getElementById('rankings').style.display = 'flex';
    document.getElementById('progress').style.display = 'block';
    document.getElementById('sessionCounter').style.display = 'block';
    updateProgress();
    nextCard();
}

function nextCard() {
    if (tempDeck.length === 0) {
    alert('Study session complete!');
    document.getElementById('flashcard').style.display = 'none';
    document.getElementById('rankings').style.display = 'none';
    document.getElementById('progress').style.display = 'none';
    document.getElementById('sessionCounter').style.display = 'none';
    return;
    }
    tempDeck.sort((a, b) => a.bucket - b.bucket);
    currentCard = tempDeck[0];
    showEnglish = (faceUpLanguage === 'english');
    updateFlashcard();
    updateCounter();
}

function updateFlashcard() {
    const flashcardElement = document.getElementById('flashcard');
    flashcardElement.innerText = showEnglish ? currentCard.english : currentCard.spanish;
    flashcardElement.style.backgroundColor = '#ffffff';
}

function flipCard() {
    showEnglish = !showEnglish;
    const flashcardElement = document.getElementById('flashcard');
    updateFlashcard();
    flashcardElement.style.backgroundColor = '#fffae6';
}

function rankCard(rank) {
    currentCard.bucket = rank;
    if (rank === 4) {
    tempDeck = tempDeck.filter(card => card !== currentCard);
    perfectedCount++;
    } else {
    const index = tempDeck.indexOf(currentCard);
    if (index !== -1) {
        tempDeck.splice(index, 1);
        tempDeck.push(currentCard);
    }
    }
    updateProgress();
    nextCard();
}

function updateProgress() {
    const total = totalSessionCards;
    const percent = (perfectedCount / total) * 100;
    document.getElementById('progressBar').style.width = `${percent}%`;
}

function updateCounter() {
    const remaining = tempDeck.length;
    const text = `${totalSessionCards - remaining + 1} / ${totalSessionCards}`;
    document.getElementById('sessionCounter').innerText = `Card: ${text}`;
}

function renderEditor() {
    const editorList = document.getElementById('editorList');
    editorList.innerHTML = '';
    flashcards.forEach((card, index) => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'editor-card';

    const englishInput = document.createElement('input');
    englishInput.value = card.english;
    englishInput.onchange = (e) => {
        flashcards[index].english = e.target.value;
    };

    const spanishInput = document.createElement('input');
    spanishInput.value = card.spanish;
    spanishInput.onchange = (e) => {
        flashcards[index].spanish = e.target.value;
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => {
        flashcards.splice(index, 1);
        saveFlashcards();
        document.getElementById('startButton').disabled = flashcards.length === 0;
    };

    cardDiv.appendChild(englishInput);
    cardDiv.appendChild(spanishInput);
    cardDiv.appendChild(deleteBtn);

    editorList.appendChild(cardDiv);
    });
}

function openEditModal() {
    document.getElementById('editModal').style.display = 'flex';
    renderEditor();
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}