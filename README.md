# simple-store
A reactive store of data for global state management in JS.

- [`Installation`](#installation)

- [`Usage`](#usage)
- [`Configuration`](#configuration)
  - API Methods
    - [`add`](#add)
    - [`get`](#get)
    - [`all`](#all)
    - [`only`](#only)
    - [`update`](#update)
    - [`delete`](#delete)
    - [`has`](#has)
  - [`The reactive part`](#the-reactive-part)
    - [`listen`](#listen)
  - [`Persisting Data`](#persisting-data)
  - [`Integration with React`](#using-simple-store-with-react)
    - [`Class Component`](#class-component)
    - [`Functional Component`](#functional-component)

## Installation
`npm install @lesnock/simple-store`  
Or  
`yarn add @lesnock/simple-store`

## Usage

### Simple Example
```javascript
// store.js
import Store from '@lesnock/simple-store';

const store = new Store();

export default store;

// otherfile.js
import store from './store'

store.add('name', 'John')

// When "name" changes in the store, this callback will be executed
store.listen('name', (value, oldValue) => {
  if (value !== oldValue) {
    console.log(`name changed to ${value}`)
  }
})

store.update('name', 'Mary') // Will emit the event binded before - name changed to 'Mary'

store.get('name') // Mary

store.delete('name')

store.get('name') // undefined
```

### Configuration
To start using the Simple Store, we should create a file to instantiate and config our store, and export the initial data. 
This is the unique moment we will import the `@lesnock/simple-store` itself. After config our store, we will import this config file in others files.

```javascript
// store.js
import Store from '@lesnock/simple-store';

const store = new Store();

// Add initial data
store.add('name', 'John');
store.add('age', 23);
store.add('address', null);

export default store;
```

#### `add`
To add a new data to the Store use the method **add**. The **add** method requires two arguments: 
**name** and **value**.  

If you try to add a data that already exists, Simple Store will throw an exception.  
This is usefull to help to organize the flow of the app. However, if you want to allow the Simple Store to add data that already exists in the store, set the **allowExistingData** to the configs.
```javascript
import store from '@lesnock/simple-store'

const store = new Store({
  allowExistingData: true,
})

store.add('name', 'John')

store.add('name', 'Mary') // Will overwrite the data
```

If you add a data that already exists in the store, it will **NOT** act as a store update, in other words, it will overwirte the data, but it is not going to run the [`effects`](#listen).

## Fetching data
There are different ways of fetching data from the store.
#### get
Fetch a specific field from the store:
```javascript
const name = store.get('name')
```

#### all
Fetch all data from the store.
```javascript
const storeData = store.all()

// Using destructuring assignment
const { name, age, address } = store.all()
```

#### only
Retrieves specifics fields from the store.
This method will return an object with the required data:
```javascript
const data = store.only(['name', 'age', 'address']) 
// { name: 'John', age: 23, address: 'Lombard Street' }

// Using destructuring assignment
const { name, age, address } = store.only(['name', 'age', 'address'])
```

## Updating and Deleting data

You can aswell, update and delete some data in the store using **update** and **delete** methods, respectively.  

#### update
```javascript
store.add('name', 'John')
store.update('name', 'Joseph')
``` 

#### delete
```javascript
store.add('name', 'John')
store.delete('name')

console.log(store.get('name')) // undefined
``` 

#### has
Verify if a data exists in the store:
```javascript
store.add('name', 'Bill')

store.has('name') // true
```

## The reactive part
Simple Store is reactive to data change. This means that simple store can detect all data update in your application.  
It's possible to attach an event to be execute whenever a specific data is updated in the store.
This is a powerfull tool, since it can be used to globally sincronize all components of your application.

#### listen
Attachs an event to a specific data in the store. Once the data is updated the callback is executed.
```javascript
store.add('activeLesson', 1)

// Whenever activeLesson is updated in the store, this callback will be executed
store.listen('activeLesson', (value, oldValue) => {
  // Logic to change lesson
}
```

If you want to set a listener to a data in the store on the moment you are creating it, you could pass a third argument as a callback:
```javascript
store.add('user', 'Gabriel', (value, oldValue) => console.log('user changed'))
```

## Persisting Data

If you want the data to persist throughout the pages, and refreshes,
just set the **persist** config to true in the store configs. With this config, Simple Store will
save the data in the localStorage, and will automatically get from there when the pages refreshes
or the user change the route. Simple Store state will be the same, regardless of page change.  
This will **NOT** work in the Node enviroment, just in the browsers.
```javascript
const store = new Store({
  persist: true,
}) 
```

It's important to mention that, if you persist the data, when you refresh or change the 
page in your application, the data will be there yet, so if you try to add that data again, Simple Store will throw an exception (How we have seen above in the [`add section`](#add)).
This can happen bacause sometimes the scripts runs again when the page is refreshed.
So when you are persisting data, maybe you should check if a data is already not in the store before add it:

```javascript
if (!store.has('name')) {
  store.add('name', 'John')
}

// OR
!store.has('name') && store.add('name', 'John')
```
The other solution is to add the `allowExistingData` config to the store.
This config will allow you to add a data that already exists in the store. If you enable this config, you should be carefull, because you can overwrite the persisted data unintentionally.

## Using Simple Store with React
Simple Store works well with React, either.  
In order to use a store in React, the most important thing is to sincronyze the component rendering
with the data in the store.  
Simple Store makes this easy.

Look at how to sincronyze and re-render a component, when necessary:  
#### Class component:
```javascript
import React, { Component } from 'react'
import store from './storeConfig'

export default class Name extends Component {
  state = {
    name: store.get('name') || 'Gabriel'
  }

  componentDidMount() {
    store.listen('name', name => {
      this.setState({ name })
    })
  }

  render() {
    return (
      <span>
        {this.state.name}
      </span>
    )
  }
}
```

#### Functional component:
```javascript
import React, { useState, useEffect } from 'react'
import store from './storeConfig'

export default function Name() {
  const [name, setName] = useState(store.get('name') || 'Gabriel')
  
  store.listen('name', value => setName(value))

  return <span>{name}</span>
}