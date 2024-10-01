// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import UseGeolocationPosition from "../hooks/UseGeolocationPosition";
import "flag-icons";
import "./Spinner";
import "./Message";
import Spinner from "./Spinner";
import Message from "./Message";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./../Context/CitiesContext";
import { useCities } from "./../Context/CitiesContext";
const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

// export function convertToEmoji(countryCode) {

//   const codePoints = countryCode
//     .toUpperCase()
//     .split("")
//     .map((char) => 127397 + char.charCodeAt());
//   return String.fromCodePoint(...codePoints);
// }
function convertToEmoji(countryCode) {
  return countryCode.toLowerCase();
  // const code = [...countryCode]
  // .map((char) => String.fromCharCode(char.codePointAt(0) - 0x1f1a5))
  // .join("")
  // .toLowerCase()
  // console.log(code)
}


const convertCodeToFlagEmoji = (code) => {
  if (typeof code !== 'string' || code.length !== 2) {
    console.error('Invalid country code:', code);
    return '';
  }

  const flagEmoji = String.fromCodePoint(
    ...code
      .toUpperCase()
      .split("")
      .map((char) => 0x1F1E6 + char.charCodeAt(0) - 'A'.charCodeAt(0))
  );

  // console.log('Converted:', code, 'to', flagEmoji);
  return flagEmoji;
};

function Form() {
  const [isLoadingGeolocation, setIsLoadingGeolocation] = useState(false);
  const [cityName, setCityName] = useState("");
  const { createNewCity, isLoading } = useCities();
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState();
  const [geocodingError, setGeocodingError] = useState("");
  const navigate = useNavigate();
  const [lat, lng] = UseGeolocationPosition();
  useEffect(
    function () {
      async function fetchCityData() {
        if (!lat && !lng) return;
        try {
          setGeocodingError("");

          setIsLoadingGeolocation(true);

          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();

          setCityName(data.city || data.locality || "");
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));

          if (!data.countryCode)
            throw new Error(
              "👋 That doesn't seem to be a city. Please,Click Somewhere else😊"
            );
        } catch (error) {
          setGeocodingError(error.message);
        } finally {
          setIsLoadingGeolocation(false);
        }
      }
      fetchCityData();
    },
    [lat, lng]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    const code = convertCodeToFlagEmoji(emoji);

    const newCity = {
      cityName,
      country,
      emoji: code,
      date,
      notes,
      position: { lat, lng },
    };

    createNewCity(newCity);
    await navigate("/app/cities");
  }
  if (isLoadingGeolocation) return <Spinner />;
  if (!lat && !lng)
    return <Message message={"👋Select somewhere to get started😊"} />;

  if (geocodingError) return <Message message={geocodingError} />;
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={`${styles.flag} fi fi-${emoji}`}></span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker onChange={(date) => setDate(date)} selected={date} />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;


