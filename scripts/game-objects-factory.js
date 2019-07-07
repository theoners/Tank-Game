(function (scope) {
    const {SIZES, Tank,Bullet} = scope;

    class GameObjectsFactory {
        constructor(width, height) {
            this.bounds = {width, height};
        }

        createTank(leftPosition, direction, color, image) {

            const {height} = this.bounds;
            const {HEIGHT,} = SIZES.TANK;
            const top = (height - HEIGHT) / 2;
            return new Tank(leftPosition, top, direction, color, image);
        }

        createBullet(top, left , color) {
            const bullet = new Bullet(top, left,color);
            return bullet;
        }

        createEnemy() {
            const {width,height} = this.bounds;
            const {HEIGHT,WIDTH} =SIZES.ENEMY;
            const top = parseInt(Math.random() * (height-HEIGHT));
            const left = parseInt(Math.random() * (width-WIDTH));
            return {
                left,
                top,
            };
        }

        createRandomObject(name){
            const {width,height} = this.bounds;
            const {HEIGHT,WIDTH} =SIZES.FRUIT;
            const top = parseInt(Math.random() * (height-HEIGHT));
            const left = parseInt(Math.random() * (width-WIDTH));
            return {
                name,
                left,
                top,
            };
        }
    }

    scope.GameObjectsFactory = GameObjectsFactory;
}(window));