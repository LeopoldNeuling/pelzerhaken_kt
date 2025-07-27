import { IconButton, Badge, Box } from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import { pink, green } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { groupDataBaseCodes, __KEY } from "../App";
import axios from "axios";
import moment from "moment";

function ActivityVoting({ weekday, ID, groupCode }) {
	const localStorageAccessLink = `${weekday}_group:${groupCode}_pelzerhaken_kt_app`;
	const [likeButton, setLikeButton] = useState();
	const [dislikeButton, setDislikeButton] = useState();
	const [likeCounter, setLikeCounter] = useState();
	const [dislikeCounter, setDislikeCounter] = useState();

	const [rerender, setRerender] = useState(false);

	useEffect(() => {
		const prevUserInteract = localStorage.getItem(
			`${weekday}_group:${groupCode}_pelzerhaken_kt_app`
		);
		const prevTimestamp = localStorage.getItem(
			`${weekday}_group:${groupCode}_timestamp_pelzerhaken_kt_app`
		);
		const now = moment();
		const timeDiff =
			prevTimestamp === null
				? moment.duration(0)
				: moment.duration(now - moment(prevTimestamp));
		if (timeDiff.asDays() >= 7) {
			setLikeButton(false);
			setDislikeButton(false);
			localStorage.setItem(localStorageAccessLink, "");
		} else {
			if (prevUserInteract === "like") {
				setLikeButton(true);
				setDislikeButton(false);
			} else {
				setLikeButton(false);
			}
			if (prevUserInteract === "dislike") {
				setDislikeButton(true);
				setLikeButton(false);
			} else {
				setDislikeButton(false);
			}
		}
		async function fetchCounters() {
			const fetching = await fetch(
				`https://api.baserow.io/api/database/rows/table/${groupDataBaseCodes[groupCode]}/${ID}/?user_field_names=true`,
				{
					headers: {
						Authorization: __KEY,
					},
				}
			);
			const response = await fetching.json();
			setLikeCounter(parseInt(response.likes));
			setDislikeCounter(parseInt(response.dislikes));

			setRerender(true);
			setTimeout(() => {
				setRerender(false);
			}, 1);
		}
		fetchCounters();
	}, [groupCode]);

	function negate(type) {
		localStorage.setItem(localStorageAccessLink, "");
		setLikeButton(false);
		setDislikeButton(false);
		const data =
			type === "like"
				? { likes: likeCounter - 1 }
				: { dislikes: dislikeCounter - 1 };
		axios({
			method: "PATCH",
			url: `https://api.baserow.io/api/database/rows/table/${groupDataBaseCodes[groupCode]}/${ID}/?user_field_names=true`,
			headers: {
				Authorization: __KEY,
				"Content-Type": "application/json",
			},
			data: data,
		}).then(() => {
			type === "like"
				? setLikeCounter((prev) => prev - 1)
				: setDislikeCounter((prev) => prev - 1);
			actionUpdated();
		});
	}
	function like() {
		if (likeButton) {
			negate("like");
			return;
		} else if (dislikeButton) negate("dislike");
		localStorage.setItem(localStorageAccessLink, "like");
		setLikeButton(true);
		setDislikeButton(false);
		axios({
			method: "PATCH",
			url: `https://api.baserow.io/api/database/rows/table/${groupDataBaseCodes[groupCode]}/${ID}/?user_field_names=true`,
			headers: {
				Authorization: __KEY,
				"Content-Type": "application/json",
			},
			data: {
				likes: likeCounter + 1,
			},
		}).then(() => {
			setLikeCounter((prev) => prev + 1);
			actionUpdated();
		});
	}

	function dislike() {
		if (dislikeButton) {
			negate("dislike");
			return;
		} else if (likeButton) negate("like");
		localStorage.setItem(localStorageAccessLink, "dislike");
		setDislikeButton(true);
		setLikeButton(false);
		axios({
			method: "PATCH",
			url: `https://api.baserow.io/api/database/rows/table/${groupDataBaseCodes[groupCode]}/${ID}/?user_field_names=true`,
			headers: {
				Authorization: __KEY,
				"Content-Type": "application/json",
			},
			data: {
				dislikes: dislikeCounter + 1,
			},
		}).then(() => {
			setDislikeCounter((prev) => prev + 1);
			actionUpdated();
		});
	}
	function actionUpdated() {
		localStorage.setItem(
			`${weekday}_group:${groupCode}_timestamp_pelzerhaken_kt_app`,
			moment()
		);
	}

	return (
		<>
			{!rerender ? (
				<Box marginRight={"2vw"}>
					<Badge badgeContent={dislikeCounter} color="secondary">
						<IconButton onClick={dislike}>
							<ThumbDown
								color={dislikeButton ? "" : "default"}
								htmlColor={dislikeButton ? pink[500] : ""}
							/>
						</IconButton>
					</Badge>
					<Badge badgeContent={likeCounter} color="secondary">
						<IconButton onClick={like}>
							<ThumbUp
								color={likeButton ? "" : "default"}
								htmlColor={likeButton ? green[500] : ""}
							/>
						</IconButton>
					</Badge>
				</Box>
			) : (
				<></>
			)}
		</>
	);
}

export default ActivityVoting;
