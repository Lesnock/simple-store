# simple-store
A reactive store of data for global state management in JS.

## Usage
```javascript
// storeConfig.js
import Store from '@lesnock/simple-store';

const store = new Store();

export default store;

// otherfile.js
import store from './storeConfig'

store.add('name', 'John')

// When "name" change on store, this callback will be executed
store.bindEffect('name', (value, oldValue) => {
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

To get some data in the store, just use the **get** method.  

You can aswell, update and delete some data in the store using **update** and **delete** methods, respectively.

## The reactive part

The **bindEffect** method attachs some callback to whenever a specific data changes in the store.
It is basically a listener to a specific data change.
```javascript
// Whenever activeLesson changes in the store, this callback will be executed
store.bindEffect('activeLesson', (value, oldValue) => {
  // Logic to change lesson
}
```

If you want to bind an effect to a data when creating it in the store,  
you could pass a third argument as a callback:
```javascript
store.add('user', 'Gabriel', (value, oldValue) => console.log('user changed'))
```