(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/PrefabCardScript.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8187e4nEj5DNZNQWOz/ul7V', 'PrefabCardScript', __filename);
// Script/PrefabCardScript.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var PrefabCard = /** @class */ (function (_super) {
    __extends(PrefabCard, _super);
    function PrefabCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.spriteList = [];
        return _this;
    }
    PrefabCard_1 = PrefabCard;
    PrefabCard.prototype.onLoad = function () {
        for (var i = 0; i < 52; i++) {
            PrefabCard_1.num[i] = i;
        }
        var id = this.genRandom();
        var sprite = this.getComponent(cc.Sprite);
        sprite.spriteFrame = this.spriteList[id];
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
    PrefabCard = PrefabCard_1 = __decorate([
        ccclass
    ], PrefabCard);
    return PrefabCard;
    var PrefabCard_1;
}(cc.Component));
exports.default = PrefabCard;

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
        //# sourceMappingURL=PrefabCardScript.js.map
        