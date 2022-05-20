const Ajv = require('ajv')
const ajv = new Ajv({ allErrors: true })
// const addFormats = require('ajv-formats')
// addFormats(ajv)

const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: {
    type: 'object',
    additionalProperties: false,
    required: ['id', 'created', 'modified'],
    properties: {
      id: { type: 'string' },
      text: { type: 'string' },
      date: { type: 'string' /* format: 'date-time' */ },
      latlng: { type: 'string' /* format: 'geolocation' */ },
      image: { type: 'string' },
      modified: { type: 'string' /* format: 'date-time' */ },
      created: { type: 'string' /* format: 'date-time' */ },
      links: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            path: { type: 'string' },
          },
          required: ['id', 'path'],
          additionalProperties: false,
        },
      },
      data: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['@context', '@type', 'contentUrl', 'encodingFormat'],
          properties: {
            '@context': { type: 'string' },
            '@type': { type: 'string' },
            contentUrl: { type: 'string' },
            encodingFormat: { type: 'string' },
            height: { type: 'number' },
            width: { type: 'number' },
            duration: { type: 'string' },
          },
        },
      },
    },
  },
  // TODO: Make '/' required
  // required: ['/'],
}

export const validateDiograph = (diographObject: object) => {
  const validate = ajv.compile(schema)

  const isValid = validate(diographObject)

  if (!isValid) {
    console.log('Diograph is not valid: ' + JSON.stringify(validate.errors))
    throw new Error('Diograph is not valid: ' + JSON.stringify(validate.errors))
  }
}
