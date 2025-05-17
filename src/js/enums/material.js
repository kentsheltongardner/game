import Images from '../images.js';
export default class Materials {
    static Marble = 0;
    static Wood = 1;
    static Glass = 2;
    static Bloodstone = 3;
    static Names = [
        'Marble',
        'Wood',
        'Glass',
        'Bloodstone',
    ];
    static TilesetOffset = [
        Images.OffsetTemplateMaterialMarble,
        Images.OffsetTemplateMaterialWood,
        Images.OffsetTemplateMaterialGlass,
        Images.OffsetTemplateMaterialBloodstone,
    ];
}
