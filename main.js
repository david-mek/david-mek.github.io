// Website Navbar Logo Spin Animation
let logo = document.querySelector('nav img');

logo.addEventListener('click', () => {
    logo.style.transition = "transform 1s";
    logo.style.transform = "rotate(360deg)";
    
    setTimeout(() => {
        logo.style.transition = "none";
        logo.style.transform = "none";
    }, 1000);
});

// Back to top button fade in and functionality.
document.addEventListener("DOMContentLoaded", function () {
  const backToTopButton = document.querySelector("#back-to-top-btn");

  if (!backToTopButton) {
    console.error("Back to top button not found");
  } else {
    console.log("Back to top button found");
    backToTopButton.addEventListener('click', smoothScrollBackToTop);
  }

  window.addEventListener("scroll", scrollFunction);

  function scrollFunction() {
    console.log("Scroll event triggered");

    if (window.scrollY > 300) { // Show backToTopButton
      console.log("Page offset greater than 300");
      if (!backToTopButton.classList.contains("btnEntrance")) {
        backToTopButton.classList.remove("btnExit");
        backToTopButton.classList.add("btnEntrance");
        backToTopButton.style.display = "block";
      }
    } else { // Hide backToTopButton
      console.log("Page offset less than or equal to 300");
      if (backToTopButton.classList.contains("btnEntrance")) {
        backToTopButton.classList.remove("btnEntrance");
        backToTopButton.classList.add("btnExit");
        setTimeout(function () {
          backToTopButton.style.display = "none";
        }, 275); // Increase the timeout to match the CSS transition duration
      }
    }
  }
});

// Smooth scrolling back to top of page w/ back to top button.
function smoothScrollBackToTop() {
  const targetPosition = 0;
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  const duration = 750;
  let start = null;
  
  window.requestAnimationFrame(step);

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    window.scrollTo(0, easeInOutCubic(progress, startPosition, distance, duration));
    if (progress < duration) window.requestAnimationFrame(step);
  }
}

function easeInOutCubic(t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t + b;
	t -= 2;
	return c/2*(t*t*t + 2) + b;
};

// Section 2 (About Me) Javascript 

// const viewSkillsBtn = document.querySelector(".view_skills_btn");
// const viewProjectsBtn = document.querySelector(".view_projects_btn");

// if (!viewSkillsBtn || !viewProjectsBtn) {
//   console.error("View Skills or View Projects button not found");
// } else {
//   console.log("View Skills and View Projects buttons found");
//   viewSkillsBtn.addEventListener("mousedown", function () {
//     recessButton(viewSkillsBtn);
//   });
//   viewSkillsBtn.addEventListener("mouseup", function () {
//     recessButton(viewSkillsBtn);
//   });
//   viewProjectsBtn.addEventListener("mousedown", function () {
//     recessButton(viewProjectsBtn);
//   });
//   viewProjectsBtn.addEventListener("mouseup", function () {
//     recessButton(viewProjectsBtn);
//   });
// }

// // Button recess animations.
// function recessButton(button) {
//   button.style.top = "5px";
//   button.style.boxShadow = "0 0 0 var(--blueColor)"; 
//   setTimeout(function () {
//     button.style.top = "0";
//     button.style.boxShadow = "0 5px 0 var(--blueColor)"; 
//   }, 150);
// }

document.addEventListener("DOMContentLoaded", () => {
  const viewSkillsBtn = document.querySelector(".view_skills_btn");
  const viewProjectsBtn = document.querySelector(".view_projects_btn");
  const tileThreeSection = document.getElementById("tile_three");
  const tileFourSection = document.getElementById("tile_four");

  if (!viewSkillsBtn || !viewProjectsBtn || !tileThreeSection || !tileFourSection) {
    console.error("Buttons or target sections not found");
    return; // Exit the function to prevent further execution
  } else {
    console.log("Buttons and target sections found");
  }

  viewSkillsBtn.addEventListener("click", () => {
    recessButton(viewSkillsBtn);
    scrollToSection(tileThreeSection);
  });

  viewProjectsBtn.addEventListener("click", () => {
    recessButton(viewProjectsBtn);
    scrollToSection(tileFourSection);
  });

  // Button recess animations.
  function recessButton(button) {
    button.style.top = "5px";
    button.style.boxShadow = "0 0 0 var(--blueColor)";
    setTimeout(function () {
      button.style.top = "0";
      button.style.boxShadow = "0 5px 0 var(--blueColor)";
    }, 150);
  }

  // Function to scroll to a target section.
  function scrollToSection(targetSection) {
    const targetOffset = targetSection.offsetTop;
    window.scrollTo({
      top: targetOffset,
      behavior: "smooth"
    });
  }
});



// Section 4 (Timeline Section) Javascript.

const events = document.querySelectorAll(".event"); // Select all event divs
let initialScrollPosition;

events.forEach(function(event) {
    const contentDiv = event.querySelector(".content");
    const modal = event.querySelector(".myModal");
    
    contentDiv.addEventListener("click", function() {
        // Recess animation
        contentDiv.style.top = "5px";
        contentDiv.style.boxShadow = "0 0 0 var(--blueColor)"; 
        setTimeout(function () {
            contentDiv.style.top = "0";
            contentDiv.style.boxShadow = "0 5px 0 var(--blueColor)"; 
        }, 150);

        // Display the modal and disable scrolling
        modal.style.display = "block";
        modal.classList.add('open'); // Add 'open' class when modal is displayed
        document.body.style.overflow = "hidden";
        // Store the scroll position
        initialScrollPosition = window.scrollY || document.documentElement.scrollTop;
    });

    // Close modal by interacting with any of the 3 macOS nav buttons.
    const closeModalButtons = event.querySelectorAll('.macos-button');
    for(let btn of closeModalButtons) {
        btn.addEventListener('click', function() {
            modal.style.animationName = "fadeOut";
            setTimeout(() => {
                modal.style.display = "none";
                modal.classList.remove('open'); // Remove 'open' class when modal is closed
                modal.style.animationName = "fadeIn"; // Reset the animation for the next use.
                document.body.style.overflow = "auto"; // Enable scrolling when the modal is closed
            }, 500);
        });
    }
    
    // Close modal just by clicking outside of it.
    window.addEventListener("click", function(event) {
      if (event.target === modal) {
          modal.style.animationName = "fadeOut";
          setTimeout(() => {
              modal.style.display = "none";
              modal.classList.remove('open'); // Remove 'open' class when modal is closed
              modal.style.animationName = "fadeIn";  // Reset the animation for the next use.
              document.body.style.overflow = "auto";  // Enable scrolling when the modal is closed
          }, 500);
      }
    });
});

window.addEventListener('scroll', function() {
  let openedModal = document.querySelector('.myModal.open'); // Check for any opened modal
  if (openedModal && window.scrollY !== initialScrollPosition) {
      // If user has scrolled, bounce back to the original position
      window.scrollTo({ top: initialScrollPosition, behavior: 'smooth' });
  }
}, { passive: false });

// Section 5 (Projects Section) Javascipt 

document.addEventListener("DOMContentLoaded", () => {
  // Filter Buttons
  const filterButtons = document.querySelectorAll(".filter-button");
  filterButtons.forEach((button) => {
      button.addEventListener("click", function() {
          this.classList.toggle("selected");
          this.classList.toggle("unselected");
          const icon = this.querySelector(".icon");
          icon.textContent = this.classList.contains("selected") ? "✓" : "✗";
          // Filtering logic here
      });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Creates a list of all pane objects from HTML.
  const paneList = document.querySelectorAll(".pane");
  // Define pain pair index.
  let curPanePairIndex = 0; 
  // Creates a list of all dot objects from HTML.
  const dotList = document.querySelectorAll(".carousel-dot");
  // Define the number of pane pairs.
  const numPanePairs = Math.ceil(paneList.length / 2);
  // Define number of dots.
  const numDots = numPanePairs;
  // Pane fade duration (in milliseconds).
  const fadeDuration = 500; 


  // Function to toggle visibility and fading
  // const toggleVisibility = (index, isVisible) => {
  //   if (index >= 0 && index < numPanePairs) {
  //     const pane1 = paneList[index];
  //     const pane2 = paneList[index + 1];
  //     // Set first pane in pair to be visible.
  //     pane1.style.transition = isVisible ? `opacity ${fadeDuration}ms` : "none";
  //     pane1.style.opacity = isVisible ? 1 : 0;
  //     pane1.style.visibility = isVisible ? "visible" : "hidden";
  //     // Set second pair in pane to be visible.
  //     pane2.style.transition = isVisible ? `opacity ${fadeDuration}ms` : "none";
  //     pane2.style.opacity = isVisible ? 1 : 0;
  //     pane2.style.visibility = isVisible ? "visible" : "hidden";
  //   }
  // };
  const toggleVisibility = (index, isVisible) => {
    const pairStartIndex = index * 2;
    const pairEndIndex = pairStartIndex + 1;

    for (let i = 0; i < paneList.length; i++) {
      if (i >= pairStartIndex && i <= pairEndIndex) {
        const pane = paneList[i];
        pane.style.transition = isVisible ? `opacity ${fadeDuration}ms` : "none";
        pane.style.opacity = isVisible ? 1 : 0;
        pane.style.visibility = isVisible ? "visible" : "hidden";
      }
    }
  };

  // Update indicator dots function.
  const updateDots = (index) => {
    dotList.forEach((dot) => dot.classList.remove("active"));
    if (index >= 0 && index < numPanePairs) {
      dotList[index].classList.add("active");
    }
  };

  // Initial setup: show the first 2 panes and update the dots.
  toggleVisibility(curPanePairIndex, true);
  updateDots(0);

  // // Shift Panes function.
  // const shiftPanes = (shift) => {
  //   toggleVisibility(curPanePairIndex, false);
  //   curPanePairIndex += shift;
  //   if (curPanePairIndex < 0) {
  //     curPanePairIndex = 0;
  //   } else if (curPanePairIndex >= numPanePairs) {
  //     curPanePairIndex = numPanePairs - 1;
  //   }
  //   toggleVisibility(curPanePairIndex, true);
  //   updateDots(curPanePairIndex);
  // }; 

  // // Assuming each pair of panes has the same width as the carousel window
  // const pairWidth = document.querySelector('.carousel-window').offsetWidth;

  // const shiftPanes = (shift) => {
  //   toggleVisibility(curPanePairIndex, false);
  //   curPanePairIndex += shift;

  //   if (curPanePairIndex < 0) {
  //     curPanePairIndex = 0;
  //   } else if (curPanePairIndex >= numPanePairs) {
  //     curPanePairIndex = numPanePairs - 1;
  //   }

  //   const shiftAmount = -pairWidth * curPanePairIndex;
  //   document.querySelector('.carousel-window').style.transform = `translateX(${shiftAmount}px)`;

  //   toggleVisibility(curPanePairIndex, true);
  //   updateDots(curPanePairIndex);
  // };

  // Assuming each pair of panes has the same width as the carousel window
  const singlePaneWidth = document.querySelector('.pane').offsetWidth;
  const pairWidth = singlePaneWidth * 2 + 40;

  // console.log("Width of a single pane:", singlePaneWidth);
  // console.log("Total width of a pair of panes:", pairWidth);

  const shiftPanes = (shift) => {
    // Hide current panes
    toggleVisibility(curPanePairIndex, false);

    // Calculate new index
    curPanePairIndex += shift;
    if (curPanePairIndex < 0) {
      curPanePairIndex = 0;
    } else if (curPanePairIndex >= numPanePairs) {
      curPanePairIndex = numPanePairs - 1;
    }

    // Apply the shift to each pair of panes
    for (let i = 0; i < numPanePairs; i++) {
      const pairStartIndex = i * 2;
      const pane1 = paneList[pairStartIndex];
      const pane2 = paneList[pairStartIndex + 1];

      const shiftAmount = -pairWidth * curPanePairIndex;
      pane1.style.transform = `translateX(${shiftAmount}px)`;
      pane2.style.transform = `translateX(${shiftAmount}px)`;
    }

    // Show new panes
    toggleVisibility(curPanePairIndex, true);
    updateDots(curPanePairIndex);
  };

  // Next Button
  // document.getElementById("next-button").addEventListener("click", () => {
  //   if (curPanePairIndex < numPanePairs - 1) {
  //     shiftPanes(1);
  //   } else {
  //     // Adding the shake animation
  //     const panes = document.querySelectorAll(".pane");
  //     panes.forEach((pane) => {
  //       pane.classList.add("shake-animation");
  //     });

  //     // Remove the shake-animation class after the animation is done to allow re-triggering
  //     setTimeout(() => {
  //       panes.forEach((pane) => {
  //         pane.classList.remove("shake-animation");
  //       });
  //     }, 300);  // The duration of the shake animation in milliseconds
  //   }
  // });
  document.getElementById("next-button").addEventListener("click", () => {
    if (curPanePairIndex < numPanePairs - 1) {
      shiftPanes(1);
    } else {
      // Trigger shake animation
      triggerShakeAnimation();
    }
  });
  
  function triggerShakeAnimation() {
    const panes = document.querySelectorAll(".pane");
    panes.forEach((pane) => {
      pane.classList.add("shake-animation");
    });
  
    // Remove the shake-animation class after the animation is done to allow re-triggering
    setTimeout(() => {
      panes.forEach((pane) => {
        pane.classList.remove("shake-animation");
      });
    }, 300); // The duration of the shake animation in milliseconds
  }

  // Previous Button
  document.getElementById("prev-button").addEventListener("click", () => {
    if (curPanePairIndex > 0) {
      shiftPanes(-1);
    } else {
      // Adding the shake animation
      const panes = document.querySelectorAll(".pane");
      panes.forEach((pane) => {
        pane.classList.add("shake-animation");
      });

      // Remove the shake-animation class after the animation is done to allow re-triggering
      setTimeout(() => {
        panes.forEach((pane) => {
          pane.classList.remove("shake-animation");
        });
      }, 300);  // The duration of the shake animation in milliseconds
    }
  });
});
