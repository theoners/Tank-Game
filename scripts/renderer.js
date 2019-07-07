(function (scope) {
    const {SIZES} = scope;

    class Renderer {
        constructor(canvas, bounds) {
            this.ctx = canvas.getContext('2d');
            this.bounds = bounds;
            this._preloadImage('redTankBulletImage', "./image/redTankBullet.png");
            this._preloadImage('blueTankBulletImage', "./image/blueTankBullet.png");
            this._preloadImage('redTankImage', "./image/redTank.png");
            this._preloadImage('blueTankImage', "./image/blueTank.png");
            this._preloadImage('enemyImage', "./image/enemy.png");
            this._preloadImage('bananaImage', "./image/banana.png");
            this._preloadImage('kiwiImage', "./image/kiwi.png");
            this._preloadImage('appleImage', "./image/apple.png");
            this._preloadImage('orangeImage', "./image/orange.png");
        }

        _preloadImage(propName, src) {
            const image = new Image();
            image.src = src;
            image.onload = () => {
                this[propName] = image;
            };
        }

        clear() {
            const {ctx} = this;
            const {width, height} = this.bounds;
            ctx.clearRect(0, 0, width, height);
        }

        renderRedTank(tank) {
            const {left, top, direction} = tank;
            const {ctx} = this;
            const {WIDTH, HEIGHT} = SIZES.TANK;
            if (this.redTankImage) {
                ctx.drawImage(this.redTankImage, left, top, WIDTH, HEIGHT);

            }
        }

        renderBlueTank(player) {
            const {left, top, direction} = player;
            const {ctx} = this;
            const {WIDTH, HEIGHT} = SIZES.TANK;
            if (this.blueTankImage) {
                ctx.drawImage(this.blueTankImage, left, top, WIDTH, HEIGHT);

            }
        }

        renderBullets(bullets, tankColor) {
            const bulletImage = tankColor === "red" ? "redTankBulletImage" :"blueTankBulletImage";
            bullets.forEach(bullet => this.renderBullet(bullet, bulletImage));

        }

        renderBullet(bullet, bulletImage) {
            const {left, top} = bullet;
            const {ctx} = this;
            const {WIDTH, HEIGHT} = SIZES.BULLET;
            if (this[bulletImage]) {
                ctx.drawImage(this[bulletImage], left, top, WIDTH, HEIGHT);
            }
        }

        renderEnemies(enemies) {
            enemies.forEach(enemy => this.renderEnemy(enemy));
        }

        renderEnemy(enemy) {
            const {left, top} = enemy;
            const {ctx} = this;
            const {WIDTH, HEIGHT} = SIZES.ENEMY;
            if (this.enemyImage) {
                ctx.drawImage(this.enemyImage, left, top, WIDTH, HEIGHT);
            }
        }
        renderFruits(fruits){
            fruits.forEach(fruit => this.renderFruit(fruit));
        }
        renderFruit(fruit) {
            const {name,left, top} = fruit;
            const {ctx} = this;
            const {WIDTH, HEIGHT} = SIZES.FRUIT;
            if (this[name+"Image"]) {
                ctx.drawImage(this[name+"Image"], left, top, WIDTH, HEIGHT);
            }
        }
    }

    scope.Renderer = Renderer;
}(window));