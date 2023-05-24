import React, { useEffect, useState } from 'react';
import { Button, Card, } from 'react-bootstrap';

const FetchPaperFromGoogleScholar = ({ searchKeyword, setSearchFromYear, searchToYear, searchNumOfResults }) => {
    const [paperData, setPaperData] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // if want to search paper => use this  因為只能搜尋 100次/月 ， api_key=可以切換成自己的api_key (；´ﾟωﾟ｀人)
                // const response = await fetch(`http://localhost:3001/paper/search.json?engine=google_scholar&q=${searchKeyword}&hl=en&as_ylo=${setSearchFromYear}&as_yhi=${searchToYear}&num=${searchNumOfResults}&api_key=40ec1a6eed3621a8e92723e97d5ddf679d0de9afab41679a8e1c93dd3038c724`)
                //     .then(response => response.json());

                // if 使用已有的json檔 => use this
                const response = await fetch("http://localhost:3001/paper")
                    .then(response => response.json())


                setPaperData([...response.organic_results]);
            } catch (error) {
                console.error('Error fetching paper data:', error);
            }
        };
        fetchData();
        console.log("==========================================")
    }, [searchKeyword,
        setSearchFromYear,
        searchToYear,
        searchNumOfResults]);

    function saveData(data) {
        console.log(data)
        // console.log(data.title) // title
        // console.log(data.publication_info.authors) // authors

        // year 和 journal 不知道怎麼找... _:(´□`」 ∠):_
    }

    return (
        <div style={{ overflowY: "auto", height: "90vh" }} >
            <div className='col'>
                {paperData && paperData.map((data, index) => {
                    return (
                        <div className='row-10' key={index}>
                            <div className='card' style={{ margin: "10px" }} >
                                <div className='card-body'>
                                    <div className="card-title card-title-text" color="blue">
                                        <Card.Link href={data.link} className='card-link-noUnderline'>
                                            {data.title}
                                        </Card.Link>
                                    </div>
                                    <div className='card-text' style={{ margin: "5px" }}>
                                        {data.publication_info.summary}
                                    </div>
                                    {data.resources && <Card.Link href={data.resources[0].link}>
                                        <Button variant="outline-info" style={{ margin: "5px" }}>
                                            PDF Link
                                        </Button>
                                    </Card.Link>}

                                    {/* {data.resources &&
                                        <Button variant="outline-danger"
                                            style={{ margin: "5px" }}>
                                            PDF Save
                                        </Button>} */}

                                    {<Button variant="outline-danger"
                                        style={{ margin: "5px" }}
                                        onClick={() => saveData(data)}>
                                        console.log information
                                    </Button>}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default FetchPaperFromGoogleScholar;