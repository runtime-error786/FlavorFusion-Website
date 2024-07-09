import * as React from 'react';
import { styled, useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const theme = createTheme({
    palette: {
        primary: {
            main: '#ffb703', // Customize your primary color
        },
        secondary: {
            main: '#ffb703', // Customize your secondary color
        },
        background: {
            default: '#f4f6f8', // Customize your background color
        },
    },
    typography: {
        fontFamily: [
            'Roboto', // Replace with preferred font family
            'sans-serif',
        ].join(','),
        h6: {
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: '#333', // Customize heading color
        },
    },
    components: {
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#ffebcd', // Custom background color
                },
            },
        },
    },
});

export default function PersistentDrawerLeft() {
    const currentTheme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleProfileClick = () => {
        // Redirect to profile page logic here
        console.log('Redirecting to profile page');
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" open={open}>
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                sx={{ mr: 2, ...(open && { display: 'none' }) }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" noWrap component="div">
                                GrubGrove
                            </Typography>
                        </Box>
                        <IconButton
                            color="inherit"
                            aria-label="profile"
                            onClick={handleProfileClick}
                            sx={{ ml: 2 }}
                        >
                            <AccountCircleIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            backgroundColor: '#ffebcd', // Custom background color
                        },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={open}
                >
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {currentTheme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <List>
                        <ListItem disablePadding component="a" href="/add-admin" sx={{ color: 'gray' }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <PersonAddIcon />
                                </ListItemIcon>
                                <ListItemText primary="Add Admin" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding component="a" href="/delete-admin" sx={{ color: 'gray' }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <PersonRemoveIcon />
                                </ListItemIcon>
                                <ListItemText primary="Delete Admin" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding component="a" href="/add-product" sx={{ color: 'gray' }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <AddBoxIcon />
                                </ListItemIcon>
                                <ListItemText primary="Add Product" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding component="a" href="/delete-product" sx={{ color: 'gray' }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <DeleteIcon />
                                </ListItemIcon>
                                <ListItemText primary="Delete Product" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding component="a" href="/update-product" sx={{ color: 'gray' }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <EditIcon />
                                </ListItemIcon>
                                <ListItemText primary="Update Product" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding component="a" href="/track-order" sx={{ color: 'gray' }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <TrackChangesIcon />
                                </ListItemIcon>
                                <ListItemText primary="Track Order" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding component="a" href="/dashboard" sx={{ color: 'gray' }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <DashboardIcon />
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding component="a" href="/profile" sx={{ color: 'gray' }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <AccountCircleIcon />
                                </ListItemIcon>
                                <ListItemText primary="Profile" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Drawer>
                <Main open={open}>
                    <DrawerHeader />
                    
                </Main>
            </Box>
        </ThemeProvider>
    );
}