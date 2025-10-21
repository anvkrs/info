const pubList = document.getElementById('pubList');
let publications = [];
let currentIndex = 0;
const pageSize = 8; // Number of publications per page

// Fetch publications from JSON
fetch('publish.json')
  .then(response => response.json())
  .then(data => {
    publications = data;
    loadPublications();
  })
  .catch(err => console.error("Failed to load publications:", err));

// Function to load publications
function loadPublications() {
  const nextIndex = currentIndex + pageSize;
  const pageItems = publications.slice(currentIndex, nextIndex);

  pageItems.forEach(pub => {
    const card = document.createElement('div');
    card.classList.add('pub-card');
    card.innerHTML = `
      <h3>${pub.title}</h3>
      <p><strong>Authors:</strong> ${pub.authors}</p>
      <p><strong>Journal:</strong> ${pub.journal}</p>
      <p class="year"><strong>Year:</strong> ${pub.year} | <strong>Cited by:</strong> ${pub.cited}</p>
    `;
    pubList.appendChild(card);
  });

  currentIndex = nextIndex;

  // Show "Load More" button only if more publications exist
  if (currentIndex < publications.length) {
    if (!document.getElementById('loadMoreBtn')) {
      const loadMoreBtn = document.createElement('button');
      loadMoreBtn.id = 'loadMoreBtn';
      loadMoreBtn.textContent = 'Load More';
      loadMoreBtn.classList.add('load-more-btn');
      loadMoreBtn.addEventListener('click', loadPublications);
      pubList.parentElement.appendChild(loadMoreBtn);
    }
  } else {
    const btn = document.getElementById('loadMoreBtn');
    if (btn) btn.remove();
  }
}
