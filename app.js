// ==========================================
// 🔴 IMPORTANT: FIREBASE CONFIGURATION 🔴
// PASTE YOUR CONFIG FROM FIREBASE BELOW:
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyChPuBq7YyudBtw3tXfPjI_BtI5vWZO3Rc",
  authDomain: "opshub-fe826.firebaseapp.com",
  projectId: "opshub-fe826",
  storageBucket: "opshub-fe826.firebasestorage.app",
  messagingSenderId: "1016769543381",
  appId: "1:1016769543381:web:e592d2ef6f4d74f52df65c",
  measurementId: "G-TH5VVE26RY"
};

// Initialize Firebase
let db = null;
if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
}

// Local State (for rendering)
let state = {
  inventory: [],
  procedures: [],
  feed: [],
  notes: [],
  checklist: []
};

// ================= HELPERS =================
function askCode(action) {
  const code = prompt(`Enter manager code to ${action}:`);
  if (code !== "billal") {
    if (code !== null) alert("Incorrect code. Access denied.");
    return false;
  }
  return true;
}

function deleteFromDB(collection, id, stateKey, renderFn) {
  if (!askCode("delete this item")) return;
  if (db) {
    db.collection(collection).doc(id).delete();
  } else {
    state[stateKey] = state[stateKey].filter(item => item.id !== id);
    localStorage.setItem('opshub_state', JSON.stringify(state));
    renderFn();
  }
}

// Initialize State
function init() {
  if (!db) {
    alert("⚠️ Firebase is not configured! Falling back to local storage.");
    fallbackInit();
    return;
  }

  db.collection("inventory").onSnapshot((snapshot) => {
    state.inventory = [];
    snapshot.forEach((doc) => {
      state.inventory.push({ id: doc.id, ...doc.data() });
    });
    if (state.inventory.length === 0 && window.INITIAL_INVENTORY) {
      window.INITIAL_INVENTORY.forEach(item => {
        db.collection("inventory").doc(item.id).set(item);
      });
    } else {
      renderInventory(document.getElementById('inventory-search').value);
    }
  });

  db.collection("procedures").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
    state.procedures = [];
    snapshot.forEach((doc) => {
      state.procedures.push({ id: doc.id, ...doc.data() });
    });
    if (state.procedures.length === 0 && window.INITIAL_PROCEDURES) {
      window.INITIAL_PROCEDURES.forEach(proc => {
        db.collection("procedures").doc(proc.id).set(proc);
      });
    } else {
      renderProcedures();
    }
  });

  db.collection("feed").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
    state.feed = [];
    snapshot.forEach((doc) => {
      state.feed.push({ id: doc.id, ...doc.data() });
    });
    renderFeed();
  });

  db.collection("notes").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
    state.notes = [];
    snapshot.forEach((doc) => {
      state.notes.push({ id: doc.id, ...doc.data() });
    });
    renderNotes();
  });

  db.collection("checklist").orderBy("timestamp", "asc").onSnapshot((snapshot) => {
    state.checklist = [];
    snapshot.forEach((doc) => {
      state.checklist.push({ id: doc.id, ...doc.data() });
    });
    if (state.checklist.length === 0) {
      const defaultTasks = [
        { id: 'task_1', title: "Perform opening temperature check", completed: false, timestamp: Date.now() - 3000 },
        { id: 'task_2', title: "Filter fryer oil & record Quality Indicator", completed: false, timestamp: Date.now() - 2000 },
        { id: 'task_3', title: "Sanitize all lobby and dining tables", completed: false, timestamp: Date.now() - 1000 }
      ];
      defaultTasks.forEach(task => {
        db.collection("checklist").doc(task.id).set({
          title: task.title,
          completed: task.completed,
          timestamp: task.timestamp
        });
      });
    } else {
      renderChecklist();
    }
  });
}

function fallbackInit() {
  const savedState = localStorage.getItem('opshub_state');
  if (savedState) {
    state = JSON.parse(savedState);
    if (!state.checklist) {
      state.checklist = [
        { id: 'task_1', title: "Perform opening temperature check", completed: false, timestamp: Date.now() - 3000 },
        { id: 'task_2', title: "Filter fryer oil & record Quality Indicator", completed: false, timestamp: Date.now() - 2000 },
        { id: 'task_3', title: "Sanitize all lobby and dining tables", completed: false, timestamp: Date.now() - 1000 }
      ];
      localStorage.setItem('opshub_state', JSON.stringify(state));
    }
  } else {
    if (window.INITIAL_INVENTORY) state.inventory = window.INITIAL_INVENTORY;
    if (window.INITIAL_PROCEDURES) state.procedures = window.INITIAL_PROCEDURES;
    state.checklist = [
      { id: 'task_1', title: "Perform opening temperature check", completed: false, timestamp: Date.now() - 3000 },
      { id: 'task_2', title: "Filter fryer oil & record Quality Indicator", completed: false, timestamp: Date.now() - 2000 },
      { id: 'task_3', title: "Sanitize all lobby and dining tables", completed: false, timestamp: Date.now() - 1000 }
    ];
    localStorage.setItem('opshub_state', JSON.stringify(state));
  }
  renderInventory();
  renderProcedures();
  renderFeed();
  renderNotes();
  renderChecklist();
}

// ================= ROUTING & LOGIN =================
const loginBtn = document.getElementById('btn-login');
const loginScreen = document.getElementById('login-screen');
const appContainer = document.getElementById('app-container');
const navItems = document.querySelectorAll('.nav-item');
const viewSections = document.querySelectorAll('.view-section');

loginBtn.addEventListener('click', () => {
  loginScreen.style.opacity = '0';
  setTimeout(() => {
    loginScreen.style.display = 'none';
    appContainer.classList.add('active');
  }, 500);
});

navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');
    const targetId = item.getAttribute('data-target');
    viewSections.forEach(section => section.classList.remove('active'));
    document.getElementById(targetId).classList.add('active');
  });
});


// ================= INVENTORY =================
const inventoryList = document.getElementById('inventory-list');
const searchInput = document.getElementById('inventory-search');
const modalInventory = document.getElementById('modal-inventory');
const formInventory = document.getElementById('form-inventory');
const btnAddInventory = document.getElementById('btn-add-inventory');

let currentCategoryFilter = 'All';

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentCategoryFilter = e.target.getAttribute('data-filter');
    renderInventory(searchInput.value);
  });
});

function compressAndResizeImage(file, maxWidth = 2560, maxHeight = 2560, quality = 0.92) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
      img.src = e.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

function highlightText(text, words) {
  if (!text || !words || words.length === 0) return text || '';
  const sortedWords = [...words].sort((a, b) => b.length - a.length);
  const escapedWords = sortedWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedWords.join('|')})`, 'gi');
  const div = document.createElement('div');
  div.innerText = text;
  let escapedHtml = div.innerHTML;
  return escapedHtml.replace(regex, '<mark class="search-highlight">$1</mark>');
}

function renderInventory(filterQuery = '') {
  inventoryList.innerHTML = '';
  const words = filterQuery.toLowerCase().split(/\s+/).filter(w => w.length > 0);

  const filtered = state.inventory.filter(item => {
    const searchString = `${item.name} ${item.category} ${item.innerDetails} ${item.caseDetails}`.toLowerCase();
    const matchesSearch = words.every(word => searchString.includes(word));
    let matchesCategory = true;
    if (currentCategoryFilter !== 'All') {
      const cat = (item.category || '').toLowerCase();
      const filter = currentCategoryFilter.toLowerCase();
      if (filter === 'raw') matchesCategory = cat.includes('raw') || cat.includes('food') || cat.includes('meat');
      else if (filter === 'cooler') matchesCategory = cat.includes('cooler') || cat.includes('beverage') || cat.includes('condiment');
      else if (filter === 'paper') matchesCategory = cat.includes('paper') || cat.includes('cup') || cat.includes('packaging') || cat.includes('lid');
      else matchesCategory = cat.includes(filter);
    }
    return matchesSearch && matchesCategory;
  });

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'inventory-card glass-panel';
    card.id = `inventory-card-${item.id}`;
    card.innerHTML = `
      <span class="category">${highlightText(item.category || '', words)}</span>
      <h3>${highlightText(item.name || '', words)}</h3>
      <div class="detail-row">
        <span class="detail-label">Inner Details</span>
        <span>${highlightText(item.innerDetails || '', words)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Case Details</span>
        <span>${highlightText(item.caseDetails || '', words)}</span>
      </div>
      <div class="card-actions" style="display:flex; gap:0.5rem; margin-top:1rem;">
        <button class="btn btn-primary" onclick="editInventory('${item.id}')" style="flex:1;">
          <i class="ph ph-pencil-simple"></i> Edit
        </button>
        <button class="btn btn-danger" onclick="deleteInventory('${item.id}')" style="flex:1;">
          <i class="ph ph-trash"></i> Delete
        </button>
      </div>
    `;
    inventoryList.appendChild(card);
  });
}

searchInput.addEventListener('input', (e) => renderInventory(e.target.value));

btnAddInventory.addEventListener('click', () => {
  if (!askCode("add an item")) return;
  formInventory.reset();
  document.getElementById('inv-id').value = '';
  document.getElementById('inventory-modal-title').innerText = 'Add Inventory Item';
  modalInventory.classList.add('active');
});

window.editInventory = (id) => {
  if (!askCode("edit this item")) return;
  const item = state.inventory.find(i => i.id === id);
  if (!item) return;
  document.getElementById('inv-id').value = item.id;
  document.getElementById('inv-category').value = item.category;
  document.getElementById('inv-name').value = item.name;
  document.getElementById('inv-inner').value = item.innerDetails;
  document.getElementById('inv-case').value = item.caseDetails;
  document.getElementById('inventory-modal-title').innerText = 'Edit Inventory Item';
  modalInventory.classList.add('active');
};

window.deleteInventory = (id) => {
  deleteFromDB("inventory", id, "inventory", () => renderInventory(searchInput.value));
};

formInventory.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('inv-id').value || 'item_' + Date.now();
  const newItem = {
    category: document.getElementById('inv-category').value,
    name: document.getElementById('inv-name').value,
    innerDetails: document.getElementById('inv-inner').value,
    caseDetails: document.getElementById('inv-case').value,
    lidInfo: 'N/A'
  };
  if (db) {
    db.collection("inventory").doc(id).set(newItem);
  } else {
    newItem.id = id;
    const idx = state.inventory.findIndex(i => i.id === id);
    if (idx >= 0) state.inventory[idx] = newItem;
    else state.inventory.unshift(newItem);
    localStorage.setItem('opshub_state', JSON.stringify(state));
    renderInventory(searchInput.value);
  }
  modalInventory.classList.remove('active');
});


// ================= PROCEDURES =================
const modalProcedure = document.getElementById('modal-procedure');
const btnAddProcedure = document.getElementById('btn-add-procedure');
const formProcedure = document.getElementById('form-procedure');
const procImageUpload = document.getElementById('proc-image-upload');
const procImagePreview = document.getElementById('proc-image-preview');
const procImageContainer = document.getElementById('proc-image-preview-container');
const btnRemoveProcImage = document.getElementById('remove-proc-image');
const proceduresList = document.getElementById('procedures-list');

let currentProcImageBase64 = null;

btnAddProcedure.addEventListener('click', () => {
  if (!askCode("add a procedure")) return;
  formProcedure.reset();
  document.getElementById('proc-id').value = '';
  document.getElementById('proc-modal-title').innerText = 'Add Procedure';
  currentProcImageBase64 = null;
  procImageContainer.classList.remove('active');
  modalProcedure.classList.add('active');
});

window.editProcedure = (id) => {
  if (!askCode("edit this procedure")) return;
  const proc = state.procedures.find(p => p.id === id);
  if (!proc) return;
  document.getElementById('proc-id').value = proc.id;
  document.getElementById('proc-title').value = proc.title;
  document.getElementById('proc-desc').value = proc.desc;
  if (proc.image) {
    currentProcImageBase64 = proc.image;
    procImagePreview.src = currentProcImageBase64;
    procImageContainer.classList.add('active');
  } else {
    currentProcImageBase64 = null;
    procImageContainer.classList.remove('active');
  }
  document.getElementById('proc-modal-title').innerText = 'Edit Procedure';
  modalProcedure.classList.add('active');
};

window.deleteProcedure = (id) => {
  deleteFromDB("procedures", id, "procedures", renderProcedures);
};

procImageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    compressAndResizeImage(file)
      .then(base64 => {
        currentProcImageBase64 = base64;
        procImagePreview.src = currentProcImageBase64;
        procImageContainer.classList.add('active');
      })
      .catch(err => {
        console.error(err);
        alert("Error loading image.");
      });
  }
});

btnRemoveProcImage.addEventListener('click', () => {
  currentProcImageBase64 = null;
  procImageContainer.classList.remove('active');
  procImageUpload.value = '';
});

formProcedure.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('proc-id').value || 'proc_' + Date.now();
  const newProc = {
    title: document.getElementById('proc-title').value,
    desc: document.getElementById('proc-desc').value,
    image: currentProcImageBase64,
    date: new Date().toLocaleDateString(),
    timestamp: Date.now()
  };
  if (db) {
    db.collection("procedures").doc(id).set(newProc);
  } else {
    newProc.id = id;
    const idx = state.procedures.findIndex(p => p.id === id);
    if (idx >= 0) state.procedures[idx] = newProc;
    else state.procedures.unshift(newProc);
    localStorage.setItem('opshub_state', JSON.stringify(state));
    renderProcedures();
  }
  modalProcedure.classList.remove('active');
});

function renderProcedures() {
  proceduresList.innerHTML = '';
  state.procedures.forEach(proc => {
    const card = document.createElement('div');
    card.className = 'inventory-card glass-panel';
    card.id = `procedure-card-${proc.id}`;
    card.innerHTML = `
      <div style="margin-bottom: 1rem;">
        ${proc.image ? `
          <div class="card-image-container" style="position:relative; margin-bottom:1rem;">
            <img src="${proc.image}" style="width:100%; max-height:220px; object-fit:contain; background:rgba(0,0,0,0.15); border-radius:8px; display:block;">
            <button class="image-fullscreen-btn">
              <i class="ph ph-arrows-out"></i> Fullscreen
            </button>
          </div>
        ` : ''}
        <h3>${proc.title}</h3>
        <p style="font-size: 0.9rem; margin-top: 0.5rem; white-space: pre-line;">${proc.desc}</p>
      </div>
      <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom:0.8rem;">Added: ${proc.date}</div>
      <div style="display:flex; gap:0.5rem;">
        <button class="btn btn-primary" onclick="editProcedure('${proc.id}')" style="flex:1; padding:0.4rem 0.8rem; font-size:0.8rem;">
          <i class="ph ph-pencil-simple"></i> Edit
        </button>
        <button class="btn btn-danger" onclick="deleteProcedure('${proc.id}')" style="flex:1; padding:0.4rem 0.8rem; font-size:0.8rem;">
          <i class="ph ph-trash"></i> Delete
        </button>
      </div>
    `;
    proceduresList.appendChild(card);
  });
}


// ================= NEWS FEED =================
const feedImageUpload = document.getElementById('feed-image-upload');
const feedImagePreview = document.getElementById('feed-image-preview');
const feedImageContainer = document.getElementById('feed-image-preview-container');
const btnRemoveFeedImage = document.getElementById('remove-feed-image');
const btnPostFeed = document.getElementById('btn-post-feed');
const feedText = document.getElementById('feed-text');
const feedPosts = document.getElementById('feed-posts');

let currentFeedImageBase64 = null;

feedImageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    compressAndResizeImage(file)
      .then(base64 => {
        currentFeedImageBase64 = base64;
        feedImagePreview.src = currentFeedImageBase64;
        feedImageContainer.classList.add('active');
      })
      .catch(err => {
        console.error(err);
        alert("Error loading image.");
      });
  }
});

btnRemoveFeedImage.addEventListener('click', () => {
  currentFeedImageBase64 = null;
  feedImageContainer.classList.remove('active');
  feedImageUpload.value = '';
});

btnPostFeed.addEventListener('click', () => {
  const text = feedText.value.trim();
  if (!text && !currentFeedImageBase64) return;
  const newPost = {
    text: text,
    image: currentFeedImageBase64,
    date: new Date().toLocaleString(),
    timestamp: Date.now()
  };
  if (db) {
    db.collection("feed").add(newPost);
  } else {
    newPost.id = 'post_' + Date.now();
    state.feed.unshift(newPost);
    localStorage.setItem('opshub_state', JSON.stringify(state));
    renderFeed();
  }
  feedText.value = '';
  currentFeedImageBase64 = null;
  feedImageContainer.classList.remove('active');
  feedImageUpload.value = '';
});

window.deleteFeedPost = (id) => {
  deleteFromDB("feed", id, "feed", renderFeed);
};

function renderFeed() {
  feedPosts.innerHTML = '';
  state.feed.forEach(post => {
    const card = document.createElement('div');
    card.className = 'post-card glass-panel';
    card.id = `feed-post-${post.id}`;
    card.innerHTML = `
      <div class="post-header">
        <img src="profile.jpg" class="post-avatar-img" alt="BH">
        <div class="post-meta">
          <h4>Manager Billal Hossen</h4>
          <span>${post.date}</span>
        </div>
        <button class="btn btn-danger" onclick="deleteFeedPost('${post.id}')" style="padding:0.3rem 0.7rem; font-size:0.75rem; margin-left:auto;">
          <i class="ph ph-trash"></i>
        </button>
      </div>
      <div class="post-content">
        ${post.text ? `<p>${post.text}</p>` : ''}
        ${post.image ? `
          <div class="card-image-container" style="position:relative; margin-top:10px;">
            <img src="${post.image}" class="post-image" style="display:block;">
            <button class="image-fullscreen-btn">
              <i class="ph ph-arrows-out"></i> Fullscreen
            </button>
          </div>
        ` : ''}
      </div>
    `;
    feedPosts.appendChild(card);
  });
}


// ================= DAILY NOTES =================
const noteFileUpload = document.getElementById('note-file-upload');
const noteFileName = document.getElementById('note-file-name');
const noteFileContainer = document.getElementById('note-file-preview-container');
const btnRemoveNoteFile = document.getElementById('remove-note-file');
const btnPostNote = document.getElementById('btn-post-note');
const noteText = document.getElementById('note-text');
const notesList = document.getElementById('notes-list');

let currentNoteFileBase64 = null;
let currentNoteFileName = null;
let currentNoteFileType = null;
let editingNoteId = null;

window.editNote = (id) => {
  if (!askCode("edit this note")) return;
  const note = state.notes.find(n => n.id === id);
  if (!note) return;
  editingNoteId = note.id;
  noteText.value = note.text || '';
  if (note.fileData) {
    currentNoteFileBase64 = note.fileData;
    currentNoteFileName = note.fileName;
    currentNoteFileType = note.fileType;
    noteFileName.innerText = currentNoteFileName || 'Attached File';
    noteFileContainer.style.display = 'flex';
  } else {
    currentNoteFileBase64 = null;
    currentNoteFileName = null;
    currentNoteFileType = null;
    noteFileContainer.style.display = 'none';
  }
  btnPostNote.innerText = "Update Note";
  // scroll to composer
  document.getElementById('view-notes').scrollTo({ top: 0, behavior: 'smooth' });
};

window.deleteNote = (id) => {
  deleteFromDB("notes", id, "notes", renderNotes);
};

noteFileUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const isImage = file.type.startsWith('image/');
    if (!isImage && file.size > 800000) {
      alert("File is too large! Please select a file under 800KB.");
      noteFileUpload.value = '';
      return;
    }
    currentNoteFileName = file.name;
    currentNoteFileType = file.type;
    
    compressAndResizeImage(file)
      .then(base64 => {
        currentNoteFileBase64 = base64;
        noteFileName.innerText = currentNoteFileName;
        noteFileContainer.style.display = 'flex';
      })
      .catch(err => {
        console.error(err);
        alert("Error loading file.");
      });
  }
});

btnRemoveNoteFile.addEventListener('click', () => {
  currentNoteFileBase64 = null;
  currentNoteFileName = null;
  currentNoteFileType = null;
  noteFileContainer.style.display = 'none';
  noteFileUpload.value = '';
});

btnPostNote.addEventListener('click', () => {
  const text = noteText.value.trim();
  if (!text && !currentNoteFileBase64) return;
  const newNote = {
    text: text,
    fileName: currentNoteFileName,
    fileType: currentNoteFileType,
    fileData: currentNoteFileBase64,
    date: new Date().toLocaleString(),
    timestamp: Date.now()
  };
  const idToSave = editingNoteId || 'note_' + Date.now();
  if (db) {
    db.collection("notes").doc(idToSave).set(newNote);
  } else {
    newNote.id = idToSave;
    if (editingNoteId) {
      const idx = state.notes.findIndex(n => n.id === editingNoteId);
      if (idx >= 0) state.notes[idx] = newNote;
    } else {
      state.notes.unshift(newNote);
    }
    localStorage.setItem('opshub_state', JSON.stringify(state));
    renderNotes();
  }
  noteText.value = '';
  currentNoteFileBase64 = null;
  currentNoteFileName = null;
  currentNoteFileType = null;
  editingNoteId = null;
  btnPostNote.innerText = "Post Note";
  noteFileContainer.style.display = 'none';
  noteFileUpload.value = '';
});

// ✅ Fixed WhatsApp sharing — includes image note and file name
window.shareToWhatsApp = (noteId) => {
  const note = state.notes.find(n => n.id === noteId);
  if (!note) return;

  let shareText = '';
  if (note.text) shareText += note.text;
  if (note.fileData && note.fileName) {
    if (note.fileData.startsWith('data:image')) {
      shareText += '\n\n📸 [Photo attached — open OpsHub to view]';
    } else {
      shareText += `\n\n📎 File attached: ${note.fileName} — open OpsHub to download`;
    }
  }
  shareText += '\n\n— Sent via OpsHub';

  const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  window.open(shareUrl, '_blank');
};

function renderNotes() {
  notesList.innerHTML = '';
  state.notes.forEach(note => {
    const card = document.createElement('div');
    card.className = 'post-card glass-panel';
    card.id = `note-card-${note.id}`;

    let attachmentHtml = '';
    if (note.fileData) {
      if (note.fileData.startsWith('data:image')) {
        attachmentHtml = `
          <div class="card-image-container" style="position:relative; margin-top:10px;">
            <img src="${note.fileData}" class="post-image" style="display:block;">
            <button class="image-fullscreen-btn">
              <i class="ph ph-arrows-out"></i> Fullscreen
            </button>
          </div>
        `;
      } else {
        attachmentHtml = `
          <div class="note-attachment">
            <i class="ph-fill ph-file"></i>
            <a href="${note.fileData}" download="${note.fileName}" class="note-attachment-link">
              ${note.fileName}
            </a>
          </div>
        `;
      }
    }

    card.innerHTML = `
      <div class="post-header">
        <img src="profile.jpg" class="post-avatar-img" alt="BH">
        <div class="post-meta">
          <h4>Manager Billal Hossen</h4>
          <span>${note.date}</span>
        </div>
      </div>
      <div class="post-content">
        ${note.text ? `<p style="white-space: pre-line;">${note.text}</p>` : ''}
        ${attachmentHtml}
      </div>
      <div style="margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.8rem; display:flex; justify-content:space-between; align-items:center; gap:0.5rem; flex-wrap:wrap;">
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-secondary" onclick="editNote('${note.id}')" style="padding:0.4rem 0.8rem; font-size:0.8rem;">
            <i class="ph ph-pencil-simple"></i> Edit
          </button>
          <button class="btn btn-danger" onclick="deleteNote('${note.id}')" style="padding:0.4rem 0.8rem; font-size:0.8rem;">
            <i class="ph ph-trash"></i> Delete
          </button>
        </div>
        <button class="btn-whatsapp" onclick="shareToWhatsApp('${note.id}')">
          <i class="ph-fill ph-whatsapp-logo" style="font-size: 1.2rem;"></i> Share to WhatsApp
        </button>
      </div>
    `;
    notesList.appendChild(card);
  });
}

// Modals close logic
document.querySelectorAll('.close-modal').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.target.closest('.modal-overlay').classList.remove('active');
  });
});

// ================= CHECKLIST (CRUD) =================
const checklistItems = document.getElementById('checklist-items');
const btnAddTask = document.getElementById('btn-add-task');
const modalTask = document.getElementById('modal-task');
const formTask = document.getElementById('form-task');

function renderChecklist() {
  if (!checklistItems) return;
  checklistItems.innerHTML = '';
  
  if (state.checklist.length === 0) {
    checklistItems.innerHTML = `
      <div style="text-align:center; padding: 2rem; color: var(--text-secondary);">
        <i class="ph ph-check-square" style="font-size:3rem; margin-bottom:1rem; opacity:0.3;"></i>
        <p>All done! Add a new task to get started.</p>
      </div>
    `;
    return;
  }

  // Sort checklist by timestamp asc so opening tasks appear first
  const sorted = [...state.checklist].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

  sorted.forEach(task => {
    const item = document.createElement('div');
    item.className = 'checklist-item glass-panel';
    item.id = `checklist-item-${task.id}`;
    item.innerHTML = `
      <label class="checkbox-container">
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}', this.checked)">
        <span class="checkmark"></span>
      </label>
      <span class="task-title ${task.completed ? 'completed' : ''}">${task.title}</span>
      <button class="btn-icon" onclick="deleteTask('${task.id}')" style="margin-left:auto;">
        <i class="ph ph-trash"></i>
      </button>
    `;
    checklistItems.appendChild(item);
  });
}

window.toggleTask = (id, completed) => {
  if (db) {
    db.collection("checklist").doc(id).update({ completed: completed });
  } else {
    const idx = state.checklist.findIndex(t => t.id === id);
    if (idx >= 0) {
      state.checklist[idx].completed = completed;
      localStorage.setItem('opshub_state', JSON.stringify(state));
      renderChecklist();
    }
  }
};

window.deleteTask = (id) => {
  deleteFromDB("checklist", id, "checklist", renderChecklist);
};

if (btnAddTask) {
  btnAddTask.addEventListener('click', () => {
    if (!askCode("add a task")) return;
    formTask.reset();
    modalTask.classList.add('active');
  });
}

if (formTask) {
  formTask.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value.trim();
    if (!title) return;
    const newTask = {
      title: title,
      completed: false,
      timestamp: Date.now()
    };
    if (db) {
      db.collection("checklist").add(newTask);
    } else {
      newTask.id = 'task_' + Date.now();
      state.checklist.push(newTask);
      localStorage.setItem('opshub_state', JSON.stringify(state));
      renderChecklist();
    }
    modalTask.classList.remove('active');
  });
}


// ================= GLOBAL SPOTLIGHT SEARCH =================
const headerSearchBtn = document.getElementById('header-search-btn');
const modalSearch = document.getElementById('modal-search');
const globalSearchInput = document.getElementById('global-search-input');
const globalSearchResults = document.getElementById('global-search-results');
const searchFilterButtons = document.querySelectorAll('.search-filter-btn');

let currentSearchResults = [];
let selectedResultIndex = -1;
let currentSearchFilter = 'All';

// Open / Close functions
function openGlobalSearch() {
  if (modalSearch) {
    modalSearch.classList.add('active');
    setTimeout(() => {
      if (globalSearchInput) {
        globalSearchInput.value = '';
        globalSearchInput.focus();
      }
      currentSearchResults = [];
      selectedResultIndex = -1;
      updateSearchFilterActive('All');
      renderGlobalSearchResults('');
    }, 50);
  }
}

function closeGlobalSearch() {
  if (modalSearch) {
    modalSearch.classList.remove('active');
  }
}

if (headerSearchBtn) {
  headerSearchBtn.addEventListener('click', openGlobalSearch);
}

const btnCloseSearch = document.getElementById('btn-close-search');
if (btnCloseSearch) {
  btnCloseSearch.addEventListener('click', closeGlobalSearch);
}

// Bind search input typing
if (globalSearchInput) {
  globalSearchInput.addEventListener('input', (e) => {
    selectedResultIndex = -1;
    renderGlobalSearchResults(e.target.value);
  });
}

// Bind filters
searchFilterButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    searchFilterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentSearchFilter = btn.getAttribute('data-search-filter');
    selectedResultIndex = -1;
    if (globalSearchInput) {
      renderGlobalSearchResults(globalSearchInput.value);
    }
  });
});

function updateSearchFilterActive(filterName) {
  currentSearchFilter = filterName;
  searchFilterButtons.forEach(btn => {
    if (btn.getAttribute('data-search-filter') === filterName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Search algorithm
function renderGlobalSearchResults(query) {
  if (!globalSearchResults) return;
  
  const trimmed = query.trim();
  const words = trimmed.toLowerCase().split(/\s+/).filter(w => w.length > 0);

  if (words.length === 0) {
    globalSearchResults.innerHTML = `
      <div class="search-empty-state">
        <i class="ph ph-magnifying-glass-plus"></i>
        <p>Type to search everything (Inventory, Procedures, Tasks, Feed, Notes)...</p>
        <span class="search-tip">Pro Tip: Search words can be in any order, e.g., "chicken box" or "soc safety"</span>
      </div>
    `;
    currentSearchResults = [];
    selectedResultIndex = -1;
    return;
  }

  // Compile all searchable items
  let allSearchItems = [];

  // 1. Inventory Items
  state.inventory.forEach(item => {
    allSearchItems.push({
      id: item.id,
      category: 'Inventory',
      title: item.name || '',
      subtitle: item.category || '',
      snippet: `Category: ${item.category || ''} | Inner: ${item.innerDetails || ''} | Case: ${item.caseDetails || ''}`,
      icon: 'ph-package',
      searchableText: `${item.name} ${item.category} ${item.innerDetails} ${item.caseDetails}`.toLowerCase(),
      domId: `inventory-card-${item.id}`,
      tabTarget: 'view-inventory',
      raw: item
    });
  });

  // 2. Procedures Items
  state.procedures.forEach(proc => {
    allSearchItems.push({
      id: proc.id,
      category: 'Procedures',
      title: proc.title || '',
      subtitle: proc.date ? `Added: ${proc.date}` : '',
      snippet: proc.desc || '',
      icon: 'ph-book-open-text',
      searchableText: `${proc.title} ${proc.desc}`.toLowerCase(),
      domId: `procedure-card-${proc.id}`,
      tabTarget: 'view-procedures',
      raw: proc
    });
  });

  // 3. Tasks Items
  state.checklist.forEach(task => {
    allSearchItems.push({
      id: task.id,
      category: 'Tasks',
      title: task.title || '',
      subtitle: task.completed ? 'Status: Completed' : 'Status: Pending',
      snippet: `Daily checklist item • ${task.completed ? 'Completed' : 'Pending check'}`,
      icon: 'ph-check-square',
      searchableText: `${task.title} ${task.completed ? 'completed' : 'pending'}`.toLowerCase(),
      domId: `checklist-item-${task.id}`,
      tabTarget: 'view-checklist',
      raw: task
    });
  });

  // 4. News Feed Items
  state.feed.forEach(post => {
    allSearchItems.push({
      id: post.id,
      category: 'News',
      title: post.text ? (post.text.length > 50 ? post.text.substring(0, 50) + '...' : post.text) : 'News Feed Announcement',
      subtitle: post.date || '',
      snippet: post.text || '[Image Post]',
      icon: 'ph-newspaper',
      searchableText: `${post.text || ''}`.toLowerCase(),
      domId: `feed-post-${post.id}`,
      tabTarget: 'view-feed',
      raw: post
    });
  });

  // 5. Daily Notes Items
  state.notes.forEach(note => {
    allSearchItems.push({
      id: note.id,
      category: 'Notes',
      title: note.text ? (note.text.length > 50 ? note.text.substring(0, 50) + '...' : note.text) : 'Daily Note',
      subtitle: note.date || '',
      snippet: `${note.text || ''} ${note.fileName ? '• Attachment: ' + note.fileName : ''}`,
      icon: 'ph-notebook',
      searchableText: `${note.text || ''} ${note.fileName || ''}`.toLowerCase(),
      domId: `note-card-${note.id}`,
      tabTarget: 'view-notes',
      raw: note
    });
  });

  // Perform search scoring & filtering
  let hits = [];
  allSearchItems.forEach(item => {
    // Must match ALL words in words array ("for every single word")
    const matchesAll = words.every(word => item.searchableText.includes(word));
    if (matchesAll) {
      // Calculate score
      let score = 0;
      words.forEach(word => {
        const titleL = item.title.toLowerCase();
        const subtitleL = item.subtitle.toLowerCase();
        const snippetL = item.snippet.toLowerCase();

        if (titleL === word) score += 100; // Exact match on title word
        else if (titleL.includes(word)) score += 30; // Substring title match
        
        if (subtitleL.includes(word)) score += 15; // Category/Subtitle match
        if (snippetL.includes(word)) score += 5; // Snippet match
      });

      // Boost score if title matches query exactly
      if (item.title.toLowerCase().includes(trimmed.toLowerCase())) {
        score += 50;
      }

      hits.push({ ...item, score });
    }
  });

  // Filter by category
  if (currentSearchFilter !== 'All') {
    hits = hits.filter(hit => hit.category === currentSearchFilter);
  }

  // Sort hits by score (descending)
  hits.sort((a, b) => b.score - a.score);

  currentSearchResults = hits;
  globalSearchResults.innerHTML = '';

  if (hits.length === 0) {
    globalSearchResults.innerHTML = `
      <div class="search-empty-state">
        <i class="ph ph-mask-sad"></i>
        <p>No results found for "${highlightText(trimmed, words)}"</p>
        <span class="search-tip">Try different terms or check spelling.</span>
      </div>
    `;
    return;
  }

  hits.forEach((hit, idx) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'search-result-item';
    itemEl.setAttribute('data-index', idx);
    if (idx === selectedResultIndex) {
      itemEl.classList.add('selected');
    }

    itemEl.innerHTML = `
      <div class="search-result-icon">
        <i class="ph-fill ${hit.icon}"></i>
      </div>
      <div class="search-result-info">
        <div class="search-result-title-row">
          <span class="search-result-title">${highlightText(hit.title, words)}</span>
          <span class="search-result-category">${hit.category}</span>
        </div>
        <div class="search-result-snippet">${highlightText(hit.snippet, words)}</div>
      </div>
    `;

    itemEl.addEventListener('click', () => {
      selectGlobalResult(hit);
    });

    globalSearchResults.appendChild(itemEl);
  });
}

// Handle selection action
function selectGlobalResult(hit) {
  closeGlobalSearch();

  // 1. Route/switch to the correct tab view
  const targetNav = document.querySelector(`.nav-item[data-target="${hit.tabTarget}"]`);
  if (targetNav) {
    targetNav.click();
  }

  // 2. Scroll and highlight the target element
  setTimeout(() => {
    const element = document.getElementById(hit.domId);
    if (element) {
      // Scroll to it
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Apply the beautiful flash-highlight animation
      element.classList.remove('flash-highlight');
      // trigger reflow
      void element.offsetWidth; 
      element.classList.add('flash-highlight');
      
      // Remove class after animation finishes (2.5s)
      setTimeout(() => {
        element.classList.remove('flash-highlight');
      }, 2600);
    }
  }, 350);
}

// Bind keyboard shortcuts & navigation
window.addEventListener('keydown', (e) => {
  const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable;
  
  // Open search overlay
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    openGlobalSearch();
    return;
  }
  if (e.key === '/' && !isTyping) {
    e.preventDefault();
    openGlobalSearch();
    return;
  }

  // Handle keys while modal is active
  if (modalSearch && modalSearch.classList.contains('active')) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeGlobalSearch();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentSearchResults.length > 0) {
        selectedResultIndex = (selectedResultIndex + 1) % currentSearchResults.length;
        updateSelectedVisuals();
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentSearchResults.length > 0) {
        if (selectedResultIndex <= 0) {
          selectedResultIndex = currentSearchResults.length - 1;
        } else {
          selectedResultIndex--;
        }
        updateSelectedVisuals();
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedResultIndex >= 0 && selectedResultIndex < currentSearchResults.length) {
        selectGlobalResult(currentSearchResults[selectedResultIndex]);
      }
      return;
    }
  }
});

function updateSelectedVisuals() {
  const items = globalSearchResults.querySelectorAll('.search-result-item');
  items.forEach((item, idx) => {
    if (idx === selectedResultIndex) {
      item.classList.add('selected');
      // Scroll the selected item into view if it goes out of container boundaries
      item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } else {
      item.classList.remove('selected');
    }
  });
}

// ================= IMAGE LIGHTBOX MODAL WITH ZOOM & PAN =================
const lightbox = document.getElementById('image-lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const btnCloseLightbox = document.getElementById('btn-close-lightbox');
const btnZoomIn = document.getElementById('btn-zoom-in');
const btnZoomOut = document.getElementById('btn-zoom-out');
const btnZoomReset = document.getElementById('btn-zoom-reset');
const zoomIndicator = document.getElementById('zoom-indicator');
const lightboxWrapper = document.querySelector('.lightbox-content-wrapper');

let zoomScale = 1.0;
let isDragging = false;
let startX = 0, startY = 0;
let translateX = 0, translateY = 0;

function openLightbox(src) {
  if (!lightbox || !lightboxImg) return;
  console.log("Opening fullscreen lightbox for:", src.substring(0, 100) + "...");
  lightboxImg.src = src;
  zoomScale = 1.0;
  translateX = 0;
  translateY = 0;
  updateLightboxTransform();
  
  lightbox.style.display = 'flex';
  void lightbox.offsetWidth; // trigger reflow
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  console.log("Closing fullscreen lightbox");
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  
  setTimeout(() => {
    if (!lightbox.classList.contains('active')) {
      lightbox.style.display = 'none';
    }
  }, 300);
}

function updateLightboxTransform() {
  if (!lightboxImg) return;
  lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoomScale})`;
  if (zoomIndicator) {
    zoomIndicator.innerText = `${Math.round(zoomScale * 100)}%`;
  }
}

// Global delegated click listener for images and fullscreen buttons
document.body.addEventListener('click', (e) => {
  // Check if click is on the fullscreen button (or its icon child)
  const btn = e.target.closest('.image-fullscreen-btn');
  if (btn) {
    e.stopPropagation();
    e.preventDefault();
    const container = btn.closest('.card-image-container');
    if (container) {
      const img = container.querySelector('img');
      if (img) {
        openLightbox(img.src);
        return;
      }
    }
  }

  // Also support clicking the image directly
  if (e.target.tagName === 'IMG') {
    // Exclude profile avatar pictures from lightbox
    if (e.target.classList.contains('avatar-img') || e.target.classList.contains('post-avatar-img')) {
      return;
    }
    
    // Check if image belongs to cards, feeds, notes, or preview
    if (e.target.classList.contains('post-image') || 
        e.target.classList.contains('image-preview') || 
        e.target.closest('.post-card') || 
        e.target.closest('.inventory-card') ||
        e.target.closest('#view-notes') ||
        e.target.id === 'proc-image-preview' ||
        e.target.id === 'feed-image-preview') {
      openLightbox(e.target.src);
    }
  }
});

// Controls
if (btnZoomIn) {
  btnZoomIn.addEventListener('click', (e) => {
    e.stopPropagation();
    zoomScale = Math.min(zoomScale + 0.25, 4.0);
    updateLightboxTransform();
  });
}

if (btnZoomOut) {
  btnZoomOut.addEventListener('click', (e) => {
    e.stopPropagation();
    zoomScale = Math.max(zoomScale - 0.25, 0.5);
    if (zoomScale <= 1.0) {
      translateX = 0;
      translateY = 0;
    }
    updateLightboxTransform();
  });
}

if (btnZoomReset) {
  btnZoomReset.addEventListener('click', (e) => {
    e.stopPropagation();
    zoomScale = 1.0;
    translateX = 0;
    translateY = 0;
    updateLightboxTransform();
  });
}

if (btnCloseLightbox) {
  btnCloseLightbox.addEventListener('click', closeLightbox);
}

// Close lightbox on click outside the image itself
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxWrapper) {
      closeLightbox();
    }
  });
}

// Wheel zoom
if (lightboxWrapper) {
  lightboxWrapper.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    zoomScale = Math.max(0.5, Math.min(4.0, zoomScale + delta));
    if (zoomScale <= 1.0) {
      translateX = 0;
      translateY = 0;
    }
    updateLightboxTransform();
  }, { passive: false });
}

// Mouse dragging and panning when zoomed in
if (lightboxWrapper && lightboxImg) {
  lightboxWrapper.addEventListener('mousedown', (e) => {
    if (zoomScale > 1.0) {
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      e.preventDefault();
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      updateLightboxTransform();
    }
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Mobile pinch and swipe drag support
  let touchStartDist = 0;
  
  lightboxWrapper.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1 && zoomScale > 1.0) {
      isDragging = true;
      startX = e.touches[0].clientX - translateX;
      startY = e.touches[0].clientY - translateY;
    } else if (e.touches.length === 2) {
      touchStartDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  });

  lightboxWrapper.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      translateX = e.touches[0].clientX - startX;
      translateY = e.touches[0].clientY - startY;
      updateLightboxTransform();
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchStartDist;
      zoomScale = Math.max(0.5, Math.min(4.0, zoomScale * factor));
      touchStartDist = dist;
      updateLightboxTransform();
    }
  });

  lightboxWrapper.addEventListener('touchend', () => {
    isDragging = false;
  });
}

// Start App
init();
