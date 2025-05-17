import Images from '../images.js';
export default class Watermarks {
    static None = 0;
    static Grass = 1;
    static Wood = 2;
    static Stone = 3;
    static Water = 4;
    static Cloud = 5;
    static Names = [
        'None',
        'Grass',
        'Wood',
        'Stone',
        'Water',
        'Cloud',
    ];
    static TilesetOffset = [
        0,
        Images.OffsetTemplateWatermarkGrass,
        Images.OffsetTemplateWatermarkWood,
        Images.OffsetTemplateWatermarkStone,
        Images.OffsetTemplateWatermarkWater,
        Images.OffsetTemplateWatermarkCloud,
    ];
}
