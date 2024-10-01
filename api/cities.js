import fs from "fs";
import path from "path";

// Define the path to your JSON file
const filePath = path.join(process.cwd(), "data", "cities.json");

export default function handler(req, res) {
  // Read the data from the JSON file
  const jsonData = fs.readFileSync(filePath, "utf8");
  const citiesData = JSON.parse(jsonData);

  // Handle the request based on the HTTP method
  switch (req.method) {
    case "GET":
      res.status(200).json(citiesData.cities); // Return the cities array
      break;

    case "POST":
      // Handle adding a new city
      const newCity = req.body; // New city data from request body
      citiesData.cities.push(newCity); // Add the new city to the array
      fs.writeFileSync(filePath, JSON.stringify(citiesData, null, 2)); // Save back to the file
      res.status(201).json(newCity); // Respond with the new city
      break;

    case "DELETE":
      // Handle deleting a city
      const idToDelete = req.query.id; // Get the ID from query parameters
      const filteredCities = citiesData.cities.filter(
        (city) => city.id !== idToDelete
      ); // Remove the city with the given ID
      citiesData.cities = filteredCities; // Update the cities array
      fs.writeFileSync(filePath, JSON.stringify(citiesData, null, 2)); // Save back to the file
      res.status(204).end(); // No content to send back
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]); // Allowed methods
      res.status(405).end(`Method ${req.method} Not Allowed`); // Method not allowed response
      break;
  }
}
