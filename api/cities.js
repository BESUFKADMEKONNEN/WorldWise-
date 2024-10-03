import { promises as fs } from "fs";
import path from "path";

// Fetch all cities from cities.json
export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), "data", "cities.json");

  try {
    const fileContents = await fs.readFile(filePath, "utf-8");
    let cities = JSON.parse(fileContents);

    if (req.method === "GET") {
      res.status(200).json(cities);
    }

    if (req.method === "POST") {
      const newCity = req.body;
      cities.push(newCity);

      await fs.writeFile(filePath, JSON.stringify(cities, null, 2));
      res.status(201).json(newCity);
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      cities = cities.filter((city) => city.id !== id);

      await fs.writeFile(filePath, JSON.stringify(cities, null, 2));
      res.status(200).json({ message: "City deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error reading or writing to cities.json" });
  }
}
