window.onload = function() {
  const userName = prompt("Enter your name:");
  document.getElementById("welcome").innerText = `Welcome, ${userName == "" ? "User" : userName}!`;

  const gameIcons = ["apple", "pear", "lemon", "apricot", "cherries", "seven"];
  const generateButton = document.getElementById("generate");
  const winChance = 0.7;
  let tries = 0;
  let consecutiveWins = 0;

  function getRandomGameIcons() {
      let columns = [[], [], []];

      for (let i = 0; i < 3; i++) {
          let iconSet = new Set();
          while (iconSet.size < 3) {
              iconSet.add(gameIcons[Math.floor(Math.random() * gameIcons.length)]);
          }
          columns[i] = Array.from(iconSet);
      }

      if (Math.random() < winChance) {
          const winningIcon = gameIcons[Math.floor(Math.random() * gameIcons.length)];
          columns[0][1] = winningIcon;
          columns[1][1] = winningIcon;
          columns[2][1] = winningIcon;
      }

      return columns;
  }

  function animateSlotsSequentially(columns) {
      const slots = document.querySelectorAll('.slot');

      function animateColumn(columnIndex) {
          return new Promise(resolve => {
              const slot = slots[columnIndex];
              slot.style.transition = 'transform 0.5s ease-in-out';
              slot.style.transform = 'translateY(-100%)';

              setTimeout(() => {
                  slot.style.transition = '';
                  slot.style.transform = 'translateY(0)';
                  slot.innerHTML = '';

                  columns[columnIndex].forEach(gameIcon => {
                      const img = document.createElement("img");
                      img.src = `images/${gameIcon}.png`;
                      img.alt = gameIcon;
                      img.classList.add("fade-in");
                      slot.appendChild(img);
                  });
                  resolve();
              }, 500);
          });
      }

      animateColumn(0).then(() => 
          animateColumn(1)).then(() => 
          animateColumn(2)).then(() => {
              checkWin(columns);
          });
  }

  function checkWin(columns) {
      const centralRow = 1;
      const win = columns[0][centralRow] === columns[1][centralRow] && 
                  columns[1][centralRow] === columns[2][centralRow];

      setTimeout(() => {
          if (win) {
              consecutiveWins++;
              if (consecutiveWins === 3) {
                  alert("Congratulations! You've won 3 times in a row!");
                  consecutiveWins = 0;
              } else {
                  alert("You win! Keep going to win 3 times in a row.");
              }
          } else {
              consecutiveWins = 0;
              alert("Try again! Better luck next time.");
          }
      }, 200);
  }

  generateButton.onclick = function() {
      tries++;
      if (tries <= 3) {
          const columns = getRandomGameIcons();
          animateSlotsSequentially(columns);
      } else {
          alert("Game over! Refresh to try again.");
      }
  };
};
