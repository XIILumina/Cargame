import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const GameCanvas = ({ car, onGameOver }) => {
  const sketchRef = useRef();
  const errorRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const sketch = (p) => {
      let playerCar, carImg, obstacles, enemyCars, coins, timer, score, isPaused, gameStarted;
      let roadY = 0;
      const laneWidth = 100;
      const lanes = [-laneWidth, 0, laneWidth];

      p.setup = async () => {
        try {
          const canvas = p.createCanvas(400, 600);
          canvas.elt.tabIndex = 0; // Make canvas focusable
          canvas.elt.focus(); // Focus canvas for key events
          canvasRef.current = canvas.elt;
          if (car) {
            carImg = await new Promise((resolve, reject) => {
              p.loadImage(`/assets/cars/${car.sprite_path || car.car.sprite_path}`, resolve, reject);
            });
          }
          resetGame();
        } catch (error) {
          console.error('Error in setup:', error);
          errorRef.current = error.message;
          p.noLoop();
        }
      };

      const resetGame = () => {
        playerCar = {
          x: 0,
          y: p.height - 100,
          speed: 0,
          maxSpeed: car ? (car.base_max_speed || car.car.base_max_speed) : 100,
          acceleration: car ? (car.base_acceleration || car.car.base_acceleration) : 5,
          brakeStrength: car ? (car.base_brake_strength || car.car.base_brake_strength) : 5,
          turningSpeed: car ? (car.base_turning_speed || car.car.base_turning_speed) : 5,
          nitrous: car ? (car.base_nitrous || car.car.base_nitrous) : 100,
          color: car ? (car.color || car.car.color || '#ff0000') : '#ff0000',
          width: 50,
          height: 80,
        };
        obstacles = [];
        enemyCars = [];
        coins = [];
        timer = 0;
        score = 0;
        isPaused = false;
        gameStarted = false;
        spawnInitialObjects();
      };

      const spawnInitialObjects = () => {
        for (let i = 0; i < 5; i++) {
          spawnObstacle();
          if (Math.random() > 0.5) spawnEnemyCar();
          if (Math.random() > 0.7) spawnCoin();
        }
      };

      const spawnObstacle = () => {
        obstacles.push({
          x: lanes[Math.floor(Math.random() * 3)],
          y: -50 - Math.random() * 200,
          width: 30,
          height: 30,
        });
      };

      const spawnEnemyCar = () => {
        enemyCars.push({
          x: lanes[Math.floor(Math.random() * 3)],
          y: -100 - Math.random() * 200,
          width: 50,
          height: 80,
          speed: 2 + Math.random() * 3,
        });
      };

      const spawnCoin = () => {
        coins.push({
          x: lanes[Math.floor(Math.random() * 3)],
          y: -50 - Math.random() * 200,
          radius: 15,
        });
      };

      p.draw = () => {
        if (errorRef.current) {
          p.background(0);
          p.fill(255, 0, 0);
          p.textSize(20);
          p.textAlign(p.CENTER);
          p.text(`Error: ${errorRef.current}`, p.width / 2, p.height / 2);
          return;
        }

        if (!gameStarted) {
          p.background(0);
          p.fill(255);
          p.textSize(32);
          p.textAlign(p.CENTER);
          p.text('Press SPACE to Start', p.width / 2, p.height / 2);
          return;
        }

        if (isPaused) {
          p.fill(255, 0, 0);
          p.textSize(32);
          p.textAlign(p.CENTER);
          p.text('Paused', p.width / 2, p.height / 2);
          return;
        }

        // Draw road with scrolling effect
        p.background(50); // Dark gray road
        p.fill(0, 150, 0); // Grass
        p.rect(0, 0, 100, p.height);
        p.rect(p.width - 100, 0, 100, p.height);
        p.stroke(255);
        p.strokeWeight(4);
        for (let y = roadY % 40; y < p.height; y += 40) {
          p.line(p.width / 2, y, p.width / 2, y + 20);
          p.line(p.width / 4, y, p.width / 4, y + 20);
          p.line(3 * p.width / 4, y, 3 * p.width / 4, y + 20);
        }

        roadY += 5;
        if (roadY > 40) roadY = 0;

        // Update player
        if (p.keyIsDown(87) || p.keyIsDown(p.UP_ARROW)) {
          playerCar.speed += playerCar.acceleration * 0.02;
        }
        if (p.keyIsDown(83) || p.keyIsDown(p.DOWN_ARROW)) {
          playerCar.speed -= playerCar.brakeStrength * 0.02;
        }
        if (p.keyIsDown(65) || p.keyIsDown(p.LEFT_ARROW)) {
          playerCar.x -= playerCar.turningSpeed * 2;
        }
        if (p.keyIsDown(68) || p.keyIsDown(p.RIGHT_ARROW)) {
          playerCar.x += playerCar.turningSpeed * 2;
        }
        if (p.keyIsDown(32) && playerCar.nitrous > 0) {
          playerCar.speed += 0.5; // Stronger nitrous effect
          playerCar.nitrous -= 1;
          p.fill(0, 191, 255); // Blue flame effect
          p.ellipse(playerCar.x + 200, playerCar.y + playerCar.height, 20, 40);
        }

        playerCar.speed = p.constrain(playerCar.speed, -2, playerCar.maxSpeed / 50);
        playerCar.x = p.constrain(playerCar.x, -laneWidth, laneWidth);
        playerCar.y += playerCar.speed;

        // Keep player within bounds
        playerCar.y = p.constrain(playerCar.y, 0, p.height - playerCar.height);

        // Draw player car
        if (carImg) {
          p.image(carImg, playerCar.x - playerCar.width / 2 + 200, playerCar.y, playerCar.width, playerCar.height);
        } else {
          p.fill(playerCar.color);
          p.rect(playerCar.x - playerCar.width / 2 + 200, playerCar.y, playerCar.width, playerCar.height);
        }

        // Update and draw obstacles
        obstacles.forEach(o => {
          o.y += 5 + playerCar.speed;
          p.fill(139, 69, 19);
          p.rect(o.x - o.width / 2 + 200, o.y, o.width, o.height);
          if (checkCollision(playerCar, o)) gameOver();
        });

        // Update and draw enemy cars
        enemyCars.forEach(c => {
          c.y += c.speed + playerCar.speed;
          p.fill(0, 0, 255);
          p.rect(c.x - c.width / 2 + 200, c.y, c.width, c.height);
          if (checkCollision(playerCar, c)) gameOver();
        });

        // Update and draw coins
        coins.forEach((c, i) => {
          c.y += 5 + playerCar.speed;
          p.fill(255, 215, 0);
          p.ellipse(c.x + 200, c.y, c.radius * 2);
          if (checkCoinCollision(playerCar, c)) {
            score += 10;
            coins.splice(i, 1);
          }
        });

        // Spawn new objects
        if (p.frameCount % 60 === 0 && gameStarted) {
          spawnObstacle();
          if (Math.random() > 0.5) spawnEnemyCar();
          if (Math.random() > 0.7) spawnCoin();
        }

        // Clean up off-screen objects
        obstacles = obstacles.filter(o => o.y < p.height + 100);
        enemyCars = enemyCars.filter(c => c.y < p.height + 100);
        coins = coins.filter(c => c.y < p.height + 100);

        // Update timer
        if (gameStarted) {
          timer += 1 / 60;
        }

        // Update UI
        p.fill(255);
        p.textSize(20);
        p.textAlign(p.LEFT);
        p.text(`Score: ${Math.floor(timer)}`, 10, 30);
        p.text(`Coins: ${score}`, 10, 60);
        p.text(`Nitrous: ${Math.floor(playerCar.nitrous)}`, 10, 90);

        // Update DOM elements
        document.getElementById('score').textContent = Math.floor(timer);
        document.getElementById('coins').textContent = score;
        document.getElementById('nitrous').textContent = Math.floor(playerCar.nitrous);
      };

      const checkCollision = (car, obj) => {
        return (
          car.x - car.width / 2 + 200 < obj.x + obj.width / 2 + 200 &&
          car.x + car.width / 2 + 200 > obj.x - obj.width / 2 + 200 &&
          car.y < obj.y + obj.height &&
          car.y + car.height > obj.y
        );
      };

      const checkCoinCollision = (car, coin) => {
        const dx = car.x + 200 - (coin.x + 200);
        const dy = car.y + car.height / 2 - coin.y;
        return Math.sqrt(dx * dx + dy * dy) < coin.radius + car.width / 2;
      };

      const gameOver = () => {
        onGameOver(Math.floor(timer), score);
        gameStarted = false;
      };

      p.keyPressed = () => {
        if (p.key === 'p' || p.key === 'P') {
          isPaused = !isPaused;
        }
        if (p.key === ' ' && !gameStarted) {
          gameStarted = true;
        }
      };
    };

    const p5Instance = new p5(sketch, sketchRef.current);
    return () => p5Instance.remove();
  }, [car, onGameOver]);

  return (
    <div className="relative bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div ref={sketchRef} className="mx-auto"></div>
      {errorRef.current && (
        <div className="text-red-500 text-center mt-4 p-4 bg-gray-800 rounded">
          Error loading game: {errorRef.current}
        </div>
      )}
    </div>
  );
};

export default GameCanvas;