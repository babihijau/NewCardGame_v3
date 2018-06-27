"use strict";
cc._RF.push(module, '6eb51EL/slOvZ8TfB8qBKKh', 'DealScript');
// Script/DealScript.ts

Object.defineProperty(exports, "__esModule", { value: true });
var DragCardScript_1 = require("./DragCardScript");
var HandCardScript_1 = require("./HandCardScript");
var DeckCardScript_1 = require("./DeckCardScript");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Deal = /** @class */ (function (_super) {
    __extends(Deal, _super);
    function Deal() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.DealButton = null;
        _this.CreateButton = null;
        _this.cardsToDeal = 0;
        _this.spawnInterval = 0;
        _this.handLayout = null;
        return _this;
    }
    Deal_1 = Deal;
    Deal.prototype.onLoad = function () {
        Deal_1.spawnCount = 0;
    };
    Deal.prototype.onDealCard = function () {
        var _this = this;
        this.schedule(this.onDealCard, this.spawnInterval);
        if (Deal_1.spawnCount >= this.cardsToDeal) {
            this.clearRepeater();
            return;
        }
        DeckCardScript_1.default.deckCards[DeckCardScript_1.default.deckCards.length - 1].runAction(cc.moveBy(0.2, cc.p(50, 50)));
        HandCardScript_1.default.handCards.push(DeckCardScript_1.default.deckCards[DeckCardScript_1.default.deckCards.length - 1]);
        var maxPoint = this.handLayout.width / 2;
        var cardsInHand = HandCardScript_1.default.handCards.length;
        var firstIndex = 0;
        var spacing = 0;
        firstIndex = (maxPoint / cardsInHand) - maxPoint;
        spacing = (maxPoint / cardsInHand) + (maxPoint / cardsInHand);
        if (spacing > 78) {
            spacing = 78;
            firstIndex = (78 / 2 - (cardsInHand * 78 / 2));
        }
        DragCardScript_1.default.currentHandSpacing = spacing;
        var _loop_1 = function () {
            var last = i === cardsInHand;
            HandCardScript_1.default.handCards[i].stopAllActions();
            HandCardScript_1.default.handCards[i].runAction(cc.spawn(cc.rotateTo(0.1, 0), cc.sequence([cc.moveTo(0.1, cc.p(firstIndex + (spacing * i), this_1.handLayout.y)), cc.callFunc(function () {
                    if (last) {
                        _this.DealButton.interactable = true;
                    }
                })])));
            HandCardScript_1.default.handCards[i].setLocalZOrder(i);
        };
        var this_1 = this;
        for (var i = 0; i < cardsInHand; i++) {
            _loop_1();
        }
        DeckCardScript_1.default.deckCards.pop();
        Deal_1.spawnCount++;
        Deal_1.interactableButton = false;
        if (Deal_1.spawnCount > 0 && Deal_1.spawnCount < 10) {
            this.CreateButton.interactable = false;
        }
        else {
            this.CreateButton.interactable = true;
        }
    };
    Deal.prototype.clearRepeater = function () {
        this.unschedule(this.onDealCard);
    };
    Deal.spawnCount = 0;
    Deal.interactableButton = false;
    __decorate([
        property(cc.Button)
    ], Deal.prototype, "DealButton", void 0);
    __decorate([
        property(cc.Button)
    ], Deal.prototype, "CreateButton", void 0);
    __decorate([
        property
    ], Deal.prototype, "cardsToDeal", void 0);
    __decorate([
        property
    ], Deal.prototype, "spawnInterval", void 0);
    __decorate([
        property(cc.Node)
    ], Deal.prototype, "handLayout", void 0);
    Deal = Deal_1 = __decorate([
        ccclass
    ], Deal);
    return Deal;
    var Deal_1;
}(cc.Component));
exports.default = Deal;

cc._RF.pop();