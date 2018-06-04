(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/VerifyCardScript.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '42cf9UVvK9BGoQlI7vwQvQc', 'VerifyCardScript', __filename);
// Script/VerifyCardScript.ts

Object.defineProperty(exports, "__esModule", { value: true });
var HandCardScript_1 = require("./HandCardScript");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var VerifyCard = /** @class */ (function (_super) {
    __extends(VerifyCard, _super);
    function VerifyCard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VerifyCard_1 = VerifyCard;
    VerifyCard.prototype.update = function () {
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
                    for (var i_1 = 0; i_1 < cards.length; i_1++) {
                        if (this.card_number_value(cards[i_1]) !== num) {
                            return false;
                        }
                    }
                }
                return true;
            };
            Evaluator.is_suit_meld = function (cards) {
                if (cards.length < 3) {
                    return false;
                }
                var suit = cards[0].length === 2 ? cards[0].substr(1, 1) : cards[0].substr(2, 1);
                var current_value = this.card_number_value(cards[0]) + 1;
                for (var i_2 = 0; i_2 < cards.length; i_2++) {
                    var s = cards[i_2].length === 2 ? cards[i_2].substr(1, 1) : cards[i_2].substr(2, 1);
                    if (suit !== s) {
                        return false;
                    }
                }
                for (var i_3 = 1; i_3 < cards.length; i_3++) {
                    if (this.card_number_value(cards[i_3]) !== current_value) {
                        return false;
                    }
                    current_value++;
                }
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
                var _loop_1 = function (i_4) {
                    var c = meld[i_4];
                    to_return = to_return.filter(function (m) {
                        return (m.indexOf(c) === -1);
                    });
                };
                for (var i_4 = 0; i_4 < meld.length; i_4++) {
                    _loop_1(i_4);
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
            Evaluator.clean = function (hand2, min, max, poss_meld) {
                var j = 0;
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
                var _loop_2 = function (i_5) {
                    var c = poss_meld[i_5];
                    hand2 = hand2.filter(function (m) {
                        return (m.indexOf(c) === -1);
                    });
                };
                for (var i_5 = 0; i_5 < poss_meld.length; i_5++) {
                    _loop_2(i_5);
                }
                return hand2;
            };
            Evaluator.highlight = function (hand) {
                var hand2 = hand.slice();
                var highlight = [];
                var min = 0;
                var max = 0;
                // 5 card suit melds
                for (var i_6 = 0; i_6 < hand2.length - 4; i_6++) {
                    var poss_meld = hand2.slice(i_6, i_6 + 5);
                    if (this.is_suit_meld(poss_meld)) {
                        min = i_6;
                        max = i_6 + 5;
                        highlight.push(poss_meld);
                        hand2 = Evaluator.clean(hand2, min, max, poss_meld);
                        i_6--;
                    }
                }
                // 4 card number meld
                for (var i_7 = 0; i_7 < hand2.length - 3; i_7++) {
                    var poss_meld = hand2.slice(i_7, i_7 + 4);
                    if (this.is_number_meld(poss_meld)) {
                        min = i_7;
                        max = i_7 + 4;
                        highlight.push(poss_meld);
                        hand2 = Evaluator.clean(hand2, min, max, poss_meld);
                        i_7--;
                    }
                }
                // 4 number meld
                for (var i_8 = 0; i_8 < hand2.length - 3; i_8++) {
                    var poss_meld = hand2.slice(i_8, i_8 + 4);
                    if (this.is_number_meld(poss_meld)) {
                        min = i_8;
                        max = i_8 + 4;
                        highlight.push(poss_meld);
                        hand2 = Evaluator.clean(hand2, min, max, poss_meld);
                        i_8--;
                    }
                }
                // 3 number meld
                for (var i_9 = 0; i_9 < hand2.length - 2; i_9++) {
                    var poss_meld = hand2.slice(i_9, i_9 + 3);
                    if (this.is_number_meld(poss_meld)) {
                        min = i_9;
                        max = i_9 + 3;
                        highlight.push(poss_meld);
                        hand2 = Evaluator.clean(hand2, min, max, poss_meld);
                        i_9--;
                    }
                }
                // 3 card suit meld
                for (var i_10 = 0; i_10 < hand2.length - 2; i_10++) {
                    var poss_meld = hand2.slice(i_10, i_10 + 3);
                    if (this.is_suit_meld(poss_meld)) {
                        min = i_10;
                        max = i_10 + 3;
                        highlight.push(poss_meld);
                        hand.splice(i_10, 3);
                        hand2 = Evaluator.clean(hand2, min, max, poss_meld);
                        i_10--;
                    }
                }
                return highlight;
            };
            Evaluator.verify = function (hand) {
                var _this = this;
                // first, check for 4 card melds of the same-numbered card
                var all_melds = [];
                hand = Evaluator.sort_by_value(hand);
                for (var i_11 = 0; i_11 < hand.length - 3; i_11++) {
                    var poss_meld = hand.slice(i_11, i_11 + 4);
                    if (this.is_number_meld(poss_meld)) {
                        all_melds.push(poss_meld);
                        // when a 4-card meld is found, also add all the possible 3-card melds which
                        // won't be picked up by the subsequent 3-card scan.
                        all_melds.push([poss_meld[0], poss_meld[1], poss_meld[3]]);
                        all_melds.push([poss_meld[0], poss_meld[2], poss_meld[3]]);
                    }
                }
                // next, check for 3 card melds of the same-numbered card
                for (var i_12 = 0; i_12 < hand.length - 2; i_12++) {
                    var poss_meld = hand.slice(i_12, i_12 + 3);
                    if (this.is_number_meld(poss_meld)) {
                        all_melds.push(poss_meld);
                    }
                }
                // next, check for 3 card melds in the same suit
                hand = this.sort_by_suit(hand);
                for (var i_13 = 0; i_13 < hand.length - 2; i_13++) {
                    var poss_meld = hand.slice(i_13, i_13 + 3);
                    if (this.is_suit_meld(poss_meld)) {
                        all_melds.push(poss_meld);
                    }
                }
                // next, 4 card melds
                for (var i_14 = 0; i_14 < hand.length - 3; i_14++) {
                    var poss_meld = hand.slice(i_14, i_14 + 4);
                    if (this.is_suit_meld(poss_meld)) {
                        all_melds.push(poss_meld);
                    }
                }
                // finally, 5 card melds
                for (var i_15 = 0; i_15 < hand.length - 4; i_15++) {
                    var poss_meld = hand.slice(i_15, i_15 + 5);
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
        VerifyCard_1.handArray = [];
        for (var i = 0; i < HandCardScript_1.default.handCards.length; i++) {
            VerifyCard_1.handArray[i] = HandCardScript_1.default.handCards[i].name;
        }
        // console.log(VerifyCard.handArray);
        // console.log(Evaluator.verify(VerifyCard.handArray));
        console.log(Evaluator.highlight(VerifyCard_1.handArray));
    };
    VerifyCard.handArray = [];
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
        