(function (scope) {
    class CollisionDetector {
        checkForCollision(x, y) {
            const hasHorizontalCollision =
                (x.left <= y.left && y.left <= x.right) ||
                (x.left <= y.right && y.right <= x.right) ||
                (y.left <= x.left && x.left <= y.right) ||
                (y.left <= x.right && x.right <= y.right);

            const hasVerticalCollision =
                (x.top <= y.top && y.top <= x.bottom) ||
                (x.top <= y.bottom && y.bottom <= x.bottom) ||
                (y.top <= x.top && x.top <= y.bottom) ||
                (y.top <= x.bottom && x.bottom <= y.bottom);

            return hasHorizontalCollision && hasVerticalCollision;
        }

        _getCollisionBox({ left, top }, { WIDTH, HEIGHT }) {
            return {
                left,
                top,
                right: left + WIDTH,
                bottom: top + HEIGHT,
            };
        }

        doOnCollidingObjects(arr1, arr2, func) {
            arr1.forEach(x => {
                const bulletCollisionBox = this._getCollisionBox(x);
                arr2.forEach(y => {
                    const enemyCollisionBox = this._getCollisionBox(y);
                    const hasCollision = this.collisionDetector.checkForCollision(bulletCollisionBox, enemyCollisionBox);
                    if(hasCollision) {
                        func(x, y);
                    }
                });
            });
        }
    }

    scope.CollisionDetector = CollisionDetector;
}(window));