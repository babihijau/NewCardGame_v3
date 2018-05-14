(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/DiscardedCardScript.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '393e5BIqQtB96PgTW8KgzOr', 'DiscardedCardScript', __filename);
// Script/DiscardedCardScript.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Discarded = /** @class */ (function (_super) {
    __extends(Discarded, _super);
    function Discarded() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // tslint:disable-next-line:no-empty
    Discarded.prototype.onLoad = function () {
    };
    Discarded.discardedCards = [];
    Discarded = __decorate([
        ccclass
    ], Discarded);
    return Discarded;
}(cc.Component));
exports.default = Discarded;

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
        //# sourceMappingURL=DiscardedCardScript.js.map
        