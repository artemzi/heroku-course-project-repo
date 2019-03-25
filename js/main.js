/**
 * The limited array of 2 elements
 */
class Pocket {
  cards = [];

  get size() {
    return this.cards.length;
  }

  push = (e) => {
    // limit array length
    if (this.cards.length < 2) {
      this.cards.push(e);
      return true;
    }
    return false;
  };

  clean = () => {
    this.cards = [];
  };
}

class Card {
  html = `
    <div class="card">
      <div class="card__front"></div>
      <div class="card__back"></div>
    </div>
  `;

  get generate() {
    return this.html;
  }
}

class Game {
  stack = new Pocket();
  interval = null;
  emoji = [
    "🐱",
    "🐻",
    "🐼",
    "🐸",
    "🦄",
    "🐿",
    "🐱",
    "🐻",
    "🐼",
    "🐸",
    "🦄",
    "🐿"
  ];

  get create() {
    return this.createNewGame();
  }

  startInterval() {
    let timer = 59,
      minutes, seconds;
    self = this;
    this.interval = setInterval(function() {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      document.querySelector('#timer').textContent = minutes + ":" + seconds;
      if (--timer < 0 || Game.isAllGreen()) {
        Game.stopGame();
      }
    }, 1000);
  };

  static isAllGreen() {
    let matched = true;
    Array.from(document.querySelectorAll(".card")).forEach((card) => {
        if (!card.classList.contains('matched')) {
          matched = false;
        }
      }
    );
    return matched;
  }

  static stopGame() {
    clearInterval(self.interval);
    self.interval = null;

    Array.from(document.querySelectorAll(".card > .card__back")).forEach((e) =>
      e.removeEventListener("click", self.onCardClickHandler, false)
    );

    if (Game.isAllGreen()) {
      document.querySelector('.win').classList.remove('hide');
    } else {
      document.querySelector('.fail').classList.remove('hide');
    }
  }

  shuffleArray(arr) {
    return arr
      .map((a) => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map((a) => a[1]);
  }

  onCardClickHandler = (e) => {
    if (this.interval === null) {
      this.startInterval();
    }

    let element = e.target.parentNode;
    if (element.classList.contains('matched') || element.classList.contains('not-matched')) return; // do nothing onClick

    if (this.stack.push(element)) {
      element.classList.add("flip");
      if (this.stack.size === 2) {
        this.checkEmojiMatching();
      }
    } else {
      this.flipCardsHandler(element);
    }
  };

  flipCardsHandler(element) {
    let cards = document.getElementsByClassName("card");
    Array.from(cards).forEach((card) => {
      if (
          card.classList.contains("flip") &&
          !card.classList.contains("matched")
      ) {
        card.classList.remove("flip");
        card.classList.remove("not-matched");
        this.stack.clean();
      }
    });
    this.stack.push(element);
    element.classList.add("flip");
  }

  checkEmojiMatching() {
    let cards = document.getElementsByClassName("card");
    if (this.stack.cards[0].innerHTML === this.stack.cards[1].innerHTML) {
      Array.from(cards).forEach((card) => {
        if (
            card.classList.contains("flip") &&
            !card.classList.contains("not-matched")
        ) {
          card.classList.add("matched");
          this.stack.clean();
        }
      });
    } else {
      Array.from(cards).forEach((card) => {
        if (
            card.classList.contains("flip") &&
            !card.classList.contains("matched")
        ) {
          card.classList.add("not-matched");
        }
      });
    }
  }

  createNewGame() {
    let emoji = this.shuffleArray(this.emoji);
    const root = document.getElementById("game");
    // magic 12 here is required cards count in game
    for (let i = 0; i < 12; i++) {
      let card = new Card().generate;
      root.insertAdjacentHTML("beforeend", card);
      // root.lastElementChild.firstElementChild.id = `card-${i}`;
      root.lastElementChild.firstElementChild.innerHTML = emoji.shift();
    }

    Array.from(document.querySelectorAll(".card > .card__back")).forEach((e) =>
      e.addEventListener("click", this.onCardClickHandler, false)
    );
  };
}

function newGame() {
  const root = document.getElementById('game'); // clean old content
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }

  Array.from(document.querySelectorAll('.modal')).forEach((e) => { // hide any modal
      if (!e.classList.contains('hide')) e.classList.add('hide');
    }
  );
  document.querySelector('#timer').textContent = "01:00"; // restore timer

  new Game().create; // new game
}

newGame();

Array.from(document.querySelectorAll(".new-game")).forEach((e) =>
  e.addEventListener("click", newGame, false)
);