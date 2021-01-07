import {int} from "./Piece";

// www.eschertile.com/tile28.htm
// www.eschertile.com

export class PieceType {

    private readonly name: string;
    private readonly number: int;

    private readonly type: TypeElement[];

    constructor(name: string, number: int, type: TypeElement[]) {
        this.name = name;
        this.number = number;
        this.type = type;
    }
}

interface TypeElement {
    letter: string; // . C T G C4
    index: int;
}
