import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const GameCanvas = ({ car, onGameOver }) => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let playerCar, carImg, obstacles, enemyCars, coins, timer, score, isPaused;
      let roadY = 0;
      const laneWidth = 100;
      const lanes = [-laneWidth, 0, laneWidth];

      p.preload = () => {
        carImg = car ? p.loadImage(`/assets/cars/${car.car.sprite_path}`) : null;
      };

      p.setup = () => {
        p.createCanvas(400, 600);
        resetGame();
      };

      const resetGame = () => {
        playerCar = {
          x: 0,
          y: p.height - 100,
          speed: 0,
          maxSpeed: car ? car.car.base_max_speed : 100,
          acceleration: car ? car.car.base_acceleration : 5,
          brakeStrength: car ? car.car.base_brake_strength : 5,
          turningSpeed: car ? car.car.base_turning_speed : 5,
          nitrous: car ? car.car.base_nitrous : 0,
          color: car ? car.color : '#ff0000',
          width: 50,
          height: 80,
        };
        obstacles = [];
        enemyCars = [];
        coins = [];
        timer = 0;
        score = 0;
        isPaused = false;
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
          radius: 10,
        });
      };

      p.draw = () => {
        if (isPaused) {
          p.textSize(32);
          p.fill(255, 0, 0);
          p.textAlign(p.CENTER);
          p.text('Paused', p.width / 2, p.height / 2);
          return;
        }

        // Draw road
        p.background(100); // Gray road
        p.fill(0, 255, 0);
        p.rect(0, 0, 100, p.height); // Left grass
        p.rect(p.width - 100, 0, 100, p.height); // Right grass
        p.stroke(255);
        p.line(p.width / 2, 0, p.width / 2, p.height); // Center line
        p.line(p.width / 4, 0, p.width / 4, p.height); // Lane lines
        p.line(3 * p.width / 4, 0, 3 * p.width / 4, p.height);

        // Move road
        roadY += 5;
        if (roadY > p.height) roadY = 0;

        // Update player
        if (p.keyIsDown(87)) playerCar.speed += playerCar.acceleration * 0.01; // W
        if (p.keyIsDown(83)) playerCar.speed -= playerCar.brakeStrength * 0.01; // S
        if (p.keyIsDown(65)) playerCar.x -= playerCar.turningSpeed; // A
        if (p.keyIsDown(68)) playerCar.x += playerCar.turningSpeed; // D
        if (p.keyIsDown(32) && playerCar.nitrous > 0) {
          playerCar.speed += 0.1; // Space for nitrous
          playerCar.nitrous -= 0.1;
        }

        playerCar.speed = p.constrain(playerCar.speed, -2, playerCar.maxSpeed / 100);
        playerCar.x = p.constrain(playerCar.x, -laneWidth, laneWidth);

        // Draw player car
        if (carImg) {
          p.image(carImg, playerCar.x - playerCar.width / 2 + 200, playerCar.y, playerCar.width, playerCar.height);
        } else {
          p.fill(playerCar.color);
          p.rect(playerCar.x - playerCar.width / 2 + 200, playerCar.y, playerCar.width, playerCar.height);
        }

        // Update and draw obstacles
        obstacles.forEach(o => {
          o.y += 5;
          p.fill(139, 69, 19);
          p.rect(o.x - o.width / 2 + 200, o.y, o.width, o.height);
          if (checkCollision(playerCar, o)) gameOver();
        });

        // Update and draw enemy cars
        enemyCars.forEach(c => {
          c.y += c.speed;
          p.fill(0, 0, 255);
          p.rect(c.x - c.width / 2 + 200, c.y, c.width, c.height);
          if (checkCollision(playerCar, c)) gameOver();
        });

        // Update and draw coins
        coins.forEach((c, i) => {
          c.y += 5;
          p.fill(255, 215, 0);
          p.ellipse(c.x + 200, c.y, c.radius * 2);
          if (checkCoinCollision(playerCar, c)) {
            score += 10;
            coins.splice(i, 1);
          }
        });

        // Spawn new objects
        if (p.frameCount % 60 === 0) {
          spawnObstacle();
          if (Math.random() > 0.5) spawnEnemyCar();
          if (Math.random() > 0.7) spawnCoin();
        }

        // Clean up off-screen objects
        obstacles = obstacles.filter(o => o.y < p.height);
        enemyCars = enemyCars.filter(c => c.y < p.height);
        coins = coins.filter(c => c.y < p.height);

        // Update timer
        timer += 1 / 60;
        p.fill(0);
        p.textSize(20);
        p.text(`Score: ${Math.floor(timer)}`, 10, 30);
        p.text(`Coins: ${score}`, 10, 60);
      };

      const checkCollision = (car, obj) => {
        return (
          car.x - car.width / 2 + 200 < obj.x + obj.width / 2 &&
          car.x + car.width / 2 + 200 > obj.x - obj.width / 2 &&
          car.y < obj.y + obj.height &&
          car.y + car.height > obj.y
        );
      };

      const checkCoinCollision = (car, coin) => {
        const dx = car.x + 200 - coin.x;
        const dy = car.y + car.height / 2 - coin.y;
        return Math.sqrt(dx * dx + dy * dy) < coin.radius + car.width / 2;
      };

      const gameOver = () => {
        onGameOver(Math.floor(timer), score);
        resetGame();
      };

      p.keyPressed = () => {
        if (p.key === 'p' || p.key === 'P') {
          isPaused = !isPaused;
        }
      };
    };

    const p5Instance = new p5(sketch, sketchRef.current);
    return () => p5Instance.remove();
  }, [car, onGameOver]);

  return <div ref={sketchRef} className="mx-auto"></div>;
};

export default GameCanvas;