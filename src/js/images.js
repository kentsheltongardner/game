import Directions from './enums/directions.js';
export default class Images {
    static CellSizePixels = 45;
    static CardShadowSizePixels = 47;
    static OffsetIconLeaf = 0;
    static OffsetIconSun = 1;
    static OffsetIconMoon = 2;
    static OffsetIconWolf = 3;
    static OffsetIconFlower = 4;
    static OffsetIconPetals = 5;
    static OffsetIconSpider = 6;
    static OffsetIconWeb = 7;
    static OffsetIconPebbles = 8;
    static OffsetIconBones = 15;
    static OffsetIconFish = 25;
    static OffsetIconNests = 30;
    static OffsetIconHoneycomb = 35;
    static OffsetIconSnowflake = 36;
    static OffsetIconClam = 37;
    static OffsetIconStarfish = 41;
    static OffsetIconHummingbird = 42;
    static OffsetIconSnake = 43;
    static OffsetIconOuroboros = 44;
    static OffsetIconAnt = 45;
    static OffsetIconButterflySmall = 46;
    static OffsetIconCloverSmall = 47;
    static OffsetIconSkullSmall = 48;
    static OffsetIconTrees = 49;
    static OffsetIconLizard = 55;
    static OffsetIconOwl = 56;
    static OffsetIconStars = 57;
    static OffsetIconChameleon = 62;
    static OffsetIconOctopus = 63;
    static OffsetIconClouds = 64;
    static OffsetIconMushrooms = 69;
    static OffsetIconLilyPads = 74;
    static OffsetIconClover = 79;
    static OffsetIconCrossBones = 80;
    static OffsetIconPawPrint = 81;
    static OffsetIconApples = 89;
    static OffsetIconButterfly = 94;
    static OffsetIconMoth = 96;
    static OffsetIconLadybug = 98;
    static OffsetIconWorker = 100;
    static OffsetIconQueen = 102;
    static OffsetIconBeehive = 104;
    static OffsetIconDragonfly = 106;
    static OffsetIconPlaque = 114;
    static OffsetIconPlaqueTranslate = 115;
    static OffsetIconPlaqueReflect = 147;
    static OffsetIconPlaqueRotate = 151;
    static OffsetTemplateBaseBacking = 0;
    static OffsetTemplateBaseGold = 1;
    static OffsetTemplateBaseSilver = 2;
    static OffsetTemplateBaseBronze = 3;
    static OffsetTemplateScrews = 4;
    static OffsetTemplateCardstock = 5;
    static OffsetTemplateWatermarkGrass = 6;
    static OffsetTemplateWatermarkWood = 7;
    static OffsetTemplateWatermarkStone = 8;
    static OffsetTemplateWatermarkWater = 9;
    static OffsetTemplateWatermarkCloud = 10;
    static OffsetTemplateFront = 11;
    static OffsetTemplateBack = 12;
    static OffsetTemplateBasePlain = 13;
    static OffsetTemplateCrease = 14;
    static OffsetTemplateMaterialMarble = 15;
    static OffsetTemplateMaterialWood = 16;
    static OffsetTemplateMaterialGlass = 17;
    static OffsetTemplateMaterialBloodstone = 18;
    static OffsetTemplateFasteners = 21;
    static OffsetTemplateEdging = 22;
    static Icons = document.getElementById('icons');
    static OffsetMap = new Array(256).fill(-1);
    static Tilesets;
    static CardShadowTileset;
    static Templates = document.getElementById('templates');
    static SoutheastMap = new Array(256).fill(-1);
    static SouthwestMap = new Array(256).fill(-1);
    static NorthwestMap = new Array(256).fill(-1);
    static NortheastMap = new Array(256).fill(-1);
    static ValidTileCount;
    static Creases = document.getElementById('creases');
    static CardShadowTemplate = document.getElementById('card-shadow-template');
    static {
        Images.initializeMaps();
        Images.Tilesets = Images.tilesetImage(Images.Templates);
        Images.CardShadowTileset = Images.tilesetImage(Images.CardShadowTemplate);
    }
    // 256 connection possibilities, diagonal connections without orthogonal connections not allowed
    static initializeMaps() {
        let index = 0;
        const bitE = Directions.Bits[Directions.East];
        const bitS = Directions.Bits[Directions.South];
        const bitW = Directions.Bits[Directions.West];
        const bitN = Directions.Bits[Directions.North];
        const bitSE = Directions.Bits[Directions.Southeast];
        const bitSW = Directions.Bits[Directions.Southwest];
        const bitNW = Directions.Bits[Directions.Northwest];
        const bitNE = Directions.Bits[Directions.Northeast];
        for (let i = 0; i < 256; i++) {
            const e = (i & bitE) === bitE;
            const s = (i & bitS) === bitS;
            const w = (i & bitW) === bitW;
            const n = (i & bitN) === bitN;
            const se = (i & bitSE) === bitSE;
            const sw = (i & bitSW) === bitSW;
            const nw = (i & bitNW) === bitNW;
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
        const size = template.width / 5;
        const lower = Math.floor(size / 2);
        const upper = size - lower;
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
                const scaledOffset = offset * size;
                context.drawImage(template, srcXSE, y + lower, upper, upper, scaledOffset + lower, y + lower, upper, upper);
                context.drawImage(template, srcXSW, y + lower, lower, upper, scaledOffset, y + lower, lower, upper);
                context.drawImage(template, srcXNW, y, lower, lower, scaledOffset, y, lower, lower);
                context.drawImage(template, srcXNE, y, upper, lower, scaledOffset + lower, y, upper, lower);
            }
        }
        const tileset = new Image();
        tileset.src = canvas.toDataURL();
        return tileset;
    }
}
