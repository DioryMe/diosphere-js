# Diosphere

## Install

```
npm install @diory/diosphere-js
# or
yarn add @diory/diosphere-js
```

## Usage

```
import { Diosphere } from '@diory/diosphere'
const diosphere = new Diosphere()
diosphere.addRoom({ text: 'Hello room!' })
console.log('Hello Diosphere!', diosphere.toObject())
```

## API

### Diosphere

```
diosphere.initialise(roomsObject)
diosphere.queryDiosphere({ text: 'some-text' })
diosphere.resetDiosphere()
diosphere.toObject()
diosphere.toJson()

diosphere.enterRoom(someRoom)

diosphere.getRoom(someRoom)
diosphere.addRoom(someRoom)
diosphere.updateRoom(someRoom)
diosphere.removeRoom(someRoom)
diosphere.addRoomDoor(someRoom, someDoorToRoom)
diosphere.removeRoomDoor(someRoom, someDoorToRoom)
diosphere.addRoomConnection(someRoom, someConnection)
diosphere.removeRoomConnection(someRoom, someConnection)
```

### Room

```
const room = new Room()
room.updateRoom(roomObject)

room.addDoor(door)
room.removeDoor(door)

room.addConnection(connection)
room.removeConnection(connection)

room.toObject()
room.toJson()
```

## Development

Compile typescript in real time to `/dist` folder:

```
yarn build-watch
```

Run unit tests in the background:

```
yarn test-watch
```
