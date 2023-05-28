import { Accordion, AccordionDetails, AccordionSummary, AppBar, Box, Container, Input, Paper, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react"
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ControlPanel = ({ setFromYear, setToYear, setNumOfResults }) => {

    useEffect(() => {
        const savedFromYear = sessionStorage.getItem('fromYear');
        if (savedFromYear) {
            setFromYear(savedFromYear);
            setFromYearValue(savedFromYear);
        }
        const savedToYear = sessionStorage.getItem('toYear');
        if (savedToYear) {
            setToYear(savedToYear);
            setToYearValue(savedToYear);
        }
        const savedNumOfResults = sessionStorage.getItem('numOfResults');
        if (savedNumOfResults) {
            setNumOfResults(savedNumOfResults);
            setNumOfResultsValue(savedNumOfResults)
        }
    }, []);


    // year filter 
    const [fromYearValue, setFromYearValue] = useState("");
    const [toYearValue, setToYearValue] = useState("");
    function fromYearChange(e) {
        setFromYearValue(e.target.value)
        setFromYear(e.target.value)
    }
    function toYearChange(e) {
        setToYearValue(e.target.value)
        setToYear(e.target.value)
    }


    // number of results filter
    const [numOfResultsValue, setNumOfResultsValue] = useState("")
    function numOfResultsChange(e) {
        setNumOfResultsValue(e.target.value)
        setNumOfResults(e.target.value)
    }


    return (
        <Container >
            <Paper variant="outlined" sx={{ marginTop: "10px" }}>
                <AppBar position="static" sx={{ borderTopRightRadius: "10px", borderTopLeftRadius: "10px" }}>
                    <Typography variant="h4" sx={{ margin: "10px" }}>Filter Tool</Typography>
                </AppBar>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={{ justifyContent: "center" }}
                    >
                        <Typography>Year</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Box sx={{ display: "flex", maxWidth: "100px" }}>
                                <Input placeholder="From" value={fromYearValue}
                                    onChange={fromYearChange} />
                            </Box>
                            <Box sx={{ marginLeft: "10px", marginRight: "10px" }}>
                                <KeyboardDoubleArrowRightIcon />
                            </Box>
                            <Box sx={{ display: "flex", maxWidth: "100px" }}>
                                <Input placeholder="To" value={toYearValue}
                                    onChange={toYearChange} />
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Typography>Number of Results</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Box sx={{ display: "flex", maxWidth: "200px" }}>
                                <Input placeholder="Number" value={numOfResultsValue}
                                    onChange={numOfResultsChange} />
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>
                {/* <TreeView aria-label="file system navigator"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    sx={{ margin: "20px" }}>
                    <TreeItem label="Year" nodeId="1" sx={{ margin: "10px" }}>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
                            <Box sx={{ display: "flex", maxWidth: "100px", margin: "10px" }}>
                                <Input placeholder="From" value={fromYearValue}
                                    onChange={fromYearChange} />
                            </Box>
                            <Box sx={{ margin: "10px" }}>
                                <KeyboardDoubleArrowRightIcon />
                            </Box>
                            <Box sx={{ display: "flex", maxWidth: "100px", margin: "10px" }}>
                                <Input placeholder="To" value={toYearValue}
                                    onChange={toYearChange} />
                            </Box>
                        </Box>
                    </TreeItem>
                    <TreeItem label="Number of Results" nodeId="2" sx={{ margin: "10px" }}>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
                            <Box sx={{ display: "flex", maxWidth: "200px", margin: "10px" }}>
                                <Input placeholder="Number" value={numOfResultsValue}
                                    onChange={numOfResultsChange} />
                            </Box>
                        </Box>
                    </TreeItem>
                </TreeView> */}
            </Paper>
        </Container>
    )
}

export default ControlPanel