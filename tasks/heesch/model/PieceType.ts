import {int} from "./Piece";

// www.eschertile.com/tile28.htm
// www.eschertile.com

export class PieceType {

    readonly name: string;
    readonly number: int;

    readonly type: TypeElement[];

    constructor(name: string, number: int, type: TypeElement[]) {
        this.name = name;
        this.number = number;
        this.type = type;
    }

    get size(): int {
        return this.type.length;
    }
}

type TypeElement = [letter: string, index?: int];

export const TYPE_TTTTTT = new PieceType(
    "TTTTTT",
    2,
    [
        ['.'],
        ['.'],
        ['.'],
        ['T', 0],
        ['T', 1],
        ['T', 2]
    ]
);

export const TYPE_TCCTCC = new PieceType(
    "TCCTCC",
    7,
    [
        ['.'],
        ['C'],
        ['C'],
        ['T', 0],
        ['C'],
        ['C']
    ]
);

export const TYPE_CC4C4C4C4 = new PieceType(
    "CC4C4C4C4",
    16,
    [
        ['C'],
        ['.'],
        ['C4', 1],
        ['.'],
        ['C4', 3]
    ]
);

export const TYPE_TG1G1TG2G2 = new PieceType(
    "TG1G1TG2G2",
    18,
    [
        ['.'],
        ['.'],
        ['G', 1],
        ['T', 0],
        ['.'],
        ['G', 4]
    ]
);

export const TYPE_TG1G2TG2G1 = new PieceType(
    "TG1G2TG2G1",
    20,
    [
        ['.'],
        ['.'],
        ['.'],
        ['T', 0],
        ['G', 2],
        ['G', 1]
    ]
);

export const TYPE_TCCTGG = new PieceType(
    "TCCTGG",
    24,
    [
        ['.'],
        ['C'],
        ['C'],
        ['T', 0],
        ['.'],
        ['G', 4]
    ]
);

export const TYPE_CG1CG2G1G2 = new PieceType(
    "CG1CG2G1G2",
    28,
    [
        ['C'],
        ['.'],
        ['C'],
        ['.'],
        ['G', 1],
        ['G', 3]
    ]
);

export const ALL_PIECE_TYPES = [
    TYPE_TTTTTT,
    TYPE_TG1G2TG2G1,
    TYPE_TG1G1TG2G2,
    TYPE_TCCTGG,
    TYPE_TCCTCC,
    TYPE_CC4C4C4C4,
    TYPE_CG1CG2G1G2
]
