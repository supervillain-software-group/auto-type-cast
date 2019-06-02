## Description

Simple, lightweight type casting of JSON objects to classes. Use it on the JSON response from your server to so you can use proper model classes on the frontend in one function call.

Your server has model classes. Your frontend has model classes. But, there isn't a great way to get instances of your Javascript model classes from the JSON objects in your responses. This package gives you an easy way to do so, without integrating with a complex Javascript framework, tying you to a specific server framework, or pulling in many dependencies (this package has none).

### Example

Given a JSON structure that looks like this:

```
var homer = {
  name: "Homer Simpson",
  __type: "Person",
  foods: [
    { name: "Jelly", category: "donut", favorite: true, __type: "Food" }
  ]
}
```

and some model classes that look like this:

```
class Person {
  getFavoriteFood() { return this.foods.find(f => f.favorite); }
}

class Food {
  getFullName() { return "${this.name} ${this.category}";  }
}
```

you can easily cast your JSON objects to instances of their respective classes:

```
autoTypeCast(homer);
homer.getFavoriteFood().getFullName(); // "Jelly donut"
```

_Does this function mutate the original objects?_ Yes, and it uses `setPrototypeOf` to do so. [Mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) claims this is much slower than `Object.assign`, and also a dangerous operation. My benchmarks show the opposite, but I am actively looking for counterexamples.

_Doesn't this mean I need to add an attribute to my JSON objects being sent from the server?_ Yes. This is simple enough for my use cases. If this does not fit for you, you should find a more complex framework. For example, [class-transformer](https://www.npmjs.com/package/class-transformer) is non-intrusive through use of type decorators.

## Usage
### Installation

Fist, add the package to your project:

```
yarn add auto-type-cast
```

Next, register your model classes with `auto-type-cast`:

```
import { registerClass } from 'auto-type-cast';

class Person {
  ...
}

registerClass(Person);
```

Make sure your server sends a `__type` attribute indicating the right class name to cast the object to, or augment the Javascript once you have it on the client. You're on your own with this, but here's an example from Ruby using [ActiveModelSerializers](https://github.com/rails-api/active_model_serializers):

```
class ApplicationSerializer < ActiveModel::Serializer
  attribute(:__type) { model.class.name }
  #assumes model class on server has same name as in Javascript
end

class PersonSerializer < ApplicationSerializer; end
```

Configure `autoTypeCast`. See [Configuration](#configuration) below. *Important:* See note about `getClassType` and minification.

Finally, call `autoTypeCast` on the object. Arrays and deeply-nested structures will be scanned and cast as well, if found.

```
import autoTypeCast from 'auto-type-cast';

var response = fetch(...);
autoTypeCast(response.data);
```

### Customization

You can control the name of the attribute that specifies the class name:

```
var myObject = { "name": "Homer", myType: 'Person' };
autoTypeCast(myObject, { typeKey: 'myType' });
// myType was used to convert the object to instance of Person
```

If you need more granular or dynamic control of the class registry, import it directly:

```
import { classRegistry } from 'auto-type-cast';
delete classRegistry['Person'];
autoTypeCast({ __type: 'Person'}); // no conversion
```

### Configuration

| Parameter  | Description | Default |
| ---------- | ----------- | ------- |
| `config.typeKey` | Determines the attribute name that specifies the object's type  | `__type` |
| `config.getObjectType`  | Returns the object's type. Used to look up the correct class in the registry. Uses `config.typeKey` by default, but if you need more control, you can override this | `(object, options) => { object[options.typeKey \|\| config.typeKey]` |
| `config.getClassType` | Returns the class's "type" name. Used to map objects to this class. The object type and the class type must match in order for `autoTypeCast` to work. | `(klass) => klass.name` |

A note regarding `getClassType`: if you are uglifying/minifying/mangling your code, you are likely destroying class names in production, which will result in `autoTypeCast` being unable to find classes at runtime. You have a few options:

1. Add a static name to your class, like so: `class TestClass { static get name() { return 'TestClass'} }`. This is the recommended option.
1. Prevent the minifier from stripping out class/function names. (e.g. with `keep_fnames = true`)
1. Override `config.getClassType` to determine the type name another way.

## Development
### Testing
- ```yarn run watch```
- Edit base code and observe test results

## Building
- ```yarn run prod``` Runs tests, lints, and builds the module
- ```npm version patch``` (or ```minor```/```major``` etc.)
- ```npm publish```
