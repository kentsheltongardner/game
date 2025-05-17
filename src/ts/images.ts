import Directions from './enums/directions.js'

export default class Images {
    public static readonly CellSizePixels                   = 45
    public static readonly CardShadowSizePixels             = 47

    public static readonly OffsetIconLeaf                   = 0
    public static readonly OffsetIconSun                    = 1
    public static readonly OffsetIconMoon                   = 2
    public static readonly OffsetIconWolf                   = 3
    public static readonly OffsetIconFlower                 = 4
    public static readonly OffsetIconPetals                 = 5
    public static readonly OffsetIconSpider                 = 6
    public static readonly OffsetIconWeb                    = 7
    public static readonly OffsetIconPebbles                = 8
    public static readonly OffsetIconBones                  = 15
    public static readonly OffsetIconFish                   = 25
    public static readonly OffsetIconNests                  = 30
    public static readonly OffsetIconHoneycomb              = 35
    public static readonly OffsetIconSnowflake              = 36
    public static readonly OffsetIconClam                   = 37
    public static readonly OffsetIconStarfish               = 41
    public static readonly OffsetIconHummingbird            = 42
    public static readonly OffsetIconSnake                  = 43
    public static readonly OffsetIconOuroboros              = 44
    public static readonly OffsetIconAnt                    = 45
    public static readonly OffsetIconButterflySmall         = 46
    public static readonly OffsetIconCloverSmall            = 47
    public static readonly OffsetIconSkullSmall             = 48
    public static readonly OffsetIconTrees                  = 49
    public static readonly OffsetIconLizard                 = 55
    public static readonly OffsetIconOwl                    = 56
    public static readonly OffsetIconStars                  = 57
    public static readonly OffsetIconChameleon              = 62
    public static readonly OffsetIconOctopus                = 63
    public static readonly OffsetIconClouds                 = 64
    public static readonly OffsetIconMushrooms              = 69
    public static readonly OffsetIconLilyPads               = 74
    public static readonly OffsetIconClover                 = 79
    public static readonly OffsetIconCrossBones             = 80
    public static readonly OffsetIconPawPrint               = 81
    public static readonly OffsetIconApples                 = 89
    public static readonly OffsetIconButterfly              = 94
    public static readonly OffsetIconMoth                   = 96
    public static readonly OffsetIconLadybug                = 98
    public static readonly OffsetIconWorker                 = 100
    public static readonly OffsetIconQueen                  = 102
    public static readonly OffsetIconBeehive                = 104
    public static readonly OffsetIconDragonfly              = 106
    public static readonly OffsetIconPlaque                 = 114
    public static readonly OffsetIconPlaqueTranslate        = 115
    public static readonly OffsetIconPlaqueReflect          = 147
    public static readonly OffsetIconPlaqueRotate           = 151

    public static readonly OffsetTemplateBaseBacking        = 0
    public static readonly OffsetTemplateBaseGold           = 1
    public static readonly OffsetTemplateBaseSilver         = 2
    public static readonly OffsetTemplateBaseBronze         = 3
    public static readonly OffsetTemplateScrews             = 4
    public static readonly OffsetTemplateCardstock          = 5
    public static readonly OffsetTemplateWatermarkGrass     = 6
    public static readonly OffsetTemplateWatermarkWood      = 7
    public static readonly OffsetTemplateWatermarkStone     = 8
    public static readonly OffsetTemplateWatermarkWater     = 9
    public static readonly OffsetTemplateWatermarkCloud     = 10
    public static readonly OffsetTemplateFront              = 11
    public static readonly OffsetTemplateBack               = 12
    public static readonly OffsetTemplateBasePlain          = 13
    public static readonly OffsetTemplateCrease             = 14
    public static readonly OffsetTemplateMaterialMarble     = 15
    public static readonly OffsetTemplateMaterialWood       = 16
    public static readonly OffsetTemplateMaterialGlass      = 17
    public static readonly OffsetTemplateMaterialBloodstone = 18
    public static readonly OffsetTemplateFasteners          = 21
    public static readonly OffsetTemplateEdging             = 22

    public static readonly Icons                = <HTMLImageElement>document.getElementById('icons')
    public static OffsetMap                     = new Array(256).fill(-1)
    public static Tilesets: HTMLImageElement
    public static CardShadowTileset: HTMLImageElement

    private static readonly Templates           = <HTMLImageElement>document.getElementById('templates')
    private static SoutheastMap                 = new Array(256).fill(-1)
    private static SouthwestMap                 = new Array(256).fill(-1)
    private static NorthwestMap                 = new Array(256).fill(-1)
    private static NortheastMap                 = new Array(256).fill(-1)
    private static ValidTileCount: number

    private static readonly Creases             = <HTMLImageElement>document.getElementById('creases')
    private static readonly CardShadowTemplate  = <HTMLImageElement>document.getElementById('card-shadow-template')

    static {
        Images.initializeMaps()
        Images.Tilesets             = Images.tilesetImage(Images.Templates)
        Images.CardShadowTileset    = Images.tilesetImage(Images.CardShadowTemplate)
    }

    // 256 connection possibilities, diagonal connections without orthogonal connections not allowed
    static initializeMaps() {
        let index = 0

        const bitE  = Directions.Bits[Directions.East]
        const bitS  = Directions.Bits[Directions.South]
        const bitW  = Directions.Bits[Directions.West]
        const bitN  = Directions.Bits[Directions.North]
        const bitSE = Directions.Bits[Directions.Southeast]
        const bitSW = Directions.Bits[Directions.Southwest]
        const bitNW = Directions.Bits[Directions.Northwest]
        const bitNE = Directions.Bits[Directions.Northeast]

        for (let i = 0; i < 256; i++) {
            const e     = (i & bitE)    === bitE
            const s     = (i & bitS)    === bitS
            const w     = (i & bitW)    === bitW
            const n     = (i & bitN)    === bitN
            const se    = (i & bitSE)   === bitSE
            const sw    = (i & bitSW)   === bitSW
            const nw    = (i & bitNW)   === bitNW
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
        const size          = template.width / 5
        const lower         = Math.floor(size / 2)
        const upper         = size - lower
        const frames        = template.height / size
        canvas.width        = size * Images.ValidTileCount
        canvas.height       = template.height

        for (let i = 0; i < 256; i++) {
            for (let j = 0; j < frames; j++) {
                const offset = Images.OffsetMap[i]
                if (offset === -1) continue

                const y             = j * size
                const srcXSE        = Images.SoutheastMap[i] * size + lower
                const srcXSW        = Images.SouthwestMap[i] * size
                const srcXNW        = Images.NorthwestMap[i] * size
                const srcXNE        = Images.NortheastMap[i] * size + lower
                const scaledOffset  = offset * size

                context.drawImage(template, srcXSE, y + lower,  upper, upper, scaledOffset + lower,    y + lower,  upper, upper)
                context.drawImage(template, srcXSW, y + lower,  lower, upper, scaledOffset,            y + lower,  lower, upper)
                context.drawImage(template, srcXNW, y,          lower, lower, scaledOffset,            y,          lower, lower)
                context.drawImage(template, srcXNE, y,          upper, lower, scaledOffset + lower,    y,          upper, lower)
            }
        }

        const tileset   = new Image()
        tileset.src     = canvas.toDataURL()
        return tileset
    }
}