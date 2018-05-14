const { ccclass, property } = cc._decorator;

@ccclass
export default class PrefabCard extends cc.Component {

    @property(cc.SpriteFrame)
    spriteList: cc.SpriteFrame[] = [];

    public static num: number[] = [];
    public static count: number = -1;

    onLoad(): void {
        for (var i: number = 0; i < 52; i++) {
            PrefabCard.num[i] = i;
        }

        var id: number = this.genRandom();
        var sprite: cc.Sprite = this.getComponent(cc.Sprite);
        sprite.spriteFrame = this.spriteList[id];
    }

    // should be randomly generated, ill get to that later.. eventually
    genRandom(): number {
        if (PrefabCard.count === 51) {
            PrefabCard.count = -1;
        }
        PrefabCard.count++;
        return PrefabCard.num[PrefabCard.count];
    }
}