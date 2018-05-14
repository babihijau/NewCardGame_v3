"use strict";
cc._RF.push(module, '03a25OB4gVOtJ159CAlHdLB', 'DeckCardScript');
// Script/DeckCardScript.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Deck = /** @class */ (function (_super) {
    __extends(Deck, _super);
    function Deck() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.deck = [];
        return _this;
    }
    // tslint:disable-next-line:no-empty
    Deck.prototype.onLoad = function () {
    };
    Deck.deckCards = [];
    __decorate([
        property
    ], Deck.prototype, "deck", void 0);
    Deck = __decorate([
        ccclass
    ], Deck);
    return Deck;
}(cc.Component));
exports.default = Deck;

cc._RF.pop();