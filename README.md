# simple-store
A reactive store of data for global state management in JS.

## Installation
`npm install @lesnock/simple-store`  
Or  
`yarn add @lesnock/simple-store`

## Usage
```javascript
// storeConfig.js
import Store from '@lesnock/simple-store';

const store = new Store();

export default store;

// otherfile.js
import store from './storeConfig'

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

To add a new data to the Store use the method **add**. The **add** method accepts two required arguments: 
**name** and **value**.  

If you try to add a data that already exists, Simple Store will throw an exception.  
This is usefull to help to organize the flow of the app. However, if you want to allow the Simple Store
to add data that already exists in the store, set the **allowExistingData** to the configs.
```javascript
import store from '@lesnock/simple-store'

const store = new Store({
  allowExistingData: true,
})

store.add('name', 'John')

store.add('name', 'Mary') // Will act as a update
```

To get some data in the store, just use the **get** method.  

You can aswell, update and delete some data in the store using **update** and **delete** methods, respectively.  

To verify if a specific data exists in the store, use the **has** method:
```javascript
store.add('name', 'Bill')

store.has('name') // true
```

## The reactive part
The **listen** method attachs some callback to a specific data.
It will listen to data change in the store and once that data changes,
the callback will be executed.  
```javascript
// Whenever activeLesson changes in the store, this callback will be executed
store.listen('activeLesson', (value, oldValue) => {
  // Logic to change lesson
}
```

If you want to bind an effect to a data when creating it in the store,  
you could pass a third argument as a callback:
```javascript
store.add('user', 'Gabriel', (value, oldValue) => console.log('user changed'))
```

## Persist Data

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

## Using Simple Store with React
Simple Store works well with React, either.  
In order to use a store in React, the most important thing is to sincronyze the component rendering
with the data in the store.  
Simple Store makes this easy.

Look at how to sincronyze and re-render a component, when necessary:  
Class component:
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

Functional component:
```javascript
import React, { useState, useEffect } from 'react'
import store from './storeConfig'

export default function Name() {
  const [name, setName] = useState(store.get('name') || 'Gabriel')
  
  store.listen('name', value => setName(value))

  return <span>{name}</span>
}