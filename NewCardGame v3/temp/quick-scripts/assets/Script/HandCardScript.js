(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/HandCardScript.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4ae14YDBohNALSpSMZH2CKI', 'HandCardScript', __filename);
// Script/HandCardScript.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Hand = /** @class */ (function (_super) {
    __extends(Hand, _super);
    function Hand() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.hand = [];
        return _this;
    }
    // tslint:disable-next-line:no-empty
    Hand.prototype.onLoad = function () {
    };
    Hand.handCards = [];
    __decorate([
        property
    ], Hand.prototype, "hand", void 0);
    Hand = __decorate([
        ccclass
    ], Hand);
    return Hand;
}(cc.Component));
exports.default = Hand;

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
        //# sourceMappingURL=HandCardScript.js.map
        