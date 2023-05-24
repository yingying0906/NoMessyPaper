import './SearchPage.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Row } from 'react-bootstrap';

import FetchPaperFromGoogleScholar from './FetchPaperFromGoogleScholar';
import ControlPanel from './ControlPanel';

// 開兩個terminal
// 一個terminal 需要先單獨運行server.js =>  node server.js
// 另一個terminal => npm start


const SearchPage = () => {
  const [text, setText] = useState("")
  const [keywords, setKeywords] = useState("")

  const [fromYear, setFromYear] = useState("")
  const [searchFromYear, setSearchFromYear] = useState("")

  const [toYear, setToYear] = useState("")
  const [searchToYear, setSearchToYear] = useState("")

  const [numOfResults, setNumOfResults] = useState("")
  const [searchNumOfResults, setSearchNumOfResults] = useState("")

  useEffect(() => {
    const savedText = sessionStorage.getItem('keywords');
    if (savedText) {
      setText(savedText);
      setKeywords(text)
    }
  }, []);

  function goHome() {
    setText("")
    setKeywords("")
    setFromYear("")
    setToYear("")
    setNumOfResults("")
    sessionStorage.setItem('keywords', "");
    sessionStorage.setItem('fromYear', "");
    sessionStorage.setItem('toYear', "");
    sessionStorage.setItem('numOfResults', "");
  }

  function inputChange(e) {
    setText(e.target.value)
  }

  function startSearch() {
    if (text !== "") {
      setKeywords(text)
      setSearchFromYear(fromYear)
      setSearchToYear(toYear)
      setSearchNumOfResults(numOfResults)

      sessionStorage.setItem('keywords', text);
      sessionStorage.setItem('fromYear', fromYear);
      sessionStorage.setItem('toYear', toYear);
      sessionStorage.setItem('numOfResults', numOfResults);
    }
  }

  return (
    <Container>
      <Row style={{ margin: "10px" }} >
        <div className='col-2 center'><div onClick={goHome} >Search Page</div></div>
        <div className='col-8'><Form.Control type="text" placeholder="You Only Have 100 Searches per month" value={text} onChange={inputChange} /></div>
        <div className='col-2'><Button color='info' onClick={startSearch}>Search</Button></div>
      </Row>
      {!keywords && <div style={{ fontSize: "50px" }} className='center'>Start Search</div>}
      {keywords && <Row>
        <div className='col-4'>
          <ControlPanel
            setFromYear={setFromYear}
            setToYear={setToYear}
            setNumOfResults={setNumOfResults} />
        </div>
        <div className='col-8'>
          <FetchPaperFromGoogleScholar
            searchKeyword={keywords}
            setSearchFromYear={searchFromYear}
            searchToYear={searchToYear}
            searchNumOfResults={searchNumOfResults} />
        </div>
      </Row>}
    </Container>
  );
};

export default SearchPage;
