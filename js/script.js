const API_BASE = "https://dhiraj-my-portfolio-api.onrender.com/api";

// Create particles for background
function createParticles() {
  const container = document.getElementById("particles");
  if (!container) return;
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    const size = Math.random() * 5 + 3;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 15}s`;

    container.appendChild(particle);
  }
}

// Navbar scroll effect
function handleNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  const backToTop = document.querySelector(".back-to-top");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      if (navbar) navbar.classList.add("scrolled");
      if (backToTop) backToTop.classList.add("visible");
    } else {
      if (navbar) navbar.classList.remove("scrolled");
      if (backToTop) backToTop.classList.remove("visible");
    }
  });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      
      if (targetId && targetId.startsWith('#') && targetId.length > 1) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          });
        }
      }
    });
  });
}

// Intersection Observer for animations
function initIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        if (entry.target.classList.contains("skill-item")) {
          const skillLevel = entry.target.getAttribute("data-level");
          const skillProgress = entry.target.querySelector(".skill-progress");
          if (skillProgress) {
            setTimeout(() => {
              skillProgress.style.width = skillLevel;
            }, 300);
          }
        }
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(".project-card, .skill-category, .skill-item")
    .forEach((item) => {
      observer.observe(item);
    });
}

// Function to load and display the resume download button
function loadResumeButton() {
    const downloadBtn = document.getElementById('download-cv-btn');
    if (!downloadBtn) return;

    fetch(`${API_BASE}/resumes`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const resumes = data.content;
            if (resumes && resumes.length > 0) {
                const resume = resumes[0];
                downloadBtn.href = `${API_BASE}/resumes/download/${resume.id}`;
                downloadBtn.style.display = 'inline-block';
            } else {
                downloadBtn.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error fetching resume URL:', error);
            downloadBtn.style.display = 'none';
        });
}

// Load projects with animation
function loadProjects() {
  fetch(`${API_BASE}/projects`)
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("projects-list");
      const projects = data.content;
      if (!container) return;

      if (projects.length === 0) {
        container.innerHTML = '<p class="empty-state">No projects found</p>';
        return;
      }

      projects.forEach((p, index) => {
        const projectCard = document.createElement("div");
        projectCard.classList.add("project-card");

        projectCard.innerHTML = `
              <div class="project-img">
                <i class="fas fa-code"></i>
              </div>
              <div class="project-content">
                <h3>${p.title}</h3>
                <p>${p.description}</p>
                <div class="tech-stack">
                  <b>Tech Stack:</b> ${p.techStack.join(", ")}
                </div>
                <div class="projeect-link">
                   ${
                     p.githubLink
                       ? `<a href="${p.githubLink}" target="_blank">
                  <button>GitHub <i class="fab fa-github"></i></button>
                   </a>`
                       : ""
                   }
                </div>
              </div>
            `;
        container.appendChild(projectCard);
        setTimeout(() => {
          projectCard.classList.add("visible");
        }, 100 * index);
      });
    })
    .catch((error) => {
      console.error("Error loading projects:", error);
      const container = document.getElementById("projects-list");
      if(container) container.innerHTML = '<p class="empty-state">Failed to load projects. Please try again later.</p>';
    });
}

// Load skills with animation
function loadSkills() {
  fetch(`${API_BASE}/skills`)
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("skills-list");
      const skills = data.content;
      if (!container) return;

      if (skills.length === 0) {
        container.innerHTML = '<p class="empty-state">No skills found</p>';
        return;
      }

      const skillCategories = {};
      skills.forEach((skill) => {
        const category = skill.category;
        if (!skillCategories[category]) {
          skillCategories[category] = [];
        }
        skillCategories[category].push(skill);
      });

      container.innerHTML = "";
      for (const [category, skills] of Object.entries(skillCategories)) {
        if (skills.length === 0) continue;
        const categoryElement = document.createElement("div");
        categoryElement.classList.add("skill-category");
        const title = category.charAt(0).toUpperCase() + category.slice(1);
        categoryElement.innerHTML = `<h3>${title}</h3>`;

        skills.forEach((skill) => {
          const skillItem = document.createElement("div");
          skillItem.classList.add("skill-item");

          let progressWidth = "50%";
          const level = skill.level.toLowerCase();

          if (level === "intermediate") {
            progressWidth = "70%";
          } else if (level === "expert") {
            progressWidth = "90%";
          }
          skillItem.setAttribute("data-level", progressWidth);

          skillItem.innerHTML = `
              <div class="skill-name">
                <span>${skill.name}</span>
                <span class="skill-level">${skill.level}</span>
              </div>
              <div class="skill-bar">
                <div class="skill-progress"></div>
              </div>
            `;
          categoryElement.appendChild(skillItem);
        });
        container.appendChild(categoryElement);
        setTimeout(() => {
          categoryElement.classList.add("visible");
        }, 300);
      }
    })
    .catch((error) => {
      console.error("Error loading skills:", error);
      const container = document.getElementById("skills-list");
      if(container) container.innerHTML = '<p class="empty-state">Failed to load skills. Please try again later.</p>';
    });
}

// Load certifications from the API
function loadCertifications() {
    const certificationsContainer = document.getElementById('certifications-list');
    if (!certificationsContainer) return;
    const apiUrl = `${API_BASE}/certifications`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const certifications = data.content;
            if (certifications.length === 0) {
                certificationsContainer.innerHTML = '<p>No certifications to display yet.</p>';
                return;
            }
            certificationsContainer.innerHTML = '';
            certifications.forEach(cert => {
                const certificationCard = document.createElement('div');
                certificationCard.classList.add('certification-card');

                const name = document.createElement('h3');
                name.textContent = cert.name;
                
                const issuer = document.createElement('p');
                issuer.innerHTML = `<strong>Issued By:</strong> ${cert.issuingOrganization}`;

                const issueDate = document.createElement('p');
                issueDate.innerHTML = `<strong>Issue Date:</strong> ${cert.issueDate}`;

                certificationCard.appendChild(name);
                certificationCard.appendChild(issuer);
                certificationCard.appendChild(issueDate);
                
                if (cert.url) {
                    const certLink = document.createElement('a');
                    certLink.href = cert.url;
                    certLink.textContent = 'View Credential';
                    certLink.target = '_blank';
                    certificationCard.appendChild(certLink);
                }

                certificationsContainer.appendChild(certificationCard);
            });
        })
        .catch(error => {
            console.error('Error fetching certifications:', error);
            if (certificationsContainer) certificationsContainer.innerHTML = '<p>Failed to load certifications. Please try again later.</p>';
        });
}

// Load education from the API
function loadEducation() {
    const educationContainer = document.getElementById('education-list');
    if (!educationContainer) return;
    const apiUrl = `${API_BASE}/education`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const educationRecords = data.content;
            if (educationRecords.length === 0) {
                educationContainer.innerHTML = '<p>No education records to display yet.</p>';
                return;
            }
            educationContainer.innerHTML = '';
            educationRecords.forEach(edu => {
                const educationCard = document.createElement('div');
                educationCard.classList.add('education-card');

                const institution = document.createElement('h3');
                institution.textContent = edu.institution;

                const degree = document.createElement('p');
                degree.innerHTML = `<strong>Degree:</strong> ${edu.degree}`;

                const dates = document.createElement('p');
                const endDateText = edu.endDate ? ` - ${edu.endDate}` : ' - Present';
                dates.innerHTML = `<strong>Dates:</strong> ${edu.startDate}${endDateText}`;

                educationCard.appendChild(institution);
                educationCard.appendChild(degree);
                educationCard.appendChild(dates);
                
                if (edu.fieldOfStudy) {
                    const fieldOfStudy = document.createElement('p');
                    fieldOfStudy.innerHTML = `<strong>Field of Study:</strong> ${edu.fieldOfStudy}`;
                    educationCard.appendChild(fieldOfStudy);
                }

                if (edu.grade) {
                    const grade = document.createElement('p');
                    grade.innerHTML = `<strong>Grade:</strong> ${edu.grade}`;
                    educationCard.appendChild(grade);
                }
                
                if (edu.description) {
                    const description = document.createElement('p');
                    description.innerHTML = `<strong>Description:</strong> ${edu.description}`;
                    educationCard.appendChild(description);
                }
                
                educationContainer.appendChild(educationCard);
            });
        })
        .catch(error => {
            console.error('Error fetching education:', error);
            if (educationContainer) educationContainer.innerHTML = '<p>Failed to load education records. Please try again later.</p>';
        });
}

// Contact form with validation
function setupContactForm() {
  const contactForm = document.getElementById("contact-form");
  const responseElement = document.getElementById("contact-response");

  if (!contactForm) return;

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    const msg = {
      name: nameInput.value,
      email: emailInput.value,
      message: messageInput.value,
    };

    // Client-side validation
    if (msg.message.length < 5 || msg.message.length > 4000) {
      responseElement.textContent =
        "❌ Error: Message must be between 5 and 4000 characters.";
      responseElement.style.color = "#ff6b6b";
      return;
    }

    // Show loading state
    responseElement.textContent = "Sending message...";
    responseElement.style.color = "#64ffda";

    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });

      const text = await res.text();

      if (res.ok) {
        responseElement.textContent = "✅ Message sent successfully!";
        responseElement.style.color = "#64ffda";
        contactForm.reset();
      } else {
        responseElement.textContent = `❌ Error: ${text}`;
        responseElement.style.color = "#ff6b6b";
      }
    } catch (error) {
      responseElement.textContent = "❌ Network error. Please try again later.";
      responseElement.style.color = "#ff6b6b";
    }
  });
}

// Function for the typewriter effect
function typewriterEffect() {
  const typedTextSpan = document.querySelector(".typed-text");
  if (!typedTextSpan) return;
  const textToType = "Dhiraj";
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentText = textToType.substring(0, charIndex);
    typedTextSpan.textContent = currentText;

    if (!isDeleting && charIndex < textToType.length) {
      charIndex++;
      setTimeout(type, 150);
    } else if (isDeleting && charIndex > 0) {
      charIndex--;
      setTimeout(type, 100);
    } else if (!isDeleting && charIndex === textToType.length) {
      isDeleting = true;
      setTimeout(type, 1000);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      setTimeout(type, 500);
    }
  }

  type();
}

// Function for the typewriter effect on the profession text
function professionTypewriter() {
  const typedTextSpan = document.querySelector(".typed-text2");
  if (!typedTextSpan) return;
  const phrases = [
    "Java Backend Developer",
    "Java Full Stack Developer",
    "Machine Learning Engineer",
    "Software Engineer",
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentPhrase = phrases[phraseIndex];
    const currentText = currentPhrase.substring(0, charIndex);
    typedTextSpan.textContent = currentText;

    if (!isDeleting && charIndex < currentPhrase.length) {
      charIndex++;
      setTimeout(type, 100);
    } else if (isDeleting && charIndex > 0) {
      charIndex--;
      setTimeout(type, 50);
    } else if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(type, 1500);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, 500);
    }
  }

  type();
}


// Initialize everything when the page loads
window.addEventListener("DOMContentLoaded", () => {
  createParticles();
  handleNavbarScroll();
  initSmoothScrolling();
  loadProjects();
  loadSkills();
  loadCertifications(); // Call the new load function
  loadEducation();
  loadResumeButton();
  setupContactForm();
  typewriterEffect();
  professionTypewriter();
});

