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
  checklist: []
};

// Initialize State
function init() {
  if (!db) {
    alert("⚠️ Firebase is not configured! Please open app.js and paste your Firebase Config keys at the top. Falling back to local storage for now.");
    fallbackInit();
    return;
  }

  // 1. Real-time listener for Inventory
  db.collection("inventory").onSnapshot((snapshot) => {
    state.inventory = [];
    snapshot.forEach((doc) => {
      state.inventory.push({ id: doc.id, ...doc.data() });
    });
    
    // If database is completely empty, seed it with initial data once
    if (state.inventory.length === 0 && window.INITIAL_INVENTORY) {
      console.log("Seeding initial inventory to cloud...");
      window.INITIAL_INVENTORY.forEach(item => {
        db.collection("inventory").doc(item.id).set(item);
      });
    } else {
      renderInventory(document.getElementById('inventory-search').value);
    }
  });

  // 2. Real-time listener for Procedures
  db.collection("procedures").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
    state.procedures = [];
    snapshot.forEach((doc) => {
      state.procedures.push({ id: doc.id, ...doc.data() });
    });
    renderProcedures();
  });

  // 3. Real-time listener for Feed
  db.collection("feed").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
    state.feed = [];
    snapshot.forEach((doc) => {
      state.feed.push({ id: doc.id, ...doc.data() });
    });
    renderFeed();
  });
}

// --- Fallback if no Firebase Config is provided ---
function fallbackInit() {
  const savedState = localStorage.getItem('opshub_state');
  if (savedState) state = JSON.parse(savedState);
  else if (window.INITIAL_INVENTORY) {
    state.inventory = window.INITIAL_INVENTORY;
    localStorage.setItem('opshub_state', JSON.stringify(state));
  }
  renderInventory();
  renderProcedures();
  renderFeed();
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

function renderInventory(filterQuery = '') {
  inventoryList.innerHTML = '';
  const query = filterQuery.toLowerCase();
  
  const filtered = state.inventory.filter(item => {
    const searchString = `${item.name} ${item.category} ${item.innerDetails} ${item.caseDetails}`.toLowerCase();
    return searchString.includes(query);
  });

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'inventory-card glass-panel';
    card.innerHTML = `
      <span class="category">${item.category || ''}</span>
      <h3>${item.name || ''}</h3>
      <div class="detail-row">
        <span class="detail-label">Inner Details</span>
        <span>${item.innerDetails || ''}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Case Details</span>
        <span>${item.caseDetails || ''}</span>
      </div>
      <div class="card-actions">
        <button class="btn btn-primary" onclick="editInventory('${item.id}')">
          <i class="ph ph-pencil-simple"></i> Edit
        </button>
      </div>
    `;
    inventoryList.appendChild(card);
  });
}

searchInput.addEventListener('input', (e) => {
  renderInventory(e.target.value);
});

btnAddInventory.addEventListener('click', () => {
  const code = prompt("Enter authorization code to add an item:");
  if (code !== "billal") {
    alert("Incorrect code. Access denied.");
    return;
  }
  
  formInventory.reset();
  document.getElementById('inv-id').value = '';
  document.getElementById('inventory-modal-title').innerText = 'Add Inventory Item';
  modalInventory.classList.add('active');
});

window.editInventory = (id) => {
  const code = prompt("Enter authorization code to edit this item:");
  if (code !== "billal") {
    alert("Incorrect code. Access denied.");
    return;
  }

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
    // Cloud sync
    db.collection("inventory").doc(id).set(newItem);
  } else {
    // Fallback sync
    newItem.id = id;
    const existingIndex = state.inventory.findIndex(i => i.id === id);
    if (existingIndex >= 0) state.inventory[existingIndex] = newItem;
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
  formProcedure.reset();
  currentProcImageBase64 = null;
  procImageContainer.classList.remove('active');
  modalProcedure.classList.add('active');
});

procImageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      currentProcImageBase64 = event.target.result;
      procImagePreview.src = currentProcImageBase64;
      procImageContainer.classList.add('active');
    };
    reader.readAsDataURL(file);
  }
});

btnRemoveProcImage.addEventListener('click', () => {
  currentProcImageBase64 = null;
  procImageContainer.classList.remove('active');
  procImageUpload.value = '';
});

formProcedure.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const newProc = {
    title: document.getElementById('proc-title').value,
    desc: document.getElementById('proc-desc').value,
    image: currentProcImageBase64,
    date: new Date().toLocaleDateString(),
    timestamp: Date.now()
  };

  if (db) {
    db.collection("procedures").add(newProc);
  } else {
    newProc.id = 'proc_' + Date.now();
    state.procedures.unshift(newProc);
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
    card.innerHTML = `
      <div style="margin-bottom: 1rem;">
        ${proc.image ? `<img src="${proc.image}" style="width:100%; height:150px; object-fit:cover; border-radius:8px; margin-bottom:1rem;">` : ''}
        <h3>${proc.title}</h3>
        <p style="font-size: 0.9rem; margin-top: 0.5rem; white-space: pre-line;">${proc.desc}</p>
      </div>
      <div style="font-size: 0.8rem; color: var(--text-secondary); text-align: right; margin-top: auto;">
        Added: ${proc.date}
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
    const reader = new FileReader();
    reader.onload = function(event) {
      currentFeedImageBase64 = event.target.result;
      feedImagePreview.src = currentFeedImageBase64;
      feedImageContainer.classList.add('active');
    };
    reader.readAsDataURL(file);
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

function renderFeed() {
  feedPosts.innerHTML = '';
  state.feed.forEach(post => {
    const card = document.createElement('div');
    card.className = 'post-card glass-panel';
    card.innerHTML = `
      <div class="post-header">
        <img src="profile.jpg" class="post-avatar-img" alt="BH">
        <div class="post-meta">
          <h4>Manager Billal Hossen</h4>
          <span>${post.date}</span>
        </div>
      </div>
      <div class="post-content">
        ${post.text ? `<p>${post.text}</p>` : ''}
        ${post.image ? `<img src="${post.image}" class="post-image">` : ''}
      </div>
    `;
    feedPosts.appendChild(card);
  });
}

// Modals close logic
document.querySelectorAll('.close-modal').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.target.closest('.modal-overlay').classList.remove('active');
  });
});

// Start App
init();
