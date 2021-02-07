import {int, Piece} from "./Piece";
import {Tessellation} from "./Tessellation";
import {G, R2, R4} from "./Transform";
import {PolyLineUtils} from "./PolyLineUtils";

// www.eschertile.com/tile28.htm
// www.eschertile.com

export class PieceType {

    readonly name: string;
    readonly number: int;
    readonly type: TypeElement[];
    readonly tessellate: (piece: Piece, indexes: int[]) => Tessellation | null;

    constructor(name: string, number: int, type: TypeElement[], tessellate: (piece: Piece, indexes: int[]) => Tessellation) {
        this.name = name;
        this.number = number;
        this.type = type;
        this.tessellate = tessellate;
    }

    get size(): int {
        return this.type.length;
    }
}

// letters '.' means any polyline, '-' means any nonempty polyline
// 'C', 'G', 'T' are certain types of polyline, 'G' and 'T' require an index of the corresponding polyline
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
    ],
    function tessellate(piece, indexes) {
        let T1 = piece.point(indexes[5]).sub(piece.point(indexes[1]));
        let T2 = piece.point(indexes[3]).sub(piece.point(indexes[1]));
        let pieces: Piece[] = [piece];
        return {T1, T2, pieces, indexes: indexes.slice()};
    }
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
    ],
    function tessellate(piece, indexes) {
        let T1 = piece.point(indexes[4]).sub(piece.point(indexes[0]));

        let D = piece.point(indexes[1]);
        let F = piece.point(indexes[2]);
        let B = piece.point(indexes[4]);
        let E = piece.point(indexes[5]);

        let M3 = B.middle(E);
        let M3_sym = R2(M3);
        let F_M3 = M3_sym.apply(F, true);

        let T2 = F_M3.sub(D);
        let pieces: Piece[] = [piece, M3_sym.applyToPiece(piece, true)];
        return {T1, T2, pieces, indexes: indexes.slice()};
    }
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
    ],
    function tessellate(piece, indexes) {
        let A = piece.point(indexes[2]);
        let A_rot = R4(A);

        let E = piece.point(indexes[0]);
        let B = piece.point(indexes[1]);
        let M = E.middle(B);

        let T1 = M.sub(A).mul(2);

        let D = piece.point(indexes[4]);
        let D_rot = A_rot.apply(A_rot.apply(D, true), true);

        let T2 = D_rot.sub(D);

        let pieces: Piece[] = [piece];
        let rotated_piece = piece;
        for (let i = 0; i < 3; i++) {
            rotated_piece = A_rot.applyToPiece(rotated_piece, true);
            pieces.push(rotated_piece);
        }

        return {T1, T2, pieces, indexes: indexes.slice()};
    }
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
    ],
    function tessellate(piece, indexes) {
        let C = piece.point(indexes[0]);
        let B = piece.point(indexes[4]);

        let T1 = B.sub(C);

        let F = piece.point(indexes[5]);
        let g = G(B, F, F, C);
        let A = piece.point(indexes[3]);
        let A_g = g.apply(A, true);
        let E = piece.point(indexes[2]);

        let T2 = E.sub(A_g);

        let pieces: Piece[] = [piece, g.applyToPiece(piece, true)];
        return {T1, T2, pieces, indexes: indexes.slice()};
    }
);

export const TYPE_TG1G2TG2G1 = new PieceType(
    "TG1G2TG2G1",  // disallow empty G1. This is the same as empty G2 starting from TG2G1 TG1G2
    20,
    [
        ['.'],
        ['-'],
        ['.'],
        ['T', 0],
        ['G', 2],
        ['G', 1]
    ],
    function tessellate(piece, indexes) {
        let A = piece.point(indexes[0]);
        let D = piece.point(indexes[4]);

        let T1 = D.sub(A);

        let B = piece.point(indexes[1]);
        let E = piece.point(indexes[2]);
        let F = piece.point(indexes[5]);

        let g = G(B, E, F, A);
        let D_g = g.apply(D, true);

        let T2 = D_g.sub(E);
        let pieces: Piece[] = [piece, g.applyToPiece(piece, true)];
        return {T1, T2, pieces, indexes: indexes.slice()};
    }
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
    ],
    function tessellate(piece, indexes) {
        let C = piece.point(indexes[0]);
        let D = piece.point(indexes[1]);
        let F = piece.point(indexes[2]);
        let A = piece.point(indexes[3]);
        let B = piece.point(indexes[4]);
        let E = piece.point(indexes[5]);

        let M1 = F.middle(A);

        let M1_rot = R2(M1);
        let g = G(B, E, E, C);

        let left_piece = M1_rot.applyToPiece(piece, true);

        let T1 = B.sub(C);

        let C_m1 = M1_rot.apply(C, true);
        let E_m1 = M1_rot.apply(E, true);
        let E_m1_g = g.apply(E_m1, true);

        let T2 = E_m1_g.sub(C_m1);
        let pieces: Piece[] = [
            piece,
            left_piece,
            g.applyToPiece(piece, true),
            g.applyToPiece(left_piece, true)
        ];
        return {T1, T2, pieces, indexes: indexes.slice()};
    }
);

export const TYPE_CG1CG2G1G2 = new PieceType(
    "CG1CG2G1G2", // disallow empty G1 (CCGG), let it be the other type TCCTGG with emtpy T)
    28,
    /*[
        ['C'],
        ['-'],
        ['C'],
        ['.'],
        ['G', 1],
        ['G', 3]
    ],*/
    [  // 010|212.010212
        ['-'],    // G2
        ['-'],    // G1
        ['G', 0], // G2
        ['C'],    // C
        ['G', 1], // G1
        ['C']     // C
    ],
    function tessellate(piece, indexes) {
        /*let D = piece.point(indexes[0]);
        let F = piece.point(indexes[1]);
        let E = piece.point(indexes[2]);
        let A = piece.point(indexes[3]);
        let B = piece.point(indexes[4]);
        let C = piece.point(indexes[5]);*/

        let D = piece.point(indexes[3]);
        let F = piece.point(indexes[4]);
        let E = piece.point(indexes[5]);
        let A = piece.point(indexes[0]);
        let B = piece.point(indexes[1]);
        let C = piece.point(indexes[2]);

        let M1 = D.middle(F);

        let M1_rot = R2(M1);
        let g1 = G(B, C, F, E);
        let g2 = G(C, D, A, B);
        if (!PolyLineUtils.isPerpendicular(g1, g2))
            return null;

        let T1 = E.sub(M1_rot.apply(A, true));
        let T2 = C.sub(g1.apply(E, true));

        let piece_left = g1.applyToPiece(piece, true);
        let pieces: Piece[] = [
            piece,
            M1_rot.applyToPiece(piece, true),
            piece_left,
            M1_rot.applyToPiece(piece_left, true)
        ];
        return {T1, T2, pieces, indexes: indexes.slice()};
    }
);

export const ALL_PIECE_TYPES = [
    TYPE_TTTTTT,      // 2        t1 t2      // !
    TYPE_TCCTCC,      // 7        t1 r/2     // !
    TYPE_CC4C4C4C4,   // 16       t1 r/4
    TYPE_TG1G1TG2G2,  // 18       t1 s       // !
    TYPE_TG1G2TG2G1,  // 20       t1 g       // !
    TYPE_TCCTGG,      // 24       t1 r/2 g   // !
    TYPE_CG1CG2G1G2   // 28       t1 r/2 g   // !
];
