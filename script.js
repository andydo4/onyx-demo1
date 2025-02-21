document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent default jump behavior
    const targetId = this.getAttribute("href"); // Get the target ID
    const targetElement = document.querySelector(targetId); // Find the target element

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth", // Smooth scroll
        block: "start", // Align to the top of the viewport
      });
    }
  });
});
