import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Topbar from "../../components/Topbar/Topbar";
import Back from "../../components/Back/Back";
import useLocalStorage from "../../hooks/useLocalStorage";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { pink } from '@mui/material/colors';
import { callAPI } from "../../domain/api";

const Favorites = () => {
  const [isDark, setIsDark] = useState(false);
  const [favoritesCode, setFavoritesCode] = useLocalStorage("favorite", []);
  const [favoritesCountry, setFavoritesCountry] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleClickFavorite = (cca3) => {
    setFavoritesCode((prev) => prev.filter(code => code != cca3));
    setFavoritesCountry((prev) => prev.filter(country => country.cca3 != cca3));
  }

  const fetchFavorites = async() => {
    try {
      setLoading(true);
      if (favoritesCode.length != 0) {
        const data = await callAPI(`/alpha?codes=${favoritesCode.join(',')}`);
        setFavoritesCountry(data);
      } 

      setLoading(false);
    } catch(error) {
      console.error(error);
      alert(error);
    }
  }

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <main className={`${isDark ? styles.dark : ""}`}>
      <Topbar isDark={isDark} setIsDark={setIsDark} />
      <Back />
      {!loading && (
        <div className={styles.favorites}>
          {favoritesCountry.map(country => (
            <div className={styles.card} key={country.name.official}>
              <a className={styles.card_image} href={`/detail/${country.name.official}`}>
                <img src={country.flags.png} alt="" />
              </a>
              <div className={styles.card_content}>
                <h4>{country.name.official}</h4>
                <div className={styles.description}>
                  <p><b>Population:</b> {country.population}</p>
                  <p><b>Region:</b> {country.region}</p>
                  <p><b>Capital:</b> {country.capital ? (country.capital.join(', ')) : "None"}</p>
                </div>
                <div className={styles.favorite} onClick={() => handleClickFavorite(country.cca3)}>
                  {favoritesCode.includes(country.cca3) ? 
                    (<FavoriteIcon sx={{ color: pink[500] }} />) : 
                    (<FavoriteBorderOutlinedIcon />)
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default Favorites;