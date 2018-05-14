(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/DragCardScript.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f4ee5kAn2FDWq5JKNFEYo7w', 'DragCardScript', __filename);
// Script/DragCardScript.ts

Object.defineProperty(exports, "__esModule", { value: true });
var DiscardedCardScript_1 = require("./DiscardedCardScript");
var HandCardScript_1 = require("./HandCardScript");
var DeckCardScript_1 = require("./DeckCardScript");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var DragCard = /** @class */ (function (_super) {
    __extends(DragCard, _super);
    function DragCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._cardInDeck = false;
        _this._cardInHand = false;
        _this._cardInDiscard = false;
        _this.parent = null;
        _this.propagate = false;
        _this._down = false;
        _this.deckLayout = null;
        _this.handLayout = null;
        _this.discardLayout = null;
        _this.previousCardIn = null;
        return _this;
    }
    DragCard_1 = DragCard;
    DragCard.prototype.onLoad = function () {
        var _this = this;
        // get the parent node which is the TableLayout
        this.parent = this.node.parent;
        // get layout nodes
        this.deckLayout = cc.find("DeckLayout", this.parent.parent);
        this.handLayout = cc.find("HandLayout", this.parent.parent);
        this.discardLayout = cc.find("DiscardLayout", this.parent.parent);
        // initialize mouse x and y value
        var mouseOriX = 0;
        var mouseOriY = 0;
        // mouse event listener for mouse riht click is pressed down
        this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            // cc.log("Drag started ...");
            _this.node.opacity = 180;
            _this._down = true;
            // store the original position of node
            DragCard_1.originalX = _this.node.x;
            DragCard_1.originalY = _this.node.y;
            // store the original mouse X and Y when mouse is fist pressed
            mouseOriX = event.getLocationX();
            mouseOriY = event.getLocationY();
            // makes the card selected appear to front
            _this.node.setLocalZOrder(_this.node.getLocalZOrder() + 100);
            _this.parent.sortAllChildren();
            // check if this card exist in deck cards
            if (DeckCardScript_1.default.deckCards.lastIndexOf(_this.node) >= 0) {
                // set this card is in deck and set current card index
                _this._cardInDeck = true;
                DragCard_1.currentDeckIndex = DeckCardScript_1.default.deckCards.lastIndexOf(_this.node);
                _this.previousCardIn = "Deck";
            }
            // check if this card exist in hand cards
            if (HandCardScript_1.default.handCards.lastIndexOf(_this.node) >= 0) {
                // set this card is in hand and set current card index
                _this._cardInHand = true;
                DragCard_1.currentHandIndex = HandCardScript_1.default.handCards.lastIndexOf(_this.node);
                _this.previousCardIn = "Hand";
            }
            // check if this card exist in discarded cards
            if (DiscardedCardScript_1.default.discardedCards.lastIndexOf(_this.node) >= 0) {
                // set this card is in discarded and set current card index
                _this._cardInDiscard = true;
                DragCard_1.currentDiscardIndex = DiscardedCardScript_1.default.discardedCards.lastIndexOf(_this.node);
                _this.previousCardIn = "Discarded";
            }
            cc.log(_this.previousCardIn);
            if (!_this.propagate) {
                event.stopPropagation();
            }
        }, this);
        // mouse event listener for mouse is moving
        this.parent.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
            if (!_this._down) {
                event.stopPropagation();
                return;
            }
            // set opacity of node
            _this.node.opacity = 180;
            // this is to track the mouse movement position
            var sumX = DragCard_1.originalX + event.getLocationX() - mouseOriX;
            var sumY = DragCard_1.originalY + event.getLocationY() - mouseOriY;
            _this.node.x = sumX;
            _this.node.y = sumY;
            // if card is moved to hand area
            if (_this._cardInHand === false && _this.node.y < _this.handLayout.y + _this.handLayout.height / 2) {
                _this.setCurrentIndex();
                _this._cardInHand = true;
                _this._cardInDeck = false;
                _this._cardInDiscard = false;
                // this insert current node into hand cards,
                // which represents the hand area in table.
                HandCardScript_1.default.handCards.splice(DragCard_1.currentHandIndex, 0, _this.node);
                _this.onSortHand();
                _this.node.setLocalZOrder(_this.node.getLocalZOrder() + 100);
                _this.node.stopAllActions();
                if (_this.node.rotation !== 0) {
                    _this.node.runAction(cc.rotateTo(0.1, 0));
                }
                var remove = DeckCardScript_1.default.deckCards.lastIndexOf(_this.node);
                if (remove >= 0) {
                    DeckCardScript_1.default.deckCards.splice(remove, 1);
                    _this.onSortTable();
                }
                remove = DiscardedCardScript_1.default.discardedCards.lastIndexOf(_this.node);
                if (remove >= 0) {
                    DiscardedCardScript_1.default.discardedCards.splice(remove, 1);
                    _this.onSortTable();
                }
            }
            if (_this._cardInHand === true && _this.node.y < (_this.handLayout.y + _this.handLayout.height / 2)) {
                _this.onMoveCard();
            }
            else {
                remove = HandCardScript_1.default.handCards.lastIndexOf(_this.node);
                if (remove >= 0) {
                    HandCardScript_1.default.handCards.splice(remove, 1);
                    _this._cardInHand = false;
                    _this.previousCardIn = "Hand";
                    _this.onSortHand();
                    DragCard_1.countLeft = 0;
                    DragCard_1.countRight = 0;
                    DragCard_1.bufferX = 0;
                }
                if (_this._cardInDiscard === true) {
                    var check = DiscardedCardScript_1.default.discardedCards.indexOf(_this.node);
                    if (check < 0) {
                        DiscardedCardScript_1.default.discardedCards.push(_this.node);
                        // this.node.rotation = Math.floor(Math.random()*360);
                        // this.node.runAction(cc.rotateTo(0.1,Math.floor(Math.random()*360)));
                    }
                }
            }
            if (!_this.propagate) {
                event.stopPropagation();
            }
        }, this);
        // mouse event listener for mouse right click is released
        this.node.on(cc.Node.EventType.MOUSE_UP, function (event) {
            if (!_this._down) {
                event.stopPropagation();
                return;
            }
            // cc.log("Drag done ...");
            _this.node.opacity = 255;
            _this._down = false;
            // if the card is brought up to discard area
            if (_this.node.x > (_this.discardLayout.x - _this.discardLayout.width / 2)
                && _this.node.y > (_this.discardLayout.y - _this.discardLayout.height / 2)) {
                _this._cardInDeck = false;
                _this._cardInHand = false;
                _this.onDiscard();
            }
            else {
                // if this card brought to the hand area
                if (_this.node.y < _this.handLayout.y + _this.handLayout.height / 2) {
                    // if card is not in hand, insert card
                    if (_this._cardInHand !== true) {
                        _this.insertHand();
                    }
                    // if card is in hand and no card movement in hand, sort.
                    if (_this._cardInHand === true && DragCard_1.countLeft === 0 && DragCard_1.countRight === 0) {
                        _this.onSortHand();
                    }
                }
                else {
                    // animate card movement to their original position.
                    if (_this.previousCardIn === "Hand") {
                        if (DragCard_1.previousCountLeft === 0 && DragCard_1.previousCountRight === 0) {
                            HandCardScript_1.default.handCards.splice(DragCard_1.currentHandIndex, 0, _this.node);
                        }
                        if (DragCard_1.previousCountRight > 0) {
                            HandCardScript_1.default.handCards.splice(DragCard_1.currentHandIndex + DragCard_1.previousCountRight, 0, _this.node);
                        }
                        if (DragCard_1.previousCountLeft > 0) {
                            HandCardScript_1.default.handCards.splice(DragCard_1.currentHandIndex - DragCard_1.previousCountLeft, 0, _this.node);
                        }
                        _this._cardInHand = true;
                        _this._cardInDeck = false;
                        _this._cardInDiscard = false;
                    }
                    if (_this.previousCardIn === "Deck") {
                        _this.node.runAction(cc.moveTo(0.1, cc.p(_this.deckLayout.x, _this.deckLayout.y)));
                        _this._cardInHand = false;
                        _this._cardInDeck = true;
                        _this._cardInDiscard = false;
                    }
                    if (_this.previousCardIn === "Discarded") {
                        var xMoveTo = Math.floor(Math.random() * ((_this.discardLayout.x + _this.node.width / 3)
                            - (_this.discardLayout.x - _this.node.width / 3) + 1)) + (_this.discardLayout.x - _this.node.width / 3);
                        // set random y point in middle of discard area
                        var yMoveTo = Math.floor(Math.random() * ((_this.discardLayout.y + _this.node.height / 3)
                            - (_this.discardLayout.y - _this.node.height / 3) + 1)) + (_this.discardLayout.y - _this.node.height / 3);
                        // run animation rotate and moveTo
                        _this.node.runAction(cc.spawn(cc.rotateTo(0.2, xMoveTo * yMoveTo % 360), cc.moveTo(0.2, xMoveTo, yMoveTo)));
                        _this._cardInHand = false;
                        _this._cardInDeck = false;
                        _this._cardInDiscard = true;
                    }
                    // on release, card localZOrder goes to original before the +100
                    _this.node.setLocalZOrder(_this.node.getLocalZOrder() - 100);
                    _this.onSortHand();
                }
            }
            // this node will copy the current node for swapping of the card
            var temp = _this.node;
            // to find out if the position of the card has changed
            for (var i = 1; i < HandCardScript_1.default.handCards.length; i++) {
                if (DragCard_1.countLeft === i && _this._cardInHand === true) {
                    // remove the current card from array and re-adding it on the new postion
                    HandCardScript_1.default.handCards.splice(DragCard_1.currentHandIndex, 1);
                    HandCardScript_1.default.handCards.splice(DragCard_1.currentHandIndex - DragCard_1.countLeft, 0, temp);
                    _this.onSortHand();
                }
                if (DragCard_1.countRight === i && _this._cardInHand === true) {
                    // remove the current card from array and re-adding it on the new postion
                    HandCardScript_1.default.handCards.splice(DragCard_1.currentHandIndex, 1);
                    HandCardScript_1.default.handCards.splice(DragCard_1.currentHandIndex + DragCard_1.countRight, 0, temp);
                    _this.onSortHand();
                }
            }
            // reset counter and sort table
            DragCard_1.countLeft = 0;
            DragCard_1.countRight = 0;
            DragCard_1.bufferX = 0;
            _this.onSortTable();
            cc.log("Discarded \n", DiscardedCardScript_1.default.discardedCards);
            cc.log("Hand \n", HandCardScript_1.default.handCards);
            cc.log("Deck \n", DeckCardScript_1.default.deckCards);
        }, this);
    };
    DragCard.prototype.onDiscard = function () {
        // check if this node exists in discardArray, returns value
        var remove = DiscardedCardScript_1.default.discardedCards.lastIndexOf(this.node);
        // if duplicates is found in the discardArray, it returns positive value,
        // this removes duplicates
        if (remove >= 0) {
            DiscardedCardScript_1.default.discardedCards.splice(remove, 1);
        }
        // this insert current node into discard cards array,
        DiscardedCardScript_1.default.discardedCards.push(this.node);
        // position this node on the discard area on layout before animation
        //   let xValue: number = Math.floor(Math.random() * ((this.discardLayout.x + this.discardLayout.width / 2) -
        //       (this.discardLayout.x - this.discardLayout.width) + 1)) + (this.discardLayout.x - this.discardLayout.width);
        //   let yStartPoint: number = Math.floor(Math.random() * ((this.discardLayout.y + this.discardLayout.height / 2) -
        //       (this.discardLayout.y - this.discardLayout.height) + 1)) + (this.discardLayout.y - this.discardLayout.height);
        //   // randoms 0 or 1, to choose between X = 0, or Y = 0 for the purpose of starting node point before spawn animation.
        //   let eitherXorY: number = Math.round(cc.random0To1());
        //   // choose starting point for node
        //   if (eitherXorY === 0) {
        //       this.node.position = new cc.Vec2(xValue, (this.discardLayout.y - this.discardLayout.height));
        //   } else {
        //       this.node.position = new cc.Vec2((this.discardLayout.x - this.discardLayout.width), yStartPoint);
        //   }
        // set random x point in middle of discard area
        var xMoveTo = Math.floor(Math.random() * ((this.discardLayout.x + this.node.width / 3)
            - (this.discardLayout.x - this.node.width / 3) + 1)) + (this.discardLayout.x - this.node.width / 3);
        // set random y point in middle of discard area
        var yMoveTo = Math.floor(Math.random() * ((this.discardLayout.y + this.node.height / 3)
            - (this.discardLayout.y - this.node.height / 3) + 1)) + (this.discardLayout.y - this.node.height / 3);
        // run animation rotate and moveTo
        this.node.runAction(cc.spawn(cc.rotateTo(0.2, xMoveTo * yMoveTo % 360), cc.moveTo(0.2, xMoveTo, yMoveTo)));
        // if this card discarded from hand,
        // remove this card from deck cards
        remove = DeckCardScript_1.default.deckCards.lastIndexOf(this.node);
        if (remove >= 0) {
            DeckCardScript_1.default.deckCards.splice(remove, 1);
        }
        // if this card discarded from hand,
        // remove this card from hand cards
        remove = HandCardScript_1.default.handCards.lastIndexOf(this.node);
        if (remove >= 0) {
            HandCardScript_1.default.handCards.splice(remove, 1);
        }
        // assign localZOrder of every array member to its corresponding index
        for (var i = 0; i < DiscardedCardScript_1.default.discardedCards.length; i++) {
            DiscardedCardScript_1.default.discardedCards[i].setLocalZOrder(i);
        }
        // make TableLayout to sort its childrens
        this.onSortHand();
        this.onSortTable();
    };
    DragCard.prototype.insertHand = function () {
        // check if this node exists in hand cards, returns negative value if not found
        var remove = HandCardScript_1.default.handCards.lastIndexOf(this.node);
        if (remove < 0) {
            // this insert current node into hand cards,
            // which represents the hand area in table.
            HandCardScript_1.default.handCards.push(this.node);
        }
        // if this item removed from discardArray,
        // remove this item from discardArray and sort discardArray
        remove = DiscardedCardScript_1.default.discardedCards.lastIndexOf(this.node);
        if (remove >= 0) {
            DiscardedCardScript_1.default.discardedCards.splice(remove, 1);
        }
        // call the hand sorting function
        this.onSortHand();
    };
    DragCard.prototype.onSortHand = function () {
        // gets the absolute maximum point for the node to be in hand layout,
        // negative means max point to the left, positive means max point to the right
        var maxPoint = this.handLayout.width / 2;
        var cardsInHand = HandCardScript_1.default.handCards.length;
        // firstIndex will hold X position for the first item in hand cards
        var firstIndex = 0;
        // spacing will hold the spacing value between all other item in hand cards
        var spacing = 0;
        // to get the first index x position
        firstIndex = (maxPoint / cardsInHand) - maxPoint;
        // to get spacing between cards
        spacing = (maxPoint / cardsInHand) + (maxPoint / cardsInHand);
        // this ensure cards goes side by side until there too much only then it will overlapped
        if (spacing > this.node.width) {
            spacing = this.node.width;
            // likewise, the spacing have to be adjusted,
            // this will indent the first card to the correct place,
            // it moves half of this node width with every card added to array
            // with exception to the first card
            firstIndex = (this.node.width / 2 - (cardsInHand * this.node.width / 2));
        }
        DragCard_1.currentHandSpacing = spacing;
        // this sort the hand with appropriate spacing given number of cards in hand
        for (var i = 0; i < cardsInHand; i++) {
            HandCardScript_1.default.handCards[i].stopAllActions();
            HandCardScript_1.default.handCards[i].runAction(cc.spawn(cc.rotateTo(0.1, 0), cc.moveTo(0.1, cc.p(firstIndex + (spacing * i), this.handLayout.y))));
            HandCardScript_1.default.handCards[i].setLocalZOrder(i);
        }
        // sort all nodes
        this.onSortTable();
    };
    DragCard.prototype.onMoveCard = function () {
        var i = 0;
        // animation to move left or right
        var moveRight = cc.moveBy(0.1, cc.p(DragCard_1.currentHandSpacing, 0));
        var moveLeft = cc.moveBy(0.1, cc.p(-DragCard_1.currentHandSpacing, 0));
        var adjustedOriginalX = DragCard_1.originalX + DragCard_1.bufferX;
        for (i = 0; i <= HandCardScript_1.default.handCards.length - 2; i++) {
            // if card moved one spacing to the left, move the previous card to the right
            if (this.node.x < adjustedOriginalX - (DragCard_1.currentHandSpacing * (i + 1))
                && this.node.x > adjustedOriginalX - (DragCard_1.currentHandSpacing * (i + 2))) {
                if (DragCard_1.countLeft === i) {
                    // prevent conditional statement goes out of array bounds
                    if (DragCard_1.currentHandIndex - (i + 1) >= 0) {
                        HandCardScript_1.default.handCards[DragCard_1.currentHandIndex - (i + 1)].runAction(moveRight.clone());
                        // clone so that each animation is run independently
                        DragCard_1.countLeft++;
                    }
                }
            }
            // if the card moved back to the right, move the next card to the left
            if (DragCard_1.countLeft === (i + 1) && this.node.x > adjustedOriginalX - (DragCard_1.currentHandSpacing * i)) {
                HandCardScript_1.default.handCards[DragCard_1.currentHandIndex - (i + 1)].runAction(moveLeft.clone());
                DragCard_1.countLeft--;
            }
        }
        for (i = 0; i <= HandCardScript_1.default.handCards.length - 2; i++) {
            // if card moved one spacing to the right, move the next card to the left
            if (this.node.x > adjustedOriginalX + (DragCard_1.currentHandSpacing * (i + 1))
                && this.node.x < adjustedOriginalX + (DragCard_1.currentHandSpacing * (i + 2))) {
                if (DragCard_1.countRight === i) {
                    // prevent conditional statement goes out of array bounds
                    if (DragCard_1.currentHandIndex + (i + 1) < HandCardScript_1.default.handCards.length) {
                        // if (Hand.handCards[.currentHandIndex + (i + 1)].runAction(moveLeft).isDone() !== true) {
                        HandCardScript_1.default.handCards[DragCard_1.currentHandIndex + (i + 1)].runAction(moveLeft.clone());
                        DragCard_1.countRight++;
                        // }DragCard
                    }
                }
            }
            // if the card moved back to the left, move the previous card to the right
            if (DragCard_1.countRight === (i + 1) && this.node.x < adjustedOriginalX + (DragCard_1.currentHandSpacing * i)) {
                // if (Hand.handCards[DragCard.currentHandIndex + (i + 1)].runAction(moveRight).isDone() !== true) {
                HandCardScript_1.default.handCards[DragCard_1.currentHandIndex + (i + 1)].runAction(moveRight.clone());
                DragCard_1.countRight--;
                // }
            }
        }
        DragCard_1.previousCountLeft = DragCard_1.countLeft;
        DragCard_1.previousCountRight = DragCard_1.countRight;
        this.onSortTable();
    };
    DragCard.prototype.setCurrentIndex = function () {
        var maxPoint = this.handLayout.width / 2;
        // this function is called before adding current card to Hand.handCards array, hence the + 1
        var cardsInHand = HandCardScript_1.default.handCards.length + 1;
        var firstIndex = 0;
        var spacing = 0;
        firstIndex = (maxPoint / cardsInHand) - maxPoint;
        spacing = (maxPoint / cardsInHand) + (maxPoint / cardsInHand);
        if (spacing > this.node.width) {
            spacing = this.node.width;
            firstIndex = (this.node.width / 2 - (cardsInHand * this.node.width / 2));
        }
        DragCard_1.currentHandSpacing = spacing;
        if (this.node.x < firstIndex) {
            DragCard_1.currentHandIndex = 0;
            DragCard_1.bufferX = firstIndex - DragCard_1.originalX;
            if (spacing < this.node.width) {
                DragCard_1.bufferX = firstIndex - DragCard_1.originalX;
            }
        }
        for (var i = 0; i < HandCardScript_1.default.handCards.length; i++) {
            if (this.node.x > firstIndex + (DragCard_1.currentHandSpacing * (i))) {
                DragCard_1.currentHandIndex = i + 1;
                DragCard_1.bufferX = firstIndex - DragCard_1.originalX + (spacing * (i + 1));
                if (spacing < this.node.width) {
                    DragCard_1.bufferX = (firstIndex - DragCard_1.originalX) + (spacing * (i + 1));
                }
            }
        }
    };
    DragCard.prototype.onSortTable = function () {
        // call TableLayout to reorder child with their localZorder value
        this.parent.sortAllChildren();
    };
    // this will count the movement of the card in hand area
    DragCard.countLeft = 0;
    DragCard.countRight = 0;
    // literally a retarded walk-around bcos i write bad codes :(
    // will figure this out
    DragCard.previousCountLeft = 0;
    DragCard.previousCountRight = 0;
    // this will hold the updated spacing value
    DragCard.currentHandSpacing = 0;
    // this will hold the current card index in deck cards
    DragCard.currentDeckIndex = 0;
    // this will hold the current card index in hand cards
    DragCard.currentHandIndex = 0;
    // this will hold the current card index in discarded cards
    DragCard.currentDiscardIndex = 0;
    // this save the x value once the mouse is pressed
    DragCard.originalX = 0;
    // this save the y value once the mouse is pressed
    DragCard.originalY = 0;
    // this hold a buffer value needed for card moving purposes
    DragCard.bufferX = 0;
    DragCard = DragCard_1 = __decorate([
        ccclass
    ], DragCard);
    return DragCard;
    var DragCard_1;
}(cc.Component));
exports.default = DragCard;

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
        //# sourceMappingURL=DragCardScript.js.map
        