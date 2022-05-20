# Diograph

## Install

```
npm install @diograph/diograph
# or
yarn add @diograph/diograph
```

## Usage

```
import { Diograph } from '@diograph/diograph'
const diograph = new Diograph()
diograph.createDiory({ text: 'Hello diory!' })
console.log('Hello Diograph!', diograph)
```

## API

```
const diograph = new Diograph(diographObject)
```

### Diograph

```
diograph.addDiograph(diographObject)
diograph.queryDiograph({ text: 'some-text' })
diograph.resetDiograph()
diograph.toObject()
diograph.toJson()

diograph.getDiory(someDiory)
diograph.addDiory(someDiory)
diograph.updateDiory(someDiory)
diograph.removeDiory(someDiory)
diograph.addDioryLink(someDiory, linkedDiory)
diograph.removeDioryLink(someDiory, linkedDiory)
```

### Diory

```
const diory = new Diory()
diory.updateDiory(dioryObject)

diory.addLink(linkedDiory)
diory.removeLink(linkedDiory)

diory.toObject()
diory.toJson()
```

### Room

```
loadRoom(clients)
- set room object contents from room.json: connections & diograph
- initiate connections if proper client is passed

initiateRoom(clients, connections, diographObject)
- set room object contents from arguments: connections & diograph

addConnection(connection)
- attach a connection to room

removeConnection(connection)
- de-attach connection from room

readContent(contentUrl)
- read buffer of the given content

addContent(fileContent)
- adds content to nativeConnection

deleteRoom()
- delete room.json and diograph.json
- delete the folder in room.address

saveRoom()
- save room.json and diograph.json to room's writable media

toObject()
- room as RoomObject

toJson()
- room as JSON string
```

### Connection

```
initiateConnection()
- set connection object contens from arguments: contentUrls & diograph

addContentUrl(contentId)
- used when listing a content folder contents to connection
  - in this case content is not added to connection (as it already exists!)

addContent(fileContent, contentId)
- saves content to connection writable media
- adds contentUrl to connection contentUrls

readContent(contentId)
- content buffer
- loaded using the connection client

deleteContent(contentId)
- deletes contentId
- removes contentId from connection contentUrls listing

deleteConnection()
- calls deleteContent for each contentUrl
- delete the folder in connection.address

toObject()
- connection as ConnectionObject
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
