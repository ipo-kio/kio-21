import {EPS} from "./Piece";
import {Transform} from "./Transform";
import {PolyLine} from "./PolyLine";

export class PolyLineUtils {
    static isC(p: PolyLine) {
        let n = p.size;

        let p0 = p.point(0);
        let pLast = p.point(n - 1);

        let c = p0.middle(pLast);

        for (let i = 1; 2 * i <= n; i++) {
            let pi = p.point(i);
            let pj = p.point(n - i - 1);

            let cc = pi.middle(pj);
            if (!c.equals(cc))
                return false;
        }
        return true;
    }

    static isT(p1: PolyLine, p2: PolyLine): boolean {
        let n = p1.size;
        if (n != p2.size)
            return false;

        let t = p2.point(0).sub(p1.point(0));
        for (let i = 1; i < n; i++) {
            let tt = p2.point(i).sub(p1.point(i));
            if (!tt.equals(t))
                return false;
        }

        return true;
    }

    // p1 rotated 90 in positive direction around p1 beginning equals p2
    static isC4(p1: PolyLine, p2: PolyLine): boolean {
        //p1 rotated around p1[0] goes to p2
        let o = p1.point(0);
        let n = p1.size;
        if (n != p2.size)
            return false;
        for (let i = 0; i < n; i++) {
            let o1 = p1.point(i);
            let o2 = p2.point(i);
            //o1 - o - o2 should be a 90 rotation
            let v1 = o1.sub(o); //example: -1, 0
            let v2 = o2.sub(o); //example: 0, 1

            let vec = v1.vec(v2);
            let dot = v1.dot(v2);

            //must hold: dot == 0, v1.len = v2.len, vec > 0
            if (Math.abs(dot) >= EPS || Math.abs(v1.length2 - v2.length2) >= EPS || vec < 0)
                return false;
        }

        return true;
    }

    static isG(p1: PolyLine, p2: PolyLine): boolean {
        let n = p1.size;
        if (n != p2.size)
            return false;

        let s1 = p1.point(0); //start 1
        let s2 = p2.point(0); //start 2
        let e1 = p1.point(n - 1); //end 1
        let e2 = p2.point(n - 1); //end 2

        let v1 = e1.sub(s1);
        let v2 = e2.sub(e1);

        //bisector v1 and v2 is a reflexion line, angle = a
        let aMul2 = v1.angle + v2.angle;
        // transform matrix:
        // p q
        // q -p
        // p = cos(2a)
        // q = sin(2a)
        let p = Math.cos(aMul2);
        let q = Math.sin(aMul2);
        let reflect = new Transform(p, q, 0, q, -p, 0);
        let t = s2.sub(reflect.apply(s1))
        let g = new Transform(p, q, t.x, q, -p, t.y);

        for (let i = 0; i < n; i++) {
            let point1 = p1.point(i);
            let point2 = p2.point(i);
            if (!g.apply(point1).equals(point2))
                return false;
        }

        return true;
    }

    static toString(p: PolyLine) {
        let points = [];
        for (let i = 0; i < p.size; i++)
            points.push(p.point(i).toString());
        return points.join('~');
    }
}
