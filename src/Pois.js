import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Pois() {
    // Los POIs
    const [pois, setPois]                                          = useState([]);
    // Los Categorías de POIs
    const [categories, setCategories]                              = useState([]);
    // Los Categorías de POIs seleccionadas para filtrar
    const [selectedCategories, setSelectedCategories]              = useState([]);
    // Select de orden
    const [order, setOrder]                                        = useState('ASC');
    // Los Categorías de POIs seleccionadas para mostrar
    const [selectedCategoryNames, setSelectedCategorieNames]       = useState([]);
    const [selectedCategoryNamesTmp, setSelectedCategorieNamesTmp] = useState([]);
    // Errores
    const [error, setError]                                        = useState(null);
    // Longitud de Almirante Pastene 244, Providencia.
    const longitude                                                = -70.6202899;
    // Latitud de Almirante Pastene 244, Providencia.
    const latitude                                                 = -70.6202899;
    // Parámetros por defecto para la query
    const params                                                   = { longitude: longitude, latitude: latitude };
    // Loading
    const [loading, setLoading]                                    = useState(false);
    // Checkboxes de categorías
    const checkboxesRef                                            = useRef([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesResponse = await axios.get('https://idnxmednaca5ywjmfx4ctn3w3m0kllpx.lambda-url.us-east-1.on.aws/');
                setCategories(categoriesResponse.data);
                const response = await axios.get('https://qvp53axo7e5yqb7aprykzzsqgm0tqizm.lambda-url.us-east-1.on.aws', { params });
                setPois(response.data);
            } catch (error) {
                setError('Error al obtener los resultados. A01');
            }
        };

        fetchData();
    }, []);

    const handleOrderChange = (event) => {
        const selectedOrder = event.target.value;
        setOrder(selectedOrder);
        params.order = selectedOrder;
        filterPois();
    };

    const categoryChange = (event) => {
        const category     = event.target.value
        const categoryName = event.target.dataset.name;
        const isChecked    = event.target.checked;
    	if (isChecked) {
            setSelectedCategories([...selectedCategories, category]);
    		setSelectedCategorieNamesTmp([...selectedCategoryNamesTmp, categoryName]);
    	} else {
            setSelectedCategories(selectedCategories.filter(item => item !== category));
    		setSelectedCategorieNamesTmp(selectedCategoryNamesTmp.filter(item => item !== categoryName));
    	}
    };

    const filterPois = async () => {
    	try {
            setSelectedCategorieNames(selectedCategoryNamesTmp);
            setLoading(true);
    		if(selectedCategories.length > 0) {
    			params.categories = selectedCategories.join(',');
    		}
    		const response = await axios.get('https://qvp53axo7e5yqb7aprykzzsqgm0tqizm.lambda-url.us-east-1.on.aws', { params });
    		setPois(response.data);
            setLoading(false);
    	} catch (error) {
    		setError('Error fetching data');
    	}
    };

    const clearFilter = async () => {
        try {
            setLoading(true);
            setSelectedCategories([]);
            setSelectedCategorieNames([]);
            setSelectedCategorieNamesTmp([]);
            checkboxesRef.current.forEach(checkbox => checkbox.checked = false);
            params.categories = '';
            const response = await axios.get('https://qvp53axo7e5yqb7aprykzzsqgm0tqizm.lambda-url.us-east-1.on.aws', { params });
            setPois(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error clearing filters');
        }
    };

    return (
        <div id="poisContainer" className="container">
            <h3 className="text-center">Puntos de interes cerca de Almirante Pastene 244, Providencia.</h3>
            { error && <p className="text-danger">{error }</p>}
            <div className="row pois">
                <div className="col-md-3 categoryList">
	                <h3 className="mb-3">Categorías</h3>
                    <div className="d-flex align-items-center mb-3">
                        <select className="form-select" value={order} onChange={handleOrderChange}>
                            <option value="ASC">Más cercano</option>
                            <option value="DESC">Más lejano</option>
                        </select>
                    </div>
	                {categories.map((category, index) => (
						<div key={index} className="form-check">
							<input
                                className="form-check-input"
                                type="checkbox"
                                value={ category.category_id }
                                id={ `category.category_id-${index}` }
                                onChange={ categoryChange }
                                data-name={ category.category_name }
                                ref={(el) => checkboxesRef.current[index] = el} />
							<label className="form-check-label" htmlFor={ `category.category_id-${index}` }>
								{ category.category_name }
							</label>
						</div>
					))}
                    <button className="btn btn-primary mt-3" onClick={ filterPois }>Filtrar puntos de interes</button>
					<button className="btn btn-danger mt-3" onClick={ clearFilter }>Limpiar filtro</button>
	            </div>
                <div className="col-md-9 poisList">
                    <h3>Puntos de interes</h3>
                    <ul className="list-group mb-3">
                        { selectedCategoryNames.length > 0 && (
                            <div>
                                { selectedCategoryNames.map((category, index) => (
                                    <span key={ index }>{ category }{ index !== selectedCategoryNames.length - 1 ? ', ' : '.' } </span>
                                ))}
                            </div>
                        )}
                    </ul>
                    { loading && (
                        <div className="d-flex justify-content-center mt-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                    { !loading && !error && (
                        <ul className="list-group">
                            {pois.map((item, index) => (
                                <li key={ index } className="list-group-item">{ item.name }</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Pois;
