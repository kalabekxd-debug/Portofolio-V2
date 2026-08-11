const revealTargets = document.querySelectorAll(
  ".manifesto, .project, .capabilities, .contact"
);

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach(el => {
  el.classList.add("reveal");
  observer.observe(el);
});

document.addEventListener("mousemove", e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;
  document.documentElement.style.setProperty("--mx", `${x * 4}px`);
  document.documentElement.style.setProperty("--my", `${y * 4}px`);
});
