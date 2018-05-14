const {ccclass, property} = cc._decorator;

@ccclass
export default class Hand extends cc.Component {

    @property
    hand: cc.Node[] = [];

    public static handCards: cc.Node[] = [];

    // tslint:disable-next-line:no-empty
    onLoad ():void {
    }
}
