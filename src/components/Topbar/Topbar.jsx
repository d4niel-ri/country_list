// import styles from './module.styles.scss';
import styles from './styles.module.scss';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

// eslint-disable-next-line react/prop-types
const Topbar = ({isDark, setIsDark}) => {
  return (
    <div className={`${styles.topbar} ${isDark ? styles.dark : ""}`}>
      <div className={styles.navigation}>
        <a className={styles.title} href='/'>
          Where in the world?
        </a>
        <a className={styles.items} href='/favorites'>
          Favorites
        </a>
      </div>
      <div className={styles.toggle} onClick={() => setIsDark(!isDark)}>
        {isDark ? (<DarkModeIcon />) : (<DarkModeOutlinedIcon />)}
        <p>Dark Mode</p>
      </div>
    </div>
  );
}

export default Topbar;