class ScoreBoard {
    constructor() {
        this.scores = [];
    }
    getNewScore() {
        return { points: 0 };
    }

    submitScore(score) {
        this.scores.push(score);
    }
}