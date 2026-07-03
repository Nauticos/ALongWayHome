kaplay({
    width: 800,
    height: 600,
    letterbox: true,
});

loadSprite("player", "./public/sprites/player.png");
loadSprite("house", "./public/sprites/house.png");
loadSprite("grassbg", "./public/sprites/grassbg.jpg");

const GRID_SIZE = 7;
const TILE_SIZE = 64;

const OFFSET_X = (width() - (GRID_SIZE * TILE_SIZE)) / 2;
const OFFSET_Y = (height() - (GRID_SIZE * TILE_SIZE)) / 2;

function gridToScreen(gx, gy) {
    return vec2(
        OFFSET_X + (gx * TILE_SIZE) + (TILE_SIZE / 2),
        OFFSET_Y + (gy * TILE_SIZE) + (TILE_SIZE / 2)
    );
}

scene("start", () => {
    setBackground(20, 20, 30);

    add([
        text("A Long Way Home", { 
            size: 48, 
            font: '"Comic Sans MS", "Chalkboard SE", "comic-sans", sans-serif' 
        }),
        pos(width() / 2, height() / 3),
        anchor("center"),
        color(255, 255, 255),
    ]);

    add([
        text("You are very dizzy. In a field. You can move... somewhere.\nGet to back home... somehow.\n\nWASD to move", { 
            size: 20, 
            align: "center",
            font: '"Comic Sans MS", "Chalkboard SE", "comic-sans", sans-serif'
        }),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(180, 180, 180),
    ]);

    add([
        text("Press SPACE to Play", { 
            size: 24,
            font: '"Comic Sans MS", "Chalkboard SE", "comic-sans", sans-serif'
        }),
        pos(width() / 2, height() * 0.7),
        anchor("center"),
        color(0, 255, 100),
    ]);

    onKeyPress("space", () => go("game"));
});

scene("game", () => {
    setBackground(10, 40, 10);

    add([
        sprite("grassbg", { 
            width: width(),   
            height: height()  
        }),
        pos(0, 0), 
    ]);

    let steps = 0;

    const stepLabel = add([
        text("Steps: 0", { 
            size: 24, 
            font: '"Comic Sans MS", "Chalkboard SE", "comic-sans", sans-serif' 
        }),
        pos(20, 20), 
        color(255, 255, 255),
    ]);

    let playerGrid = { x: 0, y: 0 };
    let houseGrid = { x: 0, y: 0 };

    playerGrid.x = randi(0, GRID_SIZE);
    playerGrid.y = randi(0, GRID_SIZE);

    do {
        houseGrid.x = randi(0, GRID_SIZE);
        houseGrid.y = randi(0, GRID_SIZE);
    } while (houseGrid.x === playerGrid.x && houseGrid.y === playerGrid.y);

    const house = add([
        sprite("house", { 
            width: 64,   
            height: 64 
        }),
        pos(gridToScreen(houseGrid.x, houseGrid.y)),
        anchor("center"),
    ]);

    const player = add([
        sprite("player", { 
            width: 64,   
            height: 64  
        }),
        pos(gridToScreen(playerGrid.x, playerGrid.y)),
        anchor("center"),
    ]);

    const directions = [
        { x: 0, y: -1 }, 
        { x: 0, y: 1 },  
        { x: -1, y: 0 }, 
        { x: 1, y: 0 },  
    ];

    function moveDizzy() {
        steps++;
        stepLabel.text = "Steps: " + steps;

        const randomDir = choose(directions);

        let targetX = playerGrid.x + randomDir.x;
        let targetY = playerGrid.y + randomDir.y;

        if (targetX >= 0 && targetX < GRID_SIZE) {
            playerGrid.x = targetX;
        }
        if (targetY >= 0 && targetY < GRID_SIZE) {
            playerGrid.y = targetY;
        }

        player.pos = gridToScreen(playerGrid.x, playerGrid.y);

        if (playerGrid.x === houseGrid.x && playerGrid.y === houseGrid.y) {
            go("victory", steps);
        }
    }

    onKeyPress("w", moveDizzy);
    onKeyPress("a", moveDizzy);
    onKeyPress("s", moveDizzy);
    onKeyPress("d", moveDizzy);
});

scene("victory", (finalSteps) => {
    setBackground(10, 40, 10);

    add([
        text("You Made It Home!", { 
            size: 40,
            font: '"Comic Sans MS", "Chalkboard SE", "comic-sans", sans-serif'
        }),
        pos(width() / 2, height() / 3),
        anchor("center"),
        color(100, 255, 100),
    ]);

    add([
        text(`It took you ${finalSteps} stumbles to find the door!`, { 
            size: 20,
            font: '"Comic Sans MS", "Chalkboard SE", "comic-sans", sans-serif'
        }),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(200, 200, 200),
    ]);

    add([
        text("Press SPACE to try again", { 
            size: 24,
            font: '"Comic Sans MS", "Chalkboard SE", "comic-sans", sans-serif'
        }),
        pos(width() / 2, height() * 0.7),
        anchor("center"),
        color(255, 255, 255),
    ]);

    onKeyPress("space", () => go("game"));
});

go("start");