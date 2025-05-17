import Images from '../images.js'

export default class BaseTypes {
    static readonly Plain       = 0
    static readonly Binary      = 1
    static readonly Ternary     = 2
    static readonly Quaternary  = 3

    static readonly Names       = [
        'Plain', 
        'Binary', 
        'Ternary', 
        'Quaternary', 
    ]

    static readonly TilesetOffset = [
        Images.OffsetTemplateBasePlain,
        Images.OffsetTemplateBaseGold,
        Images.OffsetTemplateBaseSilver,
        Images.OffsetTemplateBaseBronze,
    ]

    static readonly Powered     = [ false, true, true, true ]
    static readonly StateCount  = [ 1, 2, 3, 4 ]
}