const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position)=>{
        const { latitude, longitude } = position.coords;

        socket.emit("send-location", { latitude, longitude })
    }, (error)=>{
        console.error(error)
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    });
}

var map = L.map('map').setView([0, 0], 13);

var greenIcon = L.icon({
    iconUrl: 'images/white-Photoroom.png',

    iconSize:     [60, 90], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const markers = {};

socket.on("receive-location", (data)=>{
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 16)
    if (markers[id]) {
        markers[id].setLatLang([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude], {icon: greenIcon}).addTo(map);
    }


})

socket.on('user-disconnected', (id)=>{
    if (markers[id]) {
        map.removaLayer(markers[id]);
        delete markers[id];
    }
})

