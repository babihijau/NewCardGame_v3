(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/CreateDeckScript.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '41e6byM9W9FMIsvNDH8bQ2p', 'CreateDeckScript', __filename);
// Script/CreateDeckScript.ts

Object.defineProperty(exports, "__esModule", { value: true });
var DiscardedCardScript_1 = require("./DiscardedCardScript");
var HandCardScript_1 = require("./HandCardScript");
var DeckCardScript_1 = require("./DeckCardScript");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var CreateDeck = /** @class */ (function (_super) {
    __extends(CreateDeck, _super);
    function CreateDeck() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.prefab = null;
        _this.root = null;
        _this.position1 = cc.p(0, 0);
        _this.num = 0;
        _this.num2 = 52;
        return _this;
        /* spawnCard ():number {
            if (this.num >= this.num2) {
                this.clearRepeater();
                return;
            }
        }
    
        clearRepeater():void {
            this.unschedule(this.spawnCard);
        } */
    }
    CreateDeck.prototype.onLoad = function () {
        // this.onCreateDeck();
    };
    CreateDeck.prototype.onCreateDeck = function () {
        this.root.destroyAllChildren();
        DeckCardScript_1.default.deckCards = [];
        DiscardedCardScript_1.default.discardedCards = [];
        HandCardScript_1.default.handCards = [];
        var self = this;
        for (var i = 0; i < 52; i++) {
            var card = cc.instantiate(this.prefab);
            card.parent = this.root;
            card.position = cc.find("DeckLayout", this.root.parent).position;
            DeckCardScript_1.default.deckCards[i] = card;
            card.name = DeckCardScript_1.default.deckCards[i].getComponent(cc.Sprite).spriteFrame.name;
            cc.log(DeckCardScript_1.default.deckCards[i].name);
        }
    };
    CreateDeck.cardArray = [];
    __decorate([
        property(cc.Prefab)
    ], CreateDeck.prototype, "prefab", void 0);
    __decorate([
        property(cc.Node)
    ], CreateDeck.prototype, "root", void 0);
    CreateDeck = __decorate([
        ccclass
    ], CreateDeck);
    return CreateDeck;
}(cc.Component));
exports.default = CreateDeck;

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
        //# sourceMappingURL=CreateDeckScript.js.map
        