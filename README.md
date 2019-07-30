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


