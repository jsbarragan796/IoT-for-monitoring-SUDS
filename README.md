# MI SUDS
Monitoreo Ingeligente de Sistemas de Drenage Sostenible

<p align="center">
<img src="https://user-images.githubusercontent.com/20799513/62122604-b21db380-b28b-11e9-9699-deeef2bdb006.png" height="300">
</p>
# Manual de despliegue

Este manual está dirigido a un profesional de software para que administre y mantenga a MISUDS.
## Arquitectura
### Diagrama de componentes 
<img width="746" alt="compomentes" src="https://user-images.githubusercontent.com/20799513/62123447-90bdc700-b28d-11e9-9a86-f92fd7d3699f.png">
Mi suds cuenta con 13 componentes, primero está la **entidad fisica** que es la encargada de tomar las medidiones de los sensores y consumir del componente de **comunicación especializada en IoT** para el envio de los datos. El componente de comunicación luego comsume del componente **reception** el cual consume del componente de **in memory database** para establecer el tipo de dato, esto es requerido para establecer que tópico se va a publicar en el **Message Broker**. El componente **Crude data** se encuentra suscrito al message broker para guardar mediciones en la **time series database**. El compomente  **Event manager** se suscribe al broker y consume del **document database** para establecer el si un evento debe finalizarce. El comonente de **notification** se suscribe al broker, para el envio de mensajes cuando inicia un evento. 
