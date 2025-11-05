// ------------------------------------- DOM ELEMENTS
const pubList = document.getElementById('pubList')
const projectList = document.getElementById('projectList')
const menuToggle = document.getElementById('menuToggle')
const navLinks = document.getElementById('navLinks')
const heading = document.querySelector('.about-heading')
const audio = document.getElementById('about-audio')

// ------------------------------------- AUDIO TOGGLE
heading.addEventListener('click', () => {
  if (audio.paused) {
    audio.play()
    heading.classList.add('unmuted')
  } else {
    audio.pause()
    audio.currentTime = 0
    heading.classList.remove('unmuted')
  }
})

// ------------------------------------- MENU TOGGLE
menuToggle.addEventListener('click', event => {
  event.stopPropagation()
  navLinks.classList.toggle('show')
})
document.addEventListener('click', () => navLinks.classList.remove('show'))

// =============================================================
// ------------------------------ PROJECTS ----------------------
// =============================================================
let projects = []
let projectIndex = 0
const projectPageSize = 6

async function loadProjects () {
  const res = await fetch('projects.json')
  projects = await res.json()
  renderProjects(true)
}

function renderProjects (reset = false) {
  if (reset) {
    projectIndex = 0
    projectList.innerHTML = ''
  }

  const typeFilter = document.getElementById('typeFilter')
  const statusFilter = document.getElementById('statusFilter')

  const filtered = projects.filter(p => {
    const typeMatch = !typeFilter?.value || p.type === typeFilter.value
    const statusMatch = !statusFilter?.value || p.status === statusFilter.value
    return typeMatch && statusMatch
  })

  const nextIndex = projectIndex + projectPageSize
  const toRender = filtered.slice(projectIndex, nextIndex)

  toRender.forEach(p => {
    const card = document.createElement('div')
    card.classList.add('project-card')

    // Select icons based on data
    const typeIcon =
      p.type === 'Consultancy'
        ? 'media/icons_projects/consultancy.png'
        : 'media/icons_projects/research.png'

    const statusIcon =
      p.status === 'Completed'
        ? 'media/icons_projects/completed.png'
        : 'media/icons_projects/ongoing.png'

    card.innerHTML = `
      <h3>${p.title}</h3>

      <div class="role-duration">
        <p><img src="media/icons_projects/role.png" alt="Role"> ${p.role}</p>
        <p><img src="media/icons_projects/duration.png" alt="Duration"> ${
          p.year
        }. ${p.duration_months} months</p>
      </div>

      <div class="fund-status">
        <p><img src="media/icons_projects/funding.png" alt="Funding"> ${
          p.funding
        }</p>
        <p>
          <img src="${statusIcon}" alt="Status">
          <span class="${
            p.status === 'Completed' ? 'status-completed' : 'status-ongoing'
          }">${p.status}</span>
        </p>
      </div>

      <p><img src="media/icons_projects/agency.png" alt="Agency"> ${
        p.agency
      }</p>
      <p><img src="${typeIcon}" alt="Type"> ${p.type}</p>
    `

    projectList.appendChild(card)
  })

  projectIndex = nextIndex
  manageLoadMoreButton('project', filtered.length, renderProjects)
}

// =============================================================
// ------------------------------ SEMINARS ----------------------
// =============================================================
let seminars = []
let seminarIndex = 0
const seminarPageSize = 6

async function loadSeminars () {
  const res = await fetch('seminar.json')
  seminars = await res.json()
  renderSeminars(true)
}

function renderSeminars (reset = false) {
  const seminarList = document.getElementById('seminarList')
  if (reset) {
    seminarIndex = 0
    seminarList.innerHTML = ''
  }

  const categoryFilter = document.getElementById('categoryFilter')

  const filtered = seminars.filter(s => {
    const categoryMatch =
      !categoryFilter?.value || s.category === categoryFilter.value
    return categoryMatch
  })

  const nextIndex = seminarIndex + seminarPageSize
  const toRender = filtered.slice(seminarIndex, nextIndex)

  toRender.forEach(s => {
    const card = document.createElement('div')
    card.classList.add('seminar-card')
    card.innerHTML = `
      <h3>${s.title}</h3>
     <div class="seminar-details"> <p><img src="media/icons_seminar/category.png" alt="Category"> ${s.category}</p> <p><img src="media/icons_seminar/organizer.png" alt="Organizer"> ${s.organizer}</p> <p class="date-label"><img src="media/icons_seminar/date.png" alt="Date"> ${s.date}</p> </div>
    `
    seminarList.appendChild(card)
  })

  seminarIndex = nextIndex
  manageLoadMoreButton('seminar', filtered.length, renderSeminars)
}

// =============================================================
// ------------------------------ PUBLICATIONS -----------------
// =============================================================
let publications = []
let pubIndex = 0
const pubPageSize = 6

async function loadPublications () {
  const res = await fetch('publish.json')
  publications = await res.json()
  renderPublications(true)
}

function renderPublications (reset = false) {
  if (reset) {
    pubIndex = 0
    pubList.innerHTML = ''
  }

  const nextIndex = pubIndex + pubPageSize
  const toRender = publications.slice(pubIndex, nextIndex)

  toRender.forEach(pub => {
    const card = document.createElement('div')
    card.classList.add('pub-card')
    card.innerHTML = `
      <h3>
        <a href="${pub.link}" target="_blank" rel="noopener noreferrer">${pub.title}</a>
      </h3>
      <p><strong>Authors:</strong> ${pub.author}</p>
      <p><strong>Journal:</strong> ${pub.journal}</p>
      <p class="year">
        <strong>Year:</strong> ${pub.year} |
        <strong>Cited by:</strong> ${pub.cited}
      </p>
    `
    pubList.appendChild(card)
  })

  pubIndex = nextIndex
  manageLoadMoreButton('pub', publications.length, renderPublications)
}

// =============================================================
// ------------------------------ LOAD MORE HANDLER -------------
// =============================================================
function manageLoadMoreButton (type, total, loadFn) {
  const existingBtn = document.getElementById(`${type}-loadMoreBtn`)
  let currentIndex

  if (type === 'project') currentIndex = projectIndex
  else if (type === 'seminar') currentIndex = seminarIndex
  else if (type === 'pub') currentIndex = pubIndex

  if (currentIndex < total) {
    if (!existingBtn) {
      const btn = document.createElement('button')
      btn.id = `${type}-loadMoreBtn`
      btn.textContent = 'Load More'
      btn.classList.add('load-more-btn')
      btn.addEventListener('click', () => loadFn())

      if (type === 'project') projectList.parentElement.appendChild(btn)
      else if (type === 'seminar') seminarList.parentElement.appendChild(btn)
      else if (type === 'pub') pubList.parentElement.appendChild(btn)
    }
  } else if (existingBtn) {
    existingBtn.remove()
  }
}

// =============================================================
// ------------------------------ FILTERS & INIT ---------------
// =============================================================

// Project filters
document
  .getElementById('typeFilter')
  ?.addEventListener('change', () => renderProjects(true))
document
  .getElementById('statusFilter')
  ?.addEventListener('change', () => renderProjects(true))

// Seminar filters
document
  .getElementById('categoryFilter')
  ?.addEventListener('change', () => renderSeminars(true))

// Initial load
loadProjects()
loadSeminars()
loadPublications()
