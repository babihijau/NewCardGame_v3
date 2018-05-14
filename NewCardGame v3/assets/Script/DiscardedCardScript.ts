const {ccclass, property} = cc._decorator;

@ccclass
export default class Discarded extends cc.Component {

    public static discardedCards: cc.Node[] = [];

    // tslint:disable-next-line:no-empty
    onLoad ():void {

    }
}
