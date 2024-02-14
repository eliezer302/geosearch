import React, { useState, useEffect, useRef } from 'react';
// Importamos Axios para la gestión de información del serverless
import axios from 'axios';
// Importamos los estilos de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// Importamos Leaflet para el uso del mapa
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';

function Pois() {
    // Los POIs
    const [pois, setPois]                             = useState([]);
    // Los Categorías de POIs
    const [categories, setCategories]                 = useState([]);
    // Los Categorías de POIs seleccionadas para filtrar
    const [selectedCategories, setSelectedCategories] = useState([]);
    // Errores
    const [error, setError]                           = useState(null);
    // Latitud de Almirante Pastene 244, Providencia.
    const latitude                                    = -33.4266707;
    // Longitud de Almirante Pastene 244, Providencia.
    const longitude                                   = -70.6202899;
    // Parámetros por defecto para la query
    const params                                      = { longitude: longitude, latitude: latitude };
    // Loading
    const [loading, setLoading]                       = useState(false);
    // Checkboxes de categorías
    const checkboxesRef                               = useRef([]);
    // Referencia para los marcadores
    const markersRef                                  = useRef(leaflet.layerGroup());
    // Iconos del mapa
    const markerIcon                                  = leaflet.icon({ iconUrl: process.env.PUBLIC_URL + 'map_icons/marker.png', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -30] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Iniciamos el mapa
                const categoriesResponse = await axios.get('https://idnxmednaca5ywjmfx4ctn3w3m0kllpx.lambda-url.us-east-1.on.aws/');
                setCategories(categoriesResponse.data);
                const response = await axios.get('https://qvp53axo7e5yqb7aprykzzsqgm0tqizm.lambda-url.us-east-1.on.aws', { params });
            
                // Iniciamos el mapa
                const map = leaflet.map('map').setView([latitude, longitude], 17);
                leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                // Agregamos el icono
                leaflet.marker([latitude, longitude], { icon: markerIcon }).addTo(map).bindPopup('Almirante Pastene 244, Providencia.');

                // Agregamos el grupo de marcadores al mapa
                markersRef.current.addTo(map);

                // Agregar marcadores para cada POI
                response.data.forEach(poi => {
                    let poiIcon = poiMarkers(poi.category_id);
                    leaflet.marker([poi.latitude, poi.longitude], { icon: poiIcon }).addTo(markersRef.current).bindPopup(strToTilteCase(poi.name));
                });
            } catch (error) {
                setError('Error al obtener los resultados. A01');
            }
        };

        fetchData();
    }, []);

    const poiMarkers = (category) => {
        let poiIcon;
        switch (category) {
            case 10004:
                poiIcon = leaflet.icon({ iconUrl: process.env.PUBLIC_URL + 'map_icons/restaurant.png', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -30] });
                break;
            case 10008:
                poiIcon = leaflet.icon({ iconUrl: process.env.PUBLIC_URL + 'map_icons/supermarket.png', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -30] });
                break;
            case 10029:
                poiIcon = leaflet.icon({ iconUrl: process.env.PUBLIC_URL + 'map_icons/coffee-tea.png', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -30] });
                break;
            case 10003:
                poiIcon = leaflet.icon({ iconUrl: process.env.PUBLIC_URL + 'map_icons/bank.png', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -30] });
                break;
            case 10084:
                poiIcon = leaflet.icon({ iconUrl: process.env.PUBLIC_URL + 'map_icons/storage.png', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -30] });
                break;
            case 10005:
                poiIcon = leaflet.icon({ iconUrl: process.env.PUBLIC_URL + 'map_icons/pharmacy.png', iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -30] });
                break;
            default:
                poiIcon = markerIcon;
        }
        return poiIcon;
    };

    const filterPois = async (event) => {
        try {
            setLoading(true);
            checkboxesRef.current.forEach(checkbox => (checkbox.disabled = true));
            
            const category  = event.target.value;
            const isChecked = event.target.checked;

            const checkboxCategories = isChecked ? [...selectedCategories, category] : selectedCategories.filter(item => item !== category);
            setSelectedCategories(checkboxCategories);
            if (checkboxCategories.length > 0) {
                params.categories = checkboxCategories.join(',');
            }

            const response = await axios.get('https://qvp53axo7e5yqb7aprykzzsqgm0tqizm.lambda-url.us-east-1.on.aws', { params });
            setPois(response.data);

            markersRef.current.clearLayers();
            response.data.forEach(poi => {
                let poiIcon = poiMarkers(poi.category_id);
                leaflet.marker([poi.latitude, poi.longitude], { icon: poiIcon }).addTo(markersRef.current).bindPopup(strToTilteCase(poi.name));
            });

            checkboxesRef.current.forEach(checkbox => (checkbox.disabled = false));
            setLoading(false);
        } catch (error) {
            setError('Error fetching data');
        }
    };

    const clearFilter = async () => {
        try {
            setLoading(true);
            setSelectedCategories([]);
            checkboxesRef.current.forEach(checkbox => checkbox.checked = false);
            params.categories = '';
            const response = await axios.get('https://qvp53axo7e5yqb7aprykzzsqgm0tqizm.lambda-url.us-east-1.on.aws', { params });
            setPois(response.data);

            markersRef.current.clearLayers();
            response.data.forEach(poi => {
                let poiIcon = poiMarkers(poi.category_id);
                leaflet.marker([poi.latitude, poi.longitude], { icon: poiIcon }).addTo(markersRef.current).bindPopup(strToTilteCase(poi.name));
            });

            setLoading(false);
        } catch (error) {
            setError('Error clearing filters');
        }
    };

    const strToTilteCase = (str) => {
        if (!str) {
            return ""
        }
        return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
    }

    return (
        <div id="poisContainer" className="container">
            <h3 className="text-center">Puntos de interes cerca de Almirante Pastene 244, Providencia.</h3>
            { error && <p className="text-danger">{error }</p>}
            <div className="row pois">
                <div className="col-md-3 categoryList">
	                <h3 className="mb-3">Categorías</h3>
	                {categories.map((category, index) => (
						<div key={index} className="form-check">
							<input
                                className="form-check-input"
                                type="checkbox"
                                value={ category.category_id }
                                id={ `category.category_id-${index}` }
                                onChange={ (event) => filterPois(event) }
                                data-name={ category.category_name }
                                ref={(el) => checkboxesRef.current[index] = el} />
							<label className="form-check-label" htmlFor={ `category.category_id-${index}` }>
								{ category.category_name }
							</label>
						</div>
					))}
					<button className="btn btn-danger mt-3" onClick={ clearFilter }>Limpiar filtros</button>
	            </div>
                <div className="col-md-9 poisList">
                    <h3>Puntos de interes</h3>
                    <div id="map" style={{ width: '100%', height: '600px' }}></div>
                </div>
            </div>
        </div>
    );
}

export default Pois;
