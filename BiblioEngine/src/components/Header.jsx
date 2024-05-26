import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import Link from "@material-ui/core/Link";
import logo from '../public/assets/images/BibWE.png'
import {AppBar, Avatar, Box, Container, Menu, MenuItem, Toolbar, Tooltip, Typography} from '@material-ui/core'
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Divider from "@material-ui/core/Divider";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {getProjectsByCustomerId, searchProjectByName} from "../api/projects.api";

const settings = ['Perfil', 'Cerrar sesion'];

export default function Header() {
    const [open, setOpen] = useState(false);
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const [projects, setProjects] = useState([]);
    const customerId = sessionStorage.getItem("customerId")

    const getProjects = async (customerId) => {
        try {
            const response = await getProjectsByCustomerId(customerId);
            if (response && response.data) {
                setProjects(response.data);
            } else {
                // Manejar la ausencia de datos como sea necesario
                console.error('No data returned from getProjectsByCustomerId');
            }
        } catch (error) {
            console.error('An error occurred while fetching projects:', error);
        }
    }

    const saveProjectData = async (projectName) => {
        sessionStorage.setItem("projectName", projectName)
        try {
            const response = await searchProjectByName(projectName);
            if (response && response.data) {
                sessionStorage.setItem("projectId", response.data.id);
            } else {
                // Manejar la ausencia de datos como sea necesario
                console.error('No data returned from searchProjectByName');
            }
        } catch (error) {
            console.error('An error occurred while saving project data:', error);
        }
    }



    useEffect(() => {
        getProjects(customerId)
    }, [projects, customerId])


    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <>
            <div className="fullScreen" style={{zIndex: "-10"}}></div>


            <div style={{marginBottom: "7.5ch"}}>

                <AppBar position="fixed" style={{background: '#07a1c7'}}>
                    <Container maxWidth="100%">
                        <Toolbar sx={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <Box>
                                    <IconButton onClick={() => setOpen(true)}
                                                size="2"
                                                aria-label="account of current user"
                                                aria-controls="menu-appbar"
                                                aria-haspopup="true"
                                                color="inherit"

                                    >
                                        <MenuIcon/>
                                    </IconButton>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorElNav}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                        open={Boolean(anchorElNav)}
                                        onClose={handleCloseNavMenu}
                                    >
                                    </Menu>
                                </Box>
                            </div>
                            <div>

                                <Link href='/home'>
                                    <img src={logo} alt="Boton volver a inicio"
                                         style={{width: 60}}>
                                    </img>
                                </Link>
                            </div>
                            <div>
                                <Box>
                                    <Tooltip title="Abrir ajustes">
                                        <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                            <Avatar alt="Pedro Capilla" src="/static/images/avatar/2.jpg"/>
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{mt: '45px'}}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        map
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        {settings.map((setting) => (
                                            <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                                <Typography textAlign="center">{setting}</Typography>
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Box>

                            </div>

                        </Toolbar>
                    </Container>
                    <SwipeableDrawer
                        anchor="left"
                        open={open}
                        onOpen={() => setOpen(true)}
                        onClose={() => setOpen(false)}

                    >
                        <div
                            onClick={() => setOpen(false)}
                            onKeyPress={() => setOpen(false)}
                            role="button"
                            tabIndex={0}
                            sx={{fontFamily: '', fontWeight: 'bald'}}
                        >
                            <IconButton>
                                <ChevronLeftIcon/>
                            </IconButton>
                        </div>
                        <Divider/>
                        <List>
                            {projects.map((project) => (
                                <ListItem
                                           key={project.id}>
                                    <Link
                                        sx={{ marginRight: 20 }}
                                        color="textPrimary"
                                        variant="button"
                                        underline="none"
                                        onClick={() => saveProjectData(project.projectName)}
                                        href="/filterPerAuthor"
                                    >
                                        {project.projectName}

                                    </Link>
                                </ListItem>
                            ))}
                        </List>
                    </SwipeableDrawer>
                </AppBar>
            </div>
        </>
    );
}