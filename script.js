document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  /* =========================
   * MOBILE MENU
   * ========================= */
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
      body.classList.toggle("menu-open");
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        body.classList.remove("menu-open");
      });
    });
  }

  /* =========================
   * SCROLL PROGRESS BAR
   * ========================= */
  const progressBar = document.querySelector(".scroll-progress");

  const updateProgressBar = () => {
    if (!progressBar) return;

    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    progressBar.style.width = `${progress}%`;
  };

  updateProgressBar();
  window.addEventListener("scroll", updateProgressBar);

  /* =========================
   * CURSOR GLOW
   * ========================= */
  const cursorGlow = document.querySelector(".cursor-glow");

  if (cursorGlow && window.innerWidth > 768) {
    window.addEventListener("mousemove", (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  /* =========================
   * REVEAL ON SCROLL
   * ========================= */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  /* =========================
   * TILT CARDS
   * ========================= */
  const tiltCards = document.querySelectorAll(".tilt-card");

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      if (window.innerWidth <= 768) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * 8;
      const rotateX = ((centerY - y) / centerY) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    });
  });

  /* =========================
   * GALLERY SLIDER
   * ========================= */
  const gallery = document.getElementById("gallery");
  const galleryDots = document.getElementById("galleryDots");
  const prevBtn = document.querySelector(".gallery-btn.prev");
  const nextBtn = document.querySelector(".gallery-btn.next");

  if (gallery) {
    const slides = Array.from(gallery.querySelectorAll("img"));
    let currentIndex = slides.findIndex((img) => img.classList.contains("active"));
    if (currentIndex === -1) currentIndex = 0;

    let autoplay = null;
    const autoplayDelay = 3500;

    const renderDots = () => {
      if (!galleryDots) return;

      galleryDots.innerHTML = "";

      slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.setAttribute("aria-label", `Μετάβαση στην εικόνα ${index + 1}`);
        if (index === currentIndex) dot.classList.add("active");

        dot.addEventListener("click", () => {
          goToSlide(index);
          restartAutoplay();
        });

        galleryDots.appendChild(dot);
      });
    };

    const updateSlides = () => {
      slides.forEach((slide, index) => {
        slide.classList.toggle("active", index === currentIndex);
      });

      if (galleryDots) {
        const dots = galleryDots.querySelectorAll("button");
        dots.forEach((dot, index) => {
          dot.classList.toggle("active", index === currentIndex);
        });
      }
    };

    const goToSlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      updateSlides();
    };

    const nextSlide = () => goToSlide(currentIndex + 1);
    const prevSlide = () => goToSlide(currentIndex - 1);

    const startAutoplay = () => {
      stopAutoplay();
      autoplay = setInterval(nextSlide, autoplayDelay);
    };

    const stopAutoplay = () => {
      if (autoplay) {
        clearInterval(autoplay);
        autoplay = null;
      }
    };

    const restartAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide();
        restartAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        restartAutoplay();
      });
    }

    const galleryContainer = document.querySelector(".gallery-container");
    if (galleryContainer) {
      galleryContainer.addEventListener("mouseenter", stopAutoplay);
      galleryContainer.addEventListener("mouseleave", startAutoplay);
    }

    renderDots();
    updateSlides();
    startAutoplay();
  }

  /* =========================
   * BOOKING PAGE
   * ========================= */
  const calendar = document.getElementById("calendar");
  const bookingForm = document.getElementById("booking-form");
  const slotSelect = document.getElementById("slot");
  const serviceSelect = document.getElementById("service");
  const bookingSummary = document.getElementById("bookingSummary");
  const confirmation = document.getElementById("confirmation");
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");

  if (calendar && bookingForm && slotSelect && serviceSelect && bookingSummary) {
    const greekDays = [
      "Κυριακή",
      "Δευτέρα",
      "Τρίτη",
      "Τετάρτη",
      "Πέμπτη",
      "Παρασκευή",
      "Σάββατο"
    ];

    const greekMonths = [
      "Ιανουαρίου",
      "Φεβρουαρίου",
      "Μαρτίου",
      "Απριλίου",
      "Μαΐου",
      "Ιουνίου",
      "Ιουλίου",
      "Αυγούστου",
      "Σεπτεμβρίου",
      "Οκτωβρίου",
      "Νοεμβρίου",
      "Δεκεμβρίου"
    ];

    const hoursByDay = {
      0: [],
      1: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
      2: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
      3: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
      4: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
      5: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
      6: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
    };

    let selectedDateLabel = "";
    let selectedSlot = "";

    const formatDateLabel = (date) => {
      return `${greekDays[date.getDay()]} ${date.getDate()} ${greekMonths[date.getMonth()]}`;
    };

    const updateSummary = () => {
      const name = nameInput.value.trim() || "—";
      const phone = phoneInput.value.trim() || "—";
      const service = serviceSelect.value || "—";
      const slotText = selectedSlot
        ? `${selectedDateLabel}, ${selectedSlot}`
        : "Δεν έχει επιλεγεί ώρα";

      bookingSummary.innerHTML = `
        <strong>Σύνοψη Ραντεβού</strong><br>
        <strong>Όνομα:</strong> ${name}<br>
        <strong>Τηλέφωνο:</strong> ${phone}<br>
        <strong>Υπηρεσία:</strong> ${service}<br>
        <strong>Ημερομηνία & Ώρα:</strong> ${slotText}
      `;
    };

    const populateSlotSelect = (dateLabel, slots, chosenSlot = "") => {
      slotSelect.innerHTML = "";

      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "Επιλέξτε ώρα";
      slotSelect.appendChild(defaultOption);

      slots.forEach((slot) => {
        const option = document.createElement("option");
        option.value = `${dateLabel} | ${slot}`;
        option.textContent = `${dateLabel} | ${slot}`;
        if (slot === chosenSlot) option.selected = true;
        slotSelect.appendChild(option);
      });
    };

    const renderCalendar = () => {
      const today = new Date();
      calendar.innerHTML = "";

      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);

        const dayIndex = date.getDay();
        const slots = hoursByDay[dayIndex];
        const dateLabel = formatDateLabel(date);

        const dayEl = document.createElement("div");
        dayEl.className = "day";

        const title = document.createElement("h3");
        title.textContent = dateLabel;
        dayEl.appendChild(title);

        const times = document.createElement("div");
        times.className = "times";

        if (!slots.length) {
          const closedBtn = document.createElement("button");
          closedBtn.type = "button";
          closedBtn.className = "slot-btn closed";
          closedBtn.textContent = "Κλειστά";
          closedBtn.disabled = true;
          times.appendChild(closedBtn);
        } else {
          slots.forEach((slot) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "slot-btn";
            btn.textContent = slot;

            btn.addEventListener("click", () => {
              document.querySelectorAll(".slot-btn").forEach((b) => {
                if (!b.classList.contains("closed")) b.classList.remove("selected");
              });

              btn.classList.add("selected");

              selectedDateLabel = dateLabel;
              selectedSlot = slot;

              populateSlotSelect(dateLabel, slots, slot);
              slotSelect.value = `${dateLabel} | ${slot}`;
              updateSummary();
            });

            times.appendChild(btn);
          });
        }

        dayEl.appendChild(times);
        calendar.appendChild(dayEl);
      }
    };

    slotSelect.addEventListener("change", () => {
      const value = slotSelect.value;

      if (!value) {
        selectedDateLabel = "";
        selectedSlot = "";
        document.querySelectorAll(".slot-btn").forEach((b) => b.classList.remove("selected"));
        updateSummary();
        return;
      }

      const [datePart, timePart] = value.split(" | ");
      selectedDateLabel = datePart || "";
      selectedSlot = timePart || "";

      document.querySelectorAll(".day").forEach((dayEl) => {
        const dayTitle = dayEl.querySelector("h3")?.textContent || "";
        dayEl.querySelectorAll(".slot-btn").forEach((btn) => {
          const isMatch = dayTitle === selectedDateLabel && btn.textContent === selectedSlot;
          btn.classList.toggle("selected", isMatch);
        });
      });

      updateSummary();
    });

    [nameInput, phoneInput, serviceSelect].forEach((field) => {
      field.addEventListener("input", updateSummary);
      field.addEventListener("change", updateSummary);
    });

    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const service = serviceSelect.value;
      const slotValue = slotSelect.value;

      if (!name || !phone || !service || !slotValue) {
        confirmation.textContent = "Παρακαλώ συμπληρώστε όλα τα πεδία και επιλέξτε ώρα.";
        confirmation.style.color = "#be123c";
        return;
      }

      confirmation.textContent = `Το ραντεβού σας επιβεβαιώθηκε για ${slotValue} (${service}). Θα επικοινωνήσουμε μαζί σας σύντομα, ${name}!`;
      confirmation.style.color = "#6b21a8";

      bookingForm.reset();
      selectedDateLabel = "";
      selectedSlot = "";
      slotSelect.innerHTML = `<option value="">Επιλέξτε ώρα</option>`;
      document.querySelectorAll(".slot-btn").forEach((b) => b.classList.remove("selected"));

      bookingSummary.textContent =
        "Επιλέξτε διαθέσιμη ώρα για να εμφανιστεί η σύνοψη του ραντεβού σας.";
    });

    renderCalendar();
    updateSummary();
  }
});
