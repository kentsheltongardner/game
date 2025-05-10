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
        Images.OffsetTemplateBaseBronze,
        Images.OffsetTemplateBaseSilver,
        Images.OffsetTemplateBaseGold,
    ]

    static readonly Powered = [
        false,
        true,
        true,
        true,
    ]
}