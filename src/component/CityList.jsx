import CityItem from "./CityItem";
import styles from "./cityList.module.css";
import Spinner from "./Spinner";
import Message from './Message'
import PropTypes from "prop-types";
import { useCities } from "../Context/CitiesContext";

// CityList.propTypes = {
//   cities: PropTypes.arrayOf(
//     PropTypes.shape({
//       cityName: PropTypes.string.isRequired,
//       emoji: PropTypes.string.isRequired,
//       date: PropTypes.instanceOf(Date).isRequired,
//     })
//   ).isRequired,
//   isLoading: PropTypes.bool.isRequired,
// };


function CityList() {
  const { cities, isLoading }=useCities();
  if (isLoading) return <Spinner />;
  if(!cities.length) return <Message 
  message={'Add your frist city by clicking on a city  on the map'}/>
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
