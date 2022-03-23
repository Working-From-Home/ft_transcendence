import { GameObject } from "./GameObject";

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
    rightPaddle : GameObject,
		ballXSpeed : number
    ) : void
{
    //paddle collision
    if (
        ball.pos.y + ball.height > leftPaddle.pos.y &&
        ball.pos.y < leftPaddle.pos.y + leftPaddle.height &&
        ball.pos.x < leftPaddle.pos.x + leftPaddle.width &&
        ball.pos.x > leftPaddle.pos.x
    ) {
        setBallDir(ball, leftPaddle, 1, ballXSpeed);
    }
    else if (
        ball.pos.y + ball.height > rightPaddle.pos.y &&
        ball.pos.y < rightPaddle.pos.y + rightPaddle.height &&
        ball.pos.x + ball.width > rightPaddle.pos.x &&
        ball.pos.x + ball.width < rightPaddle.pos.x + rightPaddle.width
    ) {
        setBallDir(ball, rightPaddle, -1, ballXSpeed);
    }
    //Wall collision
    if (ball.pos.y <= 0 || ball.pos.y + ball.height >= 400)
        ball.changeYDirection();
}

function setBallDir(ball : GameObject, paddle : GameObject, dir : number, ballXSpeed : number) {
	const paddleThird = paddle.height / 3;

	if (ball.pos.y + 5 < paddle.pos.y + paddleThird) {
		ball.speed = {x: ballXSpeed * dir, y: -2}
	}
	else if (ball.pos.y + 5 < paddle.pos.y + (paddleThird * 2)) {
		ball.speed = {x: ballXSpeed * dir, y: 0}
	}
	else {
		ball.speed = {x: ballXSpeed * dir, y: 2}
	}
}