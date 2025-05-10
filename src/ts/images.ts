import Directions from './enums/directions.js'

export default class Images {
    public static readonly CellSizePixels               = 45
    public static readonly LowerSizePixels              = Math.floor(Images.CellSizePixels / 2)
    public static readonly UpperSizePixels              = Images.CellSizePixels - Images.LowerSizePixels

    public static readonly OffsetIconLeaf               = 0     * Images.CellSizePixels
    public static readonly OffsetIconSun                = 1     * Images.CellSizePixels
    public static readonly OffsetIconMoon               = 2     * Images.CellSizePixels
    public static readonly OffsetIconWolf               = 3     * Images.CellSizePixels
    public static readonly OffsetIconFlower             = 4     * Images.CellSizePixels
    public static readonly OffsetIconPetals             = 5     * Images.CellSizePixels
    public static readonly OffsetIconSpider             = 6     * Images.CellSizePixels
    public static readonly OffsetIconWeb                = 7     * Images.CellSizePixels
    public static readonly OffsetIconPebbles            = 8     * Images.CellSizePixels
    public static readonly OffsetIconBones              = 15    * Images.CellSizePixels
    public static readonly OffsetIconFish               = 25    * Images.CellSizePixels
    public static readonly OffsetIconNests              = 30    * Images.CellSizePixels
    public static readonly OffsetIconHoneycomb          = 35    * Images.CellSizePixels
    public static readonly OffsetIconSnowflake          = 36    * Images.CellSizePixels
    public static readonly OffsetIconClam               = 37    * Images.CellSizePixels
    public static readonly OffsetIconStarfish           = 41    * Images.CellSizePixels
    public static readonly OffsetIconHummingbird        = 42    * Images.CellSizePixels
    public static readonly OffsetIconSnake              = 43    * Images.CellSizePixels
    public static readonly OffsetIconOuroboros          = 44    * Images.CellSizePixels
    public static readonly OffsetIconAnt                = 45    * Images.CellSizePixels
    public static readonly OffsetIconButterflySmall     = 46    * Images.CellSizePixels
    public static readonly OffsetIconCloverSmall        = 47    * Images.CellSizePixels
    public static readonly OffsetIconSkullSmall         = 48    * Images.CellSizePixels
    public static readonly OffsetIconTrees              = 49    * Images.CellSizePixels
    public static readonly OffsetIconLizard             = 55    * Images.CellSizePixels
    public static readonly OffsetIconOwl                = 56    * Images.CellSizePixels
    public static readonly OffsetIconStars              = 57    * Images.CellSizePixels
    public static readonly OffsetIconChameleon          = 62    * Images.CellSizePixels
    public static readonly OffsetIconOctopus            = 63    * Images.CellSizePixels
    public static readonly OffsetIconClouds             = 64    * Images.CellSizePixels
    public static readonly OffsetIconMushrooms          = 69    * Images.CellSizePixels
    public static readonly OffsetIconLilyPads           = 74    * Images.CellSizePixels
    public static readonly OffsetIconClover             = 79    * Images.CellSizePixels
    public static readonly OffsetIconCrossBones         = 80    * Images.CellSizePixels
    public static readonly OffsetIconPawPrint           = 81    * Images.CellSizePixels
    public static readonly OffsetIconApples             = 89    * Images.CellSizePixels
    public static readonly OffsetIconButterfly          = 94    * Images.CellSizePixels
    public static readonly OffsetIconMoth               = 95    * Images.CellSizePixels
    public static readonly OffsetIconLadybug            = 96    * Images.CellSizePixels
    public static readonly OffsetIconBee                = 97    * Images.CellSizePixels
    public static readonly OffsetIconQueenBee           = 98    * Images.CellSizePixels
    public static readonly OffsetIconBeehive            = 99    * Images.CellSizePixels
    public static readonly OffsetIconDragonfly          = 100   * Images.CellSizePixels
    public static readonly OffsetIconPlaque             = 108   * Images.CellSizePixels
    public static readonly OffsetIconPlaqueTranslate    = 109   * Images.CellSizePixels
    public static readonly OffsetIconPlaqueReflect      = 141   * Images.CellSizePixels
    public static readonly OffsetIconPlaqueRotate       = 145   * Images.CellSizePixels

    public static readonly OffsetTemplateBaseBacking    = 0     * Images.CellSizePixels
    public static readonly OffsetTemplateBaseGold       = 1     * Images.CellSizePixels
    public static readonly OffsetTemplateBaseSilver     = 2     * Images.CellSizePixels
    public static readonly OffsetTemplateBaseBronze     = 3     * Images.CellSizePixels
    public static readonly OffsetTemplateScrews         = 4     * Images.CellSizePixels
    public static readonly OffsetTemplateCard           = 5     * Images.CellSizePixels
    public static readonly OffsetTemplateGrass          = 6     * Images.CellSizePixels
    public static readonly OffsetTemplateWood           = 7     * Images.CellSizePixels
    public static readonly OffsetTemplateStone          = 8     * Images.CellSizePixels
    public static readonly OffsetTemplateWater          = 9     * Images.CellSizePixels
    public static readonly OffsetTemplateCloud          = 10    * Images.CellSizePixels
    public static readonly OffsetTemplateFront          = 11    * Images.CellSizePixels
    public static readonly OffsetTemplateBack           = 12    * Images.CellSizePixels
    public static readonly OffsetTemplateTile           = 13    * Images.CellSizePixels
    public static readonly OffsetTemplateBasePlain      = 14    * Images.CellSizePixels

    public static readonly Icons        = <HTMLImageElement>document.getElementById('icons')
    public static OffsetMap             = new Array(256).fill(-1)
    public static Tilesets: HTMLImageElement

    private static readonly Templates   = <HTMLImageElement>document.getElementById('templates')
    private static SoutheastMap         = new Array(256).fill(-1)
    private static SouthwestMap         = new Array(256).fill(-1)
    private static NorthwestMap         = new Array(256).fill(-1)
    private static NortheastMap         = new Array(256).fill(-1)
    private static ValidTileCount: number

    static {
        Images.initializeMaps()
        Images.Tilesets = Images.tilesetImage(Images.Templates)
    }

    // 256 connection possibilities, diagonal connections without orthogonal connections not allowed
    static initializeMaps() {
        let index = 0

        const bitE  = Directions.Bits[Directions.East]
        const bitSE = Directions.Bits[Directions.Southeast]
        const bitS  = Directions.Bits[Directions.South]
        const bitSW = Directions.Bits[Directions.Southwest]
        const bitW  = Directions.Bits[Directions.West]
        const bitNW = Directions.Bits[Directions.Northwest]
        const bitN  = Directions.Bits[Directions.North]
        const bitNE = Directions.Bits[Directions.Northeast]

        for (let i = 0; i < 256; i++) {
            const e     = (i & bitE)    === bitE
            const se    = (i & bitSE)   === bitSE
            const s     = (i & bitS)    === bitS
            const sw    = (i & bitSW)   === bitSW
            const w     = (i & bitW)    === bitW
            const nw    = (i & bitNW)   === bitNW
            const n     = (i & bitN)    === bitN
            const ne    = (i & bitNE)   === bitNE

            const seIndex: number = Images.templateIndex(e, s, se)
            if (seIndex === -1) continue

            const swIndex: number = Images.templateIndex(w, s, sw)
            if (swIndex === -1) continue

            const nwIndex: number = Images.templateIndex(w, n, nw)
            if (nwIndex === -1) continue

            const neIndex: number = Images.templateIndex(e, n, ne)
            if (neIndex === -1) continue

            Images.OffsetMap[i]     = index * Images.CellSizePixels
            Images.SoutheastMap[i]  = seIndex * Images.CellSizePixels
            Images.SouthwestMap[i]  = swIndex * Images.CellSizePixels
            Images.NorthwestMap[i]  = nwIndex * Images.CellSizePixels
            Images.NortheastMap[i]  = neIndex * Images.CellSizePixels

            index++
        }
        Images.ValidTileCount = index
    }

    static templateIndex(horizontal: boolean, vertical: boolean, diagonal: boolean): number {
        const horizontalAndVertical = horizontal && vertical
        if (diagonal)               return horizontalAndVertical ? 0 : -1
        if (horizontalAndVertical)  return 1
        if (horizontal)             return 2
        if (vertical)               return 3
                                    return 4
    }

    static tilesetImage(template: HTMLImageElement): HTMLImageElement {
        const canvas        = document.createElement('canvas')
        const context       = canvas.getContext('2d')!
        const size          = Images.CellSizePixels
        const lower         = Images.LowerSizePixels
        const upper         = Images.UpperSizePixels
        const frames        = template.height / size
        canvas.width        = size * Images.ValidTileCount
        canvas.height       = template.height

        for (let i = 0; i < 256; i++) {
            for (let j = 0; j < frames; j++) {
                const offset = Images.OffsetMap[i]
                if (offset === -1) continue

                const y         = j * size
                const srcXSE    = Images.SoutheastMap[i] + lower
                const srcXSW    = Images.SouthwestMap[i]
                const srcXNW    = Images.NorthwestMap[i]
                const srcXNE    = Images.NortheastMap[i] + lower

                context.drawImage(template, srcXSE, y + lower,  upper, upper, offset + lower,    y + lower,  upper, upper)
                context.drawImage(template, srcXSW, y + lower,  lower, upper, offset,            y + lower,  lower, upper)
                context.drawImage(template, srcXNW, y,          lower, lower, offset,            y,          lower, lower)
                context.drawImage(template, srcXNE, y,          upper, lower, offset + lower,    y,          upper, lower)
            }
        }

        const tileset   = new Image()
        tileset.src     = canvas.toDataURL()
        return tileset
    }
}