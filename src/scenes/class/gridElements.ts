import Phaser from 'phaser';


export class gridElements {
    private scene: Phaser.Scene;

    constructor(scene) {
        this.scene = scene;
    }

    highlightSelectedGrid(gridId: number, gridsAlternativa: any[]) {
        // Remove o destaque de todas as grades
        gridsAlternativa.forEach((grid) => {
            if (grid.border) {
                grid.border.destroy();
                delete grid.border;
            }
        });

        // Encontra a grade selecionada pelo ID
        const selectedGrid = gridsAlternativa.find((grid) => grid.id === gridId);

        if (selectedGrid) {
            // Adiciona uma borda ao redor da grade selecionada
            const border = this.scene.add.graphics(); // Corrigido: Usar this.scene.add.graphics()
            border.lineStyle(6, 0xff0000); // Define a borda vermelha
            border.strokeRect(
                selectedGrid.offsetX,
                selectedGrid.offsetY,
                selectedGrid.gridSize * selectedGrid.cols,
                selectedGrid.gridSize * selectedGrid.rows
            );

            // Armazena a borda na grade para remoção futura
            selectedGrid.border = border;
        }
    }

    createGrid(size: number, rows: number, cols: number, offsetX: number, offsetY: number) {
        const grid = [];
        const graphics = this.scene.add.graphics();

        // Desenhar a borda ao redor do quadrado
        const totalWidth = cols * size;
        const totalHeight = rows * size;
        graphics.lineStyle(3, 0x22456f); // Define a espessura e cor da borda
        graphics.strokeRect(offsetX, offsetY, totalWidth, totalHeight);

        // Imprimir a posição total em pixels da grid
        // console.log(`Grid Position: OffsetX=${offsetX}, OffsetY=${offsetY}, TotalWidth=${totalWidth}, TotalHeight=${totalHeight}`);

        // Criar as células internas (sem desenhar bordas)
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = offsetX + col * size;
                const y = offsetY + row * size;

                // Adicionar a célula à grade (apenas para lógica, sem desenhar bordas)
                grid.push({ x, y, width: size, height: size });
            }
        }

        return grid;
    }

    addClickEventToGrids(grids: { id: number; grid: { x: number; y: number; width: number; height: number }[]; gridSize: number }[]) {
        this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const clickedX = pointer.x;
            const clickedY = pointer.y;

            grids.forEach(({ id, grid, gridSize }) => {
                const clickedCell = grid.find(cell => {
                    return (
                        clickedX >= cell.x &&
                        clickedX <= cell.x + gridSize &&
                        clickedY >= cell.y &&
                        clickedY <= cell.y + gridSize
                    );
                });

                if (clickedCell) {
                    console.log(`Clique dentro da grid ${id}: (${clickedX}, ${clickedY})`);
                }
            });
        });
    }

    addClickEvent(
        grid: { x: number; y: number; width: number; height: number }[],
        gridSize: number,
        gridId: number,
        onClick: (id: number) => void // Callback para retornar o ID da grade clicada
    ) {
        this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const clickedX = pointer.x;
            const clickedY = pointer.y;

            const clickedCell = grid.find(cell => {
                return (
                    clickedX >= cell.x &&
                    clickedX <= cell.x + gridSize &&
                    clickedY >= cell.y &&
                    clickedY <= cell.y + gridSize
                );
            });

            if (clickedCell) {
                console.log(`Clique dentro da grid ${gridId}: (${clickedX}, ${clickedY})`);
                if (onClick) {
                    if (typeof onClick === 'function') {
                        onClick(gridId); // Retorna o ID da grade clicada
                    } else {
                        console.error('onClick não é uma função válida:', onClick);
                    }
                } else {
                    console.log('Nenhum callback onClick fornecido para esta grid.');
                }
            }
        });
    }
    
    addImageToGrid(row: number, col: number, imageName: string, grid: { x: number; y: number; width: number; height: number }[], gridSize: number) {
        const getCellCenter = (row: number, col: number) => {
            const index = row * Math.sqrt(grid.length) + col;
            const cellX = grid[index].x + gridSize / 2;
            const cellY = grid[index].y + gridSize / 2;
            return { x: cellX, y: cellY };
        };

        const { x: cellX, y: cellY } = getCellCenter(row, col);

        const image = this.scene.add.image(cellX, cellY, imageName);
        image.setDisplaySize(gridSize, gridSize); // Ajustar o tamanho da imagem para caber na célula
    }
}