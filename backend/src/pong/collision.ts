import { GameObject } from "./classAndTypes/GameObject";

export function checkPaddleWall(paddle : GameObject) : boolean {
    let nextPos = paddle.pos.y + paddle.speed.y;
    if (nextPos < 0  || nextPos + paddle.height > 400)
        return false;
    else
        return true;
}

export function checkBallCollision(
    ball : GameObject,
    leftPaddle : GameObject,
    rightPaddle : GameObject
    ) : void
{
    //paddle collision
    if (
        ball.pos.y + ball.height > leftPaddle.pos.y &&
        ball.pos.y < leftPaddle.pos.y + leftPaddle.height &&
        ball.pos.x < leftPaddle.pos.x + leftPaddle.width &&
        ball.pos.x > leftPaddle.pos.x
    ) {
        ball.changeXDirection();
    }
    else if (
        ball.pos.y + ball.height > rightPaddle.pos.y &&
        ball.pos.y < rightPaddle.pos.y + rightPaddle.height &&
        ball.pos.x + ball.width > rightPaddle.pos.x &&
        ball.pos.x + ball.width < rightPaddle.pos.x + rightPaddle.width
    ) {
        ball.changeXDirection();
    }
    //Wall collision
    if (ball.pos.y <= 0 || ball.pos.y + ball.height >= 400)
        ball.changeYDirection();
}