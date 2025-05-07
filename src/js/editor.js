import Camera from './camera.js';
import Axes from './enums/axes.js';
import BaseRules from './enums/base_rules.js';
import BaseTypes from './enums/base_types.js';
import CardRules from './enums/card_rules.js';
import Colors from './enums/colors.js';
import Directions from './enums/directions.js';
import Faces from './enums/faces.js';
import Spins from './enums/spins.js';
import MouseData from './mouse_data.js';
import Watermarks from './enums/watermarks.js';
import Puzzle from './puzzle.js';
import Materials from './enums/material.js';
import Point from './geometry/point.js';
const ConnectionToggleRadius = 0.25;
export default class Editor {
    camera;
    canvas;
    context;
    controlSelection = new Point(0, 0);
    mouseData = new MouseData();
    puzzle = new Puzzle();
    spacePressed = false;
    constructor() {
        const cameraX = this.puzzle.width / 2;
        const cameraY = this.puzzle.height / 2;
        this.camera = new Camera(cameraX, cameraY);
        this.canvas = document.getElementById('editor-canvas');
        this.context = this.canvas.getContext('2d');
        console.log(this.puzzle);
        this.populateSelects();
        this.addEventListeners();
        this.resize();
        this.camera.autoZoom(this.puzzle.width, this.puzzle.height, this.canvas.width, this.canvas.height);
        this.loop();
    }
    populateSelects() {
        this.populateSelect('base-type-select', BaseTypes.Names);
        this.populateSelect('base-rule-select', BaseRules.Names);
        this.populateSelect('base-color-select', Colors.Names);
        this.populateSelect('base-spin-select', Spins.Names);
        this.populateSelect('base-axis-select', Axes.Names);
        this.populateSelect('base-direction-select', Directions.Names);
        this.populateNumericSelect('base-count-select', 7);
        this.populateNumericSelect('base-state-select', 3);
        this.populateSelect('top-card-face-select', Faces.Names);
        this.populateSelect('top-card-watermark-select', Watermarks.Names);
        this.populateSelect('top-card-rule-select', CardRules.Names);
        this.populateSelect('top-card-color-select', Colors.Names);
        this.populateSelect('top-card-direction-select', Colors.Names);
        this.populateSelect('bottom-card-face-select', Faces.Names);
        this.populateSelect('bottom-card-watermark-select', Watermarks.Names);
        this.populateSelect('bottom-card-rule-select', CardRules.Names);
        this.populateSelect('bottom-card-color-select', Colors.Names);
        this.populateSelect('bottom-card-direction-select', Directions.Names);
        this.populateSelect('bottom-card-face-select', Faces.Names);
        this.populateSelect('bottom-card-watermark-select', Watermarks.Names);
        this.populateSelect('bottom-card-rule-select', CardRules.Names);
        this.populateSelect('bottom-card-color-select', Colors.Names);
        this.populateSelect('bottom-card-direction-select', Directions.Names);
        this.populateSelect('tile-material-select', Materials.Names);
        this.populateSelect('tile-direction-select', Directions.Names);
        this.populateSelect('tile-spin-select', Spins.Names);
        this.populateNumericSelect('tile-count-select', 4);
    }
    populateSelect(selectId, names) {
        const select = document.getElementById(selectId);
        for (let i = 0; i < names.length; i++) {
            const option = document.createElement('option');
            option.value = i + '';
            option.innerText = names[i];
            select.appendChild(option);
        }
    }
    populateNumericSelect(selectId, count) {
        const select = document.getElementById(selectId);
        for (let i = 0; i <= count; i++) {
            const option = document.createElement('option');
            const value = i + '';
            option.value = value;
            option.innerText = value;
            select.appendChild(option);
        }
    }
    addEventListeners() {
        this.canvas.addEventListener('mousedown', e => {
            switch (e.button) {
                case 0:
                    this.primaryMouseDown();
                    break;
                case 2:
                    this.secondaryMouseDown();
                    break;
            }
        });
        this.canvas.addEventListener('mousemove', e => {
            this.mouseMove(e);
        });
        this.canvas.addEventListener('mouseup', e => {
            switch (e.button) {
                case 0:
                    this.primaryMouseUp();
                    break;
                case 2:
                    this.secondaryMouseUp();
                    break;
            }
        });
        this.canvas.addEventListener('mouseleave', () => {
            this.mouseLeave();
        });
        this.canvas.addEventListener('wheel', e => {
            this.mouseWheel(e);
        });
        document.getElementById('grow-east').addEventListener('mousedown', () => {
            this.puzzle.growEast();
        });
        document.getElementById('grow-south').addEventListener('mousedown', () => {
            this.puzzle.growSouth();
        });
        document.getElementById('grow-west').addEventListener('mousedown', () => {
            this.puzzle.growWest();
            this.camera.shiftX(1);
        });
        document.getElementById('grow-north').addEventListener('mousedown', () => {
            this.puzzle.growNorth();
            this.camera.shiftY(1);
        });
        document.getElementById('shrink-east').addEventListener('mousedown', () => {
            this.puzzle.shrinkEast();
        });
        document.getElementById('shrink-south').addEventListener('mousedown', () => {
            this.puzzle.shrinkSouth();
        });
        document.getElementById('shrink-west').addEventListener('mousedown', () => {
            this.puzzle.shrinkWest();
            this.camera.shiftX(-1);
        });
        document.getElementById('shrink-north').addEventListener('mousedown', () => {
            this.puzzle.shrinkNorth();
            this.camera.shiftY(-1);
        });
        window.addEventListener('contextmenu', e => {
            e.stopPropagation();
            e.preventDefault();
        });
        document.getElementById('zoom-button').addEventListener('mousedown', () => {
            this.camera.autoZoom(this.puzzle.width, this.puzzle.height, this.canvas.width, this.canvas.height);
        });
        window.addEventListener('resize', () => { this.resize(); });
        window.addEventListener('keydown', e => {
            switch (e.code) {
                case 'Space': {
                    this.spacePressed = true;
                    break;
                }
            }
        });
        window.addEventListener('keyup', e => {
            switch (e.code) {
                case 'Space': {
                    this.spacePressed = false;
                    break;
                }
            }
        });
        // const layerSelect = <HTMLSelectElement>document.getElementById('layer-select')!
        // layerSelect.addEventListener('change', () => {
        //     const toolsSections = document.getElementsByClassName('tools')
        //     for (const toolsSection of toolsSections) {
        //         toolsSection.classList.add('hidden')
        //     }
        //     switch (layerSelect.value) {
        //         case 'base':
        //             document.getElementById('base-tools')!.classList.remove('hidden')
        //             break
        //         case 'card':
        //             document.getElementById('card-tools')!.classList.remove('hidden')
        //             break
        //         case 'tile':
        //             document.getElementById('tile-tools')!.classList.remove('hidden')
        //             break
        //     }
        // })
    }
    primaryMouseDown() {
        this.mouseData.primaryPressed = true;
        const gridX = this.camera.gridX(this.mouseData.canvasX, this.canvas.width);
        const gridY = this.camera.gridY(this.mouseData.canvasY, this.canvas.height);
        if (this.puzzle.contains(gridX, gridY)) {
            this.controlSelection.x = gridX;
            this.controlSelection.y = gridY;
        }
    }
    secondaryMouseDown() {
        this.mouseData.secondaryPressed = true;
    }
    mouseMove(e) {
        if (this.mouseData.primaryPressed && this.spacePressed) {
            const dx = e.offsetX - this.mouseData.canvasX;
            const dy = e.offsetY - this.mouseData.canvasY;
            this.camera.pan(dx, dy);
        }
        this.mouseData.canvasX = e.offsetX;
        this.mouseData.canvasY = e.offsetY;
    }
    mouseWheel(e) {
        if (e.deltaY > 0) {
            this.camera.zoomOut(this.mouseData.canvasX, this.mouseData.canvasY, this.canvas.width, this.canvas.height);
        }
        else {
            this.camera.zoomIn(this.mouseData.canvasX, this.mouseData.canvasY, this.canvas.width, this.canvas.height);
        }
    }
    primaryMouseUp() {
        this.mouseData.primaryPressed = false;
    }
    secondaryMouseUp() {
        this.mouseData.secondaryPressed = false;
    }
    mouseLeave() {
        this.primaryMouseUp();
        this.secondaryMouseUp();
    }
    resize() {
        const canvasBounds = this.canvas.getBoundingClientRect();
        this.canvas.width = canvasBounds.width;
        this.canvas.height = canvasBounds.height;
    }
    loop() {
        this.render();
        requestAnimationFrame(() => { this.loop(); });
    }
    render() {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        this.context.clearRect(0, 0, canvasWidth, canvasHeight);
        this.renderBase(canvasWidth, canvasHeight);
        this.renderGrid(canvasWidth, canvasHeight);
        this.renderInfo(canvasWidth, canvasHeight);
        this.renderHover(canvasWidth, canvasHeight);
        this.renderControlSelection(canvasWidth, canvasHeight);
        // this.renderBaseConnections(canvasWidth, canvasHeight)
        // const scalar = 0.5
        // this.context.drawImage(Images.Tilesets, 0, 0, Images.Tilesets.width * scalar, Images.Tilesets.height * scalar)
    }
    renderGrid(canvasWidth, canvasHeight) {
        const xEast = this.camera.canvasX(0, canvasWidth);
        const xWest = this.camera.canvasX(this.puzzle.width, canvasWidth);
        const yNorth = this.camera.canvasY(0, canvasHeight);
        const ySouth = this.camera.canvasY(this.puzzle.height, canvasHeight);
        this.context.beginPath();
        for (let i = 0; i <= this.puzzle.width; i++) {
            const canvasX = this.camera.canvasX(i, canvasWidth);
            this.context.moveTo(canvasX, yNorth);
            this.context.lineTo(canvasX, ySouth);
        }
        for (let i = 0; i <= this.puzzle.height; i++) {
            const canvasY = this.camera.canvasY(i, canvasHeight);
            this.context.moveTo(xEast, canvasY);
            this.context.lineTo(xWest, canvasY);
        }
        this.context.lineWidth = 1;
        this.context.strokeStyle = '#444';
        this.context.stroke();
    }
    renderInfo(canvasWidth, canvasHeight) {
        const x = this.camera.gridX(this.mouseData.canvasX, canvasWidth);
        if (!this.puzzle.containsX(x))
            return;
        const y = this.camera.gridY(this.mouseData.canvasY, canvasHeight);
        if (!this.puzzle.containsY(y))
            return;
        this.context.font = '16px sans-serif';
        this.context.fillStyle = '#444';
        this.context.fillText(`(${x}, ${y})`, 5, canvasHeight - 7);
    }
    renderHover(canvasWidth, canvasHeight) {
        const x = this.camera.gridX(this.mouseData.canvasX, canvasWidth);
        if (!this.puzzle.containsX(x))
            return;
        const y = this.camera.gridY(this.mouseData.canvasY, canvasHeight);
        if (!this.puzzle.containsY(y))
            return;
        const canvasX = this.camera.canvasX(x, canvasWidth);
        const canvasY = this.camera.canvasY(y, canvasHeight);
        this.context.lineWidth = 1;
        this.context.strokeStyle = '#fff4';
        this.context.strokeRect(canvasX, canvasY, this.camera.scale, this.camera.scale);
    }
    renderControlSelection(canvasWidth, canvasHeight) {
        const canvasX = this.camera.canvasX(this.controlSelection.x, canvasWidth);
        const canvasY = this.camera.canvasY(this.controlSelection.y, canvasHeight);
        this.context.lineWidth = 2;
        this.context.strokeStyle = 'white';
        this.context.strokeRect(canvasX, canvasY, this.camera.scale, this.camera.scale);
    }
    renderBase(canvasWidth, canvasHeight) {
    }
    renderCards() {
    }
    renderTiles() {
    }
}
