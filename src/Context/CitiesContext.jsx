import { useReducer } from "react";
import { createContext, useContext, useEffect } from "react";

const cityContext = createContext();
// use it when offline
// const BASE_URL = "http://localhost:8000";

//on vercel deployement
const BASE_URL = "https://world-wise-cyan-ten.vercel.app/api/";

function CitiesProvider({ children }) {
  const initialStates = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: "",
  };
  function reducer(state, action) {
    switch (action.type) {
      case "loading":
        return {
          ...state,
          isLoading: true,
        };
      case "cities/loaded":
        return {
          ...state,
          isLoading: false,
          cities: action.payload,
        };
      case "city/loaded":
        return {
          ...state,
          isLoading: false,
          currentCity: action.payload,
        };
      case "city/created":
        return {
          ...state,
          isLoading: false,
          cities: [...state.cities, action.payload],
          currentCity: action.payload,
        };
      case "city/deleted":
        return {
          ...state,
          isLoading: false,
          cities: state.cities.filter((city) => city.id !== action.payload),
          currentCity: {},
        };
      case "rejected":
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      default:
        throw new Error("unknown action type");
    }
  }
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialStates
  );
  // const [cities, setCities] = useState([]);
  // const [isLoading, setisLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}cities`);
        const data = await res.json();
        const citiesWithDates = data.map((city) => ({
          ...city,
          date: new Date(city.date),
        }));
        // setCities(citiesWithDates);
        dispatch({ type: "cities/loaded", payload: citiesWithDates });
      } catch (error) {
        dispatch({
          type: "rejected",
          payload: "There was an error loading cities",
        });
        console.error(error);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${BASE_URL}cities/${id}`);
      const data = await res.json();
      // setCurrentCity(data);
      dispatch({ type: "city/loaded", payload: data });
    } catch (error) {
      dispatch({ type: "rejected" });
      console.error(error);
    }
  }
  async function createNewCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "appication/json" },
      });
      const data = await res.json();
      // setCities((cities) => [...cities, data]);
      dispatch({ type: "city/created", payload: data });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "There was an error in creating the city",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${BASE_URL}cities/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      // setCities((cities) => cities.filter((city) => city.id !== id));
      dispatch({ type: "city/deleted", payload: id });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "There was an error in deleting the city",
      });
    }
  }

  return (
    <cityContext.Provider
      value={{
        cities,
        isLoading,
        getCity,
        currentCity,
        createNewCity,
        deleteCity,
      }}
    >
      {children}
    </cityContext.Provider>
  );
}

function useCities() {
  const context = useContext(cityContext);
  if (context === undefined)
    throw new Error("cityContext is being used out of cityProvider  ");
  return context;
}

export { CitiesProvider, useCities };
