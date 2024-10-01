import PropTypes from "prop-types";
import styles from "./CountryItem.module.css";
import "flag-icons/css/flag-icons.min.css";

CountryItem.propTypes = {
  country: PropTypes.shape({
    country: PropTypes.string.isRequired,
    emoji: PropTypes.string.isRequired,
  }).isRequired,
};

function CountryItem({ country }) {
  const countryCode = [...country.emoji]
    .map((char) => String.fromCharCode(char.codePointAt(0) - 0x1f1a5))
    .join("")
    .toLowerCase();

  return (
    <li className={styles.countryItem}>
      <span className={`fi fi-${countryCode}`}> </span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
