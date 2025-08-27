
      // const API_BASE = "http://localhost:8080/api";
      const API_BASE = "https://dhiraj-my-portfolio-api.onrender.com/api";

      // Create particles for background
      function createParticles() {
        const container = document.getElementById("particles");
        if (!container) return;
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement("div");
          particle.classList.add("particle");

          // Random size between 3 and 8 pixels
          const size = Math.random() * 5 + 3;
          particle.style.width = `${size}px`;
          particle.style.height = `${size}px`;

          // Random position
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;

          // Random animation delay
          particle.style.animationDelay = `${Math.random() * 15}s`;

          // Random opacity for more depth
          particle.style.opacity = Math.random() * 0.6 + 0.2;

          container.appendChild(particle);
        }
      }

      // Fixed heading effect
      function setupFixedHeading() {
        const fixedHeading = document.getElementById("fixed-heading");
        if (!fixedHeading) return;

        window.addEventListener("scroll", () => {
          const scrollPosition = window.scrollY;
          const windowHeight = window.innerHeight;

          // Calculate opacity based on scroll position
          const opacity = Math.max(
            0.05,
            0.2 - scrollPosition / (windowHeight * 2)
          );
          fixedHeading.style.opacity = opacity;

          // Move the heading slightly with scroll
          fixedHeading.style.transform = `translate(-50%, calc(-50% + ${
            scrollPosition * 0.1
          }px))`;
        });
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

            // Only perform smooth scrolling if the link is a local hash
            if (targetId && targetId.startsWith("#") && targetId.length > 1) {
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

      // Function to load and display the resume download button
      function loadResumeButton() {
        const downloadBtn = document.getElementById("download-cv-btn");
        if (!downloadBtn) return;

        // Fetch the resume list
        fetch(`${API_BASE}/resumes`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            const resumes = data.content;
            if (resumes && resumes.length > 0) {
              const resume = resumes[0]; // Assuming only one resume is managed
              // Set the href of the download button and make it visible
              downloadBtn.href = `${API_BASE}/resumes/download/${resume.id}`;
              downloadBtn.style.display = "inline-block";
            } else {
              // Hide the button if no resume is found
              downloadBtn.style.display = "none";
            }
          })
          .catch((error) => {
            console.error("Error fetching resume URL:", error);
            downloadBtn.style.display = "none";
          });
      }

      // Generic slider initialization function
      function initSlider(sliderId, dotsId, cardsPerViewFn) {
        const slider = document.getElementById(sliderId);
        const container = slider.closest(".slider-container");
        const prevBtn = container.querySelector(".slider-btn.prev");
        const nextBtn = container.querySelector(".slider-btn.next");
        const dots = document.querySelectorAll(`#${dotsId} .slider-dot`);

        if (!slider || !prevBtn || !nextBtn) return;

        let currentIndex = 0;
        const cardCount = slider.children.length;
        const cardsPerView = cardsPerViewFn();

        // Function to update slider position
        function updateSlider() {
          const cardWidth = slider.children[0].offsetWidth + 30; // width + gap
          slider.scrollTo({
            left: currentIndex * cardWidth,
            behavior: "smooth",
          });

          // Update active dot
          dots.forEach((dot, index) => {
            if (index === currentIndex) {
              dot.classList.add("active");
            } else {
              dot.classList.remove("active");
            }
          });
        }

        // Next button click
        nextBtn.addEventListener("click", () => {
          if (currentIndex < cardCount - cardsPerView) {
            currentIndex++;
            updateSlider();
          }
        });

        // Previous button click
        prevBtn.addEventListener("click", () => {
          if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
          }
        });

        // Dot click
        dots.forEach((dot) => {
          dot.addEventListener("click", () => {
            currentIndex = parseInt(dot.getAttribute("data-index"));
            updateSlider();
          });
        });

        // Handle window resize
        window.addEventListener("resize", () => {
          // Recalculate cards per view
          const newCardsPerView = cardsPerViewFn();

          // Adjust current index if needed
          if (currentIndex > cardCount - newCardsPerView) {
            currentIndex = Math.max(0, cardCount - newCardsPerView);
            updateSlider();
          }
        });
      }

      // Load skills with animation
      function loadSkills() {
        fetch(`${API_BASE}/skills`)
          .then((res) => res.json())
          .then((skills) => {
            const slider = document.getElementById("skills-slider");
            const dotsContainer = document.getElementById("skills-dots");
            if (!slider) return;

            if (skills.length === 0) {
              slider.innerHTML = '<p class="empty-state">No skills found</p>';
              return;
            }

            // Group skills by category
            const skillCategories = {};

            skills.forEach((skill) => {
              const category = skill.category;
              if (!skillCategories[category]) {
                skillCategories[category] = [];
              }
              skillCategories[category].push(skill);
            });

            // Clear the container before rendering new content
            slider.innerHTML = "";
            dotsContainer.innerHTML = "";

            // Create skill categories and render skills
            for (const [category, skills] of Object.entries(skillCategories)) {
              if (skills.length === 0) continue;

              const categoryElement = document.createElement("div");
              categoryElement.classList.add("skill-category");

              const title =
                category.charAt(0).toUpperCase() + category.slice(1);
              categoryElement.innerHTML = `<h3>${title}</h3>`;

              skills.forEach((skill) => {
                const skillItem = document.createElement("div");
                skillItem.classList.add("skill-item");

                let progressWidth = "50%"; // Default to a base level
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

              slider.appendChild(categoryElement);
            }

            // Create dots for navigation
            const cardCount = slider.children.length;
            for (let i = 0; i < cardCount; i++) {
              const dot = document.createElement("div");
              dot.classList.add("slider-dot");
              if (i === 0) dot.classList.add("active");
              dot.setAttribute("data-index", i);
              dotsContainer.appendChild(dot);
            }

            // Initialize slider functionality
            setTimeout(() => {
              initSlider("skills-slider", "skills-dots", () =>
                window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3
              );

              // Animate skill bars
              document.querySelectorAll(".skill-item").forEach((item) => {
                const skillLevel = item.getAttribute("data-level");
                const skillProgress = item.querySelector(".skill-progress");
                if (skillProgress) {
                  setTimeout(() => {
                    skillProgress.style.width = skillLevel;
                  }, 300);
                }
              });
            }, 100);
          })
          .catch((error) => {
            console.error("Error loading skills:", error);
            const slider = document.getElementById("skills-slider");
            if (slider)
              slider.innerHTML =
                '<p class="empty-state">Failed to load skills. Please try again later.</p>';
          });
      }

      // Load projects with animation
      function loadProjects() {
        fetch(`${API_BASE}/projects`)
          .then((res) => res.json())
          .then((data) => {
            const slider = document.getElementById("projects-slider");
            const dotsContainer = document.getElementById("projects-dots");
            const projects = data.content || data;

            if (projects.length === 0) {
              slider.innerHTML = '<p class="empty-state">No projects found</p>';
              return;
            }

            slider.innerHTML = "";
            dotsContainer.innerHTML = "";

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

                      <div class="project-link">
                        ${
                          p.githubLink
                            ? `<a href="${p.githubLink}" target="_blank"><button>GitHub <i class="fab fa-github"></i></button></a>`
                            : ""
                        }
                      </div>
                    </div>
                  `;

              slider.appendChild(projectCard);
            });

            // Create dots for navigation
            const cardCount = slider.children.length;
            for (let i = 0; i < cardCount; i++) {
              const dot = document.createElement("div");
              dot.classList.add("slider-dot");
              if (i === 0) dot.classList.add("active");
              dot.setAttribute("data-index", i);
              dotsContainer.appendChild(dot);
            }

            // Initialize slider functionality
            setTimeout(() => {
              initSlider("projects-slider", "projects-dots", () =>
                window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3
              );
            }, 100);
          })
          .catch((error) => {
            console.error("Error loading projects:", error);
            document.getElementById("projects-slider").innerHTML =
              '<p class="empty-state">Failed to load projects. Please try again later.</p>';
          });
      }

      // Load certifications from the API
      function loadCertifications() {
        const slider = document.getElementById("certifications-slider");
        const dotsContainer = document.getElementById("certifications-dots");
        if (!slider) return;

        const apiUrl = `${API_BASE}/certifications`;

        fetch(apiUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            const certifications = data.content;
            if (certifications.length === 0) {
              slider.innerHTML = "<p>No certifications to display yet.</p>";
              return;
            }

            slider.innerHTML = "";
            dotsContainer.innerHTML = "";

            certifications.forEach((cert, index) => {
              const certificationCard = document.createElement("div");
              certificationCard.classList.add("certification-card");

              certificationCard.innerHTML = `
                <h3>${cert.name}</h3>
                <p><strong>Issued By:</strong> ${cert.issuingOrganization}</p>
                <p><strong>Issue Date:</strong> ${cert.issueDate}</p>
                ${
                  cert.url
                    ? `<a href="${cert.url}" target="_blank">View Credential</a>`
                    : ""
                }
              `;

              slider.appendChild(certificationCard);
            });

            // Create dots for navigation
            const cardCount = slider.children.length;
            for (let i = 0; i < cardCount; i++) {
              const dot = document.createElement("div");
              dot.classList.add("slider-dot");
              if (i === 0) dot.classList.add("active");
              dot.setAttribute("data-index", i);
              dotsContainer.appendChild(dot);
            }

            // Initialize slider functionality
            setTimeout(() => {
              initSlider("certifications-slider", "certifications-dots", () =>
                window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3
              );
            }, 100);
          })
          .catch((error) => {
            console.error("Error fetching certifications:", error);
            slider.innerHTML =
              "<p>Failed to load certifications. Please try again later.</p>";
          });
      }

      // Load education from the API
      function loadEducation() {
        const slider = document.getElementById("education-slider");
        const dotsContainer = document.getElementById("education-dots");
        if (!slider) return;

        const apiUrl = `${API_BASE}/education`;

        fetch(apiUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            const educationRecords = data.content;
            if (educationRecords.length === 0) {
              slider.innerHTML = "<p>No education records to display yet.</p>";
              return;
            }

            slider.innerHTML = "";
            dotsContainer.innerHTML = "";

            educationRecords.forEach((edu) => {
              const educationCard = document.createElement("div");
              educationCard.classList.add("education-card");

              educationCard.innerHTML = `
                <h3><i class="fas fa-graduation-cap"></i> ${
                  edu.institution
                }</h3>
                <p><i class="fas fa-certificate"></i> <strong>Degree:</strong> ${
                  edu.degree
                }</p>
                <p><i class="fas fa-calendar-alt"></i> <strong>Dates:</strong> ${
                  edu.startDate
                }${edu.endDate ? ` - ${edu.endDate}` : " - Present"}</p>
                ${
                  edu.fieldOfStudy
                    ? `<p><i class="fas fa-book"></i> <strong>Field of Study:</strong> ${edu.fieldOfStudy}</p>`
                    : ""
                }
                ${
                  edu.grade
                    ? `<p><i class="fas fa-star"></i> <strong>Grade:</strong> ${edu.grade}</p>`
                    : ""
                }
                ${
                  edu.description
                    ? `<p><i class="fas fa-info-circle"></i> <strong>Description:</strong> ${edu.description}</p>`
                    : ""
                }
              `;

              slider.appendChild(educationCard);
            });

            // Create dots for navigation
            const cardCount = slider.children.length;
            for (let i = 0; i < cardCount; i++) {
              const dot = document.createElement("div");
              dot.classList.add("slider-dot");
              if (i === 0) dot.classList.add("active");
              dot.setAttribute("data-index", i);
              dotsContainer.appendChild(dot);
            }

            // Initialize slider functionality
            setTimeout(() => {
              initSlider("education-slider", "education-dots", () =>
                window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3
              );
            }, 100);
          })
          .catch((error) => {
            console.error("Error fetching education:", error);
            slider.innerHTML =
              "<p>Failed to load education records. Please try again later.</p>";
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
            responseElement.textContent =
              "❌ Network error. Please try again later.";
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

      // Dark mode toggle
      function initDarkModeToggle() {
        const toggleBtn = document.querySelector(".theme-toggle");
        const icon = toggleBtn.querySelector("i");

        toggleBtn.addEventListener("click", () => {
          document.body.classList.toggle("light-mode");

          if (document.body.classList.contains("light-mode")) {
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
          } else {
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
          }
        });
      }

      // Print functionality
      function initPrintButton() {
        const printBtn = document.querySelector(".print-btn");

        printBtn.addEventListener("click", () => {
          window.print();
        });
      }

      // Initialize everything when the page loads
      window.addEventListener("DOMContentLoaded", () => {
        createParticles();
        setupFixedHeading();
        handleNavbarScroll();
        initSmoothScrolling();
        loadProjects();
        loadSkills();
        loadCertifications();
        loadEducation();
        loadResumeButton();
        setupContactForm();
        typewriterEffect();
        professionTypewriter();
        initDarkModeToggle();
        initPrintButton();
      });
   