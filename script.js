const pubList = document.getElementById('pubList')
const menuToggle = document.getElementById('menuToggle')
const navLinks = document.getElementById('navLinks')
const heading = document.querySelector('.about-heading')
const audio = document.getElementById('about-audio')

let publications = []
let currentIndex = 0
const pageSize = 6

heading.addEventListener('click', () => {
  if (audio.paused) {
    audio.play()
    heading.classList.add('unmuted')
  } else {
    audio.pause()
    audio.currentTime = 0 // reset audio to start
    heading.classList.remove('unmuted')
  }
})

menuToggle.addEventListener('click', event => {
  event.stopPropagation() // prevent click from closing immediately
  navLinks.classList.toggle('show')
})

document.addEventListener('click', event => {
  navLinks.classList.remove('show')
})

// Fetch publications from JSON
fetch('publish.json')
  .then(response => response.json())
  .then(data => {
    publications = data
    loadPublications()
  })
  .catch(err => console.error('Failed to load publications:', err))

// Function to load publications
function loadPublications () {
  const nextIndex = currentIndex + pageSize
  const pageItems = publications.slice(currentIndex, nextIndex)

  pageItems.forEach(pub => {
    const card = document.createElement('div')
    card.classList.add('pub-card')
    card.innerHTML = `
      <h3>
       <a href="${pub.link}" target="_blank" rel="noopener noreferrer">
        ${pub.title}
      </a>
      </h3>
      <p><strong>Authors:</strong> ${pub.author}</p>
      <p><strong>Journal:</strong> ${pub.journal}</p>
      <p class="year"><strong>Year:</strong> ${pub.year} | <strong>Cited by:</strong> ${pub.cited}</p>
    `
    pubList.appendChild(card)
  })

  currentIndex = nextIndex

  // Show "Load More" button only if more publications exist
  if (currentIndex < publications.length) {
    if (!document.getElementById('loadMoreBtn')) {
      const loadMoreBtn = document.createElement('button')
      loadMoreBtn.id = 'loadMoreBtn'
      loadMoreBtn.textContent = 'Load More'
      loadMoreBtn.classList.add('load-more-btn')
      loadMoreBtn.addEventListener('click', loadPublications)
      pubList.parentElement.appendChild(loadMoreBtn)
    }
  } else {
    const btn = document.getElementById('loadMoreBtn')
    if (btn) btn.remove()
  }
}
