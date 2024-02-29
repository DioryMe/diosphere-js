# Diosphere

## Install

```
npm install @diory/diosphere
# or
yarn add @diory/diosphere
```

## Usage

```
import { Diosphere } from '@diory/diosphere'
const diosphere = new Diosphere()
diosphere.createRoom({ text: 'Hello room!' })
console.log('Hello Diosphere!', diosphere.toObject())
```

## API

```
const diosphere = new Diosphere(diosphereObject)
```

### Diosphere

```
diosphere.addDiosphere(diosphereObject)
diosphere.queryDiosphere({ text: 'some-text' })
diosphere.resetDiosphere()
diosphere.toObject()
diosphere.toJson()

diosphere.getRoom(someRoom)
diosphere.addRoom(someRoom)
diosphere.updateRoom(someRoom)
diosphere.removeRoom(someRoom)
diosphere.addRoomDoor(someRoom, dooredRoom)
diosphere.removeRoomDoor(someRoom, dooredRoom)
diosphere.addRoomConnection(someRoom, dooredRoom)
diosphere.removeRoomConnection(someRoom, dooredRoom)
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
