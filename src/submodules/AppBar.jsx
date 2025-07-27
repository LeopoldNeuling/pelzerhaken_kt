import { useState } from "react";
import {
	Box,
	Avatar,
	Menu,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
	Typography,
	Button,
} from "@mui/material";
import MUIAppBar from "@mui/material/AppBar";
import { Apple, Android, InstallMobile, Person } from "@mui/icons-material";
import { pink } from "@mui/material/colors";

function AppBar({ toggleDialog, togglePassword, degradeUser, userStatus }) {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<Box position={"absolute"} width={"100vw"} top={0} left={0} zIndex={1000}>
			<MUIAppBar position="static">
				<Toolbar>
					<Button
						edge="start"
						aria-controls={open ? "demo-positioned-menu" : undefined}
						aria-haspopup="true"
						aria-expanded={open ? "true" : undefined}
						onClick={handleClick}
						startIcon={<InstallMobile />}
					>
						<Typography variant="h6" component="div">
							Handy App
						</Typography>
					</Button>
					<Box flexGrow={1}></Box>
					<List>
						<ListItem
							disablePadding
							onClick={() => {
								handleClose();
								if (userStatus === "guest") togglePassword();
								else degradeUser();
							}}
						>
							<ListItemButton>
								<ListItemIcon>
									<Avatar
										src={userStatus === "admin" ? "/sgwLogo.png" : ""}
										sx={{ bgcolor: pink[500] }}
									>
										<Person />
									</Avatar>
								</ListItemIcon>
								<ListItemText
									primary={userStatus === "guest" ? "Admin Login" : "Logout"}
								/>
							</ListItemButton>
						</ListItem>
					</List>
				</Toolbar>
			</MUIAppBar>

			<Menu
				id="demo-positioned-menu"
				aria-labelledby="demo-positioned-button"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
			>
				<List>
					{/*** TUTORIAL ACCESS ---------------------------------------------------------------------------------------***/}
					{userStatus === "guest" ? (
						<>
							<ListItem
								disablePadding
								onClick={() => {
									handleClose();
									toggleDialog();
								}}
							>
								<ListItemButton>
									<ListItemIcon>
										<Apple />
									</ListItemIcon>
									<ListItemText
										primary="App für IOS"
										secondary="Website als App auf den Home-Screen"
									/>
								</ListItemButton>
							</ListItem>
						</>
					) : (
						<></>
					)}
				</List>
			</Menu>
		</Box>
	);
}

export default AppBar;
