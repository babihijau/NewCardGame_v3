(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/VerifyCardScript.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '42cf9UVvK9BGoQlI7vwQvQc', 'VerifyCardScript', __filename);
// Script/VerifyCardScript.ts

Object.defineProperty(exports, "__esModule", { value: true });
var HandCardScript_1 = require("./HandCardScript");
var PrefabCardScript_1 = require("./PrefabCardScript");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var VerifyCard = /** @class */ (function (_super) {
    __extends(VerifyCard, _super);
    function VerifyCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.canvasNode = null;
        return _this;
    }
    VerifyCard_1 = VerifyCard;
    VerifyCard.prototype.onHighlight = function () {
        var MeldNode = /** @class */ (function () {
            function MeldNode(cards, parent) {
                this.parent = parent;
                this.cards = cards;
                this.deadwood = Evaluator.count_deadwood(cards);
                if (parent != null) {
                    this.deadwood = parent.deadwood + this.deadwood;
                }
            }
            return MeldNode;
        }());
        var Evaluator = /** @class */ (function () {
            function Evaluator() {
            }
            Evaluator.card_suit_value = function (card) {
                var c = card.length === 2 ? card.substr(1, 1) : card.substr(2, 1);
                return this.suitval[c];
            };
            Evaluator.card_value = function (card) {
                var s = (this.full_deck.indexOf(card) % 13) + 1;
                s = (s > 10) ? 10 : s;
                return s;
            };
            Evaluator.count_deadwood = function (cards) {
                var _this = this;
                var d = 0;
                cards.forEach(function (element) {
                    d += _this.card_value(element);
                });
                return d;
            };
            Evaluator.card_number_value = function (card) {
                var c = card.length === 2 ? card.substr(0, 1) : card.substr(0, 2);
                c = (c === "A") ? "1" : c;
                c = (c === "J") ? "11" : c;
                c = (c === "Q") ? "12" : c;
                c = (c === "K") ? "13" : c;
                return Number(c);
            };
            Evaluator.is_number_meld = function (cards) {
                if ((cards.length !== 3) && (cards.length !== 4)) {
                    return false;
                }
                else {
                    var num = this.card_number_value(cards[0]);
                    for (var i = 0; i < cards.length; i++) {
                        if (this.card_number_value(cards[i]) !== num) {
                            return false;
                        }
                    }
                }
                /*                 for (let i: number = 0; i < Hand.handCards.length; i++) {
                                    if (Hand.handCards[i].name === cards[0]) {
                                        var a: cc.Node = Hand.handCards[i];
                                    }
                                    if (Hand.handCards[i].name === cards[1]) {
                                        var b: cc.Node = Hand.handCards[i];
                                    }
                                    if (Hand.handCards[i].name === cards[2]) {
                                        var c: cc.Node = Hand.handCards[i];
                                    }
                                }
                                if (Hand.handCards.indexOf(a) !== Hand.handCards.indexOf(b) - 1
                                || Hand.handCards.indexOf(b) !== Hand.handCards.indexOf(c) - 1) {
                                    return false;
                                }
                                 */
                return true;
            };
            Evaluator.is_suit_meld = function (cards) {
                if (cards.length < 3) {
                    return false;
                }
                var suit = cards[0].length === 2 ? cards[0].substr(1, 1) : cards[0].substr(2, 1);
                var current_value = this.card_number_value(cards[0]) + 1;
                for (var i = 0; i < cards.length; i++) {
                    var s = cards[i].length === 2 ? cards[i].substr(1, 1) : cards[i].substr(2, 1);
                    if (suit !== s) {
                        return false;
                    }
                }
                for (var i = 1; i < cards.length; i++) {
                    if (this.card_number_value(cards[i]) !== current_value) {
                        return false;
                    }
                    current_value++;
                }
                /*                 for (let i: number = 0; i < Hand.handCards.length; i++) {
                                    if (Hand.handCards[i].name === cards[0]) {
                                        var a: cc.Node = Hand.handCards[i];
                                    }
                                    if (Hand.handCards[i].name === cards[1]) {
                                        var b: cc.Node = Hand.handCards[i];
                                    }
                                    if (Hand.handCards[i].name === cards[2]) {
                                        var c: cc.Node = Hand.handCards[i];
                                    }
                                }
                                if (Hand.handCards.indexOf(a) !== Hand.handCards.indexOf(b) - 1
                                || Hand.handCards.indexOf(b) !== Hand.handCards.indexOf(c) - 1) {
                                    return false;
                                } */
                return true;
            };
            Evaluator.valid_card = function (card) {
                var e = this.full_deck.find(function (item) { return item === card; });
                return e != null;
            };
            Evaluator.sort_by_value = function (hand) {
                var _this = this;
                return hand.sort(function (a, b) {
                    var av = _this.card_number_value(a);
                    var bv = _this.card_number_value(b);
                    var c = -1;
                    if (av < bv) {
                        c = -1;
                    }
                    else if (av === bv) {
                        c = 0;
                    }
                    else if (av > bv) {
                        c = 1;
                    }
                    if (c === 0) {
                        var as1 = _this.card_suit_value(a);
                        var bs = _this.card_suit_value(b);
                        if (as1 < bs) {
                            c = -1;
                        }
                        else if (as1 === bs) {
                            c = 0;
                        }
                        else if (as1 > bs) {
                            c = 1;
                        }
                    }
                    return c;
                });
            };
            Evaluator.sort_by_suit = function (hand) {
                var _this = this;
                return hand.sort(function (a, b) {
                    var as1 = _this.card_suit_value(a);
                    var bs = _this.card_suit_value(b);
                    var c = -1;
                    if (as1 < bs) {
                        c = -1;
                    }
                    else if (as1 === bs) {
                        c = 0;
                    }
                    else if (as1 > bs) {
                        c = 1;
                    }
                    if (c === 0) {
                        var av = _this.card_number_value(a);
                        var bv = _this.card_number_value(b);
                        var c_1 = -1;
                        if (av < bv) {
                            c_1 = -1;
                        }
                        else if (av === bv) {
                            c_1 = 0;
                        }
                        else if (av > bv) {
                            c_1 = 1;
                        }
                    }
                    return c;
                });
            };
            // returns a new array of melds, containing all melds from the initial group,
            // except for ones that contain cards from the given meld.
            Evaluator.clean_meld_group = function (melds, meld) {
                var to_return = [];
                melds.forEach(function (m) {
                    to_return.push(m);
                });
                var _loop_1 = function (i) {
                    var c = meld[i];
                    to_return = to_return.filter(function (m) {
                        return (m.indexOf(c) === -1);
                    });
                };
                for (var i = 0; i < meld.length; i++) {
                    _loop_1(i);
                }
                return to_return;
            };
            /* Returns the leaf node for which parent pointers can be followed to obtain the
            # best possible meld combinations.
            # This could be a O(n!) algorithm, where n is the number of melds. But in
            # normal use, it shouldn't ever approach something too infeasible, because any
            # large set of melds should include an enourmous amount of overlapping melds,
            # which will be eliminated from recursive calls. The max recursion depth will
            # be equal to the largest number of non-overlapping melds.*/
            Evaluator.build_meld_tree = function (melds, root_meld) {
                var _this = this;
                var best = root_meld;
                melds.forEach(function (m) {
                    var n = new MeldNode(m, root_meld);
                    var new_tree = _this.build_meld_tree(_this.clean_meld_group(melds, m), n);
                    if (best == null || (new_tree.deadwood > best.deadwood)) {
                        best = new_tree;
                    }
                });
                return best;
            };
            // follows a path up to the root, and gets an array of melds
            Evaluator.get_meld_set = function (leaf_node) {
                var arr = [];
                var n = leaf_node;
                while (n != null) {
                    arr.push(n.cards);
                    n = n.parent;
                }
                return arr;
            };
            // returns an array containing the best score and best melds
            Evaluator.get_best_combination = function (melds) {
                var best_score = 0;
                var best_melds = [];
                var best_leaf = this.build_meld_tree(melds, null);
                best_score = best_leaf.deadwood;
                best_melds = this.get_meld_set(best_leaf);
                return { score: best_score, melds: best_melds };
            };
            Evaluator.verify = function (hand) {
                var _this = this;
                // first, check for 4 card melds of the same-numbered card
                var all_melds = [];
                hand = Evaluator.sort_by_value(hand);
                for (var i = 0; i < hand.length - 3; i++) {
                    var poss_meld = hand.slice(i, i + 4);
                    if (this.is_number_meld(poss_meld)) {
                        all_melds.push(poss_meld);
                        // when a 4-card meld is found, also add all the possible 3-card melds which
                        // won't be picked up by the subsequent 3-card scan.
                        all_melds.push([poss_meld[0], poss_meld[1], poss_meld[3]]);
                        all_melds.push([poss_meld[0], poss_meld[2], poss_meld[3]]);
                    }
                }
                // next, check for 3 card melds of the same-numbered card
                for (var i = 0; i < hand.length - 2; i++) {
                    var poss_meld = hand.slice(i, i + 3);
                    if (this.is_number_meld(poss_meld)) {
                        all_melds.push(poss_meld);
                    }
                }
                // next, check for 3 card melds in the same suit
                hand = this.sort_by_suit(hand);
                for (var i = 0; i < hand.length - 2; i++) {
                    var poss_meld = hand.slice(i, i + 3);
                    if (this.is_suit_meld(poss_meld)) {
                        all_melds.push(poss_meld);
                    }
                }
                // next, 4 card melds
                for (var i = 0; i < hand.length - 3; i++) {
                    var poss_meld = hand.slice(i, i + 4);
                    if (this.is_suit_meld(poss_meld)) {
                        all_melds.push(poss_meld);
                    }
                }
                // finally, 5 card melds
                for (var i = 0; i < hand.length - 4; i++) {
                    var poss_meld = hand.slice(i, i + 5);
                    if (this.is_suit_meld(poss_meld)) {
                        all_melds.push(poss_meld);
                    }
                }
                // all possible melds have been found. Now, find the optimal set of melds.
                all_melds = all_melds.sort(function (a, b) {
                    var av = _this.count_deadwood(a);
                    var bv = _this.count_deadwood(b);
                    var c = -1;
                    if (av < bv) {
                        c = -1;
                    }
                    else if (av === bv) {
                        c = 0;
                    }
                    else if (av > bv) {
                        c = 1;
                    }
                    return c;
                });
                if (all_melds.length === 0) {
                    return { score: this.count_deadwood(hand), melds: [], hand: hand };
                }
                else {
                    var a = this.get_best_combination(all_melds);
                    var deadwood = this.count_deadwood(hand) - a.score;
                    var best_melds = a.melds;
                    best_melds.forEach(function (m) {
                        hand = hand.filter(function (item) {
                            return m.find(function (i) { return i === item; }) == null;
                        });
                    });
                    return { score: deadwood, melds: best_melds, hand: hand };
                }
            };
            Evaluator.clean = function (hand2, min, max, poss_meld) {
                /* let j: number = 0;
                 if (min < 3) {
                     for (j = 0; j < min; j++) {
                         hand2.shift();
                     }
                 }
                                 if (hand2.length - max < 2) {
                                     for (j = 0; j < hand2.length - 1 - max; j++) {
                                         hand2.pop();
                                     }
                                 } */
                var _loop_2 = function (i) {
                    var c = poss_meld[i];
                    hand2 = hand2.filter(function (m) {
                        return (m.indexOf(c) === -1);
                    });
                };
                for (var i = 0; i < poss_meld.length; i++) {
                    _loop_2(i);
                }
                return hand2;
            };
            Evaluator.highlight = function (hand) {
                var hand2 = hand.slice();
                var highlight = [];
                var min = 0;
                var max = 0;
                // 13 card sequence melds
                for (var i = 0; i < hand2.length - 12; i++) {
                    var poss_meld = hand2.slice(i, i + 13);
                    if (this.is_suit_meld(poss_meld)) {
                        min = i;
                        max = i + 13;
                        highlight.push(poss_meld);
                        hand2 = Evaluator.clean(hand2, min, max, poss_meld);
                        i--;
                    }
                }
                // 12 card sequence melds
                for (var i = 0; i < hand2.length - 11; i++) {
                    var poss_meld = hand2.slice(i, i + 12);
                    if (this.is_suit_meld(poss_meld)) {
                        min = i;
                        max = i + 12;
                        highlight.push(poss_meld);
                        hand2 = Evaluator.clean(hand2, min, max, poss_meld);
                        i--;
                    }
                }
                // 11 card sequence melds
                for (var i = 0; i < hand2.length - 10; i++) {
                    var poss_meld = hand2.slice(i, i + 11);
                    if (this.is_suit_meld(poss_meld)) {
                        min = i;
                        max = i + 11;
                        highlight.push(poss_meld);
                        hand2 = Evaluator.clean(hand2, min, max, poss_meld);
                        i--;
                    }
                }
                // 10 card sequence melds
                for (var i = 0; i < hand2.length - 9; i++) {
                    var poss_meld = hand2.slice(i, i + 10);
                    if (this.is_suit_meld(poss_meld)) {
                        min = i;
                        max = i + 10;
                        highlight.push(poss_meld);
                        hand2 = Evaluator.clean(hand2, min, max, poss_meld);
                        i--;
                    }
                }
                // 9 card sequence melds
                for (var i = 0; i < hand2.length - 8; i++) {
                    var poss_meld = hand2.slice(i, i + 9);
                    if (this.is_suit_meld(poss_meld)) {
                        min = i;
                        max = i + 9;
                        highlight.push(poss_meld);
                        hand2 = Evaluator.clean(hand2, min, max, poss_meld);
                        i--;
                    }
                }
                // 8 card sequence melds
                for (var i = 0; i < hand2.length - 7; i++) {
                    var poss_meld = hand2.slice(i, i + 8);
                    if (this.is_suit_meld(poss_meld)) {
                        min = i;
                        max = i + 8;
                        highlight.push(poss_meld);
                        hand2 = Evaluator.clean(hand2, min, max, poss_meld);
                        i--;
                    }
                }
                // 7 card sequence melds
                for (var i = 0; i < hand2.length - 6; i++) {
                    var poss_meld = hand2.slice(i, i + 7);
                    if (this.is_suit_meld(poss_meld)) {
                        min = i;
                        max = i + 7;
                        highlight.push(poss_meld);
                        hand2 = Evaluator.clean(hand2, min, max, poss_meld);
                        i--;
                    }
                }
                // 6 card sequence melds
                for (var i = 0; i < hand2.length - 5; i++) {
                    var poss_meld = hand2.slice(i, i + 6);
                    if (this.is_suit_meld(poss_meld)) {
                        min = i;
                        max = i + 6;
                        highlight.push(poss_meld);
                        hand2 = Evaluator.clean(hand2, min, max, poss_meld);
                        i--;
                    }
                }
                // 5 card sequence melds
                for (var i = 0; i < hand2.length - 4; i++) {
                    var poss_meld = hand2.slice(i, i + 5);
                    if (this.is_suit_meld(poss_meld)) {
                        min = i;
                        max = i + 5;
                        highlight.push(poss_meld);
                        hand2 = Evaluator.clean(hand2, min, max, poss_meld);
                        i--;
                    }
                }
                // 4 same number meld
                for (var i = 0; i < hand2.length - 3; i++) {
                    var poss_meld = hand2.slice(i, i + 4);
                    if (this.is_number_meld(poss_meld)) {
                        min = i;
                        max = i + 4;
                        highlight.push(poss_meld);
                        hand2 = Evaluator.clean(hand2, min, max, poss_meld);
                        i--;
                    }
                }
                // 4 card sequence meld
                for (var i = 0; i < hand2.length - 3; i++) {
                    var poss_meld = hand2.slice(i, i + 4);
                    if (this.is_suit_meld(poss_meld)) {
                        min = i;
                        max = i + 4;
                        highlight.push(poss_meld);
                        hand2 = Evaluator.clean(hand2, min, max, poss_meld);
                        i--;
                    }
                }
                // 3 same number meld
                for (var i = 0; i < hand2.length - 2; i++) {
                    var poss_meld = hand2.slice(i, i + 3);
                    if (this.is_number_meld(poss_meld)) {
                        min = i;
                        max = i + 3;
                        highlight.push(poss_meld);
                        hand2 = Evaluator.clean(hand2, min, max, poss_meld);
                        i--;
                    }
                }
                // 3 card sequence meld
                for (var i = 0; i < hand2.length - 2; i++) {
                    var poss_meld = hand2.slice(i, i + 3);
                    if (this.is_suit_meld(poss_meld)) {
                        min = i;
                        max = i + 3;
                        highlight.push(poss_meld);
                        hand.splice(i, 3);
                        hand2 = Evaluator.clean(hand2, min, max, poss_meld);
                        i--;
                    }
                }
                cc.log("Not meld: ", hand2);
                return highlight;
            };
            Evaluator.full_deck = [
                "AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC",
                "AD", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "10D", "JD", "QD", "KD",
                "AH", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "JH", "QH", "KH",
                "AS", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "10S", "JS", "QS", "KS"
            ];
            Evaluator.suitval = {
                "C": 0,
                "D": 1,
                "H": 2,
                "S": 3
            };
            return Evaluator;
        }());
        VerifyCard_1.handArrayNode = [];
        VerifyCard_1.handArrayName = [];
        for (var i = 0; i < HandCardScript_1.default.handCards.length; i++) {
            VerifyCard_1.handArrayName[i] = HandCardScript_1.default.handCards[i].name;
        }
        var handIn2DStringArray;
        handIn2DStringArray = (Evaluator.highlight(VerifyCard_1.handArrayName));
        var map = {};
        VerifyCard_1.handArrayNode = this.stringToNode(handIn2DStringArray);
        // verifyCard.handArrayNode = this.cleanHighlight(VerifyCard.handArrayNode);
        // doesnt work because cleaning after concactenated will remove possible additional melds
    };
    /*     cleanHighlight(handArrayNode: cc.Node[][]): cc.Node[][] {

                handArrayNode.forEach((item,index) => {
                    // cc.log("bugima",Hand.handCards.indexOf(item[0]));
                    // cc.log("bugima2",Hand.handCards.indexOf(item[1]));
                    if (Hand.handCards.indexOf(item[0]) !== Hand.handCards.indexOf(item[1])-1) {
                        // cc.log("false",index);
                        handArrayNode.splice(index,1);
                    }
                });

                return handArrayNode;
            } */
    VerifyCard.prototype.stringToNode = function (handIn2DStringArray) {
        var handBackTo2DNodeArray = [];
        var nodeArray = [];
        handIn2DStringArray.forEach(function (item, index) {
            nodeArray = [];
            item.forEach(function (item2) {
                HandCardScript_1.default.handCards.forEach(function (f) {
                    if (item2 === f.name) {
                        nodeArray.push(f.getComponent(PrefabCardScript_1.default));
                    }
                });
                handBackTo2DNodeArray[index] = nodeArray;
            });
        });
        return handBackTo2DNodeArray;
    };
    VerifyCard.handArrayNode = [];
    VerifyCard.handArrayName = [];
    __decorate([
        property(cc.Node)
    ], VerifyCard.prototype, "canvasNode", void 0);
    VerifyCard = VerifyCard_1 = __decorate([
        ccclass
    ], VerifyCard);
    return VerifyCard;
    var VerifyCard_1;
}(cc.Component));
exports.default = VerifyCard;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=VerifyCardScript.js.map
        