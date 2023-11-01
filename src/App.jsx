import Topbar from "./components/Topbar/Topbar";
import styles from "./styles.module.scss";
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { pink } from '@mui/material/colors';
import { regions } from "./assets/regions";
import { useState, useEffect } from "react";
import { callAPI } from "./domain/api";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const [searchText, setSearchText] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [favoritesCode, setFavoritesCode] = useLocalStorage("favorite", []);

  const fetchAllData = async() => {
    try {
      const data = await callAPI('/all', 'GET');
      setCountries(data);
      setFilteredCountries(data);

    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const handleClickFavorite = (cca3) => {
    setFavoritesCode((prev) => prev.includes(cca3) ? prev.filter(code => code != cca3) : [...prev, cca3]);
  }

  useEffect(() => {
    setLoading(true);
    fetchAllData();
    setLoading(false);
  }, []);

  useEffect(() => {
    const filteredBySearchText = countries.filter((country) => (
      country.name.official.toLowerCase().includes(searchText.toLowerCase())
    ));

    selectedRegion === "" ? 
      setFilteredCountries(filteredBySearchText) :
      setFilteredCountries(filteredBySearchText.filter((country) => (
        country.region.toLowerCase().includes(selectedRegion.toLowerCase())
      )));
  }, [searchText, countries, selectedRegion]);

  return (
    <main className={`${isDark ? styles.dark : ""}`}>
      <Topbar isDark={isDark} setIsDark={setIsDark} />
      <div className={styles.home}>
        <div className={styles.function}>
          <div className={styles.search}>
            <SearchIcon color={""} />
            <input 
              type="text" 
              placeholder="Search for a country..." 
              onChange={(e) => {setSearchText(e.target.value)}}  
            />
          </div>
          <div className={styles.filter}>
            <button>
              <p>{selectedRegion === "" ? "Filter by region" : selectedRegion}</p>
              <KeyboardArrowDownIcon />
            </button>
            <div className={styles.dropdown_content}>
              {regions.map((region, idx) => (
                <div key={idx} className={styles.dropdown_choice} onClick={() => setSelectedRegion(region)}>
                  {region}
                </div>
              ))}
            </div>
          </div>
        </div>

        {!loading && (
          <div className={styles.result}>
            {filteredCountries.map((country) => (
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
      </div>
    </main>
  )
}

export default App
