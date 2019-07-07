(function (scope) {
    class Bullet {
        constructor(top,left,power,color) {
            this.top = top;
            this.left = left;
            this.power = power;
            this.speed =SIZES.BULLET.SPEED;
            this.color=color;
                    }
    }
    scope.Bullet = Bullet;
})(window);