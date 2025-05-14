import Images from '../images.js'

export default class Watermarks {
    static readonly None    = 0
    static readonly Grass   = 1
    static readonly Wood    = 2
    static readonly Stone   = 3
    static readonly Water   = 4
    static readonly Cloud   = 5

    static readonly Names       = [
        'None', 
        'Grass', 
        'Wood', 
        'Stone', 
        'Water', 
        'Cloud', 
    ]

    static readonly TilesetOffset = [
        0,
        Images.OffsetTemplateGrass,
        Images.OffsetTemplateWood,
        Images.OffsetTemplateStone,
        Images.OffsetTemplateWater,
        Images.OffsetTemplateCloud,
    ]
}