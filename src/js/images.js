import Directions from './enums/directions.js';
export default class Images {
    static CellSizePixels = 45;
    static LowerSizePixels = Math.floor(Images.CellSizePixels / 2);
    static UpperSizePixels = Images.CellSizePixels - Images.LowerSizePixels;
    static OffsetIconLeaf = 0 * Images.CellSizePixels;
    static OffsetIconSun = 1 * Images.CellSizePixels;
    static OffsetIconMoon = 2 * Images.CellSizePixels;
    static OffsetIconWolf = 3 * Images.CellSizePixels;
    static OffsetIconFlower = 4 * Images.CellSizePixels;
    static OffsetIconPetals = 5 * Images.CellSizePixels;
    static OffsetIconSpider = 6 * Images.CellSizePixels;
    static OffsetIconWeb = 7 * Images.CellSizePixels;
    static OffsetIconPebble = 8 * Images.CellSizePixels;
    static OffsetIconBone = 15 * Images.CellSizePixels;
    static OffsetIconFish = 20 * Images.CellSizePixels;
    static OffsetIconNest = 25 * Images.CellSizePixels;
    static OffsetIconHoneycomb = 30 * Images.CellSizePixels;
    static OffsetIconSnowflake = 31 * Images.CellSizePixels;
    static OffsetIconClam = 32 * Images.CellSizePixels;
    static OffsetIconStarfish = 34 * Images.CellSizePixels;
    static OffsetIconHummingbird = 35 * Images.CellSizePixels;
    static OffsetIconSnake = 36 * Images.CellSizePixels;
    static OffsetIconOuroboros = 37 * Images.CellSizePixels;
    static OffsetIconAnt = 38 * Images.CellSizePixels;
    static OffsetIconButterflySmall = 39 * Images.CellSizePixels;
    static OffsetIconCloverSmall = 40 * Images.CellSizePixels;
    static OffsetIconSkullSmall = 41 * Images.CellSizePixels;
    static OffsetIconTree = 42 * Images.CellSizePixels;
    static OffsetIconLizard = 48 * Images.CellSizePixels;
    static OffsetIconOwl = 49 * Images.CellSizePixels;
    static OffsetIconStar = 50 * Images.CellSizePixels;
    static OffsetIconChameleon = 55 * Images.CellSizePixels;
    static OffsetIconOctopus = 56 * Images.CellSizePixels;
    static OffsetIconCloud = 57 * Images.CellSizePixels;
    static OffsetIconMushroom = 62 * Images.CellSizePixels;
    static OffsetIconLilyPad = 67 * Images.CellSizePixels;
    static OffsetIconClover = 72 * Images.CellSizePixels;
    static OffsetIconCrossBones = 73 * Images.CellSizePixels;
    static OffsetIconPawPrint = 74 * Images.CellSizePixels;
    static OffsetIconButterfly = 76 * Images.CellSizePixels;
    static OffsetIconMoth = 77 * Images.CellSizePixels;
    static OffsetIconLadybug = 78 * Images.CellSizePixels;
    static OffsetIconBee = 79 * Images.CellSizePixels;
    static OffsetIconQueenBee = 80 * Images.CellSizePixels;
    static OffsetIconBeehive = 81 * Images.CellSizePixels;
    static OffsetIconDragonfly = 82 * Images.CellSizePixels;
    static OffsetIconPlaque = 84 * Images.CellSizePixels;
    static OffsetIconPlaqueTranslate = 85 * Images.CellSizePixels;
    static OffsetIconPlaqueRotate = 93 * Images.CellSizePixels;
    static OffsetIconPlaqueReflect = 95 * Images.CellSizePixels;
    static OffsetTemplateBase = 0 * Images.CellSizePixels;
    static OffsetTemplateBinary = 1 * Images.CellSizePixels;
    static OffsetTemplateTernary = 2 * Images.CellSizePixels;
    static OffsetTemplateQuaternary = 3 * Images.CellSizePixels;
    static OffsetTemplateScrews = 4 * Images.CellSizePixels;
    static OffsetTemplateCard = 5 * Images.CellSizePixels;
    static OffsetTemplateGrass = 6 * Images.CellSizePixels;
    static OffsetTemplateWood = 7 * Images.CellSizePixels;
    static OffsetTemplateStone = 8 * Images.CellSizePixels;
    static OffsetTemplateWater = 9 * Images.CellSizePixels;
    static OffsetTemplateCloud = 10 * Images.CellSizePixels;
    static OffsetTemplateFront = 11 * Images.CellSizePixels;
    static OffsetTemplateBack = 12 * Images.CellSizePixels;
    static OffsetTemplateTile = 13 * Images.CellSizePixels;
    static Icons = document.getElementById('icons');
    static Tilesets;
    static Templates = document.getElementById('templates');
    static OffsetMap = new Array(256).fill(-1);
    static SoutheastMap = new Array(256).fill(-1);
    static SouthwestMap = new Array(256).fill(-1);
    static NorthwestMap = new Array(256).fill(-1);
    static NortheastMap = new Array(256).fill(-1);
    static ValidTileCount;
    static {
        Images.initializeMaps();
        Images.Tilesets = Images.tilesetImage(Images.Templates);
    }
    // 256 connection possibilities, diagonal connections without orthogonal connections not allowed
    static initializeMaps() {
        let index = 0;
        const bitE = Directions.Bits[Directions.East];
        const bitSE = Directions.Bits[Directions.Southeast];
        const bitS = Directions.Bits[Directions.South];
        const bitSW = Directions.Bits[Directions.Southwest];
        const bitW = Directions.Bits[Directions.West];
        const bitNW = Directions.Bits[Directions.Northwest];
        const bitN = Directions.Bits[Directions.North];
        const bitNE = Directions.Bits[Directions.Northeast];
        for (let i = 0; i < 256; i++) {
            const e = (i & bitE) === bitE;
            const se = (i & bitSE) === bitSE;
            const s = (i & bitS) === bitS;
            const sw = (i & bitSW) === bitSW;
            const w = (i & bitW) === bitW;
            const nw = (i & bitNW) === bitNW;
            const n = (i & bitN) === bitN;
            const ne = (i & bitNE) === bitNE;
            const seIndex = Images.templateIndex(e, s, se);
            if (seIndex === -1)
                continue;
            const swIndex = Images.templateIndex(w, s, sw);
            if (swIndex === -1)
                continue;
            const nwIndex = Images.templateIndex(w, n, nw);
            if (nwIndex === -1)
                continue;
            const neIndex = Images.templateIndex(e, n, ne);
            if (neIndex === -1)
                continue;
            Images.OffsetMap[i] = index;
            Images.SoutheastMap[i] = seIndex;
            Images.SouthwestMap[i] = swIndex;
            Images.NorthwestMap[i] = nwIndex;
            Images.NortheastMap[i] = neIndex;
            index++;
        }
        Images.ValidTileCount = index;
    }
    static templateIndex(horizontal, vertical, diagonal) {
        const horizontalAndVertical = horizontal && vertical;
        if (diagonal)
            return horizontalAndVertical ? 0 : -1;
        if (horizontalAndVertical)
            return 1;
        if (horizontal)
            return 2;
        if (vertical)
            return 3;
        return 4;
    }
    static tilesetImage(template) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const size = Images.CellSizePixels;
        const lower = Images.LowerSizePixels;
        const upper = Images.UpperSizePixels;
        const frames = template.height / size;
        canvas.width = size * Images.ValidTileCount;
        canvas.height = template.height;
        for (let i = 0; i < 256; i++) {
            for (let j = 0; j < frames; j++) {
                const offset = Images.OffsetMap[i];
                if (offset === -1)
                    continue;
                const y = j * size;
                const srcXSE = Images.SoutheastMap[i] * size + lower;
                const srcXSW = Images.SouthwestMap[i] * size;
                const srcXNW = Images.NorthwestMap[i] * size;
                const srcXNE = Images.NortheastMap[i] * size + lower;
                context.drawImage(template, srcXSE, y + lower, upper, upper, offset * size + lower, y + lower, upper, upper);
                context.drawImage(template, srcXSW, y + lower, lower, upper, offset * size, y + lower, lower, upper);
                context.drawImage(template, srcXNW, y, lower, lower, offset * size, y, lower, lower);
                context.drawImage(template, srcXNE, y, upper, lower, offset * size + lower, y, upper, lower);
            }
        }
        const tileset = new Image();
        tileset.src = canvas.toDataURL();
        return tileset;
    }
}
