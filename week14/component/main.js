import {createElement, Text, Wrapper} from './createElement';

class Carousel {
	constructor(config) {
		this.children = [];
		this.attributes = new Map();
		this.properties = new Map();
	}

	setAttribute(name, value) {
		this[name] = value;
	}

	appendChild(child) {
		this.children.push(child);
	}

	render() {
		let children = this.data.map(url => {
			let element = <img src={url}/>;
			element.addEventListener("dragstart", event => event.preventDefault());
			return element;
		});

		let root = <div class="carousel">
			{children}
		</div>

		let position = 0;

		let nextPic = () => {
			let nextPosition = (position + 1) % this.data.length;

			let current = children[position];
			let next = children[nextPosition];

			current.style.transition = 'ease 0s';
			next.style.transition = 'ease 0s';

			current.style.transform = `translateX(${
				-100 * position
			}%)`;
			next.style.transform = `translateX(${
				100 - 100 * nextPosition
			}%)`;

			requestAnimationFrame(function () {
				requestAnimationFrame(function () {
					current.style.transition = '';
					next.style.transition = '';

					current.style.transform = `translateX(${
						-100 - 100 * position
					}%)`;
					next.style.transform = `translateX(${
						-100 * nextPosition
					}%)`;
					position = nextPosition;
				});
			});

			setTimeout(nextPic, 3000);
		};
		setTimeout(nextPic, 3000);

		root.addEventListener('mousedown', (event) => {
			let startX = event.clientX;
			let startY = event.clientY;

			const length = this.data.length;
			let lastPosition = (position - 1 + length) % length;
			let nextPosition = (position + 1) % length;

			let last = children[lastPosition];
			let current = children[position];
			let next = children[nextPosition];

			let move = (event) => {
				last.style.transition = 'ease 0s';
				current.style.transition = 'ease 0s';
				next.style.transition = 'ease 0s';

				last.style.transform = `translateX(${
					event.clientX - startX - 500 - 500 * lastPosition
				}px)`;
				current.style.transform = `translateX(${
					event.clientX - startX - 500 * position
				}px)`;
				next.style.transform = `translateX(${
					event.clientX - startX + 500 - 500 * nextPosition
				}px)`;
			};

			let up = (event) => {
				let offset = 0;
				if (event.clientX - startX > 250) {
					offset = 1;
				} else if (event.clientX - startX < -250) {
					offset = -1;
				}

				last.style.transition = '';
				current.style.transition = '';
				next.style.transition = '';

				last.style.transform = `translateX(${
					offset * 500 - 500 - 500 * lastPosition
				}px)`;
				current.style.transform = `translateX(${
					offset * 500 - 500 * position
				}px)`;
				next.style.transform = `translateX(${
					offset * 500 + 500 - 500 * nextPosition
				}px)`;

				position =
					(position - offset + this.data.length) % this.data.length;

				document.removeEventListener('mousemove', move);
				document.removeEventListener('mouseup', up);
			};

			document.addEventListener('mousemove', move);
			document.addEventListener('mouseup', up);
		});

		return root;
	}

	mountTo(parent) {
		this.render().mountTo(parent);
	}
}

// class MyComponent {
// 	constructor(config) {
// 		this.children = [];
// 	}

// 	setAttribute(name, value) {
// 		//attribute
// 		this.root.setAttribute(name, value);
// 	}

// 	appendChild(child) {
// 		this.children.push(child);
// 	}

// 	render() {
// 		return (
// 			<article>
// 				<header>I'm a header</header>
// 				{this.slot}
// 				<footer>I'm a footer</footer>
// 			</article>
// 		);
// 	}

// 	mountTo(parent) {
// 		this.slot = <div></div>;
// 		for (let child of this.children) {
// 			debugger;
// 			this.slot.appendChild(child);
// 		}
// 		this.render().mountTo(parent);
// 	}
// }

/*let component = <div id="a" cls="b" style="width:100px;height:100px;background-color:lightgreen">
        <div></div>
        <p></p>
        <div></div>
        <div></div>
    </div>*/

let images = [
	'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
	'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
	'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
	'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
];

let component = <Carousel data={[
		'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
	'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
	'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
	'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
]} />

component.mountTo(document.getElementById('container'));
