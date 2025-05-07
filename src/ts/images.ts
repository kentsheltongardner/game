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
    public static readonly OffsetIconPebble             = 8     * Images.CellSizePixels
    public static readonly OffsetIconBone               = 15    * Images.CellSizePixels
    public static readonly OffsetIconFish               = 20    * Images.CellSizePixels
    public static readonly OffsetIconNest               = 25    * Images.CellSizePixels
    public static readonly OffsetIconHoneycomb          = 30    * Images.CellSizePixels
    public static readonly OffsetIconSnowflake          = 31    * Images.CellSizePixels
    public static readonly OffsetIconClam               = 32    * Images.CellSizePixels
    public static readonly OffsetIconStarfish           = 34    * Images.CellSizePixels
    public static readonly OffsetIconHummingbird        = 35    * Images.CellSizePixels
    public static readonly OffsetIconSnake              = 36    * Images.CellSizePixels
    public static readonly OffsetIconOuroboros          = 37    * Images.CellSizePixels
    public static readonly OffsetIconAnt                = 38    * Images.CellSizePixels
    public static readonly OffsetIconButterflySmall     = 39    * Images.CellSizePixels
    public static readonly OffsetIconCloverSmall        = 40    * Images.CellSizePixels
    public static readonly OffsetIconSkullSmall         = 41    * Images.CellSizePixels
    public static readonly OffsetIconTree               = 42    * Images.CellSizePixels
    public static readonly OffsetIconLizard             = 48    * Images.CellSizePixels
    public static readonly OffsetIconOwl                = 49    * Images.CellSizePixels
    public static readonly OffsetIconStar               = 50    * Images.CellSizePixels
    public static readonly OffsetIconChameleon          = 55    * Images.CellSizePixels
    public static readonly OffsetIconOctopus            = 56    * Images.CellSizePixels
    public static readonly OffsetIconCloud              = 57    * Images.CellSizePixels
    public static readonly OffsetIconMushroom           = 62    * Images.CellSizePixels
    public static readonly OffsetIconLilyPad            = 67    * Images.CellSizePixels
    public static readonly OffsetIconClover             = 72    * Images.CellSizePixels
    public static readonly OffsetIconCrossBones         = 73    * Images.CellSizePixels
    public static readonly OffsetIconPawPrint           = 74    * Images.CellSizePixels
    public static readonly OffsetIconButterfly          = 76    * Images.CellSizePixels
    public static readonly OffsetIconMoth               = 77    * Images.CellSizePixels
    public static readonly OffsetIconLadybug            = 78    * Images.CellSizePixels
    public static readonly OffsetIconBee                = 79    * Images.CellSizePixels
    public static readonly OffsetIconQueenBee           = 80    * Images.CellSizePixels
    public static readonly OffsetIconBeehive            = 81    * Images.CellSizePixels
    public static readonly OffsetIconDragonfly          = 82    * Images.CellSizePixels
    public static readonly OffsetIconPlaque             = 84    * Images.CellSizePixels
    public static readonly OffsetIconPlaqueTranslate    = 85    * Images.CellSizePixels
    public static readonly OffsetIconPlaqueRotate       = 93    * Images.CellSizePixels
    public static readonly OffsetIconPlaqueReflect      = 95    * Images.CellSizePixels

    public static readonly OffsetTemplateBase           = 0     * Images.CellSizePixels
    public static readonly OffsetTemplateBinary         = 1     * Images.CellSizePixels
    public static readonly OffsetTemplateTernary        = 2     * Images.CellSizePixels
    public static readonly OffsetTemplateQuaternary     = 3     * Images.CellSizePixels
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

    public static readonly Icons                        = <HTMLImageElement>document.getElementById('icons')
    public static Tilesets: HTMLImageElement

    private static readonly Templates   = <HTMLImageElement>document.getElementById('templates')
    private static OffsetMap            = new Array(256).fill(-1)
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

            Images.OffsetMap[i]     = index
            Images.SoutheastMap[i]  = seIndex
            Images.SouthwestMap[i]  = swIndex
            Images.NorthwestMap[i]  = nwIndex
            Images.NortheastMap[i]  = neIndex

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
                const srcXSE    = Images.SoutheastMap[i] * size + lower
                const srcXSW    = Images.SouthwestMap[i] * size
                const srcXNW    = Images.NorthwestMap[i] * size
                const srcXNE    = Images.NortheastMap[i] * size + lower

                context.drawImage(template, srcXSE, y + lower,  upper, upper, offset * size + lower,    y + lower,  upper, upper)
                context.drawImage(template, srcXSW, y + lower,  lower, upper, offset * size,            y + lower,  lower, upper)
                context.drawImage(template, srcXNW, y,          lower, lower, offset * size,            y,          lower, lower)
                context.drawImage(template, srcXNE, y,          upper, lower, offset * size + lower,    y,          upper, lower)
            }
        }

        const tileset   = new Image()
        tileset.src     = canvas.toDataURL()
        return tileset
    }
}