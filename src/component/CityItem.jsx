import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import "flag-icons/css/flag-icons.min.css";
import { useCities } from "../Context/CitiesContext";

// CityItem.propTypes = {
//   city: PropTypes.shape({
//     cityName: PropTypes.string.isRequired,
//     emoji: PropTypes.string.isRequired,
//     date: PropTypes.instanceOf(Date).isRequired,
//   }).isRequired,
// };

const formatDate = (date) =>
  // eslint-disable-next-line no-undef
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function CityItem({ city }) {
  const { currentCity, deleteCity } = useCities();
  const { cityName, emoji, date, id, position } = city;

  const countryCode = (emoji) =>
    [...emoji]
      .map((char) => String.fromCharCode(char.codePointAt(0) - 0x1f1a5))
      .join("")
      .toLowerCase();

  function handleDelete(e) {
    e.preventDefault();
    deleteCity(id);
  }

  // const convertCodeToFlagEmoji = (code) => {
  //   if (typeof code !== 'string' || code.length !== 2) {
  //     console.error('Invalid country code:', code);
  //     return '';
  //   }

  //   const flagEmoji = String.fromCodePoint(
  //     ...code
  //       .toUpperCase()
  //       .split("")
  //       .map((char) => 0x1F1E6 + char.charCodeAt(0) - 'A'.charCodeAt(0))
  //   );

  //   console.log('Converted:', code, 'to', flagEmoji);
  //   return flagEmoji;
  // };

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          id === currentCity.id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={`${styles.emoji} fi fi-${countryCode(emoji)}`}></span>{" "}
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn} onClick={handleDelete}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
