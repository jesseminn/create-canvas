import { isInRange } from '~utils/number.utils';
import { Canvas, CanvasElement } from '~canvas';

// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Advanced_animations

const canvas = new Canvas({
    width: 600,
    height: 300,
});

const element = new CanvasElement({
    draw: (ctx, { hook }) => {
        const canvas = ctx.canvas;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const [vx, setVx] = hook.state(20);
        const [vy, setVy] = hook.state(10);
        const [x, setX] = hook.state(100);
        const [y, setY] = hook.state(100);

        ctx.beginPath();
        ctx.arc(x, y, 50, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = 'blue';
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        const newX = x + vx;
        const newY = y + vy;
        const newVx = isInRange([canvasWidth, 0], newX) ? vx : -vx;
        const newVy = isInRange([canvasHeight, 0], newY) ? vy : -vy;
        setX(newX);
        setY(newY);
        setVx(newVx * 0.99);
        setVy(newVy + 1);
    },
});

const element2 = new CanvasElement({
    draw: (ctx, { hook }) => {
        const canvas = ctx.canvas;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const [x, setX] = hook.state(100);
        const [y, setY] = hook.state(100);

        hook.memoize(() => {
            canvas.addEventListener('mousemove', e => {
                setX(e.offsetX);
                setY(e.offsetY);
            });
        });

        const drawCircle = hook.callback((cx: number, cy: number) => {
            ctx.beginPath();
            ctx.arc(cx, cy, 50, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fillStyle = 'blue';
            ctx.fill();

            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        });

        drawCircle(x, y);
    },
});

canvas.addElement(element2);

export default canvas;