import { TimeLine, Animation } from '../lib/animation.js'
import { cubicBezier } from '../lib/cubicBezier.js'
import { create } from '../main1'

const ease = cubicBezier(.25,.1,.25,1)
const linear =  v => v;

export class Carousel {
  constructor(){
    this.root = null;
    this.data = null;
    this.tl = new TimeLine();
    // window.xtl = this.tl;
  }

  setAttribute(name, value) { //attribute
      this[name] = value;
  }

  render(){
    let position = 0;
    this.tl.start();
    let nextPickStopHander = null;

    let children = this.data.map((url, curPosition) => {

      let nextPosition = (curPosition + 1) % this.data.length;
      let lastPosition = (curPosition - 1 + this.data.length) % this.data.length;
      
      
      let offset = 0;

      const onStart = () => {
        this.tl.pause();
        clearTimeout(nextPickStopHander)
        let curEle = children[curPosition];
        let curTranfromVal = Number(curEle.style.transform.match(/translateX\(([\s\S]+)px\)/)[1])
        // 受动画影响偏移的值
        offset = curTranfromVal + 500 * curPosition;
        
      }

      const onPan = e => {
        console.log('onPan')
        let dx = e.clientX - e.startX;
        let lastEle = children[lastPosition];
        let curEle = children[curPosition];
        let nextEle = children[nextPosition];
        let curTranfromVal = -500 * curPosition + offset + dx;
        let nextTranfromVal = 500 -500 * nextPosition + offset + dx;
        let lastTranfromVal = -500 -500 * lastPosition + offset + dx;

        lastEle.style.transform = `translateX(${lastTranfromVal}px)`
        curEle.style.transform = `translateX(${curTranfromVal}px)`
        nextEle.style.transform = `translateX(${nextTranfromVal}px)`
      }

      const onPanend = e => {
        let direction = 0;
        const dx = e.clientX - e.startX;
        console.log(dx + offset)
        if (dx + offset > 250) {
          // 向右
          direction = 1;
        } else if (dx + offset < -250) {
          // 向左
          direction = -1;
        }

        this.tl.reset();
        this.tl.start();

        let lastEle = children[lastPosition];
        let curEle = children[curPosition];
        let nextEle = children[nextPosition];

        let lastAnimation = new Animation({
          object: lastEle.style,
          property: 'transform',
          template: v => `translateX(${v}px)`,
          start: -500 -500 * lastPosition + offset + dx,
          end: -500 -500 * lastPosition + offset + dx + direction * 500,
          duration: 500, 
          delay: 0,
          timingFunction: ease,
        })
        let curAnimation = new Animation({
          object: curEle.style,
          property: 'transform',
          template: v => `translateX(${v}px)`,
          start: -500 * curPosition + offset + dx,
          end: -500 * curPosition + offset + dx + direction * 500,
          duration: 500, 
          delay: 0,
          timingFunction: ease,
        })
        let nextAnimation = new Animation({
          object: nextEle.style,
          property: 'transform',
          template: v => `translateX(${v}px)`,
          start: 500 -500 * nextPosition + offset + dx,
          end: 500 -500 * nextPosition + offset + dx + direction * 500,
          duration: 500, 
          delay: 0,
          timingFunction: ease,
        })
        this.tl.add(lastAnimation);
        this.tl.add(curAnimation);
        this.tl.add(nextAnimation);

        position = (position - direction + this.data.length) % this.data.length;
        nextPic()
        console.log('onPanend')
      }

      const onCancel = () => {
        console.log('onCancel')
        nextPic()
      }

      let ele = <img src={url} onStart={onStart} onPan={onPan} onPanend={onPanend} onCancel={onCancel} enableGesture={true} />;
      ele.addEventListener("dragstart", event => event.preventDefault());
      ele.style.transform = 'translateX(0px)'
      return ele;
    })
    
    let nextPic = () => {
      let nextPosition = (position + 1) % this.data.length;
      let current = children[position];
      let next = children[nextPosition];

      let curAnimation = new Animation({
        object: current.style,
        property: 'transform',
        template: v => `translateX(${5 * v}px)`,
        start: -100 * position,
        end: -100 -100 * position,
        duration: 500, 
        delay: 0,
        timingFunction: ease,
      })

      let nextAnimation = new Animation({
        object: next.style,
        property: 'transform',
        template: v => `translateX(${5 * v}px)`,
        start: 100 -100 * nextPosition,
        end: -100 * nextPosition,
        duration: 500, 
        delay: 0,
        timingFunction: ease,
      })
      
      this.tl.add(curAnimation)
      this.tl.add(nextAnimation)
      position = nextPosition;
      
      nextPickStopHander = setTimeout(nextPic, 3000)

      
    }
    nextPic()
    return (
      <div class="carousel">
        {children}
      </div>
    )
  }

  mountTo(parent){
    const re = this.render();
    // console.log(re)
    re.mountTo(parent)
    let position = 0;
    
  }
}