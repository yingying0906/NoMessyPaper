import "./AddReferencePage.css";
import * as React from "react";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box } from "@mui/material";

import ManualReferenceFill from "./component/ManualReferenceFill";
import BibtexReference from "./component/BibtexReference";

const AddReferencePage = () => {
	const [value, setValue] = React.useState("1");

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<div className="AddReferencePage">
			<h2 style={{ textAlign: "start", marginTop: "1%" }}>
				Add Reference
			</h2>
			<div>
				<TabContext value={value}>
					<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
						<TabList
							onChange={handleChange}
							aria-label="lab API tabs example"
						>
							<Tab label="Plain Text" value="1" />
							<Tab label="Bibtex" value="2" />
						</TabList>
					</Box>
					<TabPanel value="1" style={{ padding: 0 }}>
						<ManualReferenceFill ref={null} type={null} />
					</TabPanel>
					<TabPanel value="2">
						<BibtexReference />
					</TabPanel>
				</TabContext>
			</div>
		</div>
	);
};

export default AddReferencePage;
