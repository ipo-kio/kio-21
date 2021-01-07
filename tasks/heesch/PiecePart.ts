import {PolyLine} from "./PolyLine";
import {Point} from "./Point";
import {int, Piece} from "./Piece";
import {PolyLineUtils} from "./PolyLineUtils";

export class PiecePart implements PolyLine {
    readonly size: int;

    private readonly piece: Piece;
    private readonly ind1: int;
    private readonly forward: boolean;

    constructor(piece: Piece, ind1: int, ind2: int, forward: boolean) {
        while (ind2 < ind1)
            ind2 += piece.size;
        this.piece = piece;
        this.size = ind2 - ind1 + 1;
        this.ind1 = forward ? ind1 : ind2;
        this.forward = forward;
    }

    point(ind: int): Point {
        return this.piece.point(this.forward ? this.ind1 + ind : this.ind1 - ind);
    }

    revert(): PolyLine {
        if (this.forward)
            return new PiecePart(this.piece, this.ind1, this.ind1 + this.size - 1, false);
        else
            return new PiecePart(this.piece, this.ind1 - this.size + 1, this.ind1, true);
    }
}
