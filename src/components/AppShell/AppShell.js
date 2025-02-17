import styles from "./AppShell.module.css";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ForumIcon from "@mui/icons-material/Forum";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StoreIcon from "@mui/icons-material/Store";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AddIcon from "@mui/icons-material/Add";
import { Tooltip } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { NavLink } from "react-router-dom";
import logo from "../../assets/nusfoodslogo.png";
import Randomiser from "../Randomiser";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const AppShell = () => {
  const { signInWithGoogle, user, signout } = useAuth();
  const [openRandomiser, setOpenRandomiser] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {user ? (
        <>
          <MenuItem>
            <NavLink
              to="/profile"
              style={{ textDecoration: "inherit", color: "inherit" }}
              onClick={handleMenuClose}
            >
              Profile
            </NavLink>
          </MenuItem>
          <MenuItem>
            <NavLink
              to="/"
              style={{ textDecoration: "inherit", color: "inherit" }}
              onClick={signout}
            >
              Logout
            </NavLink>
          </MenuItem>
        </>
      ) : (
        <>
          <MenuItem onClick={signInWithGoogle}>Login</MenuItem>
        </>
      )}
    </Menu>
  );

  const [anchorEl2, setAnchorEl2] = useState(null);
  const isAdminMenuOpen = Boolean(anchorEl2);

  const handleAdminMenuOpen = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAnchorEl2(null);
  };

  const adminMenuId = "add-deals-stores-menu";
  const renderAdminMenu = (
    <Menu
      anchorEl={anchorEl2}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isAdminMenuOpen}
      onClose={handleAdminMenuClose}
    >
      <MenuItem>
        <NavLink
          to="/adddeal"
          style={{ textDecoration: "inherit", color: "inherit" }}
          onClick={handleAdminMenuClose}
        >
          Add Deal
        </NavLink>
      </MenuItem>
      <MenuItem>
        <NavLink
          to="/addstore"
          style={{ textDecoration: "inherit", color: "inherit" }}
          onClick={handleAdminMenuClose}
        >
          Add Store
        </NavLink>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar style={{ background: "#e1ad01" }} position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            <NavLink className={styles.home} to="/">
              <img className={styles.logo} src={logo} alt="NUSFoods logo" />{" "}
              NUSFoods
            </NavLink>
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {user ? (
              <>
                <Tooltip title="Add Deals/Stores">
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="add deals or store"
                    aria-controls={adminMenuId}
                    aria-haspopup="true"
                    onClick={handleAdminMenuOpen}
                    color="inherit"
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Randomiser">
                  <IconButton
                    size="large"
                    aria-label="get a random store"
                    color="inherit"
                    onClick={() => setOpenRandomiser(true)}
                  >
                    <AutorenewIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Stores">
                  <IconButton
                    size="large"
                    aria-label="list all stores"
                    color="inherit"
                  >
                    <NavLink to="/stores" className={styles.button}>
                      <StoreIcon />
                    </NavLink>
                  </IconButton>
                </Tooltip>

                <Tooltip title="Forums">
                  <IconButton
                    size="large"
                    aria-label="open reviews forum page"
                    color="inherit"
                  >
                    <NavLink to="/forum" className={styles.button}>
                      <ForumIcon />
                    </NavLink>
                  </IconButton>
                </Tooltip>

                <Tooltip title="Deals">
                  <IconButton
                    size="large"
                    aria-label="open deals and discounts"
                    color="inherit"
                  >
                    <NavLink to="/deals" className={styles.button}>
                      <LocalOfferIcon />
                    </NavLink>
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <></>
            )}
            <Tooltip title="View profile">
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
      {renderAdminMenu}
      <Randomiser
        open={openRandomiser}
        onClose={() => setOpenRandomiser(false)}
      />
    </Box>
  );
};

export default AppShell;
