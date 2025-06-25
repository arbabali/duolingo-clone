
import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();

    const { lang, section } = req.query;

    if (!lang) {
        return res.status(400).json({ error: "Missing 'lang' parameter" });
    }

    const filePath = path.join(process.cwd(), 'api', `section-details_${lang}.json`);
    console.log("Reading file from:", filePath);

    try {
        const fileContents = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContents);

        // If section param is given, return only that unit if possible
        if (section) {
            const index = parseInt(section, 10) - 1;
            const selectedUnit = data.section?.units?.[index];
            if (!selectedUnit) {
                return res.status(404).json({ error: `Section ${section} not found.` });
            }

            return res.status(200).json({
                section: {
                    name: data.section.name,
                    totalChaptersInUnit: data.section.totalChaptersInUnit,
                    totalUnitsInSection: data.section.totalUnitsInSection,
                    units: [selectedUnit]
                }
            });
        }

        // Return full section data
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error loading section data:", error.message);
        res.status(500).json({ error: `Failed to load data for lang=${lang}` });
    }
}
