(function (scope) {
    class Bullet {
        constructor(top,left,power,color) {
            this.top = top;
            this.left = left;
            this.power = power;
            this.speed =5;
            this.color=color;
            this.imagePath = "./image/bullet.png"
        }
    }
    scope.Bullet = Bullet;
})(window);