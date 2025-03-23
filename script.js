// DOM Elements
const notepad = document.getElementById('notepad');
const noteTitle = document.getElementById('noteTitle'); // Add this line
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const themeBtn = document.getElementById('themeBtn');
const savedNotesList = document.getElementById('savedNotesList');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const noNotesMessage = document.getElementById('noNotesMessage');
const body = document.body;

// Generate a unique user ID if it doesn't exist
const getUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = `user_${Math.random().toString(36).substr(2, 9)}`; // Generate a random ID
    localStorage.setItem('userId', userId);
  }
  return userId;
};

// Session Storage Key (unique to each user)
const SESSION_KEY = `userNotes_${getUserId()}`;

// Get the current date in a readable format (e.g., "October 5, 2023")
const getCurrentDate = () => {
  const date = new Date();
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Load saved notes from session storage
const loadSavedNotes = () => {
  const savedNotes = JSON.parse(localStorage.getItem(SESSION_KEY)) || [];

  if (savedNotes.length === 0) {
    savedNotesList.innerHTML = '';
    noNotesMessage.style.display = 'block'; // Show "No notes saved" message
    deleteAllBtn.classList.remove('visible'); // Hide FAB
  } else {
    savedNotesList.innerHTML = savedNotes
      .map(
        (note, index) => `
        <div class="savedNote-Container" data-index="${index}">
          <li>
            <span>${note.title}</span>
            <i class="fa-solid fa-trash delete-btn" data-index="${index}"></i>
            <div class="note-date">${note.date}</div>
          </li>
        </div>
      `
      )
      .join('');
    noNotesMessage.style.display = 'none'; // Hide "No notes saved" message
    deleteAllBtn.classList.add('visible'); // Show FAB
  }
};

// Save note to session storage
const saveNote = () => {
  const content = notepad.value.trim();
  const title = noteTitle.value.trim(); // Get the title from the input field

  if (!content) return;

  const savedNotes = JSON.parse(localStorage.getItem(SESSION_KEY)) || [];
  const date = getCurrentDate(); // Get the current date
  const newNote = { title: title || 'Untitled Note', content, date }; // Include the title in the note object

  savedNotes.push(newNote);
  localStorage.setItem(SESSION_KEY, JSON.stringify(savedNotes));
  loadSavedNotes();
  notepad.value = ''; // Clear the textarea
  noteTitle.value = ''; // Clear the title input field
};

// Delete a note
const deleteNote = (index) => {
  const savedNotes = JSON.parse(localStorage.getItem(SESSION_KEY)) || [];
  savedNotes.splice(index, 1); // Remove the note at the specified index
  localStorage.setItem(SESSION_KEY, JSON.stringify(savedNotes));
  loadSavedNotes();
};

// Delete all notes
const deleteAllNotes = () => {
  localStorage.removeItem(SESSION_KEY);
  loadSavedNotes();
};

// Clear notepad
clearBtn.addEventListener('click', () => {
  notepad.value = '';
  noteTitle.value = ''; // Clear the title input field as well
});

// Save button (manual save)
saveBtn.addEventListener('click', saveNote);

// Load note into notepad when clicked
savedNotesList.addEventListener('click', (e) => {
  // Check if the clicked element is the saved note container or its child (except the delete button)
  const savedNoteContainer = e.target.closest('.savedNote-Container');
  if (savedNoteContainer && !e.target.classList.contains('delete-btn')) {
    const index = savedNoteContainer.getAttribute('data-index');
    const savedNotes = JSON.parse(localStorage.getItem(SESSION_KEY)) || [];
    notepad.value = savedNotes[index].content;
    noteTitle.value = savedNotes[index].title; // Load the title into the title input field
  }
});

// Delete note when delete button is clicked
savedNotesList.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const index = e.target.getAttribute('data-index');
    deleteNote(index);
  }
});

// Delete all notes
deleteAllBtn.addEventListener('click', deleteAllNotes);

// Dark/Light Mode Toggle
themeBtn.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDarkMode = body.classList.contains('dark-mode');
  themeBtn.innerHTML = isDarkMode ? '<i class="fa-solid fa-sun"></i> Light Mode' : '<i class="fa-solid fa-moon"></i> Dark Mode';
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

// Load theme preference
const loadTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Light Mode';
  } else {
    body.classList.remove('dark-mode');
    themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i> Dark Mode';
  }
};

// Function to adjust sidebar height dynamically
const adjustSidebarHeight = () => {
  const sidebar = document.getElementById('sidebar');
  const savedNotesList = document.getElementById('savedNotesList');
  const toolbar = document.querySelector('.toolbar');

  if (window.innerWidth <= 768) {
    // Calculate available height for the sidebar
    const availableHeight = window.innerHeight - toolbar.offsetHeight - 100; // 100px buffer
    sidebar.style.height = `${availableHeight}px`;
    savedNotesList.style.maxHeight = `${availableHeight - 100}px`; // Adjust for padding and margins
  } else {
    // Reset height for larger screens
    sidebar.style.height = 'auto';
    savedNotesList.style.maxHeight = 'none';
  }
};
// Call the function on page load and window resize
window.addEventListener('load', adjustSidebarHeight);
window.addEventListener('resize', adjustSidebarHeight);

// Initialize
loadSavedNotes();
loadTheme();