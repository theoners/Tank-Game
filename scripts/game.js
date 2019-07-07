(function (scope) {
    const {
        Renderer,
        GameObjectsFactory,
        SIZES,
        KEY_CODES,
        CollisionDetector,
    } = scope;

    const setupCanvas = function (gameContainer, width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        gameContainer.appendChild(canvas);
        return canvas;
    };

    const trueOrFalse = (chance) => {
        const value = Math.random() * 100;
        return value <= chance;
    };

    const getCollisionBox = ({left, top}, {WIDTH, HEIGHT}) => ({
        left,
        top,
        right: left + WIDTH,
        bottom: top + HEIGHT,
    });


    class Game {
        constructor(selector, width, height) {
            this.gameContainer = document.querySelector(selector);
            this.canvas = setupCanvas(this.gameContainer, width, height);

            this.bounds = {
                width,
                height,
            };
            this.renderer = new Renderer(this.canvas, this.bounds);
            this.gameObjectsFactory = new GameObjectsFactory(width, height);

            this.collisionDetector = new CollisionDetector();
            this.redTank = this.gameObjectsFactory.createTank(0, "right", "red");
            this.blueTank = this.gameObjectsFactory.createTank(width - SIZES.TANK.WIDTH, "left", "blue");
            this.redTankBullets = [];
            this.blueTankBullets = [];
            this.fruits = [];
            this.enemies = [];
            this._attachGameEvents();
        }

        start() {
            this._gameLoop();
        }

        _attachGameEvents() {
            window.addEventListener('keydown', (ev) => {
                this._handleMovementEvent(ev);
                this._handleFireEvent(ev);
            });

        }

        _handleFireEvent(ev) {
            const {RED_TANK_FIRE, BLUE_TANK_FIRE} = KEY_CODES;
            if (ev.keyCode === RED_TANK_FIRE) {
                if (this.redTankBullets.length < this.redTank.bulletCount) {
                    const {top, left} = this.redTank;
                    const redTankBullet = this.gameObjectsFactory.createBullet(top + SIZES.TANK.HEIGHT / 2 - SIZES.BULLET.HEIGHT / 2,
                        left + SIZES.TANK.WIDTH, this.redTank.bulletPower, "red");

                    this.redTankBullets.push(redTankBullet);
                }
            } else if (ev.keyCode === BLUE_TANK_FIRE) {

                if (this.blueTankBullets.length < this.blueTank.bulletCount) {

                    const {top, left} = this.blueTank;
                    const blueTankBullet = this.gameObjectsFactory.createBullet(top + SIZES.TANK.HEIGHT / 2 - SIZES.BULLET.HEIGHT / 2,
                        left - SIZES.BULLET.WIDTH, this.blueTank.bulletPower, "blue");

                    this.blueTankBullets.push(blueTankBullet);

                }
            }


        }

        _handleMovementEvent(ev) {
            const {
                BLUE_TANK_LEFT,
                BLUE_TANK_RIGHT,
                BLUE_TANK_UP,
                BLUE_TANK_DOWN,
                RED_TANK_LEFT,
                RED_TANK_RIGHT,
                RED_TANK_UP,
                RED_TANK_DOWN,
            } = KEY_CODES;
            if (ev.keyCode === RED_TANK_LEFT) {
                this.redTank.direction = 'left';
            } else if (ev.keyCode === RED_TANK_RIGHT) {
                this.redTank.direction = 'right';
            } else if (ev.keyCode === RED_TANK_UP) {

                this.redTank.direction = 'up';
            } else if (ev.keyCode === RED_TANK_DOWN) {
                this.redTank.direction = 'down';
            }
            if (ev.keyCode === BLUE_TANK_LEFT) {
                this.blueTank.direction = 'left';
            } else if (ev.keyCode === BLUE_TANK_RIGHT) {
                this.blueTank.direction = 'right';
            } else if (ev.keyCode === BLUE_TANK_UP) {

                this.blueTank.direction = 'up';
            } else if (ev.keyCode === BLUE_TANK_DOWN) {
                this.blueTank.direction = 'down';
            }


        }

        _render() {
            this.renderer.renderRedTank(this.redTank);
            this.renderer.renderBlueTank(this.blueTank);
            this.renderer.renderBullets(this.redTankBullets, "red");
            this.renderer.renderBullets(this.blueTankBullets, "blue");
            this.renderer.renderEnemies(this.enemies);
            this.renderer.renderFruits(this.fruits);
        }

        _updatePositions() {
            const {SPEED: enemySpeed} = SIZES.ENEMY;
            const {width, height} = this.bounds;
            this.redTankBullets.forEach(bullet => {
                bullet.left += bullet.speed;
                bullet.isDead = bullet.left >= width;
            });
            this.blueTankBullets.forEach(bullet => {
                bullet.left -= bullet.speed;
                bullet.isDead = bullet.left <= 0;
            });


        }

        _createNewGameObjects() {
            if (trueOrFalse(0.5)) {
                const enemy = this.gameObjectsFactory.createEnemy();
                this.enemies.push(enemy);
            }
            if (trueOrFalse(0.3)) {
                const object = ["apple", "banana", "kiwi","orange"];
                let randomIndex = Math.floor(Math.random() * 5);
                const fruit = this.gameObjectsFactory.createRandomObject(object[randomIndex]);
                this.fruits.push(fruit);
            }
        }

        _checkForRedBulletsWithEnemiesCollisions() {
            const {redTankBullets, enemies} = this;
            redTankBullets.forEach(bullet => {
                const bulletCollisionBox = getCollisionBox(bullet, SIZES.BULLET);
                enemies.forEach(enemy => {
                    if (bullet.isDead || enemy.isDead) {
                        return;
                    }

                    const enemyCollisionBox = getCollisionBox(enemy, SIZES.ENEMY);
                    const hasCollision = this.collisionDetector.checkForCollision(bulletCollisionBox, enemyCollisionBox);
                    if (hasCollision) {
                        bullet.isDead = hasCollision;
                        enemy.isDead = hasCollision;
                        this.redTank.points += 10;
                    }
                });
            });
        };

        _checkForBlueBulletsWithEnemiesCollisions() {
            const {blueTankBullets, enemies} = this;
            blueTankBullets.forEach(bullet => {
                const bulletCollisionBox = getCollisionBox(bullet, SIZES.BULLET);
                enemies.forEach(enemy => {
                    if (bullet.isDead || enemy.isDead) {
                        return;
                    }
                    const enemyCollisionBox = getCollisionBox(enemy, SIZES.ENEMY);
                    const hasCollision = this.collisionDetector.checkForCollision(bulletCollisionBox, enemyCollisionBox);
                    if (hasCollision) {
                        bullet.isDead = hasCollision;
                        enemy.isDead = hasCollision;
                        this.blueTank.points += 10;
                    }
                });
            });
        }

        _checkForBlueBulletsWithRedTankCollisions() {

            const {blueTankBullets, redTank} = this;

            const RedTankCollisionBox = getCollisionBox(redTank, SIZES.TANK);
            blueTankBullets.forEach(bullet => {
                if (bullet.isDead) {
                    return;
                }
                const bulletCollisionBox = getCollisionBox(bullet, SIZES.BULLET);
                const hasCollision = this.collisionDetector.checkForCollision(bulletCollisionBox, RedTankCollisionBox);
                if (hasCollision) {
                    bullet.isDead = hasCollision;
                    redTank.health -= bullet.power;
                    this.blueTank.points += 10;

                }
            });

        }

        _checkForRedBulletsWithBlueTankCollisions() {

            const {redTankBullets, blueTank} = this;

            const BlueTankCollisionBox = getCollisionBox(blueTank, SIZES.TANK);
            redTankBullets.forEach(bullet => {
                if (bullet.isDead) {
                    return;
                }
                const bulletCollisionBox = getCollisionBox(bullet, SIZES.BULLET);
                const hasCollision = this.collisionDetector.checkForCollision(bulletCollisionBox, BlueTankCollisionBox);
                if (hasCollision) {
                    bullet.isDead = hasCollision;
                    blueTank.health -= bullet.power;
                    this.redTank.points += 10;


                }
            });

        }
        _checkForRedBulletsWithFruitsCollisions(){
            const {redTankBullets, fruits,redTank} = this;
            redTankBullets.forEach(bullet => {
                const bulletCollisionBox = getCollisionBox(bullet, SIZES.BULLET);
                fruits.forEach(fruit => {
                    if (bullet.isDead || fruit.isDead) {
                        return;
                    }

                    const fruitCollisionBox = getCollisionBox(fruit, SIZES.FRUIT);
                    const hasCollision = this.collisionDetector.checkForCollision(bulletCollisionBox, fruitCollisionBox);
                    if (hasCollision) {
                        bullet.isDead = hasCollision;
                        fruit.isDead = hasCollision;
                        switch (fruit.name) {
                            case"banana":
                                redTank.speed+=1;
                                break;
                            case"orange":
                                redTank.bulletCount+=1;
                                break;
                            case"kiwi":
                                redTank.bulletPower+=10;
                                break;
                            case"apple":
                                redTank.health+=100;
                                break;
                        }

                    }
                });
            });
        }
        _checkForBlueBulletsWithFruitsCollisions(){
            const {blueTankBullets, fruits,blueTank} = this;
            blueTankBullets.forEach(bullet => {
                const bulletCollisionBox = getCollisionBox(bullet, SIZES.BULLET);
                fruits.forEach(fruit => {
                    if (bullet.isDead || fruit.isDead) {
                        return;
                    }

                    const fruitCollisionBox = getCollisionBox(fruit, SIZES.FRUIT);
                    const hasCollision = this.collisionDetector.checkForCollision(bulletCollisionBox, fruitCollisionBox);
                    if (hasCollision) {
                        bullet.isDead = hasCollision;
                        fruit.isDead = hasCollision;
                        switch (fruit.name) {
                            case"banana":
                                blueTank.speed+=1;
                                break;
                            case"orange":
                                blueTank.bulletCount+=1;
                                break;
                            case"kiwi":
                                blueTank.bulletPower+=10;
                                break;
                            case"apple":
                                blueTank.health+=100;
                                break;
                        }

                    }
                });
            });
        }
        _checkForCollisions() {
            // bullet with enemy
            this._checkForRedBulletsWithEnemiesCollisions();
            this._checkForBlueBulletsWithEnemiesCollisions();
            this._checkForBlueBulletsWithRedTankCollisions();
            this._checkForRedBulletsWithBlueTankCollisions();
            this._checkForRedBulletsWithFruitsCollisions();
            this._checkForBlueBulletsWithFruitsCollisions();
            // player with enemy
        }

        _removeDeadGameObjects() {
            this.redTankBullets = this.redTankBullets.filter(bullet => !bullet.isDead);
            this.blueTankBullets = this.blueTankBullets.filter(bullet => !bullet.isDead);
            this.enemies = this.enemies.filter(enemy => !enemy.isDead);
            this.fruits=this.fruits.filter(fruit=>!fruit.isDead);
        }

        updateScoreBoard() {
            const {redTank, blueTank} = this;
            const redPlayerInfo = document.getElementById("red-player").childNodes;
            redPlayerInfo[0].textContent = `Life: ${redTank.health}`;
            redPlayerInfo[1].textContent = `BulletPower: ${redTank.bulletPower}`;
            redPlayerInfo[2].textContent = `Speed: ${redTank.speed}`;
            redPlayerInfo[3].textContent = `Score: ${redTank.points}`;
            redPlayerInfo[4].textContent = `BulletCount: ${redTank.bulletCount}`;

            const bluePlayerInfo = document.getElementById("blue-player").childNodes;
            bluePlayerInfo[0].textContent = `Life: ${blueTank.health}`;
            bluePlayerInfo[1].textContent = `BulletPower: ${blueTank.bulletPower}`;
            bluePlayerInfo[2].textContent = `Speed: ${blueTank.speed}`;
            bluePlayerInfo[3].textContent = `Score: ${blueTank.points}`;
            bluePlayerInfo[4].textContent = `BulletCount: ${blueTank.bulletCount}`;
        }

        _moveTank(tank) {
            const {width, height} = this.bounds;
            switch (tank.direction) {
                case"left":
                    tank.left -= tank.speed;
                    break;
                case"right":
                    tank.left += tank.speed;
                    break;
                case"up":
                    tank.top -= tank.speed;
                    break;
                case"down":
                    tank.top += tank.speed;
                    break;
            }
            tank.left = Math.min(tank.left, width - SIZES.TANK.WIDTH);
            tank.left = Math.max(tank.left, 0);
            tank.top = Math.min(tank.top, height - SIZES.TANK.HEIGHT);
            tank.top = Math.max(tank.top, 0);

        }

        checkForWinner() {
            let playerIsDead = false;
            const {redTank, blueTank} = this;
            if (redTank.health <= 0) {
                playerIsDead = true;
            } else if (blueTank.health <= 0) {
                playerIsDead = true;
            }
            return playerIsDead;
        }

        _gameLoop() {
            this.renderer.clear();
            this._render();
            this._moveTank(this.redTank);
            this._moveTank(this.blueTank);
            this._updatePositions();
            this._createNewGameObjects();
            this._checkForCollisions();
            this._removeDeadGameObjects();
            this.updateScoreBoard();
            if (!this.checkForWinner()) {
                window.requestAnimationFrame(() => {
                    this._gameLoop();
                });
            }


        }
    }

    scope.Game = Game;
}(window));