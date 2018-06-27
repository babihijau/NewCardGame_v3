"use strict";
cc._RF.push(module, '8187e4nEj5DNZNQWOz/ul7V', 'PrefabCardScript');
// Script/PrefabCardScript.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var PrefabCard = /** @class */ (function (_super) {
    __extends(PrefabCard, _super);
    function PrefabCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.spriteList = [];
        _this.sprite = null;
        return _this;
    }
    PrefabCard_1 = PrefabCard;
    PrefabCard.prototype.onLoad = function () {
        for (var i = 0; i < 52; i++) {
            PrefabCard_1.num[i] = i;
        }
        var id = this.genRandom();
        // var sprite: cc.Sprite = this.getComponent(cc.Sprite);
        // sprite.spriteFrame = this.spriteList[id];
        this.sprite.spriteFrame = this.spriteList[id];
    };
    // should be randomly generated, ill get to that later.. eventually
    PrefabCard.prototype.genRandom = function () {
        if (PrefabCard_1.count === 51) {
            PrefabCard_1.count = -1;
        }
        PrefabCard_1.count++;
        return PrefabCard_1.num[PrefabCard_1.count];
    };
    PrefabCard.num = [];
    PrefabCard.count = -1;
    __decorate([
        property(cc.SpriteFrame)
    ], PrefabCard.prototype, "spriteList", void 0);
    __decorate([
        property(cc.Sprite)
    ], PrefabCard.prototype, "sprite", void 0);
    PrefabCard = PrefabCard_1 = __decorate([
        ccclass
    ], PrefabCard);
    return PrefabCard;
    var PrefabCard_1;
}(cc.Component));
exports.default = PrefabCard;

cc._RF.pop();