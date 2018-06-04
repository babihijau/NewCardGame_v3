import DragCard from "./DragCardScript";
import Hand from "./HandCardScript";
import Deck from "./DeckCardScript";
import CreateDeck from "./CreateDeckScript";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Deal extends cc.Component {

    @property(cc.Button)
    DealButton: cc.Button = null;
    @property(cc.Button)
    CreateButton: cc.Button = null;
    @property
    cardsToDeal: number = 0;
    @property
    spawnInterval: number = 0;
    @property(cc.Node)
    handLayout: cc.Node = null;

    public static spawnCount: number = 0;

    public static interactableButton: boolean = false;

    onLoad(): void {
            Deal.spawnCount = 0;
    }

    onDealCard(): void {
        this.schedule(this.onDealCard, this.spawnInterval);

        if (Deal.spawnCount >= this.cardsToDeal) {
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
        Deal.spawnCount++;
        Deal.interactableButton = false;
        if (Deal.spawnCount>0 && Deal.spawnCount<10) {
            this.CreateButton.interactable = false;
        } else {
            this.CreateButton.interactable = true;
        }
    }

    update(): void {
        this.DealButton.interactable = Deal.interactableButton;
    }

    clearRepeater(): void {
        this.unschedule(this.onDealCard);
    }
}
