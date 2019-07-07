(function (scope) {
    const SIZES = {
        TANK: {
            HEIGHT: 80,
            WIDTH: 100,

        },
        BULLET: {
            HEIGHT: 30,
            WIDTH: 20,
            SPEED: 5,
        },
        ENEMY: {
            HEIGHT: 50,
            WIDTH: 50,
        },
        FRUIT: {

            HEIGHT: 50,
            WIDTH: 50,
        },
    };

    const KEY_CODES = {
        BLUE_TANK_LEFT: 37,
        BLUE_TANK_RIGHT: 39,
        BLUE_TANK_UP:38,
        BLUE_TANK_DOWN:40,
        BLUE_TANK_FIRE: 13,
        RED_TANK_LEFT: 81,
        RED_TANK_RIGHT: 68,
        RED_TANK_UP:90,
        RED_TANK_DOWN:83,
        RED_TANK_FIRE: 32,
    };

    scope.SIZES = SIZES;
    scope.KEY_CODES = KEY_CODES;
}(window));