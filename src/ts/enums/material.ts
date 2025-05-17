import Images from '../images.js'

export default class Materials {
    static readonly Marble      = 0
    static readonly Wood        = 1
    static readonly Glass       = 2
    static readonly Bloodstone  = 3

    static readonly Names       = [
        'Marble', 
        'Wood', 
        'Glass', 
        'Bloodstone', 
    ]

    static readonly TilesetOffset = [
        Images.OffsetTemplateMaterialMarble,
        Images.OffsetTemplateMaterialWood,
        Images.OffsetTemplateMaterialGlass,
        Images.OffsetTemplateMaterialBloodstone,
    ]
}