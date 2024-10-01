import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from './CountryItem'
// import PropTypes from "prop-types";
import { useCities } from "../Context/CitiesContext";

// CountryList.propTypes = {
//   cities: PropTypes.arrayOf(
//     PropTypes.shape({
//       cityName: PropTypes.string.isRequired,
//       emoji: PropTypes.string.isRequired,
//       date: PropTypes.instanceOf(Date).isRequired,
//     })
//   ).isRequired,
//   isLoading: PropTypes.bool.isRequired,
// };

function CountryList() {
  const { cities, isLoading }=useCities()
  if (isLoading) return <Spinner />;
  if (!cities.length)
    return (
      <Message
        message={"Add your frist city by clicking on a city  on the map"}
      />
    );
  const countries = cities.reduce((acc,city)=>{
    if(!acc.map(val=>val.country).includes(city.country))
    return [...acc,{country:city.country,emoji:city.emoji,id:city.id}]
  else
  return acc
  },[])
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.id} />
      ))}
    </ul>
  );
}

export default CountryList;
