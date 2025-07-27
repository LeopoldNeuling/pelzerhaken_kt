//libraries
import { useState, useEffect, useRef, Fragment } from "react";
import moment from "moment";
//@mui
import {
	Button,
	Box,
	MenuItem,
	FormControl,
	Select,
	InputLabel,
	InputAdornment,
	IconButton,
	OutlinedInput,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Card,
	CardContent,
	CardMedia,
} from "@mui/material";
import {
	CheckCircle,
	Cancel,
	IosShare,
	AddBoxOutlined,
	ArrowBackIosNew,
	ArrowForwardIos,
} from "@mui/icons-material";
import { pink, green } from "@mui/material/colors";
//components
import "./App.css";
import DayDisplayCard from "./submodules/DayDisplayCard";
import AppBar from "./submodules/AppBar";

export const __KEY = "Token KBPSA0Xs1VSu8HA8hXNs98FqpnrrylSk";
const __weatherAPIkey = "4ZMKD968AF3HFHKAHTUABCHJX";
const __pass = "pelzerhaken2014";
export const groupDataBaseCodes = {
	Klabauter: "461578",
	Haifische: "461603",
	Delfine: "461604",
	Piraten: "461605",
	Wassermänner: "461606",
	Robben: "461607",
	Seeteufel: "461608",
	Krabben: "461609",
};

export const isMobile = () => {
	const deviceDependant =
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);
	const widthDependant = window.innerWidth < 900;
	return {
		deviceBased: deviceDependant,
		widthBased: widthDependant,
	};
};

function App() {
	// ***GROUP SELECT*** ------------------------------------------------------------------------------------------------------------

	const [groupSelected, setGroupSelected] = useState("Klabauter");
	const selectedGroupChanged = (event) => {
		setGroupSelected(event.target.value);
	};
	const groupNames = [];
	Object.keys(groupDataBaseCodes).forEach((key) => {
		groupNames.push(key);
	});
	const [groupState, __] = useState([...groupNames]);

	// *** SIGN IN *** ---------------------------------------------------------------------------------------------------------------

	const [userStatus, setUserStatus] = useState("guest");
	const [showPasswordField, setShowPasswordField] = useState(false);
	const [passwordFieldError, setPasswordFieldError] = useState(false);
	const passwordRef = useRef();

	function signIn() {
		if (passwordRef.current.value === __pass) {
			setUserStatus("admin");
			hidePasswordField();
		} else {
			setPasswordFieldError(true);
		}
	}
	const hidePasswordField = () => {
		setShowPasswordField(false);
		setPasswordFieldError(false);
	};

	// ***PAGE CONTENT*** ------------------------------------------------------------------------------------------------------------

	const [pageState, setPageState] = useState([
		["Montag"],
		["Dienstag"],
		["Mittwoch"],
		["Donnerstag"],
		["Freitag"],
	]);
	const [pagePointer, setPagePointer] = useState(0);
	const dayCardWidthInVW = 80;
	const dayCardHeightInVH = 67.5;

	useEffect(() => {
		async function getWeather(pageArray) {
			const today = moment();
			let startPos;
			let daysUntilNextMonday;
			let weekend = false;
			switch (today.format("dddd").substring(0, 3)) {
				case "Mon":
					startPos = 0;
					break;
				case "Tue":
					startPos = 1;
					break;
				case "Wed":
					startPos = 2;
					break;
				case "Thu":
					startPos = 3;
					break;
				case "Fri":
					startPos = 4;
					break;
				case "Sat":
					startPos = 0;
					weekend = true;
					daysUntilNextMonday = 2;
					break;
				case "Sun":
					startPos = 0;
					weekend = true;
					daysUntilNextMonday = 1;
					break;
			}
			const startDate = !weekend
				? today.format("YYYY-MM-DD")
				: today.add(daysUntilNextMonday, "days").format("YYYY-MM-DD");

			const endDate = today.add(4 - startPos, "days").format("YYYY-MM-DD");

			const fetching = await fetch(
				`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Pelzerhaken,Germany/${startDate}/${endDate}?key=${__weatherAPIkey}&unitGroup=metric`
			);
			const response = await fetching.json();
			const path = response.days;
			for (let i = 0; i < path.length; i++) {
				pageArray[i + startPos].push(Math.round(path[i].tempmax), path[i].icon);
			}
			setPageState(pageArray);
		}
		async function fetchDaySchedules() {
			const fetching = await fetch(
				`https://api.baserow.io/api/database/rows/table/${groupDataBaseCodes[groupSelected]}/?user_field_names=true`,
				{
					headers: {
						Authorization: __KEY,
					},
					method: "GET",
				}
			);
			const response = await fetching.json();
			const path = response.results;
			const pageBuffer = [
				["Montag"],
				["Dienstag"],
				["Mittwoch"],
				["Donnerstag"],
				["Freitag"],
			];
			for (let i = 0; i < path.length; i++) {
				pageBuffer[i].push(
					path[i].morning,
					path[i].afternoon,
					path[i].id,
					path[i].template
				);
			}
			getWeather(pageBuffer);
		}
		function setCurrentDay() {
			const today = moment().format("dddd").substring(0, 3);
			switch (today) {
				case "Mon":
					setPagePointer(0);
					break;
				case "Tue":
					setPagePointer(1);
					break;
				case "Wed":
					setPagePointer(2);
					break;
				case "Thu":
					setPagePointer(3);
					break;
				case "Fri":
					setPagePointer(4);
					break;
				default:
					setPagePointer(0);
			}
		}
		setCurrentDay();
		fetchDaySchedules();
	}, [groupSelected, userStatus]);

	// ***NAVIGATION BUTTONS, SWIPE HANDLER*** ---------------------------------------------------------------------------------------

	const [xInteraction, setXInteraction] = useState();
	const swipeIgnoreValue = 50;
	const pagePointerIncrement = () => {
		pagePointer === pageState.length - 1
			? setPagePointer(0)
			: setPagePointer((prev) => {
					return prev + 1;
			  });
	};
	const pagePointerDecrement = () => {
		pagePointer === 0
			? setPagePointer(pageState.length - 1)
			: setPagePointer((prev) => {
					return prev - 1;
			  });
	};

	// *** MOBILE TUTORIALS *** ------------------------------------------------------------------------------------------------------

	const [mobileDialogOpen, setMobileDialogOpen] = useState(false);
	const [mobileDialogType, setMobileDialogType] = useState();
	const openMobileDialog = (type) => {
		setMobileDialogType(type);
		setMobileDialogOpen(true);
	};
	const closeMobileDialog = () => {
		setMobileDialogOpen(false);
	};

	// *** RENDER *** ----------------------------------------------------------------------------------------------------------------

	return (
		<>
			{/*** MAIN PAGE -----------------------------------------------------------------------------------------------------***/}

			<Box
				display={"flex"}
				flexDirection={"column"}
				justifyContent={"center"}
				alignItems={"space-between"}
				height={"100svh"}
				sx={{ overflow: "hidden" }}
			>
				{/*** SIGN IN ---------------------------------------------------------------------------------------------------***/}

				<AppBar
					toggleDialog={(type) => {
						openMobileDialog(type);
					}}
					togglePassword={() => {
						setShowPasswordField(true);
					}}
					degradeUser={() => {
						setUserStatus("guest");
					}}
					userStatus={userStatus}
				/>

				{/***PAGE CONTENT -----------------------------------------------------------------------------------------------***/}

				<Box
					position={"relative"}
					height={`80vh`}
					width={
						isMobile()["widthBased"]
							? `${dayCardWidthInVW * pageState.length}vw`
							: "100vw"
					}
					display={"flex"}
					flexDirection={"row"}
					justifyContent={"center"}
					alignItems={"center"}
					sx={
						isMobile()["widthBased"]
							? {
									translate: `${
										dayCardWidthInVW / 7.5 - dayCardWidthInVW * pagePointer
									}vw`,
									transition: "ease 0.5s",
							  }
							: {}
					}
					onTouchStart={(e) => {
						setXInteraction((_prev) => {
							return e.changedTouches[0].clientX;
						});
					}}
					onTouchEnd={(e) => {
						const endPos = e.changedTouches[0].clientX;
						if (Math.abs(xInteraction - endPos) > swipeIgnoreValue)
							xInteraction > endPos ? pagePointerIncrement() : pagePointerDecrement();
					}}
				>
					{pageState[0].length > 1 ? (
						<>
							{pageState.map((day, i) => (
								<DayDisplayCard
									dayInformation={day}
									iteration={i}
									width={dayCardWidthInVW}
									height={dayCardHeightInVH}
									pointer={pagePointer}
									ableToEdit={userStatus === "admin"}
									groupCode={groupSelected}
									key={i}
								/>
							))}
						</>
					) : (
						<></>
					)}
				</Box>

				{/***FOOTER FORMS -----------------------------------------------------------------------------------------------***/}

				<Box
					marginLeft={"1vw"}
					marginRight={"1vw"}
					position={"absolute"}
					bottom={"1vh"}
					zIndex={100}
				>
					<FormControl
						sx={{
							width: "98vw",
						}}
					>
						{showPasswordField ? (
							<>
								{/*** PASSWORD FIELD ***/}
								<InputLabel htmlFor="outlined-adornment-password">
									Admin Passwort
								</InputLabel>
								<OutlinedInput
									id="outlined-adornment-password"
									type="password"
									inputRef={passwordRef}
									error={passwordFieldError}
									autoFocus
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="cancel sign in"
												edge="end"
												onClick={hidePasswordField}
											>
												<Cancel htmlColor={pink[500]} />
											</IconButton>
											<IconButton aria-label="sign in" onClick={signIn} edge="end">
												<CheckCircle htmlColor={green[500]} />
											</IconButton>
										</InputAdornment>
									}
									label="Admin Passwort"
								/>
							</>
						) : (
							<>
								{/*** GROUP SELECT ***/}
								<InputLabel id="demo-simple-select-label">Kindertreff Name</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={groupSelected}
									label="Kindertreff Name"
									onChange={selectedGroupChanged}
								>
									{groupState.map((group, i) => (
										<MenuItem key={i} value={group}>
											{group}
										</MenuItem>
									))}
								</Select>
							</>
						)}
					</FormControl>
				</Box>
			</Box>

			{/*** TUTORIALS -----------------------------------------------------------------------------------------------------***/}

			<Fragment>
				<Dialog open={mobileDialogOpen} onClose={closeMobileDialog}>
					<DialogTitle>
						{`Wie speichere ich diese Website als App auf meinem ${
							mobileDialogType === "apple"
								? "iPhone"
								: "Android Gerät (Google Chrome Browser)"
						}?`}
					</DialogTitle>
					<DialogContent>
						<Card>
							<CardMedia
								sx={{ height: mobileDialogType === "apple" ? 100 : 700 }}
								image={`/tutorials/${
									mobileDialogType === "apple"
										? "for_apple_step_1.PNG"
										: "for_android.PNG"
								}`}
							/>
							<CardContent>
								<p>
									{mobileDialogType === "apple" ? (
										<span>
											1. Klicken Sie auf das "Teilen" Icon
											<IosShare />
										</span>
									) : (
										"Folgen Sie der Schritt für Schritt Anleitung (02-08)"
									)}
								</p>
							</CardContent>
						</Card>
						{mobileDialogType === "apple" ? (
							<Card sx={{ marginTop: "5vh" }}>
								<CardMedia
									sx={{ height: 100 }}
									image="/tutorials/for_apple_step_2.PNG"
								/>
								<CardContent>
									<p>
										2. Klicken Sie auf "Zum Home-Bildschirm"
										<AddBoxOutlined />
									</p>
								</CardContent>
							</Card>
						) : (
							<></>
						)}
					</DialogContent>
					<DialogActions>
						<Button onClick={closeMobileDialog}>Zurück</Button>
					</DialogActions>
				</Dialog>
			</Fragment>

			{/*** MANUAL CONTROLS -----------------------------------------------------------------------------------------------***/}
			{!isMobile()["deviceBased"] && isMobile()["widthBased"] ? (
				<>
					<Box
						position={"absolute"}
						left={0}
						top={0}
						height={"100vh"}
						display={"flex"}
						flexDirection={"column"}
						justifyContent={"center"}
					>
						<IconButton onClick={pagePointerDecrement}>
							<ArrowBackIosNew />
						</IconButton>
					</Box>
					<Box
						position={"absolute"}
						left={"95vw"}
						top={0}
						height={"100vh"}
						display={"flex"}
						flexDirection={"column"}
						justifyContent={"center"}
					>
						<IconButton onClick={pagePointerIncrement}>
							<ArrowForwardIos />
						</IconButton>
					</Box>
				</>
			) : (
				<></>
			)}
		</>
	);
}

export default App;
