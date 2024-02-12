import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function LambdaResults() {
	const [data, setData]                             = useState([]);
	const [categories, setCategories]                 = useState([]);
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [error, setError]                           = useState(null);
	const longitude                                   = -70.6202899;
	const latitude                                    = -70.6202899;
	const params                                      = { longitude: longitude, latitude: latitude };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesResponse = await axios.get('https://idnxmednaca5ywjmfx4ctn3w3m0kllpx.lambda-url.us-east-1.on.aws/');
                setCategories(categoriesResponse.data);
                const response = await axios.get('https://qvp53axo7e5yqb7aprykzzsqgm0tqizm.lambda-url.us-east-1.on.aws', { params });
                setData(response.data);
            } catch (error) {
                setError('Error al obtener los resultados. A01');
            }
        };

        fetchData();
    }, []);

    const handleCategoryChange = (event) => {
		const category  = event.target.value;
		const isChecked = event.target.checked;
    	if (isChecked) {
    		setSelectedCategories([...selectedCategories, category]);
    	} else {
    		setSelectedCategories(selectedCategories.filter(item => item !== category));
    	}
    };

    const filterPOIsByCategories = async () => {
    	try {
    		if(selectedCategories.length > 0) {
    			params.categories = selectedCategories.join(',');
    		}
    		const response = await axios.get('https://qvp53axo7e5yqb7aprykzzsqgm0tqizm.lambda-url.us-east-1.on.aws', { params });
    		setData(response.data);
    	} catch (error) {
    		setError('Error fetching data');
    	}
    };

    return (
        <div className="container">
            <h1 className="text-center">Puntos de interes cerca de Almirante Pastene 244, Providencia.</h1>
            {error && <p className="text-danger">{error}</p>}
            <div className="row">
                <div className="col-md-3">
	                <h3>Categorías</h3>
	                {categories.map((category, index) => (
						<div key={index} className="form-check">
							<input className="form-check-input" type="checkbox" value={ category.category_id } id={`category.category_id-${index}`} onChange={handleCategoryChange} />
							<label className="form-check-label" htmlFor={`category.category_id-${index}`}>
								{ category.category_name }
							</label>
						</div>
					))}
					<button className="btn btn-primary mt-3" onClick={filterPOIsByCategories}>Filtrar puntos de interes</button>
	            </div>
                <div className="col-md-9">
                    <h3>Puntos de interes</h3>
                    <ul className="list-group">
                        {data.map((item, index) => (
                            <li key={index} className="list-group-item">{ item.name }</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default LambdaResults;
