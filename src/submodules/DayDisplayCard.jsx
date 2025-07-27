import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
	Alert,
	Card,
	CardContent,
	CardMedia,
	CardActions,
	TextField,
	Button,
	Box,
	InputLabel,
	MenuItem,
	FormControl,
	Select,
} from "@mui/material";
import {
	AccessTime,
	Snooze,
	EditCalendar,
	Beenhere,
} from "@mui/icons-material";
import ActivityVoting from "./ActivityVoting.jsx";
import "../App.css";
import { __KEY, groupDataBaseCodes, isMobile } from "../App.jsx";

function DayDisplayCard({
	dayInformation,
	groupCode,
	iteration,
	width,
	height,
	pointer,
	ableToEdit,
}) {
	const morningRef = useRef();
	const afternoonRef = useRef();
	const [loadingState, setLoadingState] = useState(0);
	const [errorState, setErrorState] = useState(false);
	const [rerender, setRerender] = useState(false);

	const [template, setTemplate] = useState(dayInformation[4]);
	const handleTemplateChange = (event) => {
		setLoadingState((prev) => {
			return prev + 1;
		});
		setTemplate(event.target.value);
	};

	useEffect(() => {
		setTemplate(dayInformation[4]);
		setRerender(true);
		setTimeout(() => {
			setRerender(false);
		}, 1);
	}, dayInformation);

	const ID = dayInformation[3];
	function editField() {
		setErrorState(false);
		axios({
			method: "PATCH",
			url: `https://api.baserow.io/api/database/rows/table/${groupDataBaseCodes[groupCode]}/${ID}/?user_field_names=true`,
			headers: {
				Authorization: __KEY,
				"Content-Type": "application/json",
			},
			data: {
				morning: template === "None" ? morningRef.current.value : "",
				afternoon: template === "None" ? afternoonRef.current.value : "",
				likes: 0,
				dislikes: 0,
				template: template,
			},
		})
			.then(() => {
				setLoadingState(0);
			})
			.catch((e) => {
				console.error(e);
				setErrorState(true);
			});
	}

	return (
		<Card
			key={iteration}
			sx={{
				width: isMobile()["widthBased"] ? `${width}vw` : "20vw",
				height: `${height}vh`,
				opacity:
					iteration === pointer || (!isMobile()["widthBased"] && ableToEdit)
						? 1
						: 0.25,
				scale:
					iteration === pointer || (!isMobile()["widthBased"] && ableToEdit)
						? 1
						: 0.9,
				pointerEvents: iteration !== pointer && !ableToEdit ? "none" : "auto",
				position: "relative",
			}}
		>
			{ableToEdit ? (
				<Alert severity="warning" icon={<EditCalendar />}>
					{dayInformation[0]}
				</Alert>
			) : (
				<CardMedia
					sx={{ height: 140 }}
					image={
						dayInformation[4] === "None"
							? `/weekdays/${
									iteration === 0
										? "monday"
										: iteration === 1
										? "tuesday"
										: iteration === 2
										? "wednesday"
										: iteration === 3
										? "thursday"
										: "friday"
							  }.png`
							: dayInformation[4] === "Anreise"
							? "templateCovers/anreise.jpg"
							: "templateCovers/abreise.jpg"
					}
				/>
			)}
			<CardContent sx={{ position: "relative" }}>
				{ableToEdit && !rerender ? (
					<>
						<FormControl fullWidth>
							<InputLabel id="demo-simple-select-label">Vorlagen</InputLabel>
							<Select
								value={template}
								label="Vorlagen"
								onChange={handleTemplateChange}
							>
								<MenuItem value={"None"}>Keine</MenuItem>
								<MenuItem value={"Anreise"}>Anreise</MenuItem>
								<MenuItem value={"Abreise"}>Abreise</MenuItem>
							</Select>
						</FormControl>
						{template === "None" ? (
							<TextField
								id="filled-multiline-flexible"
								label="Morgens"
								multiline
								fullWidth
								maxRows={3}
								variant="filled"
								inputRef={morningRef}
								defaultValue={dayInformation[1]}
								onChange={() => {
									if (morningRef.current.value !== dayInformation[1])
										setLoadingState((prev) => {
											return prev + 1;
										});
								}}
							/>
						) : (
							<></>
						)}
					</>
				) : (
					<>
						<h3 className="activityTime" style={{ marginTop: 0 }}>
							{dayInformation[4] === "None" ? (
								<>
									8.10 - 12.00
									<AccessTime />
								</>
							) : (
								<>
									{dayInformation[4] === "Anreise" ? (
										<>
											Anreise: 9.00 - 17.00
											<AccessTime />
										</>
									) : (
										<></>
									)}
								</>
							)}
						</h3>
						{dayInformation[4] === "None" ? (
							<p className="activityDisplay">{dayInformation[1]}</p>
						) : (
							<></>
						)}
					</>
				)}

				{!ableToEdit ? (
					<h5 style={{ opacity: 0.5, margin: 0 }}>
						{dayInformation[4] === "None" ? (
							<>
								Mittagspause 12.00 - 12.30
								<Snooze />
							</>
						) : (
							<>
								{dayInformation[4] === "Anreise" ? (
									<>Mittagessen heute 12.00 - 14.00</>
								) : (
									<></>
								)}
							</>
						)}
					</h5>
				) : (
					<></>
				)}

				{ableToEdit && !rerender ? (
					<>
						{template === "None" ? (
							<TextField
								id="filled-multiline-flexible"
								label="Nachmittags"
								multiline
								fullWidth
								maxRows={3}
								variant="filled"
								inputRef={afternoonRef}
								defaultValue={dayInformation[2]}
								onChange={() => {
									if (afternoonRef.current.value !== dayInformation[2])
										setLoadingState((prev) => {
											return prev + 1;
										});
								}}
							/>
						) : (
							<></>
						)}
					</>
				) : (
					<>
						<h3 className="activityTime">
							{dayInformation[4] === "None" ? (
								<>
									12.30 - {dayInformation[0] !== "Freitag" ? "16.00" : "15.15"}
									<AccessTime />
								</>
							) : (
								<>
									{dayInformation[4] === "Anreise" ? (
										<>
											Wir bitten Sie, dass Sie sich 15 Minuten vor ihrem ersten Termin in
											der Gruppe vorstellen
										</>
									) : (
										<>Wir freuen uns, dass Ihr da wart :)</>
									)}
								</>
							)}
						</h3>
						{dayInformation[4] === "None" ? (
							<p className="activityDisplay" style={{ marginBottom: 0 }}>
								{dayInformation[2]}
							</p>
						) : (
							<></>
						)}
					</>
				)}

				{ableToEdit ? (
					<Button
						variant="contained"
						endIcon={<Beenhere />}
						fullWidth
						color={errorState ? "error" : "success"}
						sx={{ borderRadius: "0 0 4px 4px" }}
						onClick={editField}
						disabled={loadingState === 0}
					>
						Speichern
					</Button>
				) : (
					<></>
				)}
			</CardContent>
			{!ableToEdit ? (
				<CardActions
					sx={{
						position: "absolute",
						bottom: "1vh",
						left: 0,
						width: "100%",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexDirection: "row",
					}}
				>
					<Box>
						{dayInformation.length === 7 ? (
							<Box
								width={"100%"}
								display={"flex"}
								flexDirection={"row"}
								justifyContent={"flex-start"}
								alignItems={"center"}
							>
								<img
									src={`https://github.com/visualcrossing/WeatherIcons/blob/main/PNG/1st%20Set%20-%20Color/${dayInformation[6]}.png?raw=true`}
									alt={dayInformation[6]}
									style={{
										width: "7.5vh",
										aspectRatio: 1,
									}}
								/>
								<div>{dayInformation[5]}°C</div>
							</Box>
						) : (
							<div style={{ fontSize: "x-small" }}>Wetter nicht verfügbar</div>
						)}
					</Box>
					<ActivityVoting
						weekday={dayInformation[0]}
						ID={ID}
						groupCode={groupCode}
					/>
				</CardActions>
			) : (
				<></>
			)}
		</Card>
	);
}

export default DayDisplayCard;
