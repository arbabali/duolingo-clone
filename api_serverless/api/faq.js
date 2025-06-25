import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();


    const filePath = path.join(process.cwd(), 'api', 'faq.json');
    try {
        const fileContents = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContents);
        res.status(200).json(data);
    } catch (error) {
        console.error("Failed to load FAQ data:", error);
        res.status(500).json({ error: "Failed to load FAQ data" });
    }
}
