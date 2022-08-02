import { Conf } from "../core/conf";
import { Func } from "../core/func";
import { Mouse } from "../core/mouse";
import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { Util } from "../libs/util";

// -----------------------------------------
//
// -----------------------------------------
export class Item extends MyDisplay {

  private _itemId:number;
  private _txt:Array<HTMLElement> = [];
  private _fontSize:number = 32 * 2;
  private _radius:number;

  constructor(opt:any) {
    super(opt)

    this._itemId = opt.id;

    const sw = Func.instance.sw();
    const sh = Func.instance.sh();
    const baseRadius = Math.min(sw, sh) * 0.25;
    this._radius = Util.instance.map(this._itemId, baseRadius * 0.25, baseRadius, 0, Conf.instance.ITEM_NUM);

    // 円周に収まる数だけつくる
    const dist = this._radius * 2 * 3.14;
    // const num = ~~(dist / (this._fontSize * 0.65));
    const num = ~~(dist / (this._fontSize * 0.5));

    Tween.instance.set(this.getEl(), {
      color:opt.color,
      fontSize:this._fontSize
    })

    for(let i = 0; i < num; i++) {
      const t = document.createElement('span');
      t.classList.add('item-txt');
      this.getEl().append(t);

      t.innerHTML = opt.txt;

      this._txt.push(t);
    }

    this._resize();
  }


  protected _update(): void {
    super._update();

    const fontSize = this.getRect(this._txt[0]);

    const line = Func.instance.isXS() ? 2 : 5;
    const size = Func.instance.sw() / line;

    const mx = Mouse.instance.easeNormal.x
    const my = Mouse.instance.easeNormal.y

    let radius = this._radius * Util.instance.map(mx, 1, 1.5, -1, 1);

    const ang = (this._c * 0.5) * (this._itemId % 2 == 0 ? 1 : -1);
    this._txt.forEach((val,i) => {
      const radian = Util.instance.radian(ang + (360 / this._txt.length) * i);
      const x = size * 0.5 + Math.sin(radian) * radius;
      const y = size * 0.5 + Math.cos(radian) * radius;

      const dx = size * 0.5 - x;
      const dy = size * 0.5 - y;
      const rot = Util.instance.degree(Math.atan2(dy, dx)) + (my * -360);

      Tween.instance.set(val, {
        x:x - fontSize.width * 0.5,
        y:y - fontSize.height * 0.5,
        rotationZ:rot,
        rotationX:0.01
      });
    })
  }



  protected _resize(): void {
    super._resize();
  }
}