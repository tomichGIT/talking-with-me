CAmbios que fuí haciendo para lograr el deploy

crear archivo .env para openAI API key.

en package.json crear los scripts:
    "deploy": "netlify deploy --prod",
    "start":"node functions/api.js"

en netlify.toml actualizar node de 16 a 18 y el nombre de la función


Para cargar las variables de entorno se puede usar netlify-cli o desde el panel de control
netlify env:set VARIABLE_NAME=variable_value