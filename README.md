# MI SUDS
Monitoreo Ingeligente de Sistemas de Drenage Sostenible

<p align="center">
<img height="300" src="https://user-images.githubusercontent.com/20799513/62122604-b21db380-b28b-11e9-9699-deeef2bdb006.png" height="300">
</p>

# Manual de despliegue

Este manual está dirigido a un profesional de software para que administre y mantenga a MISUDS.
## Arquitectura
### Diagrama de componentes 
<p align="center">
<img height="300" alt="compomentes" src="https://user-images.githubusercontent.com/20799513/62123447-90bdc700-b28d-11e9-9a86-f92fd7d3699f.png">
 </p>


La **Entidad física** toma las mediciones de los sensores y consume del componente de **Comunicación especializada en IoT** para el envío de los datos. El componente de comunicación luego consume del componente **Reception** el cual consume del componente de **In memory database** para establecer el tipo de dato y establecer qué tópico se va a publicar en el **Message broker**. El componente **Crude data** se encuentra suscrito al message broker para guardar mediciones en la **Time series database**. El componente **Event manager** está suscrito al broker y consume del **Document database** para establecer si un evento debe finalizarse. El componente de **Notification** se suscribe al broker, para el envío de mensajes cuando inicia un evento. El **Aggregate data** realiza procesamiento de la data almacenada en 
time series database y guarda los resultados en la document database. Se suscribe al broker para determinar cuándo debe procesar las mediciones de un evento. Por ultimo **Historical serving** consume de las bases de datos para exponerle al **Web client** la información de los eventos que consume el usuario final. 

### Diagrama de despliegue

<p align="center">
<img height="500" alt="compomentes" src="https://user-images.githubusercontent.com/20799513/62128912-1b58f300-b29b-11e9-9d12-1371a504ca15.png">
 </p>

MISUDS está desplegado en 5 servidores 



## Software Requerido

* **NodeJS**
Es el ambiente de ejecución de JavaScript con el cual se construyeron todos los servicios. La versión utilizada fue la 8. https://nodejs.org/en/ 

* **Nodemon**
Es una herramienta utilizada en desarrollo para correr un daemon de nodejs que reinicie el proceso cada vez que se guardan los cambios. https://nodemon.io/ 

* **PM2**
Manejador de procesos de nodeJS. Se utiliza para correr los procesos de los servicios de backend. http://pm2.keymetrics.io/ 


## Poner en operación

A continuación se muestra en detalle la configuración de cada uno de los componentes. 

### Message Broker - Apache Kafka
La instalación de Apache Kakfa se realizó según este link: https://www.digitalocean.com/community/tutorials/how-to-install-apache-kafka-on-ubuntu-18-04,  como lo indica el link, se configuró un servicio para que se corra automáticamente Apache y Zookeper con el inicio de la máquina.

Como lo indica la guía, se crearon dos servicios, ‘zookeper’ y ‘kafka’, estos están configurados para que inicien con el encendido de la máquina.

En el link también se encuentran instrucciones para crear los tópicos, los cuales tienen los siguientes nombres:
-	‘event-start’
-	‘event-finish’
-	‘measurement’
-	‘healthcheck’

### Bases de Datos

#### InfluxDB

Se siguieron las instrucciones del siguiente tutorial: https://computingforgeeks.com/install-influxdb-on-ubuntu-18-04-and-debian-9/. Como lo indican las instrucciones, se creó el servicio ‘influxdb’, que inicia con la máquina.

#### MongoDB

Se siguieron las instrucciones del siguiente tutorial: https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-18-04, se  configuró un servicio ‘mongodb’ para que se inicie con la máquina.

#### Redis

Se siguieron las intrucciones del siguiente tutorial: https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04. Se configuró el servicio ‘redis’ para que este inicie cuando inicie la máquina.
Servicios Backend

### Variables de Ambiente
Para correr estos procesos en necesario tener instalado nodeJS, junto con el administrador de procesos PM2. 
 
Todos los servicios están en el mismo repositorio en un directorio correspondiente a su servicio. Todos estos procesos requieren un archivo ‘.env’, donde van escritas las variables de entorno. Para facilitar el despliegue se sugiere generar el mismo archivo para todos, únicamente cambiando la variable para el puerto, para aquellos que lo requieran. 

Las variables generales son las siguientes:
```
PORT => El puerto donde va a correr el proceso

LOG_DIRECTORY = 'logs/application' => El directorio donde van a ir los logs, si el proceso maneja logging. Es importante que este directorio exista.

KAFKA_HOST => La dirección de la máquina donde se corre Kafka.

KAFKA_PORT=> El puerto donde se corre Kafka.

MONGODB_URI => La URI de conexión a la base de datos de MongoDB.

INFLUX_DB_DATABASE= El nombre de la base de datos de Influx.

INFLUX_DB_HOST = La dirección de la máquina donde se corre la base de datos de Inlfux.
 
INFLUX_DB_PORT = 8086 => El puerto donde se corre la base de datos de Influx.
 
INFLUX_DB_USERNAME = El usuario con el cual se accede a la base de datos de Influx. 

INFLUX_DB_PASSWORD = La contraseña con la cuál se accede a la base de datos de Influx.

INFLUX_DB_PROTOCOL = 'http' => El protocolo que se utiliza para la conexión con Influx.

SENSOR_SECRET_TOKEN => La clave secreta con la cuál se autentica SigFox. Esta variable sólo es requerida por el nodo de recepción.

REDIS_URL = La URL de conexión a Redis. Esta variable sólo es requerida por el nodo de recepción.

AWS_ACCESS_KEY_ID = El identificador de la llave de acceso de AWS, es utilizada para consumir el servicio de notificaciones de mensaje de texto, SNS.

AWS_SECRET_ACCESS_KEY = La llave secreta de acceso de AWS, es utilizada para consumir el servicio de notificaciones de mensaje de texto, SNS. 
```

A continuación se muestran las variables de entorno de cada componente:

Reception
Requiere las variables:
-	PORT.
-	SENSOR_SECRET_TOKEN.
-	LOG_DIRECTORY.
-	REDIS_URL.
-	MONGODB_URI.
-	KAFKA_HOST.
-	KAFKA_PORT.

Event Manager
Requiere las variables:
-	LOG_DIRECTORY.
-	MONGODB_URI.
-	KAFKA_HOST.
-	KAFKA_PORT.

Crude Data
-	LOG_DIRECTORY
-	KAFKA_HOST
-	KAFKA_PORT
-	INFLUX_DB_DATABASE
-	INFLUX_DB_HOST
-	INFLUX_DB_PORT
-	INFLUX_DB_USERNAME
-	INFLUX_DB_PASSWORD
-	INFLUX_DB_PROTOCOL

Aggregate Data
-	LOG_DIRECTORY
-	KAFKA_HOST
-	KAFKA_PORT
-	MONGODB_URI
-	INFLUX_DB_DATABASE
-	INFLUX_DB_HOST
-	INFLUX_DB_PORT
-	INFLUX_DB_USERNAME
-	INFLUX_DB_PASSWORD
-	INFLUX_DB_PROTOCOL

Notification
-	KAFKA_HOST
-	KAFKA_PORT
-	MONGODB_URI
-	AWS_ACCESS_KEY_ID
-	AWS_SECRET_ACCESS_KEY

Historical Serving
-	PORT
-	MONGODB_URI
-	INFLUX_DB_DATABASE
-	INFLUX_DB_HOST
-	INFLUX_DB_PORT
-	INFLUX_DB_USERNAME
-	INFLUX_DB_PASSWORD
-	INFLUX_DB_PROTOCOL
-	SOCKET_PORT


### Comandos de despliegue

Para correr cualquier proceso por primera vez se deben ejecutar el comando ```npm install```, para instalar las dependencias, y luego ```npm run first-deploy``` para ejecutarlo. Si el proceso ya está corriendo y hay un cambio a nivel de código, sólo es necesario ejecutar el comando ```npm run deploy``` para hacer efectivos los cambios. Para ver los procesos corriendo actualmente se puede ejecutar el comando ```pm2 list```.


### Servicios de AWS
Actualmente se está consumiendo el servicio Amazon SES para el envío de notificaciones por mensaje de texto. Para configurarlo es necesario crear una cuenta en AWS, y mediante Amazon IAM, que es el servicio de identificación y acceso, se crea una cuenta programática.

<p align="center">
<img height="500" alt="compomentes" src="https://user-images.githubusercontent.com/20799513/62859197-0e3bfb00-bcc2-11e9-954a-4e21b2ce435f.png">
 </p>

Es importante que al usuario se le asocie con la política de acceso al servicio.

 <p align="center">
<img height="500" alt="compomentes" src="https://user-images.githubusercontent.com/20799513/62859230-29a70600-bcc2-11e9-8594-0473ccb5fa64.png">
 </p>

Al finalizar la creación, se podrá ver la llave de acceso y el secret del usuario.




### Cliente web
c	Configuración de servidor web 
Para el despliegue es necesario en la ruta /dashboard crear un .env con el puerto donde se ejecutará el tiente. La variable tiene que ser  llamada PORT.

###	Autenticación

Para el despliegue se requiere crear una aplicación en Auth0 para permitir la autenticación, para obtener las llaves de la autenticación se siguió la siguente guia https://auth0.com/docs/quickstart/spa/react#get-your-application-keys. Una vez creada la aplicación y con las llaves generadas se requiere introducirlas en un archivo .env en la ruta/dashboard/front 
```
REACT_APP_DOMAIN=ejemplo.auth0.com'
REACT_APP_CLIENT_ID='EJEMPLO'
REACT_APP_CALLBACK_URL='http://EJEMPLO/callback'
```
El domain y el clientID son provistos por auth0, sin embargo es necesario tener la url donde va estar desplegada la aplicación para así asignarla en ```AUTH_CONFIG``` y en los ajustes de la aplicación en auth0. A continuacion una guia para la configuración del callback https://auth0.com/docs/quickstart/spa/react#configure-callback-urls. 

### Conexión con historical serving

Para conectarte con el servicio de historical serving es necesario definir una variable en el .env ubicado en la ruta /dashboard/front/ con la url donde se ejecuta historical serving. El nombre debe ser el siguiente.
```
REACT_APP_HISTORICAL_SERVING
REACT_APP_HISTORICAL_SERVING_SOCKET
```

### Build de React y despliegue 

Una vez completado los puntos anteriores en la ruta  ```/dashboard/front/``` se requiere ejecutar en la consola  ```npm run build``` posterior a este comando en la ruta  ```/dashboard``` ejecutar ```npm run start``` . En este punto el cliente estará ejecutándose en el puerto definido en el .env. 



