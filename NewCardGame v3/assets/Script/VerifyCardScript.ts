import Hand from "./HandCardScript";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VerifyCard extends cc.Component {


    public static handArray: string[] = [];

    update(): void {

        class MeldNode {
            cards: string[];
            deadwood: number;
            parent: MeldNode | null;
            constructor(cards: string[], parent: MeldNode | null) {
                this.parent = parent;
                this.cards = cards;
                this.deadwood = Evaluator.count_deadwood(cards);
                if (parent != null) {
                    this.deadwood = parent.deadwood + this.deadwood;
                }
            }
        }

        class Evaluator {
            static full_deck: string[] = [
                "AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC",
                "AD", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "10D", "JD", "QD", "KD",
                "AH", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "JH", "QH", "KH",
                "AS", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "10S", "JS", "QS", "KS"
            ];

            static suitval: { [key: string]: number } = {
                "C": 0,
                "D": 1,
                "H": 2,
                "S": 3
            };

            static card_suit_value(card: string): number {
                let c: string = card.length === 2 ? card.substr(1, 1) : card.substr(2, 1);
                return this.suitval[c];
            }

            static card_value(card: string): number {
                let s: number = (this.full_deck.indexOf(card) % 13) + 1;
                s = (s > 10) ? 10 : s;
                return s;
            }

            static count_deadwood(cards: string[]): number {
                let d: number = 0;
                cards.forEach(element => {
                    d += this.card_value(element);
                });
                return d;
            }

            static card_number_value(card: string): number {
                let c: string = card.length === 2 ? card.substr(0, 1) : card.substr(0, 2);
                c = (c === "A") ? "1" : c;
                c = (c === "J") ? "11" : c;
                c = (c === "Q") ? "12" : c;
                c = (c === "K") ? "13" : c;
                return Number(c);
            }

            static is_number_meld(cards: string[]): boolean {
                if ((cards.length !== 3) && (cards.length !== 4)) {
                    return false;
                } else {
                    let num: number = this.card_number_value(cards[0]);
                    for (let i: number = 0; i < cards.length; i++) {
                        if (this.card_number_value(cards[i]) !== num) {
                            return false;
                        }
                    }
                }
                return true;
            }

            static is_suit_meld(cards: string[]): boolean {
                if (cards.length < 3) {
                    return false;
                }
                let suit: string = cards[0].length === 2 ? cards[0].substr(1, 1) : cards[0].substr(2, 1);
                let current_value: number = this.card_number_value(cards[0]) + 1;
                for (let i: number = 0; i < cards.length; i++) {
                    let s: string = cards[i].length === 2 ? cards[i].substr(1, 1) : cards[i].substr(2, 1);
                    if (suit !== s) {
                        return false;
                    }
                }
                for (let i: number = 1; i < cards.length; i++) {
                    if (this.card_number_value(cards[i]) !== current_value) {
                        return false;
                    }
                    current_value++;
                }
                return true;
            }

            static valid_card(card: string): boolean {
                let e: string = this.full_deck.find(item => item === card);
                return e != null;
            }

            static sort_by_value(hand: string[]): string[] {
                return hand.sort((a, b) => {
                    let av: number = this.card_number_value(a);
                    let bv: number = this.card_number_value(b);
                    let c: number = -1;
                    if (av < bv) {
                        c = -1;
                    } else if (av === bv) {
                        c = 0;
                    } else if (av > bv) {
                        c = 1;
                    }
                    if (c === 0) {
                        let as1: number = this.card_suit_value(a);
                        let bs: number = this.card_suit_value(b);
                        if (as1 < bs) {
                            c = -1;
                        } else if (as1 === bs) {
                            c = 0;
                        } else if (as1 > bs) {
                            c = 1;
                        }
                    }
                    return c;
                });
            }

            static sort_by_suit(hand: string[]): string[] {
                return hand.sort((a, b) => {
                    let as1: number = this.card_suit_value(a);
                    let bs: number = this.card_suit_value(b);
                    let c: number = -1;
                    if (as1 < bs) {
                        c = -1;
                    } else if (as1 === bs) {
                        c = 0;
                    } else if (as1 > bs) {
                        c = 1;
                    }
                    if (c === 0) {
                        let av: number = this.card_number_value(a);
                        let bv: number = this.card_number_value(b);
                        let c: number = -1;
                        if (av < bv) {
                            c = -1;
                        } else if (av === bv) {
                            c = 0;
                        } else if (av > bv) {
                            c = 1;
                        }
                    }
                    return c;
                });
            }

            // returns a new array of melds, containing all melds from the initial group,
            // except for ones that contain cards from the given meld.
            static clean_meld_group(melds: string[][], meld: string[]): string[][] {
                let to_return: string[][] = [];
                melds.forEach(m => {
                    to_return.push(m);
                });
                for (let i: number = 0; i < meld.length; i++) {
                    let c: string = meld[i];
                    to_return = to_return.filter((m) => {
                        return (m.indexOf(c) === -1);
                    });
                }

                return to_return;
            }


            /* Returns the leaf node for which parent pointers can be followed to obtain the
            # best possible meld combinations.
            # This could be a O(n!) algorithm, where n is the number of melds. But in
            # normal use, it shouldn't ever approach something too infeasible, because any
            # large set of melds should include an enourmous amount of overlapping melds,
            # which will be eliminated from recursive calls. The max recursion depth will
            # be equal to the largest number of non-overlapping melds.*/
            static build_meld_tree(melds: string[][], root_meld: MeldNode | null): MeldNode {
                let best: MeldNode = root_meld;
                melds.forEach(m => {
                    let n: MeldNode = new MeldNode(m, root_meld);
                    let new_tree: MeldNode = this.build_meld_tree(this.clean_meld_group(melds, m), n);
                    if (best == null || (new_tree.deadwood > best.deadwood)) {
                        best = new_tree;
                    }
                });
                return best as MeldNode;
            }

            // follows a path up to the root, and gets an array of melds
            static get_meld_set(leaf_node: MeldNode): string[][] {
                let arr: string[][] = [];
                let n: MeldNode | null = leaf_node;
                while (n != null) {
                    arr.push(n.cards);
                    n = n.parent;
                }
                return arr;
            }

            // returns an array containing the best score and best melds
            static get_best_combination(melds: string[][]): { score: number, melds: string[][] } {
                let best_score: number = 0;
                let best_melds: string[][] = [];
                let best_leaf: MeldNode = this.build_meld_tree(melds, null);
                best_score = best_leaf.deadwood;
                best_melds = this.get_meld_set(best_leaf);
                return { score: best_score, melds: best_melds };
            }

            static clean(hand2: string[], min: number, max: number, poss_meld: string[]): string[] {
                let j: number = 0;
                if (min < 4) {
                    for (j = 0; j < min; j++) {
                        hand2.shift();
                    }
                }
                if (hand2.length - max < 4) {
                    for (j = 0; j < hand2.length - max; j++) {
                        hand2.pop();
                    }
                }

                for (let i: number = 0; i < poss_meld.length; i++) {
                    let c: string = poss_meld[i];
                    hand2 = hand2.filter((m) => {
                        return (m.indexOf(c) === -1);
                    });
                }
                return hand2;
            }

            static highlight(hand: string[]): string[][] {
                let hand2: string[] = hand.slice();
                let highlight: string[][] = [];
                let min: number = 0;
                let max: number = 0;

                // 5 card suit melds
                for (let i: number = 0; i < hand2.length - 4; i++) {
                    let poss_meld: string[] = hand2.slice(i, i + 5);
                    if (this.is_suit_meld(poss_meld)) {
                        min = i;
                        max = i + 5;
                        highlight.push(poss_meld);
                        hand2 = Evaluator.clean(hand2, min, max, poss_meld);
                        i--;
                    }
                }

                // 4 card number meld
                for (let i: number = 0; i < hand2.length - 3; i++) {
                    let poss_meld: string[] = hand2.slice(i, i + 4);
                    if (this.is_number_meld(poss_meld)) {
                        min = i;
                        max = i + 4;
                        highlight.push(poss_meld);
                        hand2 = Evaluator.clean(hand2, min, max, poss_meld);
                        i--;
                    }
                }
                // 4 number meld
                for (let i: number = 0; i < hand2.length - 3; i++) {
                    let poss_meld: string[] = hand2.slice(i, i + 4);
                    if (this.is_number_meld(poss_meld)) {
                        min = i;
                        max = i + 4;
                        highlight.push(poss_meld);
                        hand2 = Evaluator.clean(hand2, min, max, poss_meld);
                        i--;
                    }
                }
                // 3 number meld
                for (let i: number = 0; i < hand2.length - 2; i++) {
                    let poss_meld: string[] = hand2.slice(i, i + 3);
                    if (this.is_number_meld(poss_meld)) {
                        min = i;
                        max = i + 3;
                        highlight.push(poss_meld);
                        hand2 = Evaluator.clean(hand2, min, max, poss_meld);
                        i--;
                    }
                }
                // 3 card suit meld
                for (let i: number = 0; i < hand2.length - 2; i++) {
                    let poss_meld: string[] = hand2.slice(i, i + 3);
                    if (this.is_suit_meld(poss_meld)) {
                        min = i;
                        max = i + 3;
                        highlight.push(poss_meld);
                        hand.splice(i, 3);
                        hand2 = Evaluator.clean(hand2, min, max, poss_meld);
                        i--;
                    }
                }
                return highlight;
            }

            static verify(hand: string[]): { score: number, melds: string[][], hand: string[]; } {
                // first, check for 4 card melds of the same-numbered card
                let all_melds: string[][] = [];
                hand = Evaluator.sort_by_value(hand);
                for (let i: number = 0; i < hand.length - 3; i++) {
                    let poss_meld: string[] = hand.slice(i, i + 4);
                    if (this.is_number_meld(poss_meld)) {
                        all_melds.push(poss_meld);
                        // when a 4-card meld is found, also add all the possible 3-card melds which
                        // won't be picked up by the subsequent 3-card scan.
                        all_melds.push([poss_meld[0], poss_meld[1], poss_meld[3]]);
                        all_melds.push([poss_meld[0], poss_meld[2], poss_meld[3]]);
                    }
                }
                // next, check for 3 card melds of the same-numbered card
                for (let i: number = 0; i < hand.length - 2; i++) {
                    let poss_meld: string[] = hand.slice(i, i + 3);
                    if (this.is_number_meld(poss_meld)) {
                        all_melds.push(poss_meld);
                    }
                }
                // next, check for 3 card melds in the same suit
                hand = this.sort_by_suit(hand);
                for (let i: number = 0; i < hand.length - 2; i++) {
                    let poss_meld: string[] = hand.slice(i, i + 3);
                    if (this.is_suit_meld(poss_meld)) {
                        all_melds.push(poss_meld);
                    }
                }
                // next, 4 card melds
                for (let i: number = 0; i < hand.length - 3; i++) {
                    let poss_meld: string[] = hand.slice(i, i + 4);
                    if (this.is_suit_meld(poss_meld)) {
                        all_melds.push(poss_meld);
                    }
                }
                // finally, 5 card melds
                for (let i: number = 0; i < hand.length - 4; i++) {
                    let poss_meld: string[] = hand.slice(i, i + 5);
                    if (this.is_suit_meld(poss_meld)) {
                        all_melds.push(poss_meld);
                    }
                }

                // all possible melds have been found. Now, find the optimal set of melds.
                all_melds = all_melds.sort((a, b) => {
                    let av: number = this.count_deadwood(a);
                    let bv: number = this.count_deadwood(b);
                    let c: number = -1;
                    if (av < bv) {
                        c = -1;
                    } else if (av === bv) {
                        c = 0;
                    } else if (av > bv) {
                        c = 1;
                    }
                    return c;
                });

                if (all_melds.length === 0) {
                    return { score: this.count_deadwood(hand), melds: [], hand: hand };
                } else {
                    let a: { score: number; melds: string[][]; } = this.get_best_combination(all_melds);
                    let deadwood: number = this.count_deadwood(hand) - a.score;
                    let best_melds: string[][] = a.melds;
                    best_melds.forEach(m => {
                        hand = hand.filter(item => {
                            return m.find(i => i === item) == null;
                        });
                    });
                    return { score: deadwood, melds: best_melds, hand: hand };
                }
            }
        }
        VerifyCard.handArray=[];
        for (var i: number = 0; i < Hand.handCards.length; i++) {

            VerifyCard.handArray[i] = Hand.handCards[i].name;
        }
        // console.log(VerifyCard.handArray);
        // console.log(Evaluator.verify(VerifyCard.handArray));
        console.log(Evaluator.highlight(VerifyCard.handArray));
    }
}
