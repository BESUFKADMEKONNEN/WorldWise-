import { error } from "console";
import { promises as fs } from "fs";
import path from "path";

// API handler for cities
export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), "data", "cities.json");

  try {
    const fileContents = await fs.readFile(filePath, "utf-8");
    let cities = JSON.parse(fileContents);

    if (req.method === "GET") {
      res.status(200).json(cities);
    }

    if (req.method === "POST") {
      try {
        const newCity = req.body;
        if (!newCity) {
          throw new Error("No city data provided");
        }
        newCity.id = Date.now().toString(); // Generate a unique ID
        cities.push(newCity);

        await fs.writeFile(filePath, JSON.stringify(cities, null, 2));

        res.status(201).json(newCity);
      } catch (error) {
        res.status(400).json({ message: "Error adding city", error });
      }
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ message: "City ID is required" });
      }

      const cityIndex = cities.findIndex((city) => city.id === id);
      if (cityIndex === -1) {
        return res.status(404).json({ message: "City not found" });
      }

      cities.splice(cityIndex, 1); // Remove the city

      await fs.writeFile(filePath, JSON.stringify(cities, null, 2));

      res.status(200).json({ message: "City deleted successfully" });
    }
  } catch {
    err;
  }
  {
    console.log(error);
  }
}
