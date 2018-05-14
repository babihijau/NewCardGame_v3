const {ccclass, property} = cc._decorator;

@ccclass
export default class Deck extends cc.Component {

    @property
    deck: cc.Node[] = [];

    public static deckCards: cc.Node[] = [];

    // tslint:disable-next-line:no-empty
    onLoad ():void {
    }
}
