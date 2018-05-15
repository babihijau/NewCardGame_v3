import DragCard from "./DragCardScript";
import Discarded from "./DiscardedCardScript";
import Hand from "./HandCardScript";
import Deck from "./DeckCardScript";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Deal extends cc.Component {

    @property(cc.Button)
    button: cc.Button = null;
    @property
    cardsToDeal: number = 0;
    @property
    spawnInterval: number = 0;
    @property(cc.Node)
    handLayout: cc.Node = null;

    spawnCount: number = 0;

    // public static dealingArray: cc.Node[] = [];
    public static interactableButton: boolean = false;

    onLoad(): void {
        this.spawnCount = 0;
    }

    onDealCard(): void {
        this.schedule(this.onDealCard, this.spawnInterval);

        if (this.spawnCount >= this.cardsToDeal) {
            this.clearRepeater();
            return;
        }

        Deck.deckCards[Deck.deckCards.length - 1].runAction(cc.moveBy(0.2, cc.p(50, 50)));

        Hand.handCards.push(Deck.deckCards[Deck.deckCards.length - 1]);

        var maxPoint: number = this.handLayout.width / 2;
        var cardsInHand: number = Hand.handCards.length;

        var firstIndex: number = 0;

        var spacing: number = 0;

        firstIndex = (maxPoint / cardsInHand) - maxPoint;

        spacing = (maxPoint / cardsInHand) + (maxPoint / cardsInHand);

        if (spacing > 78) {
            spacing = 78;
            firstIndex = (78 / 2 - (cardsInHand * 78 / 2));
        }

        DragCard.currentHandSpacing = spacing;

        for (var i: number = 0; i < cardsInHand; i++) {
            Hand.handCards[i].stopAllActions();
            Hand.handCards[i].runAction(cc.spawn(cc.rotateTo(0.1, 0), cc.moveTo(0.1, cc.p(firstIndex + (spacing * i), this.handLayout.y))));
            Hand.handCards[i].setLocalZOrder(i);
        }

        Deck.deckCards.pop();
        this.spawnCount++;
    }

    update(): void {
        this.button.interactable = Deal.interactableButton;
    }

    clearRepeater(): void {
        this.unschedule(this.onDealCard);
    }
}
