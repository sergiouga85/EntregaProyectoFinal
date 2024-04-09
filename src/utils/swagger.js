import swaggerJSDoc from "swagger-jsdoc"

const swaggerOptions = {
    definition:{
        openapi: '3.0.1',
        info: {
            version: '1.0.0',
            title: 'Ecommerce DigitalStore',
            description: "Documentacion de ecommerce"
        },
    },
    apis:[`./docs/**/*.yaml`]
}

export const specs = swaggerJSDoc(swaggerOptions)