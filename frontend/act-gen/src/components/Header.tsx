import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
}

export default function Header({ darkMode, onToggleTheme }: HeaderProps) {
  return (
    <AppBar position="fixed" elevation={1}>
      <Toolbar>
        <AutoAwesomeIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
          IntentFlow
        </Typography>
        <IconButton color="inherit" onClick={onToggleTheme}>
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
