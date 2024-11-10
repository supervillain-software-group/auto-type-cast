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
@Register('Person')
class Person {
  getFavoriteFood() { return this.foods.find(f => f.favorite); }
}

@Register('Food')
class Food {
  getFullName() { return `${this.name} ${this.category}`; }
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

First, add the package to your project:

```
npm install auto-type-cast --save
```

Next, register your model classes using the @Register decorator:

```
import { Register } from 'auto-type-cast';

@Register('Person')
class Person {
  // ... your class implementation
}
```

The @Register decorator takes a string parameter that specifies the type name to use for this class. This is particularly useful when your class names might be minified or obfuscated in production, as it allows you to maintain a consistent type name regardless of code transformation.

Make sure your server sends a `__type` attribute matching the registered name, or augment the Javascript once you have it on the client. You're on your own with this, but here's an example from Ruby using [ActiveModelSerializers](https://github.com/rails-api/active_model_serializers):

```
class ApplicationSerializer < ActiveModel::Serializer
  attribute(:__type) { model.class.name }
  #assumes model class on server has same name as registered on frontend
end

class PersonSerializer < ApplicationSerializer; end
```

Configure `autoTypeCast`. See [Configuration](#configuration) below.

Finally, call `autoTypeCast` on the object. Arrays and deeply-nested structures will be scanned and cast as well, if found.

```
import autoTypeCast from 'auto-type-cast';

var response = fetch(...);
autoTypeCast(response.data);
```

### Alternative Registration Methods

While using the @Register decorator is the recommended approach, you can also register classes manually:

```
import { registerClass } from 'auto-type-cast';

class Person {
  // ... your class implementation
}

registerClass(Person);  // Will use the class name as the type
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

| Parameter               | Description                                                                                                                                                                                                                         | Default                                                             |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `config.typeKey`        | Determines the attribute name that specifies the object's type                                                                                                                                                                      | `__type`                                                            |
| `config.getObjectType`  | Returns the object's type. Used to look up the correct class in the registry. Uses `config.typeKey` by default, but if you need more control, you can override this                                                                 | `(object, options) =>  object[options.typeKey \|\| config.typeKey]` |
| `config.getClassType`   | Returns the class's "type" name. Used to map objects to this class. The object type and the class type must match in order for `autoTypeCast` to work.                                                                              | `(klass) => klass.registeredName \|\| klass.name`                   |
| `config.beforeTypeCast` | Called with the object as a parmeter immediately before type casting it. You can use this if you need to transform it (e.g. manipulating `__type`) before it is ready for type cast.                                                | No-op `(object) => {}`                                              |
| `config.afterTypeCast`  | Called with the object as a parmeter immediately after type casting it. You can use this if you need to transform it after it has taken on its new class (e.g. calling a function from the new class like `object.mySpecialInit()`) | No-op `(object) => {}`                                              |

## Development

### Testing

- `npm run watch`
- Edit base code and observe test results

## Building

- `npm run prod` Runs tests, lints, and builds the module
- `npm version patch` (or `minor`/`major` etc.)
- `npm publish`
