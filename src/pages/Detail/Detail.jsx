import { useEffect, useState } from "react";
import Topbar from "../../components/Topbar/Topbar";
import styles from './styles.module.scss';
import { useParams } from "react-router-dom";
import { callAPI } from "../../domain/api";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { pink } from '@mui/material/colors';
import Back from "../../components/Back/Back";
import useLocalStorage from "../../hooks/useLocalStorage";

const Detail = () => {
  const [country, setCountry] = useState({});
  const [loading, setLoading] = useState(true);
  const [borders, setBorders] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const [favoritesCode, setFavoritesCode] = useLocalStorage("favorite", []);

  const routeParams = useParams();

  const handleClickFavorite = (cca3) => {
    setFavoritesCode((prev) => prev.includes(cca3) ? prev.filter(code => code != cca3) : [...prev, cca3]);
  }

  const fetchSingleData = async() => {
    try {
      setLoading(true);
      const data = await callAPI(`/name/${routeParams.country_name}`, 'GET', {}, {fullText:true});
      setCountry(data[0]);
      setLoading(false);
    
    } catch(error) {
      console.error(error);
      alert(error);
    }
  }

  const fetchBorders = async() => {
    try {
      setLoading(true);
      if (country.borders) {
        const data = await callAPI(`/alpha?codes=${country.borders.join(',')}`);
        setBorders(data);
        setLoading(false);
        
      } else {
        setBorders([]);
        setLoading(false);
      }
    } catch(error) {
      console.error(error);
      alert(error);
    }
  }

  const getNativeNamesString = () => {
    // Assumption: already get the data
    if (country.name.nativeName === "null" || country.name.nativeName === "undefined") return "-";

    const nativeNamesString = Object.values(country.name.nativeName).map((nativeName) => nativeName.common).join(", ");
    return nativeNamesString;
  }

  const getCurrenciesString = () => {
    // Assumption: already get the data
    if (country.currencies === "null" || country.currencies === "undefined") return "-";

    const currenciesString = Object.values(country.currencies).map((currency) => currency.name).join(", ");
    return currenciesString;
  }

  useEffect(() => {
    fetchSingleData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading) return;

    fetchBorders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country])

  return (
    <main className={`${isDark ? styles.dark : ""}`}>
      <Topbar isDark={isDark} setIsDark={setIsDark} />
      <div className={styles.detail}>
        <Back />

        {!loading && (
          <div className={styles.content}>
            <div className={styles.flag}>
              <img src={country.flags.png} alt={country.name.official} />
            </div>
            <div className={styles.description}>
              <header>
                <h1>{country.name.official}</h1>
                <div className={styles.favorite} onClick={() => handleClickFavorite(country.cca3)}>
                  {favoritesCode.includes(country.cca3) ? 
                    (<FavoriteIcon sx={{ color: pink[500] }} />) : 
                    (<FavoriteBorderOutlinedIcon />)
                  }
                </div>
              </header>
              <div className={styles.row_desc}>
                <div className={styles.col_desc}>
                  <p><b>Native Names:</b> {getNativeNamesString()}</p>
                  <p><b>Population:</b> {country.population}</p>
                  <p><b>Region:</b> {country.region}</p>
                  <p><b>Sub region:</b> {country.subregion}</p>
                  <p><b>Capital:</b> {country.capital ? (country.capital.join(', ')) : "-"}</p>
                </div>
                <div className={styles.col_desc}>
                  <p><b>Top Level Domain:</b> {country.tld.join(', ')}</p>
                  <p><b>Currencies:</b> {getCurrenciesString()}</p>
                  <p><b>Languages:</b> {Object.values(country.languages).join(', ')}</p>
                </div>
              </div>
              <div className={styles.footer_desc}>
                <p><b>Border Countries:</b></p>
                {borders.length === 0 ? (
                  <p>None</p>
                ) : (
                  <div className={styles.borders}>
                  {borders.map((border) => (
                    <a className={styles.border} key={border.name.official} href={`/detail/${border.name.official}`}>
                      {border.name.common}
                    </a>
                  ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default Detail;