import DragCard from "./DragCardScript";
import Discarded from "./DiscardedCardScript";
import Hand from "./HandCardScript";
import Deck from "./DeckCardScript";
import Deal from "./DealScript";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CreateDeck extends cc.Component {

    @property(cc.Prefab)
    prefab: cc.Prefab = null;

    @property(cc.Node)
    root: cc.Node = null;

    public static cardArray: cc.Node[] = [];

    onLoad ():void {
       // this.onCreateDeck();
    }

    position1: cc.Vec2 = cc.p(0,0);
    num: number = 0;
    num2: number = 52;

    onCreateDeck ():void {

        this.root.destroyAllChildren();
        Deck.deckCards = [];
        Discarded.discardedCards = [];
        Hand.handCards = [];
        Deal.interactableButton = true;
        Deal.spawnCount = 0;

        var self: this = this;

        for (var i:number = 0;i<52;i++) {
        var card: cc.Node = cc.instantiate(this.prefab);
        card.parent = this.root;
        card.position = cc.find("DeckLayout" ,this.root.parent).position;
        Deck.deckCards[i] = card;
        card.name = Deck.deckCards[i].getComponent(cc.Sprite).spriteFrame.name;
        cc.log(Deck.deckCards[i].name);
        }
    }

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
