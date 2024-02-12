# Georesearch prueba
La aplicación Georesearch es una plataforma web desarrollada con ReactJS que permite buscar puntos de interés (POIs) cercanos a una ubicación específica.

# Instalación
Clona el repositorio:
git clone https://github.com/eliezer302/geosearch.git
cd georesearch

Instala las dependencias:
npm install

# Uso
Una vez que hayas instalado las dependencias, puedes iniciar la aplicación localmente ejecutando el siguiente comando:
npm start

Esto iniciará el servidor de desarrollo y abrirá la aplicación en tu navegador predeterminado. Si no se abre automáticamente, puedes acceder a la aplicación en http://localhost:3000.

La aplicación permite buscar puntos de interés cercanos proporcionando una longitud y latitud específicas, y filtrar los resultados por categoría. También puedes limpiar los filtros y ver la lista completa de POIs. Los POIs y categorías se obtienen de un serverless AWS Lambda.

# Obtener POIs
URL:
https://qvp53axo7e5yqb7aprykzzsqgm0tqizm.lambda-url.us-east-1.on.aws
Se deben enviar al menos los parámetros "longitude" y "latitude", también recibe "category" el cual debe corresponder al category_id de la BD en PostgreSQL georesearch pois y también recibe el parámetro order para ordernar ASC o DESC los resultados.

# Obtener categorías
URL:
https://idnxmednaca5ywjmfx4ctn3w3m0kllpx.lambda-url.us-east-1.on.aws
Esta devuelve las categorías y sus IDs
