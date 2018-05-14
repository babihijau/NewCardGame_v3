import Discarded from "./DiscardedCardScript";
import Hand from "./HandCardScript";
import Deck from "./DeckCardScript";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragCard extends cc.Component {

    _cardInDeck: boolean = false;
    _cardInHand: boolean = false;
    _cardInDiscard: boolean = false;
    parent: cc.Node = null;
    propagate: boolean = false;
    _down: boolean = false;
    deckLayout: cc.Node = null;
    handLayout: cc.Node = null;
    discardLayout: cc.Node = null;
    previousCardIn: string = null;

    // this will count the movement of the card in hand area
    public static countLeft: number = 0;
    public static countRight: number = 0;

    // literally a retarded walk-around bcos i write bad codes :(
    // will figure this out
    public static previousCountLeft: number = 0;
    public static previousCountRight: number = 0;

    // this will hold the updated spacing value
    public static currentHandSpacing: number = 0;

    // this will hold the current card index in deck cards
    public static currentDeckIndex: number = 0;

    // this will hold the current card index in hand cards
    public static currentHandIndex: number = 0;

    // this will hold the current card index in discarded cards
    public static currentDiscardIndex: number = 0;

    // this save the x value once the mouse is pressed
    public static originalX: number = 0;
    // this save the y value once the mouse is pressed
    public static originalY: number = 0;
    // this hold a buffer value needed for card moving purposes
    public static bufferX: number = 0;

    onLoad(): void {

        // get the parent node which is the TableLayout
        this.parent = this.node.parent;

        // get layout nodes
        this.deckLayout = cc.find("DeckLayout", this.parent.parent);
        this.handLayout = cc.find("HandLayout", this.parent.parent);
        this.discardLayout = cc.find("DiscardLayout", this.parent.parent);

        // initialize mouse x and y value
        var mouseOriX: number = 0;
        var mouseOriY: number = 0;

        // mouse event listener for mouse riht click is pressed down
        this.node.on(cc.Node.EventType.MOUSE_DOWN, (event) => {
            // cc.log("Drag started ...");
            this.node.opacity = 180;
            this._down = true;

            // store the original position of node
            DragCard.originalX = this.node.x;
            DragCard.originalY = this.node.y;

            // store the original mouse X and Y when mouse is fist pressed
            mouseOriX = event.getLocationX();
            mouseOriY = event.getLocationY();

            // makes the card selected appear to front
            this.node.setLocalZOrder(this.node.getLocalZOrder() + 100);
            this.parent.sortAllChildren();

            // check if this card exist in deck cards
            if (Deck.deckCards.lastIndexOf(this.node) >= 0) {
                // set this card is in deck and set current card index
                this._cardInDeck = true;
                DragCard.currentDeckIndex = Deck.deckCards.lastIndexOf(this.node);
                this.previousCardIn = "Deck";
            }

            // check if this card exist in hand cards
            if (Hand.handCards.lastIndexOf(this.node) >= 0) {
                // set this card is in hand and set current card index
                this._cardInHand = true;
                DragCard.currentHandIndex = Hand.handCards.lastIndexOf(this.node);
                this.previousCardIn = "Hand";
            }

            // check if this card exist in discarded cards
            if (Discarded.discardedCards.lastIndexOf(this.node) >= 0) {
                // set this card is in discarded and set current card index
                this._cardInDiscard = true;
                DragCard.currentDiscardIndex = Discarded.discardedCards.lastIndexOf(this.node);
                this.previousCardIn = "Discarded";
            }
            cc.log(this.previousCardIn);

            if (!this.propagate) {
                event.stopPropagation();
            }


        }, this);

        // mouse event listener for mouse is moving
        this.parent.on(cc.Node.EventType.MOUSE_MOVE, (event) => {

            if (!this._down) {
                event.stopPropagation();
                return;
            }
            // set opacity of node
            this.node.opacity = 180;
            // this is to track the mouse movement position
            var sumX: number = DragCard.originalX + event.getLocationX() - mouseOriX;
            var sumY: number = DragCard.originalY + event.getLocationY() - mouseOriY;
            this.node.x = sumX;
            this.node.y = sumY;

            // if card is moved to hand area
            if (this._cardInHand === false && this.node.y < this.handLayout.y + this.handLayout.height / 2) {

                this.setCurrentIndex();
                this._cardInHand = true;
                this._cardInDeck = false;
                this._cardInDiscard = false;
                // this insert current node into hand cards,
                // which represents the hand area in table.
                Hand.handCards.splice(DragCard.currentHandIndex, 0, this.node);
                this.onSortHand();
                this.node.setLocalZOrder(this.node.getLocalZOrder() + 100);
                this.node.stopAllActions();
                if (this.node.rotation !== 0) {
                    this.node.runAction(cc.rotateTo(0.1, 0));
                }

                var remove: number = Deck.deckCards.lastIndexOf(this.node);

                if (remove >= 0) {
                    Deck.deckCards.splice(remove, 1);
                    this.onSortTable();
                }

                remove = Discarded.discardedCards.lastIndexOf(this.node);

                if (remove >= 0) {
                    Discarded.discardedCards.splice(remove, 1);
                    this.onSortTable();
                }

            }

            if (this._cardInHand === true && this.node.y < (this.handLayout.y + this.handLayout.height / 2)) {

                this.onMoveCard();

            } else {

                remove = Hand.handCards.lastIndexOf(this.node);

                if (remove >= 0) {
                    Hand.handCards.splice(remove, 1);
                    this._cardInHand = false;
                    this.previousCardIn = "Hand";
                    this.onSortHand();
                    DragCard.countLeft = 0;
                    DragCard.countRight = 0;
                    DragCard.bufferX = 0;
                }

                if (this._cardInDiscard === true) {
                    var check: number = Discarded.discardedCards.indexOf(this.node);
                    if (check < 0) {
                        Discarded.discardedCards.push(this.node);
                        // this.node.rotation = Math.floor(Math.random()*360);
                        // this.node.runAction(cc.rotateTo(0.1,Math.floor(Math.random()*360)));
                    }
                }
            }

            if (!this.propagate) {
                event.stopPropagation();
            }
        }, this);

        // mouse event listener for mouse right click is released
        this.node.on(cc.Node.EventType.MOUSE_UP, (event) => {

            if (!this._down) {
                event.stopPropagation();
                return;
            }
            // cc.log("Drag done ...");
            this.node.opacity = 255;
            this._down = false;

            // if the card is brought up to discard area
            if (this.node.x > (this.discardLayout.x - this.discardLayout.width / 2)
                && this.node.y > (this.discardLayout.y - this.discardLayout.height / 2)) {
                this._cardInDeck = false;
                this._cardInHand = false;
                this.onDiscard();
            } else {
                // if this card brought to the hand area
                if (this.node.y < this.handLayout.y + this.handLayout.height / 2) {
                    // if card is not in hand, insert card
                    if (this._cardInHand !== true) {
                        this.insertHand();
                    }
                    // if card is in hand and no card movement in hand, sort.
                    if (this._cardInHand === true && DragCard.countLeft === 0 && DragCard.countRight === 0) {
                        this.onSortHand();
                    }
                } else { // if card is brought to neither discard area or hand area
                    // animate card movement to their original position.
                    if (this.previousCardIn === "Hand") {

                        if (DragCard.previousCountLeft === 0 && DragCard.previousCountRight === 0) {
                            Hand.handCards.splice(DragCard.currentHandIndex, 0, this.node);
                        }
                        if (DragCard.previousCountRight > 0) {
                            Hand.handCards.splice(DragCard.currentHandIndex + DragCard.previousCountRight, 0, this.node);
                        }
                        if (DragCard.previousCountLeft > 0) {
                            Hand.handCards.splice(DragCard.currentHandIndex - DragCard.previousCountLeft, 0, this.node);
                        }
                        this._cardInHand = true;
                        this._cardInDeck = false;
                        this._cardInDiscard = false;
                    }

                    if (this.previousCardIn === "Deck") {

                        this.node.runAction(cc.moveTo(0.1, cc.p(this.deckLayout.x, this.deckLayout.y)));
                        this._cardInHand = false;
                        this._cardInDeck = true;
                        this._cardInDiscard = false;
                    }

                    if (this.previousCardIn === "Discarded") {

                        let xMoveTo: number = Math.floor(Math.random() * ((this.discardLayout.x + this.node.width / 3)
                        - (this.discardLayout.x - this.node.width / 3) + 1)) + (this.discardLayout.x - this.node.width / 3);
                    // set random y point in middle of discard area
                    let yMoveTo: number = Math.floor(Math.random() * ((this.discardLayout.y + this.node.height / 3)
                        - (this.discardLayout.y - this.node.height / 3) + 1)) + (this.discardLayout.y - this.node.height / 3);
                    // run animation rotate and moveTo
                    this.node.runAction(cc.spawn(cc.rotateTo(0.2, xMoveTo * yMoveTo % 360), cc.moveTo(0.2, xMoveTo, yMoveTo)));

                    this._cardInHand = false;
                    this._cardInDeck = false;
                    this._cardInDiscard = true;
                    }

                    // on release, card localZOrder goes to original before the +100
                    this.node.setLocalZOrder(this.node.getLocalZOrder() - 100);
                    this.onSortHand();
                }
            }

            // this node will copy the current node for swapping of the card
            var temp: cc.Node = this.node;

            // to find out if the position of the card has changed
            for (var i: number = 1; i < Hand.handCards.length; i++) {

                if (DragCard.countLeft === i && this._cardInHand === true) {

                    // remove the current card from array and re-adding it on the new postion
                    Hand.handCards.splice(DragCard.currentHandIndex, 1);
                    Hand.handCards.splice(DragCard.currentHandIndex - DragCard.countLeft, 0, temp);
                    this.onSortHand();
                }

                if (DragCard.countRight === i && this._cardInHand === true) {

                    // remove the current card from array and re-adding it on the new postion
                    Hand.handCards.splice(DragCard.currentHandIndex, 1);
                    Hand.handCards.splice(DragCard.currentHandIndex + DragCard.countRight, 0, temp);
                    this.onSortHand();
                }
            }
            // reset counter and sort table
            DragCard.countLeft = 0;
            DragCard.countRight = 0;
            DragCard.bufferX = 0;
            this.onSortTable();

            cc.log("Discarded \n", Discarded.discardedCards);
            cc.log("Hand \n", Hand.handCards);
            cc.log("Deck \n", Deck.deckCards);

        }, this);

    }

    onDiscard(): void {

        // check if this node exists in discardArray, returns value
        var remove: number = Discarded.discardedCards.lastIndexOf(this.node);
        // if duplicates is found in the discardArray, it returns positive value,
        // this removes duplicates
        if (remove >= 0) {
            Discarded.discardedCards.splice(remove, 1);
        }
        // this insert current node into discard cards array,
        Discarded.discardedCards.push(this.node);

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
        let xMoveTo: number = Math.floor(Math.random() * ((this.discardLayout.x + this.node.width / 3)
            - (this.discardLayout.x - this.node.width / 3) + 1)) + (this.discardLayout.x - this.node.width / 3);
        // set random y point in middle of discard area
        let yMoveTo: number = Math.floor(Math.random() * ((this.discardLayout.y + this.node.height / 3)
            - (this.discardLayout.y - this.node.height / 3) + 1)) + (this.discardLayout.y - this.node.height / 3);
        // run animation rotate and moveTo
        this.node.runAction(cc.spawn(cc.rotateTo(0.2, xMoveTo * yMoveTo % 360), cc.moveTo(0.2, xMoveTo, yMoveTo)));

        // if this card discarded from hand,
        // remove this card from deck cards
        remove = Deck.deckCards.lastIndexOf(this.node);
        if (remove >= 0) {

            Deck.deckCards.splice(remove, 1);
        }

        // if this card discarded from hand,
        // remove this card from hand cards
        remove = Hand.handCards.lastIndexOf(this.node);
        if (remove >= 0) {

            Hand.handCards.splice(remove, 1);
        }

        // assign localZOrder of every array member to its corresponding index
        for (var i: number = 0; i < Discarded.discardedCards.length; i++) {
            Discarded.discardedCards[i].setLocalZOrder(i);
        }
        // make TableLayout to sort its childrens
        this.onSortHand();
        this.onSortTable();
    }

    insertHand(): void {
        // check if this node exists in hand cards, returns negative value if not found
        var remove: number = Hand.handCards.lastIndexOf(this.node);

        if (remove < 0) {
            // this insert current node into hand cards,
            // which represents the hand area in table.
            Hand.handCards.push(this.node);
        }

        // if this item removed from discardArray,
        // remove this item from discardArray and sort discardArray
        remove = Discarded.discardedCards.lastIndexOf(this.node);
        if (remove >= 0) {
            Discarded.discardedCards.splice(remove, 1);
        }

        // call the hand sorting function
        this.onSortHand();
    }

    onSortHand(): void {

        // gets the absolute maximum point for the node to be in hand layout,
        // negative means max point to the left, positive means max point to the right
        var maxPoint: number = this.handLayout.width / 2;
        var cardsInHand: number = Hand.handCards.length;

        // firstIndex will hold X position for the first item in hand cards
        var firstIndex: number = 0;
        // spacing will hold the spacing value between all other item in hand cards
        var spacing: number = 0;
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

        DragCard.currentHandSpacing = spacing;

        // this sort the hand with appropriate spacing given number of cards in hand
        for (var i: number = 0; i < cardsInHand; i++) {
            Hand.handCards[i].stopAllActions();
            Hand.handCards[i].runAction(cc.spawn(cc.rotateTo(0.1, 0), cc.moveTo(0.1, cc.p(firstIndex + (spacing * i), this.handLayout.y))));
            Hand.handCards[i].setLocalZOrder(i);
        }
        // sort all nodes
        this.onSortTable();
    }

    onMoveCard(): void {

        var i: number = 0;
        // animation to move left or right
        var moveRight: cc.ActionInterval = cc.moveBy(0.1, cc.p(DragCard.currentHandSpacing, 0));
        var moveLeft: cc.ActionInterval = cc.moveBy(0.1, cc.p(-DragCard.currentHandSpacing, 0));

        var adjustedOriginalX: number = DragCard.originalX + DragCard.bufferX;

        for (i = 0; i <= Hand.handCards.length - 2; i++) {

            // if card moved one spacing to the left, move the previous card to the right
            if (this.node.x < adjustedOriginalX - (DragCard.currentHandSpacing * (i + 1))
                && this.node.x > adjustedOriginalX - (DragCard.currentHandSpacing * (i + 2))) {

                if (DragCard.countLeft === i) {

                    // prevent conditional statement goes out of array bounds
                    if (DragCard.currentHandIndex - (i + 1) >= 0) {
                        Hand.handCards[DragCard.currentHandIndex - (i + 1)].runAction(moveRight.clone());
                        // clone so that each animation is run independently
                        DragCard.countLeft++;
                    }
                }
            }
            // if the card moved back to the right, move the next card to the left
            if (DragCard.countLeft === (i + 1) && this.node.x > adjustedOriginalX - (DragCard.currentHandSpacing * i)) {

                Hand.handCards[DragCard.currentHandIndex - (i + 1)].runAction(moveLeft.clone());
                DragCard.countLeft--;

            }
        }

        for (i = 0; i <= Hand.handCards.length - 2; i++) {

            // if card moved one spacing to the right, move the next card to the left
            if (this.node.x > adjustedOriginalX + (DragCard.currentHandSpacing * (i + 1))
                && this.node.x < adjustedOriginalX + (DragCard.currentHandSpacing * (i + 2))) {

                if (DragCard.countRight === i) {
                    // prevent conditional statement goes out of array bounds
                    if (DragCard.currentHandIndex + (i + 1) < Hand.handCards.length) {
                        // if (Hand.handCards[.currentHandIndex + (i + 1)].runAction(moveLeft).isDone() !== true) {
                        Hand.handCards[DragCard.currentHandIndex + (i + 1)].runAction(moveLeft.clone());
                        DragCard.countRight++;
                        // }DragCard
                    }
                }
            }

            // if the card moved back to the left, move the previous card to the right
            if (DragCard.countRight === (i + 1) && this.node.x < adjustedOriginalX + (DragCard.currentHandSpacing * i)) {
                // if (Hand.handCards[DragCard.currentHandIndex + (i + 1)].runAction(moveRight).isDone() !== true) {
                Hand.handCards[DragCard.currentHandIndex + (i + 1)].runAction(moveRight.clone());
                DragCard.countRight--;
                // }
            }
        }
        DragCard.previousCountLeft = DragCard.countLeft;
        DragCard.previousCountRight = DragCard.countRight;

        this.onSortTable();
    }

    setCurrentIndex(): void {


        var maxPoint: number = this.handLayout.width / 2;
        // this function is called before adding current card to Hand.handCards array, hence the + 1
        var cardsInHand: number = Hand.handCards.length + 1;

        var firstIndex: number = 0;
        var spacing: number = 0;

        firstIndex = (maxPoint / cardsInHand) - maxPoint;
        spacing = (maxPoint / cardsInHand) + (maxPoint / cardsInHand);

        if (spacing > this.node.width) {
            spacing = this.node.width;

            firstIndex = (this.node.width / 2 - (cardsInHand * this.node.width / 2));
        }

        DragCard.currentHandSpacing = spacing;

        if (this.node.x < firstIndex) {
            DragCard.currentHandIndex = 0;
            DragCard.bufferX = firstIndex - DragCard.originalX;
            if (spacing < this.node.width) {
                DragCard.bufferX = firstIndex - DragCard.originalX;
            }
        }

        for (var i: number = 0; i < Hand.handCards.length; i++) {
            if (this.node.x > firstIndex + (DragCard.currentHandSpacing * (i))) {

                DragCard.currentHandIndex = i + 1;
                DragCard.bufferX = firstIndex - DragCard.originalX + (spacing * (i + 1));

                if (spacing < this.node.width) {
                    DragCard.bufferX = (firstIndex - DragCard.originalX) + (spacing * (i + 1));
                }
            }
        }
    }

    onSortTable(): void {
        // call TableLayout to reorder child with their localZorder value
        this.parent.sortAllChildren();
    }
}
