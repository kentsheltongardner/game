import Images from '../images.js';
export default class BaseTypes {
    static Plain = 0;
    static Binary = 1;
    static Ternary = 2;
    static Quaternary = 3;
    static Names = [
        'Plain',
        'Binary',
        'Ternary',
        'Quaternary',
    ];
    static TilesetOffset = [
        Images.OffsetTemplateBasePlain,
        Images.OffsetTemplateBaseGold,
        Images.OffsetTemplateBaseSilver,
        Images.OffsetTemplateBaseBronze,
    ];
    static Powered = [
        false,
        true,
        true,
        true,
    ];
}
