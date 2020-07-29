//监听鼠标事件
// let element = document.body;

function enableGesture(element) {

	let contexts = Object.create(null);

	let MOUSE_SYMBOL = Symbol("mouse")

	if (document.ontouchstart != null)
		element.addEventListener("mousedown", (event) => {
			contexts[MOUSE_SYMBOL] = Object.create(null);
			start(event, contexts[MOUSE_SYMBOL])
			let mousemove = event => {
				move(event, contexts[MOUSE_SYMBOL])
			}
			let mouseend = event => {
				end(event, contexts[MOUSE_SYMBOL])
				document.removeEventListener("mouseover", mousemove)
				document.removeEventListener("mouseup", mouseend)
				delete contexts[MOUSE_SYMBOL]
			}
			document.addEventListener("mouseover", mousemove)
			document.addEventListener("mouseup", mouseend)
		})

	element.addEventListener("touchstart", event => {
		for (let touch of event.targetTouches) {
			contexts[touch.identifier] = Object.create(null);
			start(touch, contexts[touch.identifier])
		}
	})
	element.addEventListener("touchmove", event => {
		for (let touch of event.targetTouches) {
			move(touch, contexts[touch.identifier])
		}
	})
	element.addEventListener("touchend", event => {
		for (let touch of event.targetTouches) {
			end(touch, contexts[touch.identifier])
			delete contexts[touch.identifier]
		}
	})

	element.addEventListener("touchcancel", event => {
		for (let touch of event.targetTouches) {
			cancel(touch, contexts[touch.identifier])
			delete contexts[touch.identifier]
		}
	})

	// tap
	// pan - panstart panmove panend
	// flick
	// press - pressstart pressend

	let start = (point, context) => {
		context.startX = point.clientX, context.startY = point.clientY,
		context.moves = [];
		context.isTap = true;
		context.isPan = false;
		context.isPress = false;
		context.timeoutHandler = setTimeout(() => {
			if (context.isPan)
				return

			context.isTap = false;
			context.isPan = false;
			context.isPress = true;
			// console.log('pressStart')
			ele.dispatchEvent(new CustomEvent('pressstart'))
		}, 500)
		// console.log('start', point.clientX, point.clientY)
		const event = new CustomEvent('start');
		Object.assign(event, {
		  startX: context.startX,
		  startY: context.startY,
		  clientX: e.clientX,
		  clientY: e.clientY,
		})
		element.dispatchEvent(event)
	}

	let move = (point, context) => {
		let dx = point.clientX - context.startX,
			dy = point.clientY - context.startY
		if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
			if (context.isPress) {
				element.dispatchEvent(new CustomEvent('presscancel'))
			}
			context.isTap = false;
			context.isPan = true;
			context.isPress = false;
			// console.log('panStart')
			element.dispatchEvent(new CustomEvent('panstart'))
		}


		if (context.isPan) {
			context.moves.push({
				dx,
				dy,
				t: Date.now()
			})
			context.moves = context.moves.filter(record => Date.now() - record.t < 300)
			// console.log('pan')
			const event = new CustomEvent('pan');
			Object.assign(event, {
				startX: context.startX,
				startY: context.startY,
				clientX: e.clientX,
				clientY: e.clientY,
			  })
			ele.dispatchEvent(event)
		}
		// console.log('move', dx, dy)
	}

	let end = (point, context) => {
		if (context.isPress) {
			element.dispatchEvent(new CustomEvent('pressend'))
		}
		if (context.isPan) {
			let dx = point.clientX - context.startX,
				dy = point.clientY - context.startY
			let record = context.moves[0]
			let speed = Math.sqrt((record.dx - dx) ** 2 + (record.dy - dy) ** 2) / (Date.now() = record.t)
			if (speed > 2.5) {
				// console.log("flick")
				const event = new CustomEvent('flick')
				Object.assign(event, {
					startX: context.startX,
					startY: context.startY,
					clientX: point.clientX,
					clientY: point.clientY,
					isFlick,
					speed,
				})
				element.dispatchEvent(event)
			}
			const event = new CustomEvent('panend')
			      Object.assign(event, {
			        startX: context.startX,
			        startY: context.startY,
			        clientX: e.clientX,
			        clientY: e.clientY,
			        isFlick,
			        speed,
			      })
			element.dispatchEvent(event)
			// console.log('panend')
			// console.log(context.moves)
		}
		if (context.isTap)
			// console.log('tap')
			element.dispatchEvent(new CustomEvent('tap'))

		clearTimeout(context.timeoutHandler)
	}

	let cancel = (point, context) => {
		console.log('cancel')
		clearTimeout(context.timeoutHandler)
	}
}
