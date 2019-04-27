class BlogComment {
	getHeadline() {
  	return `${this.author} - ${this.title}`
  }
}

class BlogPost {
	getCommentCount() {
  	return this.comments.length;
  }
}

class Goat {
  getGoat() { return "I am a goat"; }
}

const classRegistry = {
  BlogComment,
  BlogPost,
  Goat,
}

var raw = [
  {
    title: 'Post 1',
    __type: 'BlogPost',
    comments: [
      { author: 'Author 1-1', title: 'Comment 1-1', __type: 'BlogComment'},
      {author: 'Author 1-2', __type: 'BlogComment', title: 'Comment 1-2'}
    ]
  },
  {
    title: 'Post 2',
    comments: [
      {author: 'Author 2-1', title: 'Comment 2-1', __type: 'BlogComment'},
      {title: 'Not a real comment', children: [{"goat": {__type: 'Goat'}}]}
    ]
  }
]

const TYPE_KEY_NAME = '__type';

function transform(obj, options = {}) {
  if (obj === null || obj === undefined) {
  	return obj;
  }

  let typeKey = options.typeKey || TYPE_KEY_NAME;
  console.log('searching for key: ' + typeKey);

  console.log("obj: " + JSON.stringify(obj));
  console.log("typeof: " + typeof obj);
  console.log("constructor: " + obj.constructor.name);
  console.log("")

	if (typeof obj[Symbol.iterator] === 'function' && obj.constructor.name !== "String") {
    console.log("transformIterable")
  	return transformIterable(obj, options);
  }

  if (obj.constructor.name === "Object") {
    console.log("nested:")
    Object.entries(obj).forEach(([key, value]) => {
      if (key == typeKey) return;
      console.log("key: " + key)
      transform(value, options);
    })

    //options could specify alternate or additional class registry
    let type = classRegistry[obj[typeKey]];
    if (type) {
      console.log('Setting prototype to: '  +type.name )
      //options could specify before/after/around transform
      //class could specify before/after/around transform
      Object.setPrototypeOf(obj, type.prototype);
      console.log('Constructor is now: '  + obj.constructor.name )
    }
    //else if has key but no type found and option is set, throw error
  }

  return obj;
}

function transformIterable(iterable, options) {
	var iterator = iterable[Symbol.iterator]()
  var current;

  while (!(current = iterator.next()).done)
  {
  	transform(current.value, options)
  }
}

transform(raw)

console.log(raw[0].getCommentCount())
console.log(raw[0].comments[0].getHeadline())
console.log("should be undefined: " + raw[1].getCommentCount)
console.log(raw[1].comments[0].getHeadline())
console.log("should be undefined: " + raw[1].comments[1].getHeadline)
console.log(raw[1].comments[1].children[0].goat.getGoat())

var customKey = { "notGoat": { __type: "Goat" }, 'goat': { 'ttyyppee': 'Goat'} };
transform(customKey, {typeKey: 'ttyyppee'})
console.log(customKey.notGoat.constructor.name)
console.log(customKey.goat.constructor.name)
