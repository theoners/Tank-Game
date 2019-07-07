(function (scope) {
    const {SIZES} = scope;

    class Tank {
        constructor(left, top, direction, color, image) {
            this.width = SIZES.TANK.WIDTH;
            this.height = SIZES.TANK.HEIGHT;
            this.speed = 2;
            this.bulletCount =2;
            this.bulletPower = 10;
            this.points = 0;
            this.left = left;
            this.top = top;
            this.direction = direction;
            this.color = color;
            this.health = 1000;
            this.fire = false;
        }

        changeDirection(direction) {
            this.direction = direction;
        }

        Fire() {
            this.fire = true;
        }
    }

    scope.Tank = Tank;
})(window);