import Layers from './enums/layers.js';
import Tools from './enums/tools.js';
export default class Renderer {
    static render(puzzle, canvas, camera, layer, tool, mouseX, mouseY) {
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.imageSmoothingEnabled = false;
        Renderer.renderBase(canvasWidth, canvasHeight);
        Renderer.renderGrid(puzzle, context, camera, canvasWidth, canvasHeight);
        Renderer.renderInfo(puzzle, context, camera, canvasWidth, canvasHeight);
        switch (layer) {
            case Layers.Base: {
                switch (tool) {
                    case Tools.Connect: {
                        Renderer.renderBaseConnectionToggles(canvasWidth, canvasHeight);
                        break;
                    }
                    case Tools.Disconnect: {
                        Renderer.renderBaseConnectionToggles(canvasWidth, canvasHeight);
                        break;
                    }
                }
                break;
            }
            case Layers.Card: {
                break;
            }
            case Layers.Tile: {
                break;
            }
        }
        Renderer.renderHover(canvasWidth, canvasHeight);
        Renderer.renderControlSelection(canvasWidth, canvasHeight);
    }
    static renderGrid(puzzle, context, camera, canvasWidth, canvasHeight) {
        const xEast = camera.canvasX(0, canvasWidth);
        const xWest = camera.canvasX(puzzle.width(), canvasWidth);
        const yNorth = camera.canvasY(0, canvasHeight);
        const ySouth = camera.canvasY(puzzle.height(), canvasHeight);
        context.beginPath();
        for (let i = 0; i <= puzzle.width(); i++) {
            const canvasX = camera.canvasX(i, canvasWidth);
            context.moveTo(canvasX, yNorth);
            context.lineTo(canvasX, ySouth);
        }
        for (let i = 0; i <= puzzle.height(); i++) {
            const canvasY = camera.canvasY(i, canvasHeight);
            context.moveTo(xEast, canvasY);
            context.lineTo(xWest, canvasY);
        }
        context.lineWidth = 1;
        context.strokeStyle = '#444';
        context.stroke();
    }
    static renderInfo(puzzle, context, camera, canvasWidth, canvasHeight) {
        const x = camera.gridX(mouseX, canvasWidth);
        if (!puzzle.containsX(x))
            return;
        const y = camera.gridY(mouseY, canvasHeight);
        if (!puzzle.containsY(y))
            return;
        context.font = '16px sans-serif';
        context.fillStyle = '#444';
        context.fillText(`(${x}, ${y})`, 5, canvasHeight - 7);
    }
    static renderHover(canvasWidth, canvasHeight) {
        const x = camera.gridX(mouseX, canvasWidth);
        if (!puzzle.containsX(x))
            return;
        const y = camera.gridY(mouseY, canvasHeight);
        if (!puzzle.containsY(y))
            return;
        const canvasX = camera.canvasX(x, canvasWidth);
        const canvasY = camera.canvasY(y, canvasHeight);
        context.lineWidth = 1;
        context.strokeStyle = '#fff4';
        context.strokeRect(canvasX, canvasY, camera.scale, camera.scale);
    }
    static renderControlSelection(canvasWidth, canvasHeight) {
        const canvasX = camera.canvasX(controlGridX, canvasWidth);
        const canvasY = camera.canvasY(controlGridY, canvasHeight);
        context.lineWidth = 2;
        context.strokeStyle = 'white';
        context.strokeRect(canvasX, canvasY, camera.scale, camera.scale);
    }
    static renderBase(canvasWidth, canvasHeight) {
        for (let i = 0; i < puzzle.width(); i++) {
            const canvasX = camera.canvasX(i, canvasWidth);
            for (let j = 0; j < puzzle.height(); j++) {
                const canvasY = camera.canvasY(j, canvasHeight);
                const base = puzzle.baseGrid[i][j];
                renderBaseType(base, canvasX, canvasY);
                renderBaseRule(base, canvasX, canvasY);
                renderBaseScrews(base, canvasX, canvasY);
                // context.fillText(base.connections.toString(2).padStart(8, '0'), x + 5, y + 20)
            }
        }
    }
    static renderBaseType(base, canvasX, canvasY) {
        renderBaseBacking(base, canvasX, canvasY);
        const opacity = base.type === BaseTypes.Plain ? 1.0 : 0.5;
        context.globalAlpha = opacity;
        context.drawImage(Images.Tilesets, Images.OffsetMap[base.connections], BaseTypes.TilesetOffset[base.type], Images.CellSizePixels, Images.CellSizePixels, canvasX, canvasY, camera.scale, camera.scale);
        context.globalAlpha = 1.0;
    }
    static renderBaseBacking(base, canvasX, canvasY) {
        if (base.type === BaseTypes.Plain)
            return;
        context.globalAlpha = base.power / base.type;
        context.drawImage(Images.Tilesets, Images.OffsetMap[base.connections], Images.OffsetTemplateBaseBacking, Images.CellSizePixels, Images.CellSizePixels, canvasX, canvasY, camera.scale, camera.scale);
        context.globalAlpha = 1.0;
    }
    static renderBaseRule(base, canvasX, canvasY) {
        let offset = BaseRules.Offsets[base.rule];
        switch (base.rule) {
            case BaseRules.Area:
            case BaseRules.Groups:
            case BaseRules.Neighbors:
            case BaseRules.Orthogonal:
            case BaseRules.Order:
            case BaseRules.Relative:
            case BaseRules.Rules:
            case BaseRules.States:
                offset += (base.count - 1) * Images.CellSizePixels;
                break;
            case BaseRules.Adjacent:
                offset += base.count * Images.CellSizePixels;
                break;
            case BaseRules.Symmetric:
                offset += (base.axis - 1) * Images.CellSizePixels;
                break;
            case BaseRules.Length:
                offset += (base.count - 1) * Images.CellSizePixels + (base.axis - 1) * 5 * Images.CellSizePixels;
                break;
        }
        context.globalAlpha = 0.75;
        context.drawImage(Images.Icons, offset, (base.color - 1) * Images.CellSizePixels, Images.CellSizePixels, Images.CellSizePixels, canvasX, canvasY, camera.scale, camera.scale);
        context.globalAlpha = 1.0;
    }
    static renderBaseScrews(base, canvasX, canvasY) {
        if (base.type !== BaseTypes.Plain && base.fixed) {
            context.drawImage(Images.Tilesets, Images.OffsetMap[base.connections], Images.OffsetTemplateScrews, Images.CellSizePixels, Images.CellSizePixels, canvasX, canvasY, camera.scale, camera.scale);
        }
    }
    static renderBaseConnectionToggles(canvasWidth, canvasHeight) {
        const potentialBaseConnections = puzzle.potentialBaseConnections();
        context.beginPath();
        const radius = camera.scale * ConnectionToggleRadius;
        for (const connection of potentialBaseConnections) {
            const vector = Directions.Vectors[connection.direction];
            const x = camera.canvasX(connection.gridX + 0.5 * (1 + vector.dx), canvasWidth);
            const y = camera.canvasY(connection.gridY + 0.5 * (1 + vector.dy), canvasHeight);
            context.moveTo(x, y);
            context.arc(x, y, radius, 0, Tau);
        }
        context.fillStyle = '#ffffff20';
        context.fill();
    }
    static renderCards() {
    }
    static renderTiles() {
    }
}
