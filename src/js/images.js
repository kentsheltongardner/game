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
    static OffsetIconPebbles = 8 * Images.CellSizePixels;
    static OffsetIconBones = 15 * Images.CellSizePixels;
    static OffsetIconFish = 25 * Images.CellSizePixels;
    static OffsetIconNests = 30 * Images.CellSizePixels;
    static OffsetIconHoneycomb = 35 * Images.CellSizePixels;
    static OffsetIconSnowflake = 36 * Images.CellSizePixels;
    static OffsetIconClam = 37 * Images.CellSizePixels;
    static OffsetIconStarfish = 41 * Images.CellSizePixels;
    static OffsetIconHummingbird = 42 * Images.CellSizePixels;
    static OffsetIconSnake = 43 * Images.CellSizePixels;
    static OffsetIconOuroboros = 44 * Images.CellSizePixels;
    static OffsetIconAnt = 45 * Images.CellSizePixels;
    static OffsetIconButterflySmall = 46 * Images.CellSizePixels;
    static OffsetIconCloverSmall = 47 * Images.CellSizePixels;
    static OffsetIconSkullSmall = 48 * Images.CellSizePixels;
    static OffsetIconTrees = 49 * Images.CellSizePixels;
    static OffsetIconLizard = 55 * Images.CellSizePixels;
    static OffsetIconOwl = 56 * Images.CellSizePixels;
    static OffsetIconStars = 57 * Images.CellSizePixels;
    static OffsetIconChameleon = 62 * Images.CellSizePixels;
    static OffsetIconOctopus = 63 * Images.CellSizePixels;
    static OffsetIconClouds = 64 * Images.CellSizePixels;
    static OffsetIconMushrooms = 69 * Images.CellSizePixels;
    static OffsetIconLilyPads = 74 * Images.CellSizePixels;
    static OffsetIconClover = 79 * Images.CellSizePixels;
    static OffsetIconCrossBones = 80 * Images.CellSizePixels;
    static OffsetIconPawPrint = 81 * Images.CellSizePixels;
    static OffsetIconApples = 89 * Images.CellSizePixels;
    static OffsetIconButterfly = 94 * Images.CellSizePixels;
    static OffsetIconMoth = 95 * Images.CellSizePixels;
    static OffsetIconLadybug = 96 * Images.CellSizePixels;
    static OffsetIconBee = 97 * Images.CellSizePixels;
    static OffsetIconQueenBee = 98 * Images.CellSizePixels;
    static OffsetIconBeehive = 99 * Images.CellSizePixels;
    static OffsetIconDragonfly = 100 * Images.CellSizePixels;
    static OffsetIconPlaque = 108 * Images.CellSizePixels;
    static OffsetIconPlaqueTranslate = 109 * Images.CellSizePixels;
    static OffsetIconPlaqueReflect = 141 * Images.CellSizePixels;
    static OffsetIconPlaqueRotate = 145 * Images.CellSizePixels;
    static OffsetTemplateBaseBacking = 0 * Images.CellSizePixels;
    static OffsetTemplateBaseGold = 1 * Images.CellSizePixels;
    static OffsetTemplateBaseSilver = 2 * Images.CellSizePixels;
    static OffsetTemplateBaseBronze = 3 * Images.CellSizePixels;
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
    static OffsetTemplateBasePlain = 14 * Images.CellSizePixels;
    static Icons = document.getElementById('icons');
    static OffsetMap = new Array(256).fill(-1);
    static Tilesets;
    static Templates = document.getElementById('templates');
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
            Images.OffsetMap[i] = index * Images.CellSizePixels;
            Images.SoutheastMap[i] = seIndex * Images.CellSizePixels;
            Images.SouthwestMap[i] = swIndex * Images.CellSizePixels;
            Images.NorthwestMap[i] = nwIndex * Images.CellSizePixels;
            Images.NortheastMap[i] = neIndex * Images.CellSizePixels;
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
                const srcXSE = Images.SoutheastMap[i] + lower;
                const srcXSW = Images.SouthwestMap[i];
                const srcXNW = Images.NorthwestMap[i];
                const srcXNE = Images.NortheastMap[i] + lower;
                context.drawImage(template, srcXSE, y + lower, upper, upper, offset + lower, y + lower, upper, upper);
                context.drawImage(template, srcXSW, y + lower, lower, upper, offset, y + lower, lower, upper);
                context.drawImage(template, srcXNW, y, lower, lower, offset, y, lower, lower);
                context.drawImage(template, srcXNE, y, upper, lower, offset + lower, y, upper, lower);
            }
        }
        const tileset = new Image();
        tileset.src = canvas.toDataURL();
        return tileset;
    }
}
