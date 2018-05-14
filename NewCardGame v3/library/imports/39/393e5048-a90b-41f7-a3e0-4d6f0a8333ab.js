"use strict";
cc._RF.push(module, '393e5BIqQtB96PgTW8KgzOr', 'DiscardedCardScript');
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