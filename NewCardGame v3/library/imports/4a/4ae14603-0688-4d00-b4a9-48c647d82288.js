"use strict";
cc._RF.push(module, '4ae14YDBohNALSpSMZH2CKI', 'HandCardScript');
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