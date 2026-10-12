/*
  CAMPUSLINK CONTENT SETTINGS
  Edit the sample content below and replace each WhatsApp placeholder with your real invite link.
  This is a static public website: visitors can view it without logging in.
*/
const campusLinkContent = {
  announcements: [
    { category: "Student notice", number: "01", title: "Stay in the loop", description: "Check official campus channels for verified notices, timetable changes and important deadlines." },
    { category: "Career growth", number: "02", title: "Prepare for your next opportunity", description: "Keep your CV updated and watch for internships, attachments and entry-level roles." },
    { category: "Community", number: "03", title: "Connect with other students", description: "Join a relevant student group to exchange helpful information and support one another." }
  ],
  opportunities: [
    { icon: "↗", type: "CAREER STARTER", title: "Internships", description: "Build practical experience and explore opportunities related to your course.", linkText: "Explore listings", url: "https://www.brightermonday.co.ke/" },
    { icon: "▣", type: "STUDENT EXPERIENCE", title: "Industrial attachment", description: "Look for attachment placements that help you apply what you learn in class.", linkText: "Find opportunities", url: "https://www.fuzu.com/" },
    { icon: "✦", type: "PROFESSIONAL GROWTH", title: "Skills & CV tips", description: "Strengthen your CV, interview skills and professional profile before applying.", linkText: "Build your skills", url: "https://www.linkedin.com/jobs/" }
  ],
  events: [
    { day: "TBA", month: "DATE", title: "Campus community meetup", detail: "Add your venue, date and registration information here." },
    { day: "TBA", month: "DATE", title: "Career and opportunity session", detail: "Add details about a career talk, workshop or student event." },
    { day: "TBA", month: "DATE", title: "Student networking event", detail: "Share the organiser's verified details and sign-up link." }
  ],
  // Replace these with your actual WhatsApp invite links.
  whatsapp: {
    main: "https://chat.whatsapp.com/",
    campus: "https://chat.whatsapp.com/",
    jobs: "https://chat.whatsapp.com/",
    study: "https://chat.whatsapp.com/",
    events: "https://chat.whatsapp.com/"
  }
};

const announcementList = document.getElementById("announcementList");
announcementList.innerHTML = campusLinkContent.announcements.map(item => `
  <article class="announcement-card">
    <div class="card-number">${item.number}</div>
    <span class="tag">${item.category}</span>
    <h3>${item.title}</h3>
    <p>${item.description}</p>
  </article>`).join("");

const opportunityList = document.getElementById("opportunityList");
opportunityList.innerHTML = campusLinkContent.opportunities.map(item => `
  <article class="opportunity-card">
    <div class="opp-icon">${item.icon}</div>
    <span class="tag">${item.type}</span>
    <h3>${item.title}</h3>
    <p>${item.description}</p>
    <a class="text-link" href="${item.url}" target="_blank" rel="noopener noreferrer">${item.linkText} ↗</a>
  </article>`).join("");

const eventList = document.getElementById("eventList");
eventList.innerHTML = campusLinkContent.events.map(item => `
  <article class="event-item">
    <div class="event-date">${item.day}<small>${item.month}</small></div>
    <div><h3>${item.title}</h3><p>${item.detail}</p></div>
    <span class="event-arrow">↗</span>
  </article>`).join("");

document.getElementById("mainWhatsapp").href = campusLinkContent.whatsapp.main;
const groupLinks = document.querySelectorAll(".group-row .join-link");
const groupKeys = ["campus", "jobs", "study", "events"];
groupLinks.forEach((link, index) => link.href = campusLinkContent.whatsapp[groupKeys[index]] || campusLinkContent.whatsapp.main);
document.getElementById("year").textContent = new Date().getFullYear();

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));
