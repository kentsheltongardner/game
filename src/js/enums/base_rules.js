export default class BaseRules {
    static None = 0;
    static Vacuous = 1;
    static On = 2;
    static Off = 3;
    static Same = 4;
    static Grouped = 5;
    static Separated = 6;
    static Length = 7;
    static Area = 8;
    static Relative = 9;
    static Congruent = 10;
    static Incongruent = 11;
    static Symmetric = 12;
    static Adjacent = 13;
    static Path = 14;
    static Loop = 15;
    static Order = 16;
    static Follow = 17;
    static Equidistant = 18;
    static Walk = 19;
    static Neighbors = 20;
    static Contain = 21;
    static Exclude = 22;
    static Hide = 23;
    static Groups = 24;
    static States = 25;
    static Orthogonal = 26;
    static Rules = 27;
    static Mimic = 28;
    static Names = [
        'None',
        'Vacuous',
        'On',
        'Off',
        'Same',
        'Grouped',
        'Separated',
        'Length',
        'Area',
        'Relative',
        'Congruent',
        'Incongruent',
        'Symmetric',
        'Adjacent',
        'Path',
        'Loop',
        'Order',
        'Follow',
        'Equidistant',
        'Walk',
        'Neighbors',
        'Contain',
        'Exclude',
        'Hide',
        'Groups',
        'States',
        'Orthogonal',
        'Rules',
        'Mimic',
    ];
}
// export enum BaseRules {
//     None,                   // (none)               No rule or icon
//     Vacuous,                // pebble               No rule, icon
//     On,                     // sun                  Group must be on
//     Off,                    // moon                 Group must be off
//     Same,                   // wolf                 Must all be in groups with same state
//     Grouped,                // bee                  Must all be in same group
//     Separated,              // spider               Must all be in different groups
//     Length,                 // bamboo               Group width/height must match sum
//     Area,                   // birds and bats       Group area must match sum
//     Relative,               // fish                 Group areas must be strictly ordered (there's always a bigger fish)
//     Congruent,              // honeycomb            All containing groups must be congruent
//     Incongruent,            // snowflake            No containing groups may be congruent
//     Symmetric,              // clam and starfish    All containing groups must form symmetric shape (change, groups of same color considered simultaneously, use different colors for single shapes)
//     Adjacent,               // nest and eggs        Number of adjacent cells in same group
//     Path,                   // snake                Group must form narrow path
//     Loop,                   // ouroboros            Group must form narrow loop
//     Order,                  // tree                 No path except ordered
//     Follow,                 // ant                  No path except head to tail
//     Equidistant,            // octopus              Minimal paths to other rules must be equidistant
//     Walk,                   // lizard               Walker must pass through all rules in group
//     Neighbors,              // mushrooms            Group must touch n groups where n = sum of neighboring group count rules
//     Contain,                // clover               Group must be able to contain sum of contain icons
//     Exclude,                // bones                Group must not be able to contain sum of exclude icons
//     Hide,                   // owl                  No line of sight to other rules
//     Groups,                 // clouds               Number of groups containing rules must equal global sum
//     States,                 // raindrops            For each state, number of groups in that state containing rules must equal global sum
//     Orthogonal,             // stars                Number of orthogonal cells in same state
//     Rules,                  // lily pads            Number of rules in group
//     Mimic,                  // chameleon            Satisfy all rules in puzzle
//     // 
//     // Reflection,             // leaves               Row, column, or diagonal must be reflective
//     // Equal,                  // butterfly and moth   For any rectangular region defined, state totals must be equal (plain bases do not count toward total)
//     // Cross color boundaries
//     // Dominant,               //                      More rules in group than rules of other colors
//     // Monochrome,             //                      Only rules of same color in group
//     // Too much
//     // Growth,                 // pumpkins             Group must equal growth pattern where any two adjacent pumpkins grow turn by turn         
//     // Inadequately defined
//     // Offset,                 // paw prints           Group must be able to offset by vector sum without touching same state
//     // Intersection,           //                      States are 0, 1, 2, 3,               (m - 1) - |a - b| % m = |a - b| % m
//     // Pattern,                //                      
// }
